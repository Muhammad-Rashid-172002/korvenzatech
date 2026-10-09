"""Generates the HTML app-screen recreations (4 × IELTS AI Master, 4 × SkillLink).

Neutral demo data only (no real users, no store ratings / download counts).
Run:  python3 tools/screens/gen.py  &&  node tools/screens/render.mjs
"""
from pathlib import Path

ROOT = Path(__file__).parent

# Minimal line icons (24×24, stroke) — generic shapes, no third-party brand marks.
I = {
    'home': '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    'chart': '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    'book': '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
    'user': '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    'head': '<path d="M3 14v-2a9 9 0 0 1 18 0v2"/><rect x="2" y="14" width="5" height="7" rx="2"/><rect x="17" y="14" width="5" height="7" rx="2"/>',
    'read': '<path d="M2 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2zM22 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8z"/>',
    'pen': '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    'mic': '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5"/>',
    'bell': '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0"/>',
    'check': '<path d="M20 6 9 17l-5-5"/>',
    'spark': '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    'back': '<path d="M15 18 9 12l6-6"/>',
    'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    'search': '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    'pin': '<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    'wrench': '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z"/>',
    'bolt': '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    'drop': '<path d="M12 2.7S5 10 5 15a7 7 0 0 0 14 0c0-5-7-12.3-7-12.3z"/>',
    'brush': '<path d="M18 2l4 4-9 9-4-4zM9 11l-5 5a3 3 0 0 0 4 4l5-5"/>',
    'snow': '<path d="M12 2v20M4 7l16 10M20 7 4 17"/>',
    'spray': '<path d="M3 21h12V9H3zM7 9V5h4v4M15 5h2M18 3v0M19 7h2M18 11v0"/>',
    'msg': '<path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z"/>',
    'list': '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    'plus': '<path d="M12 5v14M5 12h14"/>',
    'phone': '<path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
    'star': '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    'shield': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    'cal': '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    'filter': '<path d="M4 6h16M7 12h10M10 18h4"/>',
    'nav': '<path d="m3 11 19-9-9 19-2-8z"/>',
}


def ico(name, size=20, color='currentColor', fill='none', sw=2):
    return f'<svg class="ico" viewBox="0 0 24 24" style="width:{size}px;height:{size}px;stroke:{color};fill:{fill};stroke-width:{sw}">{I[name]}</svg>'


STATUS = '''<div class="status"><span>9:41</span><i>
<span style="display:inline-flex;gap:2px;align-items:flex-end;height:12px"><b style="height:4px"></b><b style="height:6px"></b><b style="height:9px"></b><b style="height:12px"></b></span>
<svg viewBox="0 0 24 24" style="width:17px;height:13px;fill:none;stroke:currentColor;stroke-width:2.6;stroke-linecap:round"><path d="M2 8.5a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16.3a5 5 0 0 1 6 0"/><circle cx="12" cy="19.5" r=".6"/></svg>
<span class="batt"></span></i></div>'''


def page(theme_css, body, title):
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{title}</title>
<link rel="stylesheet" href="../base.css"><style>{theme_css}</style></head>
<body>{STATUS}{body}<div class="home-ind"></div></body></html>'''


def tabbar(items, on):
    out = '<nav class="tabbar">'
    for i, (icon, label) in enumerate(items):
        out += f'<div class="tab{" on" if i == on else ""}">{ico(icon, 22)}<span>{label}</span></div>'
    return out + '</nav>'


# --------------------------------------------------------------------------- IELTS AI Master
IELTS_CSS = '''
:root { --bg:#F3F5FB; --card:#fff; --ink:#0E1A3D; --muted:#6B7594; --line:#E3E7F2; --brand:#1E4FD8; --red:#E2384D; --navy:#0D1C4A; }
.mod { padding:16px; border-radius:20px; color:#fff; position:relative; overflow:hidden; height:128px; display:flex; flex-direction:column; justify-content:space-between; }
.mod .ic { width:38px; height:38px; border-radius:12px; background:rgba(255,255,255,.18); display:grid; place-items:center; }
.mod::after { content:""; position:absolute; right:-26px; top:-26px; width:90px; height:90px; border-radius:50%; background:rgba(255,255,255,.1); }
.ring { width:66px; height:66px; border-radius:50%; display:grid; place-items:center; }
.err { background:#FDECEE; color:#B3192D; border-radius:4px; padding:0 2px; text-decoration:line-through; text-decoration-color:rgba(179,25,45,.5); }
.fix { background:#E7F6EE; color:#11804A; border-radius:4px; padding:0 2px; font-weight:600; }
'''
IELTS_TABS = [('home', 'Home'), ('book', 'Practice'), ('chart', 'Progress'), ('user', 'Profile')]

ielts = {}
ielts['screen-1'] = page(IELTS_CSS, f'''
<div class="wrap">
 <div class="row between" style="margin-top:6px">
  <div><div class="muted small" style="font-weight:600">Good evening</div><div class="h1" style="margin-top:4px">Ready to practise?</div></div>
  <div class="card" style="width:44px;height:44px;border-radius:14px;display:grid;place-items:center;color:var(--ink)">{ico('bell')}</div>
 </div>
 <div style="margin-top:18px;border-radius:22px;padding:18px;background:linear-gradient(135deg,#0D1C4A,#1E4FD8);color:#fff;position:relative;overflow:hidden">
  <div style="position:absolute;right:-30px;bottom:-40px;width:150px;height:150px;border-radius:50%;background:rgba(255,255,255,.08)"></div>
  <div class="row between"><span class="chip" style="background:rgba(255,255,255,.14);color:#fff">{ico('spark',14,'#fff')} AI study plan</span><span class="small" style="opacity:.8">Day 12 of 30</span></div>
  <div style="font-size:19px;font-weight:800;letter-spacing:-.02em;margin-top:14px;line-height:1.25">Today: Writing Task 2<br>+ 10 min speaking warm-up</div>
  <div class="row" style="gap:10px;margin-top:14px"><div class="bar" style="flex:1;background:rgba(255,255,255,.2)"><span style="width:40%;background:#fff"></span></div><span class="small" style="font-weight:700">40%</span></div>
 </div>
 <div class="row between" style="margin-top:22px"><div class="h2">Practice modules</div><span class="small" style="color:var(--brand);font-weight:700">See all</span></div>
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">
  <div class="mod" style="background:linear-gradient(150deg,#1E4FD8,#3D6CF0)"><span class="ic">{ico('head',20,'#fff')}</span><div><div style="font-weight:800;font-size:16px">Listening</div><div class="small" style="opacity:.85">4 sections · 40 Qs</div></div></div>
  <div class="mod" style="background:linear-gradient(150deg,#0D1C4A,#24387A)"><span class="ic">{ico('read',20,'#fff')}</span><div><div style="font-weight:800;font-size:16px">Reading</div><div class="small" style="opacity:.85">3 passages · 60 min</div></div></div>
  <div class="mod" style="background:linear-gradient(150deg,#E2384D,#F06272)"><span class="ic">{ico('pen',20,'#fff')}</span><div><div style="font-weight:800;font-size:16px">Writing</div><div class="small" style="opacity:.85">Task 1 & 2 · AI feedback</div></div></div>
  <div class="mod" style="background:linear-gradient(150deg,#0F7A6B,#17A08C)"><span class="ic">{ico('mic',20,'#fff')}</span><div><div style="font-weight:800;font-size:16px">Speaking</div><div class="small" style="opacity:.85">Parts 1–3 · live mock</div></div></div>
 </div>
 <div class="card row" style="margin-top:14px;padding:14px;gap:12px">
  <div style="width:42px;height:42px;border-radius:12px;background:#EEF2FD;display:grid;place-items:center;color:var(--brand)">{ico('clock')}</div>
  <div style="flex:1"><div style="font-weight:700;font-size:14px">Full mock test</div><div class="small muted">All four modules · 2 h 45 min</div></div>
  <span class="chip" style="background:#EEF2FD;color:var(--brand)">Start</span>
 </div>
</div>{tabbar(IELTS_TABS, 0)}''', 'IELTS — Dashboard')

ielts['screen-2'] = page(IELTS_CSS, f'''
<div class="wrap">
 <div class="row" style="gap:10px;margin-top:4px"><div class="card" style="width:40px;height:40px;border-radius:12px;display:grid;place-items:center">{ico('back')}</div><div class="h2">Writing feedback</div></div>
 <div class="card" style="margin-top:16px;padding:18px">
  <div class="row" style="gap:16px">
   <div class="ring" style="background:conic-gradient(var(--brand) 0 72%,var(--line) 72% 100%)"><div style="width:52px;height:52px;border-radius:50%;background:#fff;display:grid;place-items:center;font-weight:800;font-size:19px;color:var(--ink)">6.5</div></div>
   <div><div class="small muted" style="font-weight:600">Estimated band · Task 2</div><div style="font-weight:800;font-size:17px;margin-top:2px">Good progress</div><div class="small muted" style="margin-top:4px">Sample essay · 284 words</div></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 16px;margin-top:18px">
   {''.join(f'<div><div class="row between small" style="font-weight:600"><span>{k}</span><span>{v}</span></div><div class="bar" style="margin-top:6px"><span style="width:{w}%"></span></div></div>' for k, v, w in [('Task response','7.0',78),('Coherence','6.5',72),('Vocabulary','6.0',66),('Grammar','6.5',72)])}
  </div>
 </div>
 <div class="row between" style="margin-top:20px"><div class="h2">AI corrections</div><span class="chip" style="background:#FDECEE;color:#B3192D">3 to fix</span></div>
 <div class="card" style="margin-top:10px;padding:16px;font-size:14px;line-height:1.75;color:#33405F">
  Many people <span class="err">believes</span> <span class="fix">believe</span> that technology <span class="err">make</span> <span class="fix">makes</span> our lives easier. In my opinion, the advantages <span class="err">is</span> <span class="fix">are</span> greater than the disadvantages, <span class="err">because of</span> <span class="fix">because</span> it saves time…
 </div>
 <div class="card" style="margin-top:12px;padding:14px;display:flex;gap:12px">
  <div style="width:34px;height:34px;border-radius:10px;background:#EEF2FD;color:var(--brand);display:grid;place-items:center;flex-shrink:0">{ico('spark',18)}</div>
  <div class="small" style="line-height:1.55;color:#33405F"><b style="color:var(--ink)">Tip:</b> use linking phrases such as “On the other hand” to improve coherence between paragraphs.</div>
 </div>
 <div class="btn" style="margin-top:16px">Rewrite with suggestions</div>
</div>''', 'IELTS — Writing feedback')

wave = ''.join(f'<span style="width:4px;border-radius:3px;background:{"#fff" if i < 26 else "rgba(255,255,255,.35)"};height:{h}px"></span>' for i, h in enumerate([10,18,26,14,32,40,22,30,46,28,18,36,50,34,24,42,30,20,38,48,26,16,30,40,22,14,28,36,20,12,24,30,18,10]))
ielts['screen-3'] = page(IELTS_CSS + ':root{--bg:#0D1C4A;--ink:#fff;--muted:#A9B4D6}', f'''
<div class="wrap" style="color:#fff">
 <div class="row between" style="margin-top:4px"><div style="width:40px;height:40px;border-radius:12px;background:rgba(255,255,255,.1);display:grid;place-items:center">{ico('back',20,'#fff')}</div><span class="chip" style="background:rgba(226,56,77,.18);color:#FF8A98"><span style="width:7px;height:7px;border-radius:50%;background:#FF5B6E"></span> Recording</span></div>
 <div class="small" style="margin-top:22px;color:#A9B4D6;font-weight:600;letter-spacing:.08em;text-transform:uppercase">Speaking · Part 2</div>
 <div style="font-size:22px;font-weight:800;letter-spacing:-.02em;margin-top:8px;line-height:1.3">Describe a place you visited that you would like to visit again.</div>
 <div style="margin-top:14px;padding:14px 16px;border-radius:16px;background:rgba(255,255,255,.07);font-size:13.5px;line-height:1.7;color:#C9D2EE">You should say: where it is · when you went · what you did there · and explain why you would like to return.</div>
 <div style="margin-top:40px;text-align:center"><div style="font-size:46px;font-weight:800;letter-spacing:-.03em;font-variant-numeric:tabular-nums">01:24</div><div class="small" style="color:#A9B4D6">of 2:00 speaking time</div></div>
 <div class="row" style="justify-content:center;gap:4px;height:60px;margin-top:22px">{wave}</div>
 <div style="margin:40px auto 0;width:96px;height:96px;border-radius:50%;background:radial-gradient(circle,#F06272,#E2384D);display:grid;place-items:center;box-shadow:0 0 0 14px rgba(226,56,77,.16),0 0 0 30px rgba(226,56,77,.07)"><span style="width:28px;height:28px;border-radius:7px;background:#fff"></span></div>
 <div class="row" style="justify-content:space-between;margin-top:46px;font-size:13px;color:#C9D2EE">
  <span class="row" style="gap:6px">{ico('spark',16,'#7FA2FF')} Live fluency check</span><span class="row" style="gap:6px">{ico('clock',16,'#7FA2FF')} Prep: 1 min</span>
 </div>
</div>''', 'IELTS — Speaking')

ielts['screen-4'] = page(IELTS_CSS, f'''
<div class="wrap">
 <div class="h1" style="margin-top:6px">Your progress</div>
 <div class="small muted" style="margin-top:4px">Sample learner · last 4 weeks</div>
 <div class="card" style="margin-top:16px;padding:18px">
  <div class="row between"><div class="h2">Band trend</div><span class="chip" style="background:#EEF2FD;color:var(--brand)">Target 7.0</span></div>
  <svg viewBox="0 0 330 130" style="width:100%;height:130px;margin-top:10px">
   <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E4FD8" stop-opacity=".25"/><stop offset="1" stop-color="#1E4FD8" stop-opacity="0"/></linearGradient></defs>
   <path d="M0 26H330" stroke="#E2384D" stroke-dasharray="4 5" stroke-width="1.5"/>
   <path d="M0 104 L55 96 L110 88 L165 80 L220 66 L275 60 L330 50 V130 H0Z" fill="url(#g)"/>
   <path d="M0 104 L55 96 L110 88 L165 80 L220 66 L275 60 L330 50" fill="none" stroke="#1E4FD8" stroke-width="3" stroke-linejoin="round"/>
   <circle cx="330" cy="50" r="5" fill="#1E4FD8" stroke="#fff" stroke-width="2.5" transform="translate(-6 0)"/>
  </svg>
  <div class="row between small muted" style="margin-top:4px"><span>Wk 1</span><span>Wk 2</span><span>Wk 3</span><span>Wk 4</span></div>
 </div>
 <div class="h2" style="margin-top:20px">Personal plan</div>
 {''.join(f'<div class="card row" style="margin-top:10px;padding:14px;gap:12px"><div style="width:40px;height:40px;border-radius:12px;background:{bg};color:{fg};display:grid;place-items:center">{ico(ic,19)}</div><div style="flex:1"><div style="font-weight:700;font-size:14px">{t}</div><div class="small muted">{d}</div></div>{chk}</div>' for ic, t, d, bg, fg, chk in [
   ('pen', 'Writing Task 2 — opinion essay', 'Focus: coherence & linking', '#FDECEE', '#B3192D', f'<span style="width:26px;height:26px;border-radius:50%;background:#1E4FD8;display:grid;place-items:center">{ico("check",15,"#fff",sw=3)}</span>'),
   ('mic', 'Speaking Part 3 — discussion', 'Focus: fluency & examples', '#E5F5F2', '#0F7A6B', '<span style="width:26px;height:26px;border-radius:50%;border:2px solid var(--line)"></span>'),
   ('head', 'Listening Section 4', 'Focus: note completion', '#EEF2FD', '#1E4FD8', '<span style="width:26px;height:26px;border-radius:50%;border:2px solid var(--line)"></span>'),
 ])}
</div>{tabbar(IELTS_TABS, 2)}''', 'IELTS — Progress')

# --------------------------------------------------------------------------- SkillLink
SL_CSS = '''
:root { --bg:#F5F5FB; --card:#fff; --ink:#15123A; --muted:#6E6B8F; --line:#E7E6F3; --brand:#4F46E5; --brand2:#7C6CF6; }
.cat { display:flex; flex-direction:column; align-items:center; gap:7px; font-size:11.5px; font-weight:600; color:#3B3864; }
.cat span { width:56px; height:56px; border-radius:18px; background:#EEEDFD; color:var(--brand); display:grid; place-items:center; }
.svc { display:flex; gap:12px; padding:12px; }
.thumb { width:84px; height:84px; border-radius:16px; flex-shrink:0; display:grid; place-items:center; }
.price { font-weight:800; color:var(--brand); font-size:14px; }
.fab { position:absolute; left:50%; top:-22px; transform:translateX(-50%); width:54px; height:54px; border-radius:50%; background:linear-gradient(135deg,var(--brand),var(--brand2)); display:grid; place-items:center; box-shadow:0 10px 24px -8px rgba(79,70,229,.7); }
.step { display:flex; gap:14px; position:relative; padding-bottom:20px; }
.step .dot { width:26px; height:26px; border-radius:50%; display:grid; place-items:center; flex-shrink:0; z-index:1; }
.step::before { content:""; position:absolute; left:12px; top:26px; bottom:0; width:2px; background:var(--line); }
.step.done::before { background:var(--brand); }
.step:last-child::before { display:none; }
'''
SL_TABS = [('home', 'Home'), ('list', 'Requests'), ('plus', ''), ('msg', 'Messages'), ('user', 'Profile')]


def sl_tabbar(on):
    out = '<nav class="tabbar" style="position:absolute">'
    for i, (icon, label) in enumerate(SL_TABS):
        if icon == 'plus':
            out += f'<div class="tab" style="position:relative"><span class="fab">{ico("plus",24,"#fff",sw=2.6)}</span></div>'
        else:
            out += f'<div class="tab{" on" if i == on else ""}">{ico(icon, 22)}<span>{label}</span></div>'
    return out + '</nav>'


sl = {}
sl['screen-1'] = page(SL_CSS, f'''
<div class="wrap">
 <div class="row between" style="margin-top:2px"><span class="row small" style="gap:5px;font-weight:600;color:#3B3864">{ico('pin',15,'var(--brand)')} Lahore, Pakistan</span><span style="color:var(--ink)">{ico('bell',21)}</span></div>
 <div class="h1" style="margin-top:14px">Hi there,</div>
 <div class="muted" style="font-size:14px;margin-top:4px">What do you need help with today?</div>
 <div class="row" style="gap:10px;margin-top:16px">
  <div class="card row" style="flex:1;height:50px;padding:0 14px;gap:10px;border-radius:16px;color:var(--muted);font-size:14px">{ico('search',18)} Search for a service…</div>
  <div style="width:50px;height:50px;border-radius:16px;background:var(--brand);display:grid;place-items:center">{ico('filter',20,'#fff')}</div>
 </div>
 <div class="row between" style="margin-top:22px"><div class="h2">Categories</div><span class="small" style="color:var(--brand);font-weight:700">View all</span></div>
 <div class="row between" style="margin-top:12px">
  {''.join(f'<div class="cat"><span>{ico(i,22)}</span>{t}</div>' for i, t in [('wrench','Repairs'),('brush','Painting'),('bolt','Electric'),('spray','Cleaning'),('drop','Plumbing')])}
 </div>
 <div class="row between" style="margin-top:22px"><div class="h2">Popular services</div><span class="small" style="color:var(--brand);font-weight:700">See all</span></div>
 {''.join(f'<div class="card svc" style="margin-top:12px"><div class="thumb" style="background:{bg}">{ico(ic,34,fg,sw=1.6)}</div><div style="flex:1;display:flex;flex-direction:column;justify-content:space-between"><div><div style="font-weight:700;font-size:15px">{t}</div><div class="small muted" style="margin-top:3px;line-height:1.4">{d}</div></div><div class="row between"><span class="price">{p}</span><span class="small muted">from</span></div></div></div>' for ic, t, d, p, bg, fg in [
   ('snow', 'AC Service', 'Cleaning, gas check & general servicing', 'Rs 2,500', 'linear-gradient(135deg,#E8E7FE,#D7D4FD)', '#4F46E5'),
   ('bolt', 'Electrician', 'Wiring, switches, fittings & installation', 'Rs 1,200', 'linear-gradient(135deg,#FFF1DA,#FFE2B0)', '#C77A00'),
 ])}
</div>{sl_tabbar(0)}''', 'SkillLink — Home')

pins = [(84, 150, 'A'), (262, 118, 'B'), (300, 250, 'C'), (60, 300, 'D'), (210, 330, 'E')]
mapsvg = '''<svg viewBox="0 0 390 420" style="position:absolute;inset:0;width:390px;height:420px">
<rect width="390" height="420" fill="#ECEBF4"/>
<path d="M-10 90 Q120 60 220 110 T400 80" stroke="#fff" stroke-width="14" fill="none"/>
<path d="M-10 260 Q140 230 250 280 T400 250" stroke="#fff" stroke-width="18" fill="none"/>
<path d="M110 -10 Q90 160 140 260 T120 430" stroke="#fff" stroke-width="12" fill="none"/>
<path d="M300 -10 Q280 140 310 230 T290 430" stroke="#fff" stroke-width="10" fill="none"/>
<rect x="150" y="140" width="70" height="60" rx="10" fill="#DDF0E1"/><rect x="20" y="170" width="60" height="50" rx="8" fill="#E3E1F0"/>
<rect x="320" y="290" width="60" height="70" rx="8" fill="#E3E1F0"/><rect x="170" y="330" width="80" height="50" rx="10" fill="#DDF0E1"/>
<path d="M-10 380 Q200 350 400 400" stroke="#CFE3F6" stroke-width="26" fill="none"/>
<circle cx="195" cy="215" r="74" fill="#4F46E5" fill-opacity=".12" stroke="#4F46E5" stroke-opacity=".35" stroke-dasharray="5 6"/>
<circle cx="195" cy="215" r="16" fill="#4F46E5" fill-opacity=".25"/><circle cx="195" cy="215" r="8" fill="#4F46E5" stroke="#fff" stroke-width="3"/>
''' + ''.join(f'<g transform="translate({x} {y})"><path d="M0 0c-9-10-14-17-14-24a14 14 0 0 1 28 0c0 7-5 14-14 24z" fill="#fff" stroke="#4F46E5" stroke-width="2.5"/><circle cx="0" cy="-24" r="5.5" fill="#4F46E5"/></g>' for x, y, _ in pins) + '</svg>'

workers = [('UA', 'Usman A.', 'Electrician', '1.2 km', '#6D5CF0'), ('RA', 'Rizwan A.', 'Plumber', '1.6 km', '#0F9D7A'), ('FK', 'Fahad K.', 'AC Technician', '2.1 km', '#E07A2E')]
sl['screen-2'] = page(SL_CSS, f'''
<div style="position:absolute;inset:0;top:0">{mapsvg}</div>
<div class="wrap" style="position:relative">
 <div class="row between" style="margin-top:4px"><div class="card" style="width:42px;height:42px;border-radius:14px;display:grid;place-items:center">{ico('back')}</div><div class="card chip" style="padding:10px 14px;font-size:13px;color:var(--ink)">Find workers nearby</div><div class="card" style="width:42px;height:42px;border-radius:14px;display:grid;place-items:center">{ico('filter')}</div></div>
</div>
<div class="card" style="position:absolute;left:0;right:0;top:400px;bottom:0;border-radius:28px 28px 0 0;padding:10px 20px 0">
 <div style="width:40px;height:5px;border-radius:3px;background:var(--line);margin:0 auto"></div>
 <div class="row between" style="margin-top:14px"><div class="h2">Nearby workers</div><span class="chip" style="background:#EEEDFD;color:var(--brand)">5 available</span></div>
 {''.join(f'<div class="row" style="gap:12px;padding:12px 0;border-bottom:1px solid var(--line)"><div class="avatar" style="width:46px;height:46px;background:{c};font-size:15px">{a}</div><div style="flex:1"><div style="font-weight:700;font-size:15px">{n}</div><div class="small muted">{r}</div></div><div style="text-align:right"><div class="small" style="font-weight:700;color:var(--ink)">{d}</div><div class="small muted">away</div></div></div>' for a, n, r, d, c in workers)}
 <div class="btn" style="margin-top:14px">Request a worker</div>
</div>''', 'SkillLink — Nearby')

sl['screen-3'] = page(SL_CSS, f'''
<style>.status{{color:#fff}}</style><div style="position:absolute;left:0;right:0;top:0;height:250px;background:linear-gradient(150deg,#4F46E5,#7C6CF6)"></div>
<div class="wrap" style="position:relative;color:#fff">
 <div class="row between" style="margin-top:4px"><div style="width:42px;height:42px;border-radius:14px;background:rgba(255,255,255,.16);display:grid;place-items:center">{ico('back',20,'#fff')}</div><div style="width:42px;height:42px;border-radius:14px;background:rgba(255,255,255,.16);display:grid;place-items:center">{ico('msg',20,'#fff')}</div></div>
</div>
<div class="card" style="position:relative;margin:56px 20px 0;padding:0 18px 18px;text-align:center">
 <div class="avatar" style="width:86px;height:86px;background:linear-gradient(135deg,#8B7CF8,#5B4FE8);font-size:26px;margin:0 auto;transform:translateY(-43px);border:5px solid #fff">UA</div>
 <div style="margin-top:-32px;font-weight:800;font-size:20px;letter-spacing:-.02em">Usman A.</div>
 <div class="small muted" style="margin-top:3px">Electrician · Lahore</div>
 <div class="row" style="justify-content:center;gap:8px;margin-top:12px"><span class="chip" style="background:#E8F7F0;color:#0F7A55">{ico('shield',14,'#0F7A55')} ID verified</span><span class="chip" style="background:#EEEDFD;color:var(--brand)">{ico('clock',14,'var(--brand)')} Available today</span></div>
 <div style="display:grid;grid-template-columns:1fr 1fr 1fr;margin-top:16px;padding-top:14px;border-top:1px solid var(--line)">
  {''.join(f'<div><div style="font-weight:800;font-size:16px">{v}</div><div class="small muted">{k}</div></div>' for v, k in [('Rs 1,200', 'Visit fee'), ('6 yrs', 'Experience'), ('1.2 km', 'Distance')])}
 </div>
</div>
<div class="wrap" style="margin-top:6px">
 <div class="h2" style="margin-top:12px">Skills</div>
 <div class="row" style="flex-wrap:wrap;gap:8px;margin-top:10px">{''.join(f'<span class="chip" style="background:#fff;border:1px solid var(--line);color:#3B3864;padding:8px 12px">{s}</span>' for s in ['Wiring', 'Switch boards', 'Fan installation', 'UPS setup', 'Lighting'])}</div>
 <div class="h2" style="margin-top:18px">About</div>
 <div class="small" style="margin-top:8px;line-height:1.6;color:#4A4770;font-size:13px">Residential electrical work: new wiring, fault finding, fan and light installation. Brings own tools.</div>
 <div class="row" style="gap:10px;margin-top:18px"><div class="card" style="width:52px;height:52px;border-radius:16px;display:grid;place-items:center;color:var(--brand)">{ico('phone')}</div><div class="btn" style="flex:1">Book Usman</div></div>
</div>''', 'SkillLink — Worker profile')

steps = [('Request sent', 'Today, 10:05 AM', 'done'), ('Worker accepted', 'Usman A. · 10:07 AM', 'done'), ('On the way', 'Arriving in ~12 min', 'now'), ('Job in progress', '', ''), ('Completed & rated', '', '')]


def step_html(t, d, s):
    if s == 'done':
        dot = f'<span class="dot" style="background:var(--brand)">{ico("check",14,"#fff",sw=3)}</span>'
    elif s == 'now':
        dot = '<span class="dot" style="background:#fff;border:2px solid var(--brand);box-shadow:0 0 0 6px rgba(79,70,229,.12)"><span style="width:10px;height:10px;border-radius:50%;background:var(--brand)"></span></span>'
    else:
        dot = '<span class="dot" style="background:#fff;border:2px solid var(--line)"></span>'
    col = 'var(--ink)' if s else 'var(--muted)'
    sub = f'<div class="small muted" style="margin-top:2px">{d}</div>' if d else ''
    return f'<div class="step{" done" if s == "done" else ""}">{dot}<div style="padding-top:3px"><div style="font-weight:700;font-size:14.5px;color:{col}">{t}</div>{sub}</div></div>'


sl['screen-4'] = page(SL_CSS, f'''
<div class="wrap">
 <div class="row" style="gap:10px;margin-top:4px"><div class="card" style="width:40px;height:40px;border-radius:12px;display:grid;place-items:center">{ico('back')}</div><div class="h2">Job status</div></div>
 <div style="margin-top:16px;border-radius:22px;padding:18px;background:linear-gradient(150deg,#4F46E5,#7C6CF6);color:#fff">
  <div class="row between"><span class="chip" style="background:rgba(255,255,255,.18);color:#fff">{ico('nav',13,'#fff')} On the way</span><span class="small" style="opacity:.85">Job #SL-2041</span></div>
  <div style="font-size:21px;font-weight:800;letter-spacing:-.02em;margin-top:14px">Ceiling fan installation</div>
  <div class="small" style="opacity:.85;margin-top:4px">Model Town, Lahore · Today</div>
  <div class="row" style="gap:12px;margin-top:16px;padding-top:14px;border-top:1px solid rgba(255,255,255,.18)">
   <div class="avatar" style="width:40px;height:40px;background:rgba(255,255,255,.22);font-size:14px">UA</div>
   <div style="flex:1"><div style="font-weight:700;font-size:14px">Usman A.</div><div class="small" style="opacity:.8">Electrician</div></div>
   <div style="width:40px;height:40px;border-radius:12px;background:#fff;display:grid;place-items:center">{ico('phone',18,'var(--brand)')}</div>
   <div style="width:40px;height:40px;border-radius:12px;background:rgba(255,255,255,.18);display:grid;place-items:center">{ico('msg',18,'#fff')}</div>
  </div>
 </div>
 <div class="card" style="margin-top:14px;padding:18px 18px 0">{''.join(step_html(*s) for s in steps)}</div>
 <div class="card row between" style="margin-top:12px;padding:14px 16px"><div><div class="small muted">Estimated total</div><div style="font-weight:800;font-size:17px;margin-top:2px">Rs 1,800</div></div><span class="chip" style="background:#EEEDFD;color:var(--brand)">Pay after job</span></div>
</div>{sl_tabbar(1)}''', 'SkillLink — Job status')

for app, screens in (('ielts', ielts), ('skilllink', sl)):
    for name, html in screens.items():
        (ROOT / app / f'{name}.html').write_text(html, encoding='utf-8')
print('ok', len(ielts) + len(sl))
