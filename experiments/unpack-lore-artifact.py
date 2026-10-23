"""Unpack one CI render artifact without mixing batch diagnostics or using RAM.

Usage: python3 experiments/unpack-lore-artifact.py ci-logs/batch0.zip --batch 0 \
    --out ci-logs/render-artifacts-current
Download the archive with the authenticated GitHub API first. No output is
silently overwritten; validate the complete output set before publishing it.
"""
import argparse
import shutil
import zipfile
from pathlib import Path, PurePosixPath

parser = argparse.ArgumentParser()
parser.add_argument('archive', type=Path)
parser.add_argument('--out', type=Path, required=True)
parser.add_argument('--batch', type=int, required=True, choices=range(6))
args = parser.parse_args()
with zipfile.ZipFile(args.archive) as archive:
    count = 0
    for entry in archive.infolist():
        path = PurePosixPath(entry.filename)
        if path.is_absolute() or '..' in path.parts:
            raise ValueError(f'Unsafe archive path: {entry.filename}')
        if entry.is_dir():
            continue
        if path.parts[:2] == ('tmp', 'lore-scenes'):
            target = args.out/Path(*path.parts[2:])
        elif 'ci-logs' in path.parts:
            index = path.parts.index('ci-logs')
            target = args.out/'batch-logs'/str(args.batch)/Path(*path.parts[index+1:])
        else:
            raise ValueError(f'Unexpected artifact path: {entry.filename}')
        target.parent.mkdir(parents=True, exist_ok=True)
        with archive.open(entry) as source, target.open('xb') as destination:
            shutil.copyfileobj(source, destination, length=64*1024)
        count += 1
print(f'Unpacked batch {args.batch}: {count} files into {args.out}')
