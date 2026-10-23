"""Recover generated loading art after a rejected native-size check.

Usage: /usr/bin/python3 experiments/recover-loading-art.py SESSION_JSONL GENERATED_IMAGE_ROOT
Only exact matches to committed generation prompts are accepted. The session
is read locally; no conversation or unrelated generation data is retained.
"""
import json
import subprocess
import sys
from pathlib import Path

root=Path(__file__).resolve().parents[1]
jobs=json.loads((root/'docs/master-plan/concepts/jobs/loading-screens.json').read_text())
by_prompt={job['prompt']:job for job in jobs}
found={}
with Path(sys.argv[1]).open() as session:
    for line in session:
        event=json.loads(line)
        payload=event.get('payload',{})
        if event.get('type')!='event_msg' or payload.get('type')!='item_completed': continue
        item=payload.get('item',{})
        if item.get('kind')!='image_gen.generation' or item.get('status')!='completed': continue
        job=by_prompt.get(item.get('revisedPrompt'))
        if not job: continue
        generation=item['id']
        source=Path(sys.argv[2])/payload['thread_id']/(generation+'.png')
        if not source.is_file(): raise ValueError('Missing generated source: '+generation)
        if job['id'] in found: raise ValueError('Ambiguous prompt match: '+job['id'])
        found[job['id']]=source
if set(found)!={job['id'] for job in jobs}: raise ValueError(f'Expected all {len(jobs)} jobs, found {len(found)}')
for job in jobs:
    subprocess.run(['/usr/bin/python3',str(root/'experiments/save-concept-art.py'),job['id'],str(found[job['id']])],check=True,cwd=root)
print(f'Recovered {len(found)} independently generated native images without resizing.')
