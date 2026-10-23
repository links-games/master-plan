"""Make internal review sheets from native, unpublished imagegen candidates.

Usage: /usr/bin/python3 experiments/review-art-candidates.py ci-logs/candidates.json
The input is a list of {id, path} records. Native images remain untouched.
"""
import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps

parser = argparse.ArgumentParser()
parser.add_argument('candidates', type=Path)
args = parser.parse_args()
records = json.loads(args.candidates.read_text())
output = Path('ci-logs/art-review')
output.mkdir(parents=True, exist_ok=True)
for start in range(0, len(records), 8):
    group = records[start:start+8]
    sheet = Image.new('RGB', (1024, 572), '#142326')
    draw = ImageDraw.Draw(sheet)
    for index, record in enumerate(group):
        x, y = index % 4*256, index // 4*286
        with Image.open(record['path']) as source:
            preview = ImageOps.contain(source.convert('RGB'), (256, 256))
        sheet.paste(preview, (x+(256-preview.width)//2, y))
        draw.text((x+5, y+262), record['id'], fill='white')
    target = output/f'{args.candidates.stem}-{start//8+1:02}.jpg'
    sheet.save(target, quality=90)
    print(target)
