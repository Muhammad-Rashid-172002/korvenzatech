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

type Config = { apiKey: string; models: string[] };

function getConfig(): Config | null {
  const apiKey = process.env.AI_API_KEY?.trim();
  const models = [
    process.env.AI_MODEL,
    process.env.AI_FALLBACK_MODEL,
    process.env.AI_FALLBACK_MODEL_2,
    process.env.AI_FALLBACK_MODEL_3,
  ].map(v => v?.trim()).filter((v): v is string => Boolean(v));

  if (!apiKey || !models.length) return null;
  return { apiKey, models: [...new Set(models)] };
}

export function isIntelligenceConfigured() {
  return Boolean(getConfig());
}

function isRetryable(status: number, message: string) {
  return status === 429 || status === 408 || status >= 500 || /quota|rate limit|temporar|overload|unavailable/i.test(message);
}

async function callModel(model: string, apiKey: string, options: GenerateOptions): Promise<string> {
  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent` +
    `?key=${encodeURIComponent(apiKey)}`;

  const body: Record<string, unknown> = {
    contents: options.contents,
    generationConfig: {
      temperature: options.temperature ?? 0.55,
      maxOutputTokens: options.maxOutputTokens ?? 2200,
      ...(options.responseMimeType ? { responseMimeType: options.responseMimeType } : {}),
    },
  };

  if (options.systemInstruction) {
    body.systemInstruction = { parts: [{ text: options.systemInstruction }] };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => ({} as any));
    if (!response.ok) {
      const detail = String(payload?.error?.message || payload?.message || `Intelligence service returned ${response.status}.`);
      const error = new Error(detail) as Error & { status?: number; retryable?: boolean };
      error.status = response.status;
      error.retryable = isRetryable(response.status, detail);
      throw error;
    }

    const parts = payload?.candidates?.[0]?.content?.parts;
    if (!Array.isArray(parts)) return '';
    return parts.map((part: any) => typeof part?.text === 'string' ? part.text : '').join('').trim();
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateIntelligence(options: GenerateOptions): Promise<string> {
  const config = getConfig();
  if (!config) throw new Error('INTELLIGENCE_NOT_CONFIGURED');

  let lastError: unknown;
  for (const model of config.models) {
    try {
      return await callModel(model, config.apiKey, options);
    } catch (error: any) {
      lastError = error;
      if (!error?.retryable) break;
    }
  }

  const publicError = new Error('INTELLIGENCE_TEMPORARILY_UNAVAILABLE') as Error & { cause?: unknown };
  publicError.cause = lastError;
  throw publicError;
}

export function stripCodeFence(raw: string) {
  return raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
}

export function parseJsonResponse<T>(raw: string, fallback: T): T {
  try { return JSON.parse(stripCodeFence(raw)) as T; } catch { return fallback; }
}
