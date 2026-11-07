"""Converts tools/screens/out/*.png (render2.mjs) into the shipped WebP assets."""
from pathlib import Path
from PIL import Image
ROOT = Path(__file__).parent
OUT = ROOT / 'out'
PUB = ROOT.parent.parent / 'public' / 'media'


def save(im, path, q=82, **kw):
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, 'WEBP', quality=q, method=6, **kw)
    print(path.relative_to(PUB.parent.parent), path.stat().st_size // 1024, 'KB')


for app in ('fitmind', 'caredesk'):
    for i in range(1, 5):
        im = Image.open(OUT / f'{app}-screen-{i}.png').convert('RGB')
        save(im, PUB / 'work' / app / f'screen-{i}.webp', 80)
        save(im.resize((540, 1169), Image.LANCZOS), PUB / 'work' / app / f'screen-{i}-540.webp', 82)
for i in (1, 2):
    im = Image.open(OUT / f'caredesk-dashboard-{i}.png').convert('RGB')
    save(im.resize((1600, 1000), Image.LANCZOS), PUB / 'work' / 'caredesk' / f'dashboard-{i}.webp', 82)
    save(im.resize((960, 600), Image.LANCZOS), PUB / 'work' / 'caredesk' / f'dashboard-{i}-960.webp', 82)
for n in ('chat', 'flow', 'doc'):
    im = Image.open(OUT / f'ai-panel-{n}.png').convert('RGBA')
    save(im.resize((1024, 654), Image.LANCZOS), PUB / 'ai' / f'panel-{n}.webp', 84)
for n in ('fitmind', 'caredesk', 'skillnova', 'ielts'):
    im = Image.open(OUT / f'cover-{n}.png').convert('RGB')
    save(im, PUB / 'work' / f'{n}-1536.webp', 80)
    save(im.resize((800, 533), Image.LANCZOS), PUB / 'work' / f'{n}-800.webp', 80)
