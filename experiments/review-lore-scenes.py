"""Create internal review sheets from native Blender outputs, without editing them.

Usage: /usr/bin/python3 experiments/review-lore-scenes.py ci-logs/render-artifacts-final
Sheets are diagnostic files under ignored ci-logs/lore-review/.
"""
import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps, ImageStat

parser = argparse.ArgumentParser()
parser.add_argument('root', type=Path)
args = parser.parse_args()
paths = sorted(args.root.rglob('poster.png'), key=lambda path: path.parent.name)
if not paths:
    raise SystemExit('No native render outputs found')
output = Path('ci-logs/lore-review')
output.mkdir(parents=True, exist_ok=True)
records = []
for start in range(0, len(paths), 4):
    sheet = Image.new('RGB', (1280, 792), '#142326')
    draw = ImageDraw.Draw(sheet)
    for index, path in enumerate(paths[start:start+4]):
        x, y = index % 2 * 640, index // 2 * 396
        with Image.open(path) as source:
            source.verify()
        with Image.open(path) as source:
            preview = ImageOps.contain(source.convert('RGB'), (640, 360))
            luminance=source.convert('L')
            histogram=luminance.histogram()
            mean=round(ImageStat.Stat(luminance).mean[0],2)
            dark=round(sum(histogram[:12])/sum(histogram),4)
        sheet.paste(preview, (x, y))
        draw.text((x+8, y+369), path.parent.name, fill='white')
        records.append({'scene': path.parent.name, 'path': str(path),
                        'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
                        'meanLuminance':mean,'nearBlackFraction':dark})
        print(path.parent.name,mean,dark)
    target = output / f'pilots-{start//4+1:02}.jpg'
    sheet.save(target, quality=90)
    print(target)
(output / 'index.json').write_text(json.dumps(records, indent=2)+'\n')
