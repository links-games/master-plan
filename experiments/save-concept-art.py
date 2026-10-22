"""Persist a built-in imagegen result without resizing its native artwork.

Usage: python3 experiments/save-concept-art.py JOB_ID SOURCE_IMAGE
Encode a full-resolution WebP plus a small index-only thumbnail. Generation
prompts and actual file hashes/dimensions remain reviewable in the repository.
"""

import hashlib
import json
import os
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "docs/master-plan/concepts"


def atomic_image_save(picture, target, quality):
    """An interrupted encode must never look like a delivered image."""
    descriptor, name = tempfile.mkstemp(prefix='encoding-', suffix='.tmp', dir=target.parent)
    os.close(descriptor)
    temporary = Path(name)
    try:
        picture.convert('RGB').save(temporary, 'WEBP', quality=quality, method=6)
        temporary.replace(target)
    finally:
        temporary.unlink(missing_ok=True)


def main():
    job_id, source = sys.argv[1:]
    loading = job_id.startswith("loading/")
    family = job_id.split("-")[0]
    extra_style = job_id.split('/')[1] in ['05-storybook', '06-anime']
    job_file = 'style-variations.json' if extra_style else 'loading-screens.json' if loading else f'{family}.json'
    jobs = json.loads((BASE / 'jobs' / job_file).read_text())
    job = next(job for job in jobs if job["id"] == job_id)
    game, direction = job_id.split("/")
    target_dir = BASE / "art" / game
    target_dir.mkdir(parents=True, exist_ok=True)
    target = target_dir / f"{direction}.webp"
    if target.exists():
        raise SystemExit(f"Already saved: {target}; do not overwrite reviewed artwork")
    with Image.open(source) as picture:
        picture.load()
        width, height = picture.size
        minimum = 900 if loading else 1024
        if min(width, height) < minimum or width*height < 1_500_000:
            raise SystemExit(f"Native resolution too small: {width} x {height}")
        if loading:
            portrait = job['orientation'] == 'portrait'
            expected_ratio = 9/16 if portrait else 16/9
            if abs(width/height-expected_ratio) > .004:
                raise SystemExit(f"Unexpected loading-screen aspect ratio: {width} x {height}")
        atomic_image_save(picture, target, quality=92)
        if direction == "01-gameplay":
            thumbnail = picture.copy()
            thumbnail.thumbnail((320, 320))
            atomic_image_save(thumbnail, target_dir / "thumbnail.webp", quality=82)
    manifest_path = target_dir / "manifest.json"
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else ({"collection": "loading", "images": []} if loading else {"gameId": job["gameId"], "images": []})
    manifest["images"].append({
        "file": target.name,
        "direction": job.get("direction", job.get("orientation")),
        "tool": "image_gen.imagegen (built-in)",
        "modelRequested": "GPT Image 2.5 or latest available",
        "modelReported": None,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "width": width,
        "height": height,
        "sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
        "prompt": job["prompt"],
        "encoding": "WebP quality 92, original pixel dimensions; no upscaling",
    })
    manifest["images"].sort(key=lambda image: image["file"])
    temporary_manifest = manifest_path.with_suffix('.json.tmp')
    temporary_manifest.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
    temporary_manifest.replace(manifest_path)
    print(json.dumps({"id": job_id, "size": [width, height], "bytes": target.stat().st_size}))


if __name__ == "__main__":
    main()
