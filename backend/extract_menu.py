"""
Menu extraction pipeline (v2 - using google-genai + Gemini 3.6 Flash)
=======================================================================
Turns a photographed menu into the structured JSON our frontend expects:

    { id, name, description, price, category, veg, photo }

Run with:
    python extract_menu.py menu_test.jpg --vendor-slug test-vendor
"""

import argparse
import json
import os
import re
from pathlib import Path

from google import genai
from google.genai import types
from PIL import Image

try:
    import requests
except ImportError:
    requests = None  # stock-photo fallback just won't run without this


EXTRACTION_PROMPT = """You are reading a photograph of a restaurant menu.

Extract every distinct food/drink item you can find. For each item return:
- name: the dish name, cleaned up (fix obvious OCR/spelling issues, keep it recognizable)
- description: a short 1-sentence description. If the menu has no description,
  write a brief, honest, generic description based on the dish name and cuisine.
- price: the numeric price only (no currency symbol). If unreadable, use null.
- category: one of exactly these values: "veg-starter", "nonveg-starter",
  "veg-main", "nonveg-main", "dessert", "beverage". Infer the best fit if the
  menu's own section headers differ.
- veg: true or false. Use standard Indian veg/non-veg conventions (egg counts
  as non-veg) and any veg/non-veg symbols printed on the menu if visible.
- photo_bbox: if there is a printed photograph of this specific dish directly
  on the menu next to its listing, return its pixel bounding box as
  [x_min, y_min, x_max, y_max] relative to the full image. If there is no
  photo for this item, use null. Do NOT guess or fabricate a box.

Return a JSON array of objects with exactly these keys:
name, description, price, category, veg, photo_bbox
"""


def get_client() -> genai.Client:
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise SystemExit(
            "GOOGLE_API_KEY not found. Run this in your terminal first:\n"
            "  set GOOGLE_API_KEY=your-key-here"
        )
    return genai.Client(api_key=api_key)


def extract_items(client: genai.Client, image_path: Path) -> list[dict]:
    """Call Gemini to pull structured items out of the menu photo."""
    print(f"Uploading {image_path.name} ...")
    uploaded_file = client.files.upload(file=str(image_path))

    print("Asking Gemini to extract structured items ...")
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=[uploaded_file, EXTRACTION_PROMPT],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
        ),
    )
    return json.loads(response.text)


def crop_photo(image_path: Path, bbox: list, out_path: Path) -> bool:
    """Crop an embedded food photo out of the menu image using its bbox."""
    try:
        with Image.open(image_path) as img:
            x_min, y_min, x_max, y_max = bbox
            cropped = img.crop((x_min, y_min, x_max, y_max))
            cropped.save(out_path)
        return True
    except Exception as e:
        print(f"  ! crop failed for {out_path.name}: {e}")
        return False


def fetch_stock_photo(dish_name: str) -> str | None:
    """Fallback: look up a representative stock photo by dish name via Unsplash."""
    access_key = os.environ.get("UNSPLASH_ACCESS_KEY")
    if not access_key or requests is None:
        return None
    try:
        resp = requests.get(
            "https://api.unsplash.com/search/photos",
            params={"query": f"{dish_name} food dish", "per_page": 1},
            headers={"Authorization": f"Client-ID {access_key}"},
            timeout=10,
        )
        resp.raise_for_status()
        results = resp.json().get("results", [])
        if results:
            return results[0]["urls"]["regular"]
    except Exception as e:
        print(f"  ! stock photo lookup failed for '{dish_name}': {e}")
    return None


def slugify(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", (name or "item").lower()).strip("-")


def run(menu_image_path: str, vendor_slug: str, out_dir: str = "output"):
    image_path = Path(menu_image_path)
    out_path = Path(out_dir)
    photos_dir = out_path / "photos" / vendor_slug
    photos_dir.mkdir(parents=True, exist_ok=True)

    client = get_client()
    raw_items = extract_items(client, image_path)
    print(f"Found {len(raw_items)} items. Resolving photos ...")

    final_items = []
    for i, item in enumerate(raw_items, start=1):
        item_slug = slugify(item.get("name"))
        photo_url = None

        bbox = item.get("photo_bbox")
        if bbox:
            crop_filename = f"{item_slug}.jpg"
            crop_path = photos_dir / crop_filename
            if crop_photo(image_path, bbox, crop_path):
                photo_url = f"/photos/{vendor_slug}/{crop_filename}"

        if not photo_url:
            photo_url = fetch_stock_photo(item.get("name", "")) or (
                f"https://picsum.photos/seed/{item_slug}/400/300"
            )

        final_items.append(
            {
                "id": i,
                "name": item.get("name"),
                "description": item.get("description"),
                "price": item.get("price"),
                "category": item.get("category"),
                "veg": item.get("veg"),
                "photo": photo_url,
            }
        )

    menu_json_path = out_path / f"{vendor_slug}-menu.json"
    menu_json_path.write_text(json.dumps(final_items, indent=2, ensure_ascii=False))
    print(f"\nDone. Wrote {len(final_items)} items to {menu_json_path}")
    return final_items


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Extract a structured menu from a photo.")
    parser.add_argument("image", help="Path to the photographed menu image")
    parser.add_argument("--vendor-slug", required=True, help="Unique slug for this vendor")
    parser.add_argument("--out-dir", default="output", help="Where to write the JSON and photos")
    args = parser.parse_args()

    run(args.image, args.vendor_slug, args.out_dir)