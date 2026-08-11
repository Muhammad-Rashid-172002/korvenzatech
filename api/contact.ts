import type { IncomingMessage, ServerResponse } from 'http';
import { handleContact } from '../lib/handlers';

export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    return res.end(JSON.stringify({ error: 'Method not allowed.' }));
  }

  try {
    const result = await handleContact(req.body || {});
    res.statusCode = result.status;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result.body));
  } catch (error) {
    console.error('Contact endpoint error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'We could not process your inquiry right now.' }));
  }
}
