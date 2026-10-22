"""Create temporary review sheets; these are never catalog deliverables.

Usage: python3 experiments/review-concept-art.py bc /tmp/concept-review
Each sheet compares four complete games, with four independently generated views
per game. Full-resolution originals and their manifests remain unchanged.
"""

import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("family", help="Two-letter collection ID")
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    base = Path(__file__).resolve().parents[1] / "docs/master-plan/concepts"
    games = json.loads((base / "catalog" / f"{args.family}.json").read_text())
    directions = ["01-gameplay", "02-world", "03-details", "04-discovery"]
    complete = [
        game for game in games
        if all((base / "art" / game["id"].lower() / f"{d}.webp").exists()
               for d in directions)
    ]
    args.output.mkdir(parents=True, exist_ok=True)
    for start in range(0, len(complete), 4):
        batch = complete[start:start + 4]
        sheet = Image.new("RGB", (1024, len(batch) * 286), "#f4f1e8")
        draw = ImageDraw.Draw(sheet)
        for row, game in enumerate(batch):
            for column, direction in enumerate(directions):
                path = base / "art" / game["id"].lower() / f"{direction}.webp"
                with Image.open(path) as source:
                    preview = source.convert("RGB")
                    preview.thumbnail((248, 248))
                sheet.paste(preview, (column * 256 + 4, row * 286 + 4))
                draw.text((column * 256 + 6, row * 286 + 256),
                          f'{game["id"]}: {direction}', fill="#242424")
        destination = args.output / f"{args.family}-{start // 4 + 1:02d}.jpg"
        sheet.save(destination, quality=90)
        print(destination)
    print(f"{len(complete)}/{len(games)} complete games available for review")


if __name__ == "__main__":
    main()
