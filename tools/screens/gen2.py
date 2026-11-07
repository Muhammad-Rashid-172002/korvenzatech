"""Concept UI designs for FitMind AI and CareDesk (+ AI showcase panels and portfolio covers).

These are ILLUSTRATIVE CONCEPT DESIGNS made for the KorvenzaTech website, based on each product's
documented features — not screenshots of the shipped apps. Neutral demo data only (no real
people, no patient data, no store ratings, downloads or accuracy claims).

Run:  python3 tools/screens/gen2.py  &&  node tools/screens/render2.mjs  &&  python3 tools/screens/sheet2.py
"""
from pathlib import Path
from gen import I, ico, page, tabbar

ROOT = Path(__file__).parent

I.update({
    'camera': '<path d="M3 8a2 2 0 0 1 2-2h2.5L9 4h6l1.5 2H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/>',
    'scan': '<path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3M7 12h10"/>',
    'flame': '<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-2 2-5 5-5 8a7 7 0 0 0 7 7z"/>',
    'heart': '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z"/>',
    'pill': '<path d="M10.5 20.5a5 5 0 0 1-7-7l10-10a5 5 0 0 1 7 7z"/><path d="m8.5 8.5 7 7"/>',
    'face': '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    'run': '<circle cx="13" cy="4" r="2"/><path d="m6 20 4-6 3 2v5M8 12l2-4 4 1 3 3 3-1M10 14l-3-1"/>',
    'leaf': '<path d="M11 20A7 7 0 0 1 4 13c0-6 6-10 16-10 0 10-4 16-10 16zM2 22l9-9"/>',
    'grid': '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    'users': '<circle cx="9" cy="8" r="3.5"/><path d="M2 21a7 7 0 0 1 14 0M16 4a3.5 3.5 0 0 1 0 7M22 21a7 7 0 0 0-4-6.3"/>',
    'file': '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
    'cog': '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    'build': '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4M9 10h.01M15 10h.01M9 14h.01M15 14h.01"/>',
    'img': '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
    'alert': '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
    'down': '<path d="m6 9 6 6 6-6"/>',
    'bot': '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 14h.01M15 14h.01M2 13v2M22 13v2"/>',
    'mail': '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7 10-7"/>',
    'db': '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    'send': '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
})

# =========================================================================== FitMind AI (dark)
FIT_CSS = '''
:root { --bg:#0B0F14; --card:#151B22; --card2:#1C242D; --ink:#F2F6F4; --muted:#8B98A3; --line:#26303A; --brand:#A3E635; --orange:#FB923C; --blue:#38BDF8; --pink:#F472B6; }
body { background: radial-gradient(120% 60% at 50% -10%, #17241A 0%, var(--bg) 55%); }
.card { background: var(--card); box-shadow: none; border: 1px solid var(--line); }
.tabbar { background: #10151B; border-top-color: var(--line); }
.macro { flex:1; } .macro .bar { height:6px; background:#26303A; margin-top:7px; }
.lbl { font-size:11px; color:var(--muted); font-weight:600; letter-spacing:.02em; }
.disc { font-size:10.5px; color:#6F7C87; line-height:1.4; }
.pill { display:inline-flex; align-items:center; gap:6px; padding:5px 10px; border-radius:99px; font-size:11.5px; font-weight:700; }
'''
FIT_TABS = [('home', 'Today'), ('scan', 'Scan'), ('chart', 'Insights'), ('user', 'Profile')]


def ring(pct, size, stroke, color, track='#26303A'):
    r = (size - stroke) / 2
    c = 2 * 3.14159 * r
    return f'''<svg width="{size}" height="{size}" style="transform:rotate(-90deg)"><circle cx="{size/2}" cy="{size/2}" r="{r}" fill="none" stroke="{track}" stroke-width="{stroke}"/>
<circle cx="{size/2}" cy="{size/2}" r="{r}" fill="none" stroke="{color}" stroke-width="{stroke}" stroke-linecap="round" stroke-dasharray="{c*pct:.1f} {c:.1f}"/></svg>'''


def plate():
    """Stylised top-down meal (CSS shapes only, no photography)."""
    return '''<div style="position:absolute;left:50%;top:50%;width:250px;height:250px;margin:-125px 0 0 -125px;border-radius:50%;background:radial-gradient(circle,#F4F1EA 0 58%,#E3DDD0 59% 62%,#F7F4EE 63%);box-shadow:0 30px 60px rgba(0,0,0,.55)">
 <div style="position:absolute;left:46px;top:58px;width:92px;height:70px;border-radius:44% 56% 52% 48%;background:linear-gradient(135deg,#C9822F,#9A5A1E);box-shadow:inset 0 -6px 0 rgba(0,0,0,.15)"></div>
 <div style="position:absolute;left:50px;top:66px;width:84px;height:6px;border-radius:3px;background:rgba(60,30,8,.45);transform:rotate(-12deg)"></div>
 <div style="position:absolute;left:58px;top:88px;width:76px;height:6px;border-radius:3px;background:rgba(60,30,8,.45);transform:rotate(-12deg)"></div>
 <div style="position:absolute;right:40px;top:62px;width:78px;height:84px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#FFFFFF,#EDE6D8);box-shadow:inset 0 -5px 0 rgba(0,0,0,.06)"></div>
 <div style="position:absolute;left:62px;bottom:44px;width:120px;height:66px;border-radius:50% 50% 46% 54%;background:radial-gradient(circle at 25% 40%,#7BC043 0 18%,transparent 19%),radial-gradient(circle at 60% 30%,#4E9A2E 0 20%,transparent 21%),radial-gradient(circle at 75% 65%,#E2483B 0 13%,transparent 14%),radial-gradient(circle at 40% 70%,#F2C14E 0 12%,transparent 13%),radial-gradient(circle at 50% 50%,#5DAA35 0 60%,#3E7D24 61%)"></div>
</div>'''


def box(x, y, w, h, label, kcal, color='#A3E635', side='left'):
    return f'''<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;border:2px solid {color};border-radius:14px;box-shadow:0 0 0 1px rgba(0,0,0,.2)">
<span style="position:absolute;{side}:-2px;top:-30px;white-space:nowrap;background:{color};color:#0B0F14;font-size:11.5px;font-weight:800;padding:5px 9px;border-radius:9px">{label} · {kcal}</span></div>'''


fit = {}
fit['screen-1'] = page(FIT_CSS, f'''<div class="wrap">
 <div class="row between" style="margin-top:6px"><div><div class="lbl">Thursday · Concept</div><div class="h1" style="margin-top:4px">Today</div></div>
  <div class="avatar" style="width:40px;height:40px;background:#26303A;color:var(--brand);font-size:13px">FM</div></div>
 <div class="card" style="margin-top:16px;padding:18px;display:flex;align-items:center;gap:18px">
  <div style="position:relative;width:132px;height:132px">{ring(.68,132,13,'var(--brand)')}
   <div style="position:absolute;inset:0;display:grid;place-content:center;text-align:center"><div style="font-size:28px;font-weight:800;letter-spacing:-.03em">1,420</div><div class="lbl">of 2,100 kcal</div></div></div>
  <div style="flex:1;display:grid;gap:12px">
   <div class="macro"><div class="row between small"><b>Protein</b><span class="muted">86 / 130g</span></div><div class="bar"><span style="width:66%;background:var(--blue)"></span></div></div>
   <div class="macro"><div class="row between small"><b>Carbs</b><span class="muted">152 / 240g</span></div><div class="bar"><span style="width:63%;background:var(--orange)"></span></div></div>
   <div class="macro"><div class="row between small"><b>Fat</b><span class="muted">41 / 70g</span></div><div class="bar"><span style="width:58%;background:var(--pink)"></span></div></div>
  </div></div>
 <div class="btn" style="margin-top:14px;background:var(--brand);color:#0B0F14;height:56px;border-radius:18px">{ico('scan',20,'#0B0F14')} Scan a meal with AI</div>
 <div class="row" style="gap:10px;margin-top:14px">
  <div class="card" style="flex:1;padding:14px"><div class="row" style="gap:8px">{ico('run',18,'var(--orange)')}<span class="lbl">Steps</span></div><div style="font-size:20px;font-weight:800;margin-top:8px">7,842</div><div class="bar" style="height:5px;margin-top:8px;background:#26303A"><span style="width:78%;background:var(--orange)"></span></div></div>
  <div class="card" style="flex:1;padding:14px"><div class="row" style="gap:8px">{ico('drop',18,'var(--blue)')}<span class="lbl">Water</span></div><div style="font-size:20px;font-weight:800;margin-top:8px">1.6 L</div><div class="bar" style="height:5px;margin-top:8px;background:#26303A"><span style="width:64%;background:var(--blue)"></span></div></div>
 </div>
 <div class="row between" style="margin-top:20px"><div class="h2">Meals</div><span class="small" style="color:var(--brand);font-weight:700">Add</span></div>
 <div class="card" style="margin-top:10px;padding:4px 14px">
  <div class="row between" style="padding:12px 0;border-bottom:1px solid var(--line)"><div class="row" style="gap:12px"><div style="width:40px;height:40px;border-radius:12px;background:#2A2116;display:grid;place-items:center">{ico('flame',18,'var(--orange)')}</div><div><b style="font-size:14px">Breakfast</b><div class="small muted">Oats, banana, yogurt</div></div></div><b style="font-size:14px">410</b></div>
  <div class="row between" style="padding:12px 0"><div class="row" style="gap:12px"><div style="width:40px;height:40px;border-radius:12px;background:#1B2A12;display:grid;place-items:center">{ico('leaf',18,'var(--brand)')}</div><div><b style="font-size:14px">Lunch</b><div class="small muted">Scanned · chicken, rice, salad</div></div></div><b style="font-size:14px">640</b></div>
 </div>
</div>{tabbar(FIT_TABS, 0)}''', 'FitMind AI — Today')

fit['screen-2'] = page(FIT_CSS + 'body{background:#05080A} .status{color:#fff}', f'''
<div style="position:absolute;inset:0;background:radial-gradient(70% 50% at 50% 42%,#3A3226,#0A0C0E 80%)"></div>
<div style="position:absolute;left:0;right:0;top:56px;padding:0 20px;display:flex;justify-content:space-between;align-items:center;z-index:2">
 <div style="width:40px;height:40px;border-radius:13px;background:rgba(0,0,0,.45);display:grid;place-items:center">{ico('back',20,'#fff')}</div>
 <span class="pill" style="background:rgba(0,0,0,.5);color:#fff">{ico('spark',14,'var(--brand)')} AI food scan</span>
 <div style="width:40px;height:40px;border-radius:13px;background:rgba(0,0,0,.45);display:grid;place-items:center">{ico('bolt',18,'#fff')}</div></div>
<div style="position:absolute;left:0;right:0;top:110px;height:400px">{plate()}
 {box(84,150,108,84,'Chicken','280')}{box(196,152,96,98,'Rice','210','#FBBF24','right')}{box(96,262,142,82,'Salad','90','#38BDF8')}
 <div style="position:absolute;left:30px;top:30px;width:34px;height:34px;border-left:3px solid #fff;border-top:3px solid #fff;border-radius:10px 0 0 0;opacity:.8"></div>
 <div style="position:absolute;right:30px;top:30px;width:34px;height:34px;border-right:3px solid #fff;border-top:3px solid #fff;border-radius:0 10px 0 0;opacity:.8"></div>
 <div style="position:absolute;left:30px;bottom:6px;width:34px;height:34px;border-left:3px solid #fff;border-bottom:3px solid #fff;border-radius:0 0 0 10px;opacity:.8"></div>
 <div style="position:absolute;right:30px;bottom:6px;width:34px;height:34px;border-right:3px solid #fff;border-bottom:3px solid #fff;border-radius:0 0 10px 0;opacity:.8"></div>
</div>
<div style="position:absolute;left:10px;right:10px;bottom:10px;padding:20px 18px 26px;border-radius:28px;background:#151B22;border:1px solid #26303A;z-index:2">
 <div style="width:40px;height:5px;border-radius:3px;background:#323C47;margin:-8px auto 14px"></div>
 <div class="row between"><div><div class="lbl">Detected · 3 items</div><div style="font-size:24px;font-weight:800;margin-top:4px">≈ 580 kcal</div></div><span class="pill" style="background:#1B2A12;color:var(--brand)">Estimate</span></div>
 <div class="row" style="gap:8px;margin-top:14px">
  <div class="card" style="flex:1;padding:10px;background:#1C242D"><div class="lbl">Protein</div><b style="font-size:16px">42 g</b></div>
  <div class="card" style="flex:1;padding:10px;background:#1C242D"><div class="lbl">Carbs</div><b style="font-size:16px">64 g</b></div>
  <div class="card" style="flex:1;padding:10px;background:#1C242D"><div class="lbl">Fat</div><b style="font-size:16px">14 g</b></div></div>
 <div class="btn" style="margin-top:14px;background:var(--brand);color:#0B0F14">Add to lunch</div>
 <div class="disc" style="margin-top:10px;text-align:center">AI estimates are informational and may differ from actual values.</div>
</div>''', 'FitMind AI — Food scan')

fit['screen-3'] = page(FIT_CSS, f'''<div class="wrap">
 <div class="row between" style="margin-top:6px"><div style="width:40px;height:40px;border-radius:13px;background:#151B22;display:grid;place-items:center">{ico('back',20)}</div><b>Nutrition analysis</b><div style="width:40px"></div></div>
 <div class="card" style="margin-top:16px;padding:18px">
  <div class="row" style="gap:18px">
   <div style="position:relative;width:118px;height:118px">
    <svg width="118" height="118" viewBox="0 0 42 42" style="transform:rotate(-90deg)"><circle cx="21" cy="21" r="15.9" fill="none" stroke="#26303A" stroke-width="6"/>
    <circle cx="21" cy="21" r="15.9" fill="none" stroke="#38BDF8" stroke-width="6" stroke-dasharray="30 70"/>
    <circle cx="21" cy="21" r="15.9" fill="none" stroke="#FB923C" stroke-width="6" stroke-dasharray="45 55" stroke-dashoffset="-30"/>
    <circle cx="21" cy="21" r="15.9" fill="none" stroke="#F472B6" stroke-width="6" stroke-dasharray="22 78" stroke-dashoffset="-75"/></svg>
    <div style="position:absolute;inset:0;display:grid;place-content:center;text-align:center"><b style="font-size:22px">580</b><span class="lbl">kcal</span></div></div>
   <div style="display:grid;gap:9px;flex:1" class="small">
    <div class="row between"><span class="row" style="gap:7px"><i style="width:9px;height:9px;border-radius:3px;background:#38BDF8"></i>Protein</span><b>30%</b></div>
    <div class="row between"><span class="row" style="gap:7px"><i style="width:9px;height:9px;border-radius:3px;background:#FB923C"></i>Carbs</span><b>45%</b></div>
    <div class="row between"><span class="row" style="gap:7px"><i style="width:9px;height:9px;border-radius:3px;background:#F472B6"></i>Fat</span><b>22%</b></div>
    <div class="row between"><span class="row" style="gap:7px"><i style="width:9px;height:9px;border-radius:3px;background:#A3E635"></i>Fibre</span><b>3%</b></div></div>
  </div></div>
 <div class="h2" style="margin-top:20px">Items</div>
 <div class="card" style="margin-top:10px;padding:4px 14px">
  {''.join(f'<div class="row between" style="padding:12px 0;{"border-bottom:1px solid var(--line)" if i<2 else ""}"><div><b style="font-size:14px">{n}</b><div class="small muted">{q}</div></div><div style="text-align:right"><b style="font-size:14px">{k}</b><div class="small muted">kcal</div></div></div>' for i,(n,q,k) in enumerate([("Grilled chicken","≈ 150 g","280"),("Steamed rice","≈ 1 cup","210"),("Garden salad","≈ 1 bowl","90")]))}
 </div>
 <div class="card" style="margin-top:14px;padding:16px;background:linear-gradient(135deg,#1B2A12,#151B22);border-color:#2F4A1C">
  <div class="row" style="gap:8px">{ico('spark',16,'var(--brand)')}<b style="font-size:13px;color:var(--brand)">AI insight</b></div>
  <p style="font-size:13.5px;line-height:1.5;margin-top:8px;color:#D9E2DC">A balanced plate. You still have about 44 g of protein left for today — a lean dinner would help you reach your goal.</p>
 </div>
 <div class="disc" style="margin-top:12px">Insights are informational only and not a substitute for professional medical or dietary advice.</div>
</div>{tabbar(FIT_TABS, 2)}''', 'FitMind AI — Nutrition analysis')

fit['screen-4'] = page(FIT_CSS, f'''<div class="wrap">
 <div style="margin-top:6px"><div class="lbl">AI health tools · Concept</div><div class="h1" style="margin-top:4px">Scan &amp; track</div></div>
 <div class="row" style="gap:10px;margin-top:16px">
  <div class="card" style="flex:1;padding:16px;background:linear-gradient(160deg,#2A1A22,#151B22)"><div style="width:42px;height:42px;border-radius:14px;background:#3A2030;display:grid;place-items:center">{ico('face',20,'var(--pink)')}</div><b style="display:block;margin-top:14px;font-size:15px">Skin scan</b><div class="small muted" style="margin-top:3px">Photo-based skin check</div></div>
  <div class="card" style="flex:1;padding:16px;background:linear-gradient(160deg,#13242E,#151B22)"><div style="width:42px;height:42px;border-radius:14px;background:#163343;display:grid;place-items:center">{ico('pill',20,'var(--blue)')}</div><b style="display:block;margin-top:14px;font-size:15px">Medicine scanner</b><div class="small muted" style="margin-top:3px">Read a medicine label</div></div>
 </div>
 <div class="card" style="margin-top:12px;padding:14px;display:flex;gap:12px;align-items:center"><div style="width:44px;height:44px;border-radius:14px;background:#1B2A12;display:grid;place-items:center">{ico('scan',20,'var(--brand)')}</div><div style="flex:1"><b style="font-size:14px">Food scanner</b><div class="small muted">Calories &amp; macros from a photo</div></div>{ico('back',18,'#6F7C87')}</div>
 <div class="row between" style="margin-top:20px"><div class="h2">This week</div><span class="small muted">Workouts</span></div>
 <div class="card" style="margin-top:10px;padding:16px">
  <div class="row" style="align-items:flex-end;gap:10px;height:112px">
   {''.join(f'<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px"><div style="width:100%;height:{h}px;border-radius:8px;background:{"var(--brand)" if i==4 else "#26303A"}"></div><span class="lbl">{d}</span></div>' for i,(d,h) in enumerate(zip("MTWTFSS",[40,72,30,88,96,24,56])))}
  </div>
  <div class="row between" style="margin-top:14px"><div><div class="lbl">Active minutes</div><b style="font-size:18px">214</b></div><div><div class="lbl">Workouts</div><b style="font-size:18px">5</b></div><div><div class="lbl">Burned</div><b style="font-size:18px">1,860</b></div></div>
 </div>
 <div class="card" style="margin-top:12px;padding:12px 14px;display:flex;gap:10px;align-items:flex-start;background:#12171D">{ico('alert',16,'#8B98A3')}<div class="disc">Skin and medicine results are general information only. Always consult a qualified healthcare professional.</div></div>
</div>{tabbar(FIT_TABS, 1)}''', 'FitMind AI — Health tools')

# =========================================================================== CareDesk (light clinical)
CARE_CSS = '''
:root { --bg:#F2F6F8; --card:#fff; --ink:#0F2430; --muted:#647887; --line:#E2EAEE; --brand:#0E8C86; --brand2:#0B6E69; --amber:#D97706; --red:#DC2626; --blue:#2563EB; }
.st { display:inline-flex; align-items:center; gap:5px; padding:4px 9px; border-radius:99px; font-size:11px; font-weight:700; }
.open { background:#FEF3C7; color:#92400E; } .prog { background:#DBEAFE; color:#1E40AF; } .done { background:#D1FAE5; color:#065F46; } .new { background:#FCE7F3; color:#9D174D; }
.lbl { font-size:11px; color:var(--muted); font-weight:600; }
'''
CARE_TABS = [('home', 'Home'), ('list', 'Complaints'), ('bell', 'Alerts'), ('user', 'Profile')]

care = {}
care['screen-1'] = page(CARE_CSS, f'''<div style="background:linear-gradient(160deg,#0E8C86,#0A5F5B);margin-top:-47px;padding:59px 20px 70px;color:#fff;border-radius:0 0 30px 30px">
 <div class="row between"><div><div style="font-size:13px;opacity:.8">Staff portal · Concept</div><div style="font-size:24px;font-weight:800;letter-spacing:-.02em;margin-top:4px">Good morning, Sara</div><div style="font-size:12.5px;opacity:.8;margin-top:3px">Nursing · Ward 3B</div></div>
 <div style="width:42px;height:42px;border-radius:14px;background:rgba(255,255,255,.16);display:grid;place-items:center">{ico('bell',20,'#fff')}</div></div></div>
<div class="wrap" style="margin-top:-52px">
 <div class="card" style="padding:16px;display:grid;grid-template-columns:repeat(3,1fr);text-align:center">
  <div><div style="font-size:22px;font-weight:800;color:var(--amber)">2</div><div class="lbl">Open</div></div>
  <div style="border-left:1px solid var(--line);border-right:1px solid var(--line)"><div style="font-size:22px;font-weight:800;color:var(--blue)">1</div><div class="lbl">In progress</div></div>
  <div><div style="font-size:22px;font-weight:800;color:var(--brand)">9</div><div class="lbl">Resolved</div></div></div>
 <div class="btn" style="margin-top:14px;background:var(--brand)">{ico('plus',20,'#fff')} Report a complaint</div>
 <div class="row between" style="margin-top:20px"><div class="h2">Recent</div><span class="small" style="color:var(--brand);font-weight:700">See all</span></div>
 {''.join(f'<div class="card" style="margin-top:10px;padding:14px;display:flex;gap:12px;align-items:center"><div style="width:42px;height:42px;border-radius:13px;background:{bg};display:grid;place-items:center">{ico(ic,19,col)}</div><div style="flex:1"><b style="font-size:14px">{t}</b><div class="small muted" style="margin-top:2px">{d}</div></div><span class="st {cls}">{s}</span></div>' for t,d,ic,bg,col,cls,s in [("AC not cooling","Ward 3B · Room 12 · #CD-1042","snow","#E0F2FE","#0369A1","prog","In progress"),("Flickering ceiling light","Corridor B · #CD-1039","bolt","#FEF3C7","#B45309","open","Open"),("Leaking wash basin","Staff room · #CD-1031","drop","#D1FAE5","#047857","done","Resolved")])}
</div>{tabbar(CARE_TABS, 0)}''', 'CareDesk — Home')

care['screen-2'] = page(CARE_CSS, f'''<div class="wrap">
 <div class="row between" style="margin-top:6px"><div style="width:40px;height:40px;border-radius:13px;background:#fff;display:grid;place-items:center">{ico('back',20)}</div><b>New complaint</b><div style="width:40px"></div></div>
 <div class="lbl" style="margin-top:20px">Category</div>
 <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">
  {''.join(f'<span class="chip" style="{"background:var(--brand);color:#fff" if on else "background:#fff;border:1px solid var(--line);color:var(--ink)"}">{ico(ic,15,"#fff" if on else "var(--muted)")}{t}</span>' for t,ic,on in [("Electrical","bolt",False),("AC / HVAC","snow",True),("Plumbing","drop",False),("Cleanliness","spray",False),("Equipment","wrench",False),("Other","list",False)])}
 </div>
 <div class="lbl" style="margin-top:18px">Location</div>
 <div class="card" style="margin-top:8px;padding:14px;display:flex;justify-content:space-between;align-items:center"><span class="row" style="gap:10px">{ico('build',18,'var(--brand)')}<b style="font-size:14px">Ward 3B · Room 12</b></span>{ico('down',18,'var(--muted)')}</div>
 <div class="lbl" style="margin-top:18px">Priority</div>
 <div class="row" style="gap:8px;margin-top:8px">{''.join(f'<div style="flex:1;text-align:center;padding:11px 0;border-radius:13px;font-size:13px;font-weight:700;{s}">{t}</div>' for t,s in [("Low","background:#fff;border:1px solid var(--line)"),("Medium","background:#FEF3C7;border:1px solid #FCD34D;color:#92400E"),("Urgent","background:#fff;border:1px solid var(--line)")])}</div>
 <div class="lbl" style="margin-top:18px">Description</div>
 <div class="card" style="margin-top:8px;padding:14px;height:96px;font-size:14px;line-height:1.5;color:#33505E">The AC unit is running but the room is not cooling. Started this morning.</div>
 <div class="card" style="margin-top:10px;padding:12px 14px;display:flex;gap:10px;align-items:center;border:1.5px dashed #B6CBD3;box-shadow:none">{ico('camera',19,'var(--brand)')}<span style="font-size:13.5px;font-weight:600">Add a photo</span><span class="small muted" style="margin-left:auto">Optional</span></div>
 <div class="btn" style="margin-top:16px;background:var(--brand)">Submit complaint {ico('send',17,'#fff')}</div>
</div>''', 'CareDesk — New complaint')

STEPS = [("Submitted", "Today, 08:12", "done"), ("Assigned to technician", "HVAC team · 08:20", "done"), ("In progress", "Technician on site · 09:05", "now"), ("Resolved", "Awaiting confirmation", "todo")]


def cstep(t, d, s, last=False):
    dot = {'done': f'<div style="width:24px;height:24px;border-radius:50%;background:var(--brand);display:grid;place-items:center">{ico("check",14,"#fff",sw=3)}</div>',
           'now': '<div style="width:24px;height:24px;border-radius:50%;border:2px solid var(--blue);display:grid;place-items:center"><i style="width:10px;height:10px;border-radius:50%;background:var(--blue)"></i></div>',
           'todo': '<div style="width:24px;height:24px;border-radius:50%;border:2px solid var(--line)"></div>'}[s]
    line = '' if last else f'<div style="width:2px;flex:1;background:{"var(--brand)" if s=="done" else "var(--line)"};margin:4px 0"></div>'
    return f'<div class="row" style="gap:14px;align-items:stretch;min-height:{38 if last else 62}px"><div style="display:flex;flex-direction:column;align-items:center">{dot}{line}</div><div><b style="font-size:14px;{"color:var(--muted)" if s=="todo" else ""}">{t}</b><div class="small muted" style="margin-top:2px">{d}</div></div></div>'


care['screen-3'] = page(CARE_CSS, f'''<div class="wrap">
 <div class="row between" style="margin-top:6px"><div style="width:40px;height:40px;border-radius:13px;background:#fff;display:grid;place-items:center">{ico('back',20)}</div><b>#CD-1042</b><div style="width:40px"></div></div>
 <div class="card" style="margin-top:16px;padding:18px">
  <div class="row between"><span class="st prog">In progress</span><span class="st open">Medium</span></div>
  <div style="font-size:20px;font-weight:800;letter-spacing:-.02em;margin-top:12px">AC not cooling</div>
  <div class="small muted" style="margin-top:4px">AC / HVAC · Ward 3B · Room 12</div>
  <div class="row" style="gap:10px;margin-top:14px;padding-top:14px;border-top:1px solid var(--line)"><div class="avatar" style="width:36px;height:36px;background:#0E8C86;font-size:12px">HT</div><div style="flex:1"><b style="font-size:13.5px">HVAC technician</b><div class="small muted">Assigned by facilities admin</div></div></div>
 </div>
 <div class="card" style="margin-top:12px;padding:18px 18px 4px">{''.join(cstep(*s, last=i==len(STEPS)-1) for i,s in enumerate(STEPS))}</div>
 <div class="h2" style="margin-top:18px">Updates</div>
 <div class="card" style="margin-top:10px;padding:14px"><div class="row between"><b style="font-size:13px">Technician</b><span class="small muted">09:05</span></div><p style="font-size:13.5px;line-height:1.5;margin-top:6px;color:#33505E">Filter cleaned, checking the refrigerant level now. Should be fixed within the hour.</p></div>
</div>{tabbar(CARE_TABS, 1)}''', 'CareDesk — Complaint tracking')

care['screen-4'] = page(CARE_CSS, f'''<div class="wrap">
 <div class="row between" style="margin-top:6px"><div class="h1">My complaints</div><div style="width:40px;height:40px;border-radius:13px;background:#fff;display:grid;place-items:center">{ico('filter',19)}</div></div>
 <div class="row" style="gap:8px;margin-top:14px">{''.join(f'<span class="chip" style="{s}">{t}</span>' for t,s in [("All 12","background:var(--ink);color:#fff"),("Open 2","background:#fff;border:1px solid var(--line)"),("In progress 1","background:#fff;border:1px solid var(--line)"),("Resolved 9","background:#fff;border:1px solid var(--line)")])}</div>
 {''.join(f'<div class="card" style="margin-top:10px;padding:14px"><div class="row between"><span class="small muted">{n}</span><span class="st {c}">{s}</span></div><b style="display:block;font-size:14.5px;margin-top:8px">{t}</b><div class="row between" style="margin-top:8px"><span class="small muted">{loc}</span><span class="small muted">{when}</span></div></div>' for n,c,s,t,loc,when in [("#CD-1042","prog","In progress","AC not cooling","Ward 3B · Room 12","Today"),("#CD-1039","open","Open","Flickering ceiling light","Corridor B","Yesterday"),("#CD-1036","open","Open","Broken bed rail lock","Ward 3B · Room 7","2 days ago"),("#CD-1031","done","Resolved","Leaking wash basin","Staff room","Last week"),("#CD-1027","done","Resolved","Blocked drain","Ward 3B · Washroom","Last week")])}
</div>{tabbar(CARE_TABS, 1)}''', 'CareDesk — My complaints')

# --------------------------------------------------------------------- CareDesk admin web dashboard (1440×900)
DASH_CSS = '''
* { box-sizing:border-box; margin:0; padding:0; }
html,body { width:1440px; height:900px; overflow:hidden; }
body { font-family:Inter,system-ui,sans-serif; -webkit-font-smoothing:antialiased; background:#F2F6F8; color:#0F2430; display:flex; }
.ico { stroke:currentColor; fill:none; stroke-linecap:round; stroke-linejoin:round; }
.side { width:248px; background:#0B2E33; color:#C7DADC; padding:26px 18px; display:flex; flex-direction:column; gap:4px; }
.logo { display:flex; align-items:center; gap:10px; color:#fff; font-weight:800; font-size:19px; margin:0 8px 26px; }
.logo i { width:34px; height:34px; border-radius:10px; background:linear-gradient(135deg,#14B8A6,#0E8C86); display:grid; place-items:center; }
.nav { display:flex; align-items:center; gap:12px; padding:11px 12px; border-radius:11px; font-size:14px; font-weight:600; }
.nav.on { background:rgba(20,184,166,.16); color:#fff; }
.main { flex:1; padding:26px 32px; display:flex; flex-direction:column; gap:20px; }
.top { display:flex; align-items:center; justify-content:space-between; }
.h { font-size:26px; font-weight:800; letter-spacing:-.02em; }
.muted { color:#647887; } .sm { font-size:13px; }
.card { background:#fff; border-radius:18px; border:1px solid #E2EAEE; padding:20px; }
.kpis { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
.kpi b { display:block; font-size:30px; font-weight:800; letter-spacing:-.02em; margin-top:8px; }
.seg { display:inline-flex; background:#fff; border:1px solid #E2EAEE; border-radius:12px; padding:4px; }
.seg span { padding:8px 14px; border-radius:9px; font-size:13px; font-weight:700; color:#647887; }
.seg span.on { background:#0E8C86; color:#fff; }
.st { display:inline-flex; padding:4px 10px; border-radius:99px; font-size:12px; font-weight:700; }
.open { background:#FEF3C7; color:#92400E; } .prog { background:#DBEAFE; color:#1E40AF; } .done { background:#D1FAE5; color:#065F46; } .urg { background:#FEE2E2; color:#991B1B; }
table { width:100%; border-collapse:collapse; font-size:13.5px; }
th { text-align:left; color:#647887; font-weight:600; font-size:12px; padding:0 10px 10px; border-bottom:1px solid #E2EAEE; }
td { padding:12px 10px; border-bottom:1px solid #EEF3F5; }
.tag { position:absolute; right:32px; bottom:18px; font-size:11px; color:#8AA0AC; }
'''


def dico(name, size=18, color='currentColor'):
    return f'<svg class="ico" viewBox="0 0 24 24" style="width:{size}px;height:{size}px;stroke:{color};stroke-width:2">{I[name]}</svg>'


def dash_page(active, body):
    navs = [('grid', 'Dashboard'), ('list', 'Complaints'), ('build', 'Departments'), ('users', 'Employees'), ('wrench', 'Technicians'), ('chart', 'Reports'), ('cog', 'Settings')]
    side = ''.join(f'<div class="nav{" on" if n == active else ""}">{dico(i)}{n}</div>' for i, n in navs)
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><style>{DASH_CSS}</style></head><body>
<aside class="side"><div class="logo"><i>{dico('shield',18,'#fff')}</i>CareDesk</div>{side}
<div style="margin-top:auto;padding:14px;border-radius:14px;background:rgba(255,255,255,.06);font-size:12px;line-height:1.5">Admin console<br><span style="opacity:.7">Concept design · demo data</span></div></aside>
<main class="main" style="position:relative">{body}<div class="tag">Illustrative concept · sample data · no patient information</div></main></body></html>'''


months = [38, 44, 31, 52, 47, 41, 58, 49, 36, 45, 54, 40]
bars = ''.join(f'<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:8px"><div style="width:100%;height:{m*3}px;border-radius:8px 8px 4px 4px;background:{"#0E8C86" if i==10 else "#CDE7E5"}"></div><span class="muted" style="font-size:11px">{"JFMAMJJASOND"[i]}</span></div>' for i, m in enumerate(months))
cats = [("Electrical", 31, '#0E8C86'), ("AC / HVAC", 24, '#14B8A6'), ("Plumbing", 18, '#2563EB'), ("Cleanliness", 15, '#D97706'), ("Equipment", 12, '#94A3B8')]
off = 0
donut = ''
for n, p, c in cats:
    donut += f'<circle cx="21" cy="21" r="15.9" fill="none" stroke="{c}" stroke-width="7" stroke-dasharray="{p} {100-p}" stroke-dashoffset="{-off}"/>'
    off += p
rows = [("#CD-1042", "AC not cooling", "AC / HVAC", "Ward 3B", "HVAC team", "prog", "In progress"),
        ("#CD-1041", "Power socket sparking", "Electrical", "Radiology", "Electrical team", "urg", "Urgent"),
        ("#CD-1039", "Flickering ceiling light", "Electrical", "Corridor B", "Unassigned", "open", "Open"),
        ("#CD-1036", "Broken bed rail lock", "Equipment", "Ward 3B", "Biomedical", "open", "Open"),
        ("#CD-1031", "Leaking wash basin", "Plumbing", "Staff room", "Plumbing team", "done", "Resolved")]
table = ''.join(f'<tr><td class="muted">{a}</td><td><b>{b}</b></td><td>{c}</td><td>{d}</td><td>{e}</td><td><span class="st {f}">{g}</span></td></tr>' for a, b, c, d, e, f, g in rows)

dash = {}
dash['dashboard-1'] = dash_page('Dashboard', f'''
<div class="top"><div><div class="h">Complaints overview</div><div class="muted sm" style="margin-top:4px">All departments · demo data</div></div>
<div style="display:flex;gap:12px;align-items:center"><div class="seg"><span>Month</span><span class="on">Quarter</span><span>Year</span></div>
<div style="padding:11px 16px;border-radius:12px;background:#0E8C86;color:#fff;font-weight:700;font-size:13px">Export report</div></div></div>
<div class="kpis">
 <div class="card kpi"><span class="muted sm">Complaints this quarter</span><b>142</b><span class="sm" style="color:#0E8C86;font-weight:700">Across 9 departments</span></div>
 <div class="card kpi"><span class="muted sm">Open</span><b style="color:#B45309">18</b><span class="sm muted">6 awaiting assignment</span></div>
 <div class="card kpi"><span class="muted sm">In progress</span><b style="color:#1E40AF">11</b><span class="sm muted">With technicians</span></div>
 <div class="card kpi"><span class="muted sm">Resolved</span><b style="color:#047857">113</b><span class="sm muted">Confirmed by staff</span></div>
</div>
<div style="display:grid;grid-template-columns:1.7fr 1fr;gap:16px">
 <div class="card"><div style="display:flex;justify-content:space-between"><b>Complaints per month</b><span class="muted sm">Sample year</span></div><div style="display:flex;align-items:flex-end;gap:10px;height:200px;margin-top:18px">{bars}</div></div>
 <div class="card"><b>By category</b><div style="display:flex;gap:18px;align-items:center;margin-top:16px">
  <svg width="150" height="150" viewBox="0 0 42 42" style="transform:rotate(-90deg)">{donut}</svg>
  <div style="display:grid;gap:9px;font-size:13px;flex:1">{''.join(f'<div style="display:flex;justify-content:space-between"><span style="display:flex;gap:8px;align-items:center"><i style="width:10px;height:10px;border-radius:3px;background:{c}"></i>{n}</span><b>{p}%</b></div>' for n,p,c in cats)}</div></div></div>
</div>
<div class="card" style="flex:1"><div style="display:flex;justify-content:space-between;margin-bottom:12px"><b>Latest complaints</b><span class="sm" style="color:#0E8C86;font-weight:700">View all</span></div>
<table><tr><th>ID</th><th>Issue</th><th>Category</th><th>Location</th><th>Assigned to</th><th>Status</th></tr>{table}</table></div>''')

dash['dashboard-2'] = dash_page('Complaints', f'''
<div class="top"><div><div class="muted sm">Complaints / #CD-1042</div><div class="h" style="margin-top:4px">AC not cooling</div></div>
<div style="display:flex;gap:10px"><span class="st prog" style="font-size:13px;padding:8px 14px">In progress</span><span class="st open" style="font-size:13px;padding:8px 14px">Medium priority</span></div></div>
<div style="display:grid;grid-template-columns:1.4fr 1fr;gap:16px;flex:1">
 <div style="display:flex;flex-direction:column;gap:16px">
  <div class="card"><b>Details</b><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:14px;font-size:13.5px">
   <div><div class="muted sm">Category</div><b>AC / HVAC</b></div><div><div class="muted sm">Location</div><b>Ward 3B · Room 12</b></div><div><div class="muted sm">Reported by</div><b>Nursing staff</b></div>
   <div><div class="muted sm">Submitted</div><b>Today 08:12</b></div><div><div class="muted sm">Department</div><b>Facilities</b></div><div><div class="muted sm">Channel</div><b>Employee app</b></div></div>
   <p style="margin-top:16px;font-size:14px;line-height:1.6;color:#33505E">The AC unit is running but the room is not cooling. Started this morning.</p></div>
  <div class="card" style="flex:1"><b>Activity</b>
   {''.join(f'<div style="display:flex;gap:14px;margin-top:16px"><div style="width:34px;height:34px;border-radius:10px;background:{bg};display:grid;place-items:center">{dico(ic,16,col)}</div><div style="flex:1"><div style="display:flex;justify-content:space-between"><b style="font-size:13.5px">{t}</b><span class="muted sm">{w}</span></div><div class="muted sm" style="margin-top:2px">{d}</div></div></div>' for ic,bg,col,t,w,d in [("plus","#E0F2F1","#0E8C86","Complaint submitted","08:12","From the employee app"),("users","#DBEAFE","#1E40AF","Assigned to HVAC team","08:20","By facilities admin"),("wrench","#FEF3C7","#B45309","Technician on site","09:05","Filter cleaned, checking refrigerant level"),("msg","#F1F5F9","#475569","Staff notified","09:06","Push notification sent")])}
  </div>
 </div>
 <div style="display:flex;flex-direction:column;gap:16px">
  <div class="card"><b>Assignment</b><div style="margin-top:14px;padding:14px;border-radius:14px;border:1px solid #E2EAEE;display:flex;gap:12px;align-items:center"><div style="width:40px;height:40px;border-radius:50%;background:#0E8C86;color:#fff;display:grid;place-items:center;font-weight:700;font-size:13px">HT</div><div><b style="font-size:14px">HVAC team</b><div class="muted sm">Facilities · on duty</div></div></div>
  <div style="margin-top:12px;display:flex;gap:10px"><div style="flex:1;text-align:center;padding:11px;border-radius:12px;background:#0E8C86;color:#fff;font-weight:700;font-size:13px">Reassign</div><div style="flex:1;text-align:center;padding:11px;border-radius:12px;border:1px solid #E2EAEE;font-weight:700;font-size:13px">Escalate</div></div></div>
  <div class="card"><b>Resolution timeline</b><div style="margin-top:14px;display:grid;gap:12px;font-size:13.5px">
   <div style="display:flex;justify-content:space-between"><span class="muted">Time to assign</span><b>8 min</b></div>
   <div style="display:flex;justify-content:space-between"><span class="muted">Time on site</span><b>53 min</b></div>
   <div style="display:flex;justify-content:space-between"><span class="muted">Target resolution</span><b>Same day</b></div></div></div>
  <div class="card" style="flex:1"><b>Internal note</b><p class="muted" style="margin-top:10px;font-size:13.5px;line-height:1.6">Check the other units on Ward 3B during the next preventive maintenance round.</p></div>
 </div>
</div>''')

# --------------------------------------------------------------------- AI showcase panels (transparent glass, 720×460)
PANEL_CSS = '''
* { box-sizing:border-box; margin:0; padding:0; }
html,body { width:720px; height:460px; background:transparent; overflow:hidden; }
body { font-family:Inter,system-ui,sans-serif; -webkit-font-smoothing:antialiased; color:#E8F3EE; }
.ico { stroke:currentColor; fill:none; stroke-linecap:round; stroke-linejoin:round; }
.p { position:absolute; inset:6px; border-radius:26px; padding:26px 28px; background:linear-gradient(160deg,rgba(22,48,40,.92),rgba(6,16,13,.94) 70%); border:1.5px solid rgba(110,221,176,.35); box-shadow:inset 0 1px 0 rgba(255,255,255,.12); overflow:hidden; }
.p::before { content:''; position:absolute; inset:0; background:linear-gradient(115deg,rgba(255,255,255,.08),transparent 40%); pointer-events:none; }
.hd { display:flex; justify-content:space-between; align-items:center; }
.t { display:flex; align-items:center; gap:12px; font-size:20px; font-weight:800; letter-spacing:-.01em; }
.ic { width:38px; height:38px; border-radius:12px; background:linear-gradient(135deg,#19C784,#087F5B); display:grid; place-items:center; color:#04120D; }
.tag { padding:6px 11px; border-radius:99px; border:1px solid rgba(110,221,176,.35); background:rgba(25,199,132,.12); color:#A6EBCD; font:700 11px/1 ui-monospace,monospace; letter-spacing:.12em; text-transform:uppercase; }
.muted { color:#8EA098; }
'''


def pico(name, size=18, color='currentColor'):
    return f'<svg class="ico" viewBox="0 0 24 24" style="width:{size}px;height:{size}px;stroke:{color};stroke-width:2.2">{I[name]}</svg>'


def panel(body):
    return f'<!doctype html><html><head><meta charset="utf-8"><style>{PANEL_CSS}</style></head><body><div class="p">{body}</div></body></html>'


ai = {}
ai['panel-chat'] = panel(f'''<div class="hd"><div class="t"><span class="ic">{pico('bot',20,'#04120D')}</span>Support assistant</div><span class="tag">Demo</span></div>
<div style="margin-top:22px;display:flex;justify-content:flex-end"><div style="max-width:70%;padding:13px 16px;border-radius:18px 18px 4px 18px;background:#19C784;color:#04120D;font-size:15px;font-weight:600">Can I change my delivery address after ordering?</div></div>
<div style="margin-top:14px;display:flex;gap:12px"><span class="ic" style="width:32px;height:32px;border-radius:10px;flex:none">{pico('spark',16,'#04120D')}</span>
<div style="max-width:80%;padding:14px 16px;border-radius:18px 18px 18px 4px;background:rgba(255,255,255,.07);border:1px solid rgba(110,221,176,.18);font-size:15px;line-height:1.5">Yes — until the order is dispatched. Open <b>Orders → Edit address</b>, or I can send the update request for you.
<div style="margin-top:10px;display:flex;gap:8px"><span style="padding:5px 10px;border-radius:8px;background:rgba(25,199,132,.12);color:#A6EBCD;font-size:12px;font-weight:600">{pico('file',13)} Shipping policy §2</span><span style="padding:5px 10px;border-radius:8px;background:rgba(25,199,132,.12);color:#A6EBCD;font-size:12px;font-weight:600">{pico('file',13)} FAQ · Orders</span></div></div></div>
<div style="position:absolute;left:28px;right:28px;bottom:24px;display:flex;gap:10px;align-items:center;padding:12px 14px;border-radius:16px;background:rgba(0,0,0,.25);border:1px solid rgba(110,221,176,.18)"><span class="muted" style="font-size:14px;flex:1">Ask about your order…</span><span class="ic" style="width:34px;height:34px">{pico('send',16,'#04120D')}</span></div>''')

ai['panel-flow'] = panel(f'''<div class="hd"><div class="t"><span class="ic">{pico('bolt',20,'#04120D')}</span>Workflow automation</div><span class="tag">Demo</span></div>
<div style="margin-top:26px;display:grid;gap:12px">
{''.join(f'<div style="display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:14px;background:{"rgba(25,199,132,.12)" if s=="run" else "rgba(255,255,255,.04)"};border:1px solid {"rgba(110,221,176,.4)" if s=="run" else "rgba(110,221,176,.12)"}"><span style="width:34px;height:34px;border-radius:10px;background:rgba(25,199,132,.15);display:grid;place-items:center;color:#6EDDB0">{pico(ic,17)}</span><b style="flex:1;font-size:15px">{t}</b><span style="font:700 11px/1 ui-monospace,monospace;letter-spacing:.1em;color:{"#A6EBCD" if s=="run" else "#6EDDB0"}">{ {"done":"DONE","run":"RUNNING","wait":"QUEUED"}[s] }</span></div>' for ic,t,s in [("mail","New enquiry email received","done"),("file","Extract name, company and request","done"),("db","Create CRM lead","run"),("send","Draft reply for review","wait")])}
</div>''')

ai['panel-doc'] = panel(f'''<div class="hd"><div class="t"><span class="ic">{pico('file',20,'#04120D')}</span>Document intelligence</div><span class="tag">Demo</span></div>
<div style="margin-top:22px;display:grid;grid-template-columns:1fr 1.05fr;gap:18px">
 <div style="height:300px;border-radius:14px;background:#F4F7F5;padding:18px;color:#1D2B26;font-size:11px;position:relative">
  <div style="display:flex;justify-content:space-between"><b style="font-size:15px">INVOICE</b><span style="color:#6B7B74">INV-2087</span></div>
  <div style="margin-top:14px;height:8px;width:60%;border-radius:4px;background:#D8E1DC"></div><div style="margin-top:7px;height:8px;width:45%;border-radius:4px;background:#D8E1DC"></div>
  {''.join(f'<div style="margin-top:12px;display:flex;justify-content:space-between"><div style="height:8px;width:{w}%;border-radius:4px;background:#E2E9E5"></div><div style="height:8px;width:14%;border-radius:4px;background:#E2E9E5"></div></div>' for w in [52,40,46,34])}
  <div style="position:absolute;left:12px;right:12px;top:8px;height:28px;border:2px solid #19C784;border-radius:8px"></div>
  <div style="position:absolute;right:12px;bottom:16px;width:44%;height:30px;border:2px solid #19C784;border-radius:8px;display:flex;align-items:center;justify-content:flex-end;padding-right:8px;font-weight:800;font-size:14px">$ 4,250.00</div>
 </div>
 <div style="display:grid;gap:10px;align-content:start">
  {''.join(f'<div style="padding:11px 13px;border-radius:12px;background:rgba(255,255,255,.05);border:1px solid rgba(110,221,176,.16)"><div class="muted" style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em">{k}</div><div style="font-size:15.5px;font-weight:700;margin-top:3px">{v}</div></div>' for k,v in [("Invoice no.","INV-2087"),("Vendor","Northwind Supplies"),("Due date","30 Nov"),("Total","$ 4,250.00")])}
 </div>
</div>''')

# --------------------------------------------------------------------- Portfolio covers (1536×1024)
COVER_CSS = '''
* { box-sizing:border-box; margin:0; padding:0; }
html,body { width:1536px; height:1024px; overflow:hidden; }
body { font-family:Inter,system-ui,sans-serif; -webkit-font-smoothing:antialiased; color:#fff; position:relative; }
.ph { position:absolute; width:300px; height:650px; border-radius:48px; padding:10px; background:linear-gradient(150deg,#3B4048,#111317 40%,#0A0B0D 70%,#2A2E34); box-shadow:0 60px 120px -30px rgba(0,0,0,.8), inset 0 1px 1px rgba(255,255,255,.25); }
.ph img { width:100%; height:100%; border-radius:39px; display:block; object-fit:cover; }
.ph::after { content:''; position:absolute; left:50%; top:22px; width:92px; height:26px; margin-left:-46px; border-radius:99px; background:#000; }
.name { position:absolute; left:110px; top:50%; transform:translateY(-50%); }
.name h1 { font-size:96px; font-weight:800; letter-spacing:-.04em; line-height:1; }
.name p { margin-top:18px; font-size:30px; font-weight:500; opacity:.75; }
.note { position:absolute; left:110px; bottom:70px; font:600 18px/1 ui-monospace,monospace; letter-spacing:.14em; text-transform:uppercase; opacity:.55; }
'''


def cover(bg, title_html, sub, phones, extra='', note='Concept visuals'):
    ph = ''.join(f'<div class="ph" style="left:{x}px;top:{y}px;transform:rotate({r}deg) scale({s})"><img src="{src}"></div>' for x, y, r, s, src in phones)
    return f'''<!doctype html><html><head><meta charset="utf-8"><style>{COVER_CSS}</style></head><body style="background:{bg}">
{extra}<div class="name"><h1>{title_html}</h1><p>{sub}</p></div>{ph}<div class="note">{note}</div></body></html>'''


OUT = '../out'
covers = {}
covers['fitmind'] = cover('radial-gradient(60% 70% at 72% 50%,#1D3A12 0%,#0B0F14 65%)', 'FitMind <span style="color:#A3E635">AI</span>', 'AI health &amp; nutrition app',
                          [(760, 200, -6, 1, f'{OUT}/fitmind-screen-2.png'), (1100, 170, 5, 1, f'{OUT}/fitmind-screen-1.png')])
covers['caredesk'] = cover('radial-gradient(60% 70% at 70% 50%,#0F4A47 0%,#061A1C 65%)', 'Care<span style="color:#5EEAD4">Desk</span>', 'Hospital complaint management',
                           [(1120, 260, 4, .92, f'{OUT}/caredesk-screen-3.png')],
                           extra=f'<div style="position:absolute;left:650px;top:190px;width:820px;height:513px;border-radius:22px;padding:12px;background:linear-gradient(150deg,#3B4048,#111317);box-shadow:0 60px 120px -30px rgba(0,0,0,.8)"><img src="{OUT}/caredesk-dashboard-1.png" style="width:100%;height:100%;border-radius:12px;display:block"></div>')
covers['ielts'] = cover('radial-gradient(60% 70% at 72% 50%,#16306E 0%,#0A1024 65%)', 'IELTS<br><span style="color:#7EA2FF">AI Master</span>', 'AI IELTS preparation app',
                        [(760, 200, -6, 1, f'{OUT}/ielts-screen-2.png'), (1100, 170, 5, 1, f'{OUT}/ielts-screen-1.png')], note='Interface recreations')
covers['skillnova'] = cover('radial-gradient(60% 70% at 72% 50%,#2A2470 0%,#0D0B24 65%)', 'Skill<span style="color:#A99BFF">Nova</span>', 'On-demand service marketplace',
                            [(760, 200, -6, 1, f'{OUT}/skilllink-screen-2.png'), (1100, 170, 5, 1, f'{OUT}/skilllink-screen-1.png')], note='Interface recreations')

if __name__ == '__main__':
    for d, pages in (('fitmind', fit), ('caredesk', {**care, **dash}), ('ai', ai), ('covers', covers)):
        (ROOT / d).mkdir(exist_ok=True)
        for name, html in pages.items():
            (ROOT / d / f'{name}.html').write_text(html, encoding='utf-8')
    print('ok', len(fit) + len(care) + len(dash) + len(ai) + len(covers))
