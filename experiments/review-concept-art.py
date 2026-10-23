"""Build labeled review sheets without changing any delivered artwork.

Usage: /usr/bin/python3 experiments/review-concept-art.py td
Outputs under ignored ci-logs/art-review/; 16 native images per sheet,
including additional style alternatives. Loading screens include both orientations.
"""
import argparse
import hashlib
import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps

parser = argparse.ArgumentParser()
parser.add_argument('family', help='Collection prefix, or loading')
parser.add_argument('--only-new', action='store_true', help='Skip artwork already present in HEAD')
args = parser.parse_args()
root = Path('docs/master-plan/concepts/art')
output = Path('ci-logs/art-review')
output.mkdir(parents=True, exist_ok=True)
if args.family == 'loading':
    paths = sorted((root/'loading').glob('*.webp'))
else:
    paths = sorted(p for game in root.glob(f'{args.family}-*')
                   for p in game.glob('0[1-6]-*.webp'))
if args.only_new:
    tracked=set(subprocess.check_output(['git','ls-files','--',str(root)],text=True).splitlines())
    paths=[path for path in paths if str(path) not in tracked]
if not paths:
    raise SystemExit('No images to review')
records = []
for start in range(0, len(paths), 16):
    group = paths[start:start+16]
    sheet = Image.new('RGB', (1024, 4*286), '#142326')
    draw = ImageDraw.Draw(sheet)
    for index, path in enumerate(group):
        x, y = index % 4*256, index // 4*286
        with Image.open(path) as source:
            preview = ImageOps.contain(source.convert('RGB'), (256, 256))
        sheet.paste(preview, (x+(256-preview.width)//2, y))
        draw.text((x+5, y+262), f'{path.parent.name}/{path.stem}', fill='white')
        records.append({'image': str(path), 'sheet': f'{args.family}-{start//16+1:02}.jpg',
                        'sha256': hashlib.sha256(path.read_bytes()).hexdigest()})
    target = output/f'{args.family}-{start//16+1:02}.jpg'
    sheet.save(target, quality=88)
    print(target)
(output/f'{args.family}.json').write_text(json.dumps(records, indent=2)+'\n')
