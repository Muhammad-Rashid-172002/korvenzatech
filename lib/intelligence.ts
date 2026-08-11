type ContentRole = 'user' | 'model';

export type IntelligenceContent = {
  role: ContentRole;
  parts: Array<{ text: string }>;
};

type GenerateOptions = {
  contents: IntelligenceContent[];
  systemInstruction?: string;
  responseMimeType?: string;
  temperature?: number;
  maxOutputTokens?: number;
};

function getConfig() {
  const apiKey = process.env.AI_API_KEY?.trim();
  const model = process.env.AI_MODEL?.trim();

  if (!apiKey || !model) {
    return null;
  }

  return { apiKey, model };
}

export function isIntelligenceConfigured() {
  return Boolean(getConfig());
}

export async function generateIntelligence(options: GenerateOptions): Promise<string> {
  const config = getConfig();
  if (!config) {
    throw new Error('INTELLIGENCE_NOT_CONFIGURED');
  }

  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.model)}:generateContent` +
    `?key=${encodeURIComponent(config.apiKey)}`;

  const body: Record<string, unknown> = {
    contents: options.contents,
    generationConfig: {
      temperature: options.temperature ?? 0.6,
      maxOutputTokens: options.maxOutputTokens ?? 2200,
      ...(options.responseMimeType ? { responseMimeType: options.responseMimeType } : {}),
    },
  };

  if (options.systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: options.systemInstruction }],
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 35_000);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => ({} as any));

    if (!response.ok) {
      const detail =
        payload?.error?.message ||
        payload?.message ||
        `Intelligence service returned ${response.status}.`;
      throw new Error(String(detail));
    }

    const parts = payload?.candidates?.[0]?.content?.parts;
    if (!Array.isArray(parts)) return '';

    return parts
      .map((part: any) => (typeof part?.text === 'string' ? part.text : ''))
      .join('')
      .trim();
  } finally {
    clearTimeout(timeout);
  }
}

export function stripCodeFence(raw: string) {
  return raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

export function parseJsonResponse<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(stripCodeFence(raw)) as T;
  } catch {
    return fallback;
  }
}
