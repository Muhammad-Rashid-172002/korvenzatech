import type { IncomingMessage, ServerResponse } from 'http';
import { handleChat } from '../lib/handlers.js';

export default async function handler(
  req: IncomingMessage & { body?: any },
  res: ServerResponse & { status?: any; json?: any }
) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Method not allowed.' }));
  }

  try {
    const result = await handleChat(req.body || {});

    res.statusCode = result.status;
    res.setHeader('Content-Type', 'application/json');

    return res.end(JSON.stringify(result.body));
  } catch (error: any) {
    console.error('Assistant error:', error);

    const message = String(error?.message || '');
    const status =
      message.includes('429') ||
      message.toLowerCase().includes('quota')
        ? 429
        : 500;

    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');

    return res.end(
      JSON.stringify({
        error:
          status === 429
            ? 'Korvenza AI is temporarily at capacity. Please try again shortly.'
            : 'Korvenza AI is temporarily unavailable. Please try again.',
      }),
    );
  }
}