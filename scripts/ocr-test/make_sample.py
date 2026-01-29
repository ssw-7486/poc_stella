#!/usr/bin/env python3
"""Create a minimal printed-sample image for Phase 0 OCR test. Requires: pip install Pillow."""

from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Need Pillow: pip install Pillow")
    raise

SCRIPT_DIR = Path(__file__).resolve().parent
OUT = SCRIPT_DIR / "samples" / "sample_printed.png"
TEXT = """Stella OCR Test
Printed line 1
Printed line 2
Phase 0 olmOCR 2 validation."""

def main():
    SCRIPT_DIR.joinpath("samples").mkdir(exist_ok=True)
    # Simple image: white background, black text
    img = Image.new("RGB", (400, 120), color="white")
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 18)
    except Exception:
        font = ImageFont.load_default()
    draw.text((20, 20), TEXT.strip(), fill="black", font=font)
    img.save(OUT)
    print(f"Created {OUT}")

if __name__ == "__main__":
    main()
