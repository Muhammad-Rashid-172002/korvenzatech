# App screen recreations (dev tooling — never shipped)

HTML recreations of IELTS AI Master and SkillLink screens used as textures for the 3D phones in
"Selected products" (Flutter sources were not available, so Option B from the 3D brief).

- Neutral demo data only: no real users, no store ratings or download counts. Prices in PKR.
- `python3 tools/screens/gen.py` → writes `ielts/screen-1..4.html`, `skilllink/screen-1..4.html`
- `node tools/screens/render.mjs` → 390×844 @3x PNGs in `out/` (git-ignored). Needs Playwright
  (`PW=/path/to/playwright/index.mjs`, optional `CHROMIUM=/path/to/chrome`).
- `python3 tools/screens/sheet.py` → `public/media/work/<app>/screen-N.webp` (1170×2532, <150 KB),
  `screen-N-540.webp` (WebGL texture size) and `contact-sheet.png`.

**NEEDS RASHID REVIEW** — check that each screen matches the real apps closely enough before publishing.

## Concept designs (FitMind AI, CareDesk) + AI showcase panels + portfolio covers

`gen2.py` → `render2.mjs` → `sheet2.py` (same Playwright setup). These are **illustrative concept designs**
based on each product's documented features — not screenshots of the shipped apps — and the website labels
them that way. Outputs: `public/media/work/{fitmind,caredesk}/screen-N(.webp|-540.webp)`,
`public/media/work/caredesk/dashboard-N(.webp|-960.webp)`, `public/media/ai/panel-{chat,flow,doc}.webp`
(WebGL textures for the AI showcase) and the four portfolio covers `public/media/work/<name>-{800,1536}.webp`.
Replace them with real screenshots when available (same file names and sizes).
