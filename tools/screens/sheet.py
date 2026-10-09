"""PNG renders → WebP (<150 KB each, 1170×2532) + 540px texture variants in public/media/work/<app>/,
plus tools/screens/contact-sheet.png."""
from pathlib import Path
from PIL import Image
here = Path(__file__).parent
pub = here.parent.parent / 'public' / 'media' / 'work'
thumbs = []
for app in ('ielts', 'skilllink'):
    (pub / app).mkdir(parents=True, exist_ok=True)
    for i in range(1, 5):
        im = Image.open(here / 'out' / f'{app}-screen-{i}.png').convert('RGB')
        dst = pub / app / f'screen-{i}.webp'
        for q in (82, 76, 70, 64, 58):
            im.save(dst, 'WEBP', quality=q, method=6)
            if dst.stat().st_size < 150_000: break
        print(dst.name, app, q, dst.stat().st_size // 1024, 'KB')
        # Small variant used as a WebGL texture (phone screens are never shown larger than ~460px tall).
        tex = pub / app / f'screen-{i}-540.webp'
        im.resize((540, 1169), Image.LANCZOS).save(tex, 'WEBP', quality=80, method=6)
        print(' ', tex.name, tex.stat().st_size // 1024, 'KB')
        thumbs.append(im.resize((390, 844), Image.LANCZOS))
W, H, G = 390, 844, 24
sheet = Image.new('RGB', (4 * W + 5 * G, 2 * H + 3 * G), (24, 28, 34))
for k, t in enumerate(thumbs):
    sheet.paste(t, (G + (k % 4) * (W + G), G + (k // 4) * (H + G)))
sheet.save(here / 'contact-sheet.png', optimize=True)
