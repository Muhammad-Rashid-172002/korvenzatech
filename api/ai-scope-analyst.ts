import type { IncomingMessage, ServerResponse } from 'http';
import { handleScope } from '../lib/handlers';

export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    return res.end(JSON.stringify({ error: 'Method not allowed.' }));
  }

  try {
    const result = await handleScope(req.body || {});
    res.statusCode = result.status;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(result.body));
  } catch (error) {
    console.error('Scope engine error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'The scope engine is temporarily unavailable.' }));
  }
}
