"""Verify new delivered art against exact-prompt native generation outputs.

Usage: /usr/bin/python3 experiments/audit-native-concept-art.py SESSION IMAGE_ROOT
Reads the local generation history once, then re-encodes one image at a time.
Previously verified file/prompt hashes are retained so later runs only audit
new artwork. Neither generation order nor filenames establish prompt identity.
"""

import hashlib
import io
import json
import subprocess
import sys
from pathlib import Path

from PIL import Image

root = Path(__file__).resolve().parents[1]
art = root / 'docs/master-plan/concepts/art'
# Compare with the prepared issue baseline, so committing new deliveries does
# not silently remove them from subsequent provenance audits.
baseline = 'ba2ba272a23c8df2dbbbc4b75d84d8ce7720b9a5'
original = set(subprocess.check_output(
    ['git', 'ls-tree', '-r', '--name-only', baseline, '--',
     'docs/master-plan/concepts/art'],
    text=True, cwd=root).splitlines())
records = []
for manifest_path in sorted(art.glob('*/manifest.json')):
    manifest = json.loads(manifest_path.read_text())
    for entry in manifest['images']:
        path = manifest_path.parent / entry['file']
        relative = str(path.relative_to(root))
        if relative not in original:
            records.append((relative, entry))
prompts = {entry['prompt'] for _, entry in records}
sources = {}
with Path(sys.argv[1]).open() as session:
    for line in session:
        if '"image_gen.generation"' not in line:
            continue
        event = json.loads(line)
        payload = event.get('payload', {})
        item = payload.get('item', {})
        if (event.get('type') != 'event_msg'
                or item.get('kind') != 'image_gen.generation'
                or item.get('status') != 'completed'
                or item.get('revisedPrompt') not in prompts):
            continue
        source = (Path(sys.argv[2]) / payload['thread_id']
                  / (item['id'] + '.png'))
        assert source.is_file(), f'Missing native generation: {source}'
        sources.setdefault(item['revisedPrompt'], []).append(source)

report_path = root / 'ci-logs/native-concept-encoding-audit.json'
report = json.loads(report_path.read_text()) if report_path.exists() else {}
verified = skipped = 0
for relative, entry in records:
    target = root / relative
    actual_hash = hashlib.sha256(target.read_bytes()).hexdigest()
    prompt_hash = hashlib.sha256(entry['prompt'].encode()).hexdigest()
    assert actual_hash == entry['sha256'], f'{relative}: stale manifest hash'
    previous = report.get(relative, {})
    if (previous.get('sha256') == actual_hash
            and previous.get('promptSha256') == prompt_hash):
        skipped += 1
        continue
    candidates = sources.get(entry['prompt'], [])
    assert candidates, f'{relative}: no exact-prompt native generation found'
    for source in candidates:
        with Image.open(source) as picture:
            assert picture.size == (entry['width'], entry['height'])
            encoded = io.BytesIO()
            picture.convert('RGB').save(encoded, 'WEBP', quality=92, method=6)
            matches = hashlib.sha256(encoded.getvalue()).hexdigest() == actual_hash
        if matches:
            report[relative] = {
                'sha256': actual_hash,
                'promptSha256': prompt_hash,
                'nativeSourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
                'generationId': source.stem,
                'nativeDimensions': [entry['width'], entry['height']],
                'verification': 'Exact prompt and byte-identical native-size WebP encoding',
            }
            temporary = report_path.with_suffix('.json.tmp')
            temporary.write_text(json.dumps(report, indent=2) + '\n')
            temporary.replace(report_path)
            verified += 1
            print(f'VERIFIED {relative}', flush=True)
            break
    else:
        raise AssertionError(f'{relative}: delivered art differs from its native outputs')
print(json.dumps({'newlyVerified': verified, 'previouslyVerified': skipped,
                  'deliveredNewImages': len(records), 'totalRecorded': len(report)}))
