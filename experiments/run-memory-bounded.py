"""Run a browser experiment while preserving the container's memory reserve.

Usage: python3 experiments/run-memory-bounded.py COMMAND [ARG ...]
Reclaimable clean file cache is excluded. No elapsed-time deadline is imposed.
"""
import os
from pathlib import Path
import signal
import subprocess
import sys
import time

group=Path('/sys/fs/cgroup')
raw_limit=(group/'memory.max').read_text().strip()
limit=int(raw_limit) if raw_limit!='max' else None
reserve=128*1024*1024
process=subprocess.Popen(sys.argv[1:],start_new_session=True)
stopped=False
while process.poll() is None:
    values=dict(line.split() for line in (group/'memory.stat').read_text().splitlines())
    resident=sum(int(values.get(key,0)) for key in
                 ['anon','kernel','file_mapped','file_dirty','file_writeback'])
    if limit and resident>limit-reserve:
        print(f'Memory reserve reached: {resident} resident bytes; stopping experiment',
              file=sys.stderr,flush=True)
        os.killpg(process.pid,signal.SIGTERM)
        stopped=True
        break
    time.sleep(.5)
result=process.wait()
raise SystemExit(75 if stopped else result)
