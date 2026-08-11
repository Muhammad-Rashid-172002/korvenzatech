import { buildAssistantInstruction } from './assistantKnowledge';
import {
  generateIntelligence,
  isIntelligenceConfigured,
  parseJsonResponse,
} from './intelligence';


export type ApiResult = {
  status: number;
  body: Record<string, unknown>;
};

const fallbackSuggestions = [
  'Tell me more',
  'Help me with the next step',
  'Show me another option',
];

function sanitizeSuggestionList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === 'string' && item.trim())
    .slice(0, 3)
    .map((item) => String(item).trim().slice(0, 120));
}

export async function handleChat(body: any): Promise<ApiResult> {
  const message = typeof body?.message === 'string' ? body.message.trim() : '';
  const history = Array.isArray(body?.history) ? body.history : [];
  const memory = typeof body?.memory === 'string' ? body.memory.slice(0, 5000) : '';

  if (!message) {
    return { status: 400, body: { error: 'Please enter a message.' } };
  }
  if (message.length > 4000) {
    return {
      status: 400,
      body: { error: 'Please keep each message under 4,000 characters.' },
    };
  }

  if (!isIntelligenceConfigured()) {
    return {
      status: 503,
      body: {
        configured: false,
        error: 'Korvenza AI is not configured on this deployment yet.',
      },
    };
  }

  const cleanHistory = history
    .filter(
      (item: any) =>
        item &&
        (item.role === 'user' || item.role === 'assistant') &&
        typeof item.text === 'string',
    )
    .slice(-28)
    .map((item: any) => ({
      role: item.role === 'assistant' ? 'model' as const : 'user' as const,
      parts: [{ text: item.text.slice(0, 4000) }],
    }));

  const contents = [
    ...cleanHistory,
    { role: 'user' as const, parts: [{ text: message }] },
  ];

  const raw = await generateIntelligence({
    contents,
    systemInstruction: buildAssistantInstruction(memory),
    responseMimeType: 'application/json',
    temperature: 0.65,
    maxOutputTokens: 2400,
  });

  let parsed: any = parseJsonResponse(raw, null);

  if (!parsed || typeof parsed !== 'object') {
    parsed = {
      reply: raw || 'I’m here. What would you like help with?',
      suggestions: fallbackSuggestions,
      memory,
    };
  }

  // Defensive normalization in case a model embeds the requested object in `reply`.
  if (typeof parsed.reply === 'string') {
    const nested = parseJsonResponse<any>(parsed.reply.trim(), null);
    if (nested && typeof nested === 'object' && typeof nested.reply === 'string') {
      parsed = {
        reply: nested.reply,
        suggestions: nested.suggestions ?? parsed.suggestions,
        memory: nested.memory ?? parsed.memory,
      };
    }
  }

  const reply =
    typeof parsed.reply === 'string' && parsed.reply.trim()
      ? parsed.reply.trim().slice(0, 14000)
      : 'I’m here. What would you like help with?';

  const suggestions = sanitizeSuggestionList(parsed.suggestions);
  const updatedMemory =
    typeof parsed.memory === 'string'
      ? parsed.memory.trim().slice(0, 5000)
      : memory;

  return {
    status: 200,
    body: {
      configured: true,
      reply,
      suggestions:
        suggestions.length === 3 ? suggestions : fallbackSuggestions,
      memory: updatedMemory,
    },
  };
}

export async function handleScope(body: any): Promise<ApiResult> {
  const idea = typeof body?.idea === 'string' ? body.idea.trim() : '';

  if (idea.length < 5) {
    return {
      status: 400,
      body: {
        error: 'Please provide a brief description of your business idea or goal.',
      },
    };
  }

  if (!isIntelligenceConfigured()) {
    return {
      status: 503,
      body: {
        error: 'The intelligent scope engine is not configured on this deployment yet.',
      },
    };
  }

  const prompt = `You are KorvenzaTech's lead solutions architect.
Analyze this client idea:
"${idea.slice(0, 6000)}"

Return raw JSON only with:
{
  "recommendedService": "Primary service title",
  "suggestedStack": ["4 or 5 provider-neutral technologies"],
  "estimatedTimeline": "A clearly labeled rough MVP estimate",
  "recommendedFeatures": ["4 high-value MVP capabilities"],
  "businessValueSummary": "Two clear non-technical sentences about business value",
  "nextStep": "A practical next action"
}

Rules:
- Do not name or reveal the underlying model provider.
- Do not invent company claims or guaranteed results.
- Prefer provider-neutral terms such as language model, multimodal intelligence, cloud platform, or managed database when a vendor name is not necessary.`;

  const raw = await generateIntelligence({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    responseMimeType: 'application/json',
    temperature: 0.4,
    maxOutputTokens: 1200,
  });

  const parsed = parseJsonResponse<any>(raw, null);

  if (!parsed || typeof parsed !== 'object') {
    return {
      status: 502,
      body: { error: 'The scope engine could not format the analysis. Please try again.' },
    };
  }

  return {
    status: 200,
    body: {
      recommendedService:
        typeof parsed.recommendedService === 'string'
          ? parsed.recommendedService.slice(0, 140)
          : 'Custom Digital Product',
      suggestedStack: Array.isArray(parsed.suggestedStack)
        ? parsed.suggestedStack.filter((x: any) => typeof x === 'string').slice(0, 5)
        : [],
      estimatedTimeline:
        typeof parsed.estimatedTimeline === 'string'
          ? parsed.estimatedTimeline.slice(0, 120)
          : 'Scope dependent',
      recommendedFeatures: Array.isArray(parsed.recommendedFeatures)
        ? parsed.recommendedFeatures.filter((x: any) => typeof x === 'string').slice(0, 4)
        : [],
      businessValueSummary:
        typeof parsed.businessValueSummary === 'string'
          ? parsed.businessValueSummary.slice(0, 800)
          : '',
      nextStep:
        typeof parsed.nextStep === 'string'
          ? parsed.nextStep.slice(0, 240)
          : 'Discuss the requirements with KorvenzaTech.',
    },
  };
}

export async function handleContact(body: any): Promise<ApiResult> {
  const fullName = typeof body?.fullName === 'string' ? body.fullName.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';

  if (!fullName || !email) {
    return {
      status: 400,
      body: { error: 'Name and email are required fields.' },
    };
  }

  if (
    fullName.length > 120 ||
    email.length > 180 ||
    (body?.ideaDescription && String(body.ideaDescription).length > 8000)
  ) {
    return { status: 400, body: { error: 'Please shorten the submitted details.' } };
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    return { status: 400, body: { error: 'Please enter a valid email address.' } };
  }

  // Honeypot: bots may fill this hidden field.
  if (body?.website) {
    return {
      status: 200,
      body: {
        success: true,
        message: 'Thank you. Your inquiry has been received.',
      },
    };
  }

  const referenceId = `KZ-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;

  const webhook = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (webhook) {
    try {
      const webhookResponse = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceId,
          submittedAt: new Date().toISOString(),
          fullName,
          email,
          companyName: String(body?.companyName || '').slice(0, 180),
          country: String(body?.country || '').slice(0, 120),
          serviceNeeded: String(body?.serviceNeeded || 'General Inquiry').slice(0, 160),
          budgetRange: String(body?.budgetRange || 'Not specified').slice(0, 100),
          ideaDescription: String(body?.ideaDescription || '').slice(0, 8000),
          preferredContact: String(body?.preferredContact || 'Email').slice(0, 80),
        }),
      });

      if (!webhookResponse.ok) {
        throw new Error(`Webhook returned ${webhookResponse.status}`);
      }
    } catch (error) {
      console.error('Project inquiry forwarding failed:', error);
      return {
        status: 502,
        body: {
          error: 'We could not deliver your inquiry right now. Please try again shortly.',
        },
      };
    }
  } else {
    console.info('Project inquiry received', {
      referenceId,
      fullName,
      email,
      serviceNeeded: body?.serviceNeeded || 'General Inquiry',
    });
  }

  return {
    status: 200,
    body: {
      success: true,
      message:
        'Thank you. Our team will review your project details and contact you as soon as possible.',
      referenceId,
    },
  };
}
