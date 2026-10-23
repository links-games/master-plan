"""Reject unreadably dark native scene renders; keep visual review necessary.

Usage: /usr/bin/python3 experiments/check-lore-render-visibility.py ROOT
The conservative mean floor catches nearly black environment studies without
requiring daylight brightness from night or orbital scenes. This diagnostic
does not replace inspection of composition, detail or localized shadows.
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageStat

root=Path(sys.argv[1] if len(sys.argv)>1 else 'docs/master-plan/lore/scenes')
paths=sorted(root.glob('*/poster.png'))
if not paths:
    raise SystemExit('No native posters to inspect')
failed=[]
for path in paths:
    with Image.open(path) as source:
        mean=ImageStat.Stat(source.convert('L')).mean[0]
    print(json.dumps({'scene':path.parent.name,'meanLuminance':round(mean,2),
                      'minimum':20,'passed':mean>=20}))
    if mean<20: failed.append(path.parent.name)
if failed:
    raise SystemExit('Unreadable environment exposure: '+', '.join(failed))
