// Renders the concept designs from gen2.py → tools/screens/out/*.png (git-ignored).
// Usage: node tools/screens/render2.mjs  (Playwright via PW env, default /tmp/sdts)
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const PW = process.env.PW || '/tmp/sdts/node_modules/playwright/index.mjs';
const { chromium } = await import(PW);
const here = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const shot = async (vw, vh, dpr, file, out, transparent = false) => {
  const ctx = await b.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: dpr });
  const p = await ctx.newPage();
  await p.goto('file://' + path.join(here, file));
  await p.waitForTimeout(200);
  await p.screenshot({ path: path.join(here, 'out', out), omitBackground: transparent });
  await ctx.close();
};
for (const app of ['fitmind', 'caredesk']) for (let i = 1; i <= 4; i++) await shot(390, 844, 3, `${app}/screen-${i}.html`, `${app}-screen-${i}.png`);
for (let i = 1; i <= 2; i++) await shot(1440, 900, 1.5, `caredesk/dashboard-${i}.html`, `caredesk-dashboard-${i}.png`);
for (const n of ['chat', 'flow', 'doc']) await shot(720, 460, 1.5, `ai/panel-${n}.html`, `ai-panel-${n}.png`, true);
for (const n of ['fitmind', 'caredesk', 'skillnova', 'ielts']) await shot(1536, 1024, 1, `covers/${n}.html`, `cover-${n}.png`);
await b.close();
console.log('rendered');
