"""Render pilots in separate Blender processes on memory-constrained machines.

Usage: /usr/bin/python3 experiments/render-lore-scenes.py --resume
Every subprocess finishes before the next starts. Full diagnostics stay in
ci-logs/. Resume accepts only complete outputs from the current source hashes.
"""
import argparse
import hashlib
import json
import os
import subprocess
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'examples/lore-scenes'


def digest(path):
    value = hashlib.sha256()
    with path.open('rb') as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b''):
            value.update(chunk)
    return value.hexdigest()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--blender', default='/tmp/master-plan-blender/blender')
    parser.add_argument('--out', type=Path, default=ROOT / 'docs/master-plan/lore/scenes')
    parser.add_argument('--resume', action='store_true')
    parser.add_argument('--batch', help='Zero-based partition, for example 0/6')
    args = parser.parse_args()
    inputs = {name: digest(SOURCE / name) for name in
              ['render.py', 'detail.py', 'trees.py', 'scenes.json', 'assets/manifest.json']}
    specs = json.loads((SOURCE / 'scenes.json').read_text())
    if args.batch:
        batch, count = map(int, args.batch.split('/'))
        if not 0 <= batch < count <= len(specs):
            raise ValueError('Invalid render partition')
        specs = [spec for index, spec in enumerate(specs) if index % count == batch]
    logs = ROOT / 'ci-logs'
    logs.mkdir(exist_ok=True)
    for number, spec in enumerate(specs, 1):
        destination = args.out / spec['id']
        manifest = destination / 'manifest.json'
        if args.resume and manifest.exists():
            report = json.loads(manifest.read_text())
            files = [destination / name for name in ['environment.blend', 'poster.png', 'scene.json']]
            if (report.get('sourceInputs') == inputs and report.get('samples') == 64
                    and report.get('resolution') == [1280, 720]
                    and all(path.is_file() and digest(path) == report['files'][path.name]['sha256'] for path in files)):
                print(f'SKIP {number}/{len(specs)} {spec["id"]}: current complete render', flush=True)
                continue
        started = time.monotonic()
        log = logs / f'lore-render-{spec["id"]}.log'
        print(f'START {number}/{len(specs)} {spec["id"]}', flush=True)
        with log.open('w') as output:
            subprocess.run([args.blender, '--background', '--factory-startup', '--threads', '2',
                            '--python-exit-code', '1', '--python', str(SOURCE / 'render.py'), '--',
                            '--scene', spec['id'], '--out', str(args.out)], check=True, cwd=ROOT,
                           env={**os.environ, 'MALLOC_ARENA_MAX': '2', 'MALLOC_TRIM_THRESHOLD_': '65536'},
                           stdout=output, stderr=subprocess.STDOUT)
        print(f'DONE {number}/{len(specs)} {spec["id"]}: {time.monotonic()-started:.1f}s; {log.relative_to(ROOT)}', flush=True)


if __name__ == '__main__':
    main()
