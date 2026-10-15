"""Persist a built-in imagegen result without resizing its native artwork.

Usage: python3 experiments/save-concept-art.py JOB_ID SOURCE_IMAGE
Encode a full-resolution WebP plus a small index-only thumbnail. Generation
prompts and actual file hashes/dimensions remain reviewable in the repository.
"""

import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "docs/master-plan/concepts"


def main():
    job_id, source = sys.argv[1:]
    family = job_id.split("-")[0]
    jobs = json.loads((BASE / "jobs" / f"{family}.json").read_text())
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
        if min(width, height) < 1024:
            raise SystemExit(f"Native resolution too small: {width} x {height}")
        picture.convert("RGB").save(target, "WEBP", quality=92, method=6)
        if direction == "01-gameplay":
            thumbnail = picture.copy()
            thumbnail.thumbnail((320, 320))
            thumbnail.convert("RGB").save(target_dir / "thumbnail.webp", "WEBP", quality=82, method=6)
    manifest_path = target_dir / "manifest.json"
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {"gameId": job["gameId"], "images": []}
    manifest["images"].append({
        "file": target.name,
        "direction": job["direction"],
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
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
    print(json.dumps({"id": job_id, "size": [width, height], "bytes": target.stat().st_size}))


if __name__ == "__main__":
    main()
