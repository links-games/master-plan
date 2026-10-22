"""Recover completed native generations after an interrupted tool session.

Usage: /usr/bin/python3 experiments/recover-concept-art.py SESSION IMAGE_ROOT JOBS...
Add --save to encode missing outputs. Match complete prompts, never filenames or
generation order. Keep the recovery inventory and remaining jobs in ci-logs/.
"""

import argparse
import hashlib
import json
import shutil
import subprocess
import time
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('session', type=Path)
parser.add_argument('image_root', type=Path)
parser.add_argument('jobs', type=Path, nargs='+')
parser.add_argument('--save', action='store_true')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
jobs = [job for path in args.jobs for job in json.loads(path.read_text())]
assert len({job['id'] for job in jobs}) == len(jobs)
by_prompt = {job['prompt']: job for job in jobs}
assert len(by_prompt) == len(jobs), 'Every job needs its own exact prompt'
found = {}
with args.session.open() as session:
    for line in session:
        if '"image_gen.generation"' not in line:
            continue
        event = json.loads(line)
        payload = event.get('payload', {})
        item = payload.get('item', {})
        if (event.get('type') != 'event_msg'
                or item.get('kind') != 'image_gen.generation'
                or item.get('status') != 'completed'):
            continue
        job = by_prompt.get(item.get('revisedPrompt'))
        if job is None:
            continue
        source = args.image_root / payload['thread_id'] / (item['id'] + '.png')
        assert source.is_file(), f'Missing native output: {source}'
        found.setdefault(job['id'], []).append(str(source))

art = root / 'docs/master-plan/concepts/art'


def complete(job):
    game, direction = job['id'].split('/')
    target = art / game / (direction + '.webp')
    manifest = art / game / 'manifest.json'
    if not target.is_file() or not manifest.is_file():
        return False
    entries = json.loads(manifest.read_text())['images']
    entry = next((item for item in entries if item['file'] == target.name), None)
    # A reviewed replacement can intentionally supersede this frozen job list.
    # Recovery repairs incomplete writes; it must preserve valid newer artwork.
    return (entry is not None
            and hashlib.sha256(target.read_bytes()).hexdigest() == entry['sha256'])


missing = [job for job in jobs if not complete(job)]
recovered = [{'id': job['id'], 'source': found[job['id']][-1],
              'matchingNativeOutputs': found[job['id']], 'prompt': job['prompt']}
             for job in missing if job['id'] in found]
output = root / 'ci-logs'
output.mkdir(exist_ok=True)
(output / 'recovered-concept-art.json').write_text(
    json.dumps(recovered, indent=2) + '\n')
if args.save:
    archive = output / 'interrupted-encoding' / str(time.time_ns())
    for entry in recovered:
        game, direction = entry['id'].split('/')
        target = art / game / (direction + '.webp')
        if target.exists():
            destination = archive / game
            destination.mkdir(parents=True, exist_ok=True)
            shutil.move(target, destination / target.name)
            manifest_path = target.parent / 'manifest.json'
            if manifest_path.exists():
                shutil.copy2(manifest_path, destination / 'manifest.json')
                manifest = json.loads(manifest_path.read_text())
                manifest['images'] = [image for image in manifest['images']
                                      if image['file'] != target.name]
                manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
        subprocess.run(['/usr/bin/python3',
                        str(root / 'experiments/save-concept-art.py'),
                        entry['id'], entry['source']], check=True, cwd=root)
remaining = [job for job in jobs if not complete(job)]
(output / 'remaining-concept-jobs.json').write_text(
    json.dumps(remaining, indent=2) + '\n')
print(json.dumps({'jobs': len(jobs), 'missingBeforeRecovery': len(missing),
                  'recoverable': len(recovered), 'remaining': len(remaining),
                  'saved': args.save}))
