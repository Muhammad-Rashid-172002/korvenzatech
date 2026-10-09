// Renders tools/screens/<app>/screen-N.html at 390×844 @3x → public/media/work/<app>/screen-N.webp (+ contact sheet).
// Usage: node tools/screens/render.mjs   (needs Playwright; PLAYWRIGHT path via PW env, default /tmp/sdts)
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const PW = process.env.PW || '/tmp/sdts/node_modules/playwright/index.mjs';
const { chromium } = await import(PW);
const here = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
const p = await ctx.newPage();
for (const app of ['ielts', 'skilllink']) for (let i = 1; i <= 4; i++) {
  await p.goto('file://' + path.join(here, app, `screen-${i}.html`));
  await p.waitForTimeout(150);
  await p.screenshot({ path: path.join(here, 'out', `${app}-screen-${i}.png`) });
}
await b.close();
console.log('rendered');
