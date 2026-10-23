"""Encode Blender's native PNG renders as web previews, retaining provenance."""
import hashlib
import json
import sys
from pathlib import Path
from PIL import Image

root = Path(sys.argv[1] if len(sys.argv) > 1 else 'docs/master-plan/lore/scenes')
for report in sorted(root.glob('*/manifest.json')):
    manifest = json.loads(report.read_text())
    target = report.parent / 'poster.webp'
    with Image.open(report.parent / 'poster.png') as image:
        image.convert('RGB').save(target, 'WEBP', quality=90, method=6)
    manifest['files'][target.name] = {
        'bytes': target.stat().st_size,
        'sha256': hashlib.sha256(target.read_bytes()).hexdigest(),
    }
    manifest['webPreview'] = 'WebP quality 90; original rendered pixel dimensions'
    report.write_text(json.dumps(manifest, indent=2) + '\n')
    print(f'{report.parent.name}: {target.stat().st_size} web preview bytes')
