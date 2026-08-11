import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { handleChat, handleContact, handleScope } from './lib/handlers';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "img-src 'self' data: blob:",
      "font-src 'self' https://fonts.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "script-src 'self' 'unsafe-inline'",
      "connect-src 'self'",
      "form-action 'self'",
    ].join('; '),
  );
  next();
});

const buckets = new Map<string, { count: number; resetAt: number }>();
function rateLimit(req: express.Request, res: express.Response, next: express.NextFunction) {
  const now = Date.now();
  const key = String(req.ip || 'anonymous');
  const current = buckets.get(key);

  if (!current || now > current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + 60_000 });
    return next();
  }

  current.count += 1;
  if (current.count > 35) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
  }

  next();
}

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    company: 'KorvenzaTech',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/chat', rateLimit, async (req, res) => {
  try {
    const result = await handleChat(req.body);
    res.status(result.status).json(result.body);
  } catch (error: any) {
    console.error('Assistant error:', error);
    const message = String(error?.message || '');
    const status = message.includes('429') || message.toLowerCase().includes('quota') ? 429 : 500;
    res.status(status).json({
      error:
        status === 429
          ? 'Korvenza AI is temporarily at capacity. Please try again shortly.'
          : 'Korvenza AI is temporarily unavailable. Please try again.',
    });
  }
});

app.post('/api/ai-scope-analyst', rateLimit, async (req, res) => {
  try {
    const result = await handleScope(req.body);
    res.status(result.status).json(result.body);
  } catch (error) {
    console.error('Scope engine error:', error);
    res.status(500).json({ error: 'The scope engine is temporarily unavailable.' });
  }
});

app.post('/api/contact', rateLimit, async (req, res) => {
  try {
    const result = await handleContact(req.body);
    res.status(result.status).json(result.body);
  } catch (error) {
    console.error('Contact endpoint error:', error);
    res.status(500).json({ error: 'We could not process your inquiry right now.' });
  }
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, {
      immutable: false,
      maxAge: '1h',
      setHeaders(res, filePath) {
        if (/\.(js|css|woff2?|png|jpg|jpeg|webp|svg)$/.test(filePath)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      },
    }));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KorvenzaTech server ready on http://0.0.0.0:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Server startup failed:', error);
  process.exit(1);
});
