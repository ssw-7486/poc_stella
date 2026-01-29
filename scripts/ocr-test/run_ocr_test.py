#!/usr/bin/env python3
"""
Phase 0 (T0b): Minimal olmOCR 2 test via Ollama API.
Sends 1–2 sample images to olmOCR 2, prints extracted text.

Usage:
  python run_ocr_test.py [image1.png] [image2.png]
  python run_ocr_test.py   # uses default samples/ if present

Requires: Ollama running with olmOCR 2 pulled (e.g. ollama pull richardyoung/olmocr2:7b-q8).
"""

import base64
import json
import sys
from pathlib import Path

from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

OLLAMA_URL = "http://localhost:11434"
MODEL = "richardyoung/olmocr2:7b-q8"  # olmOCR 2 on Ollama (Allen AI 7B)
SCRIPT_DIR = Path(__file__).resolve().parent
DEFAULT_SAMPLES = list((SCRIPT_DIR / "samples").glob("*.png")) + list((SCRIPT_DIR / "samples").glob("*.jpg"))


def main():
    if len(sys.argv) > 1:
        paths = [Path(p) for p in sys.argv[1:]]
    else:
        paths = sorted(DEFAULT_SAMPLES)[:2]
    if not paths:
        print("No images given and no samples in scripts/ocr-test/samples/.")
        print("Usage: python run_ocr_test.py [image1.png] [image2.png]")
        print("Or add PNG/JPEG files to scripts/ocr-test/samples/ and run again.")
        sys.exit(1)
    for p in paths:
        if not p.exists():
            print(f"File not found: {p}")
            sys.exit(1)

    print("Phase 0 olmOCR 2 test via Ollama")
    print("Model:", MODEL)
    print("Images:", [str(p) for p in paths])
    print("-" * 60)

    for path in paths:
        text = run_ocr(path)
        print(f"\n--- {path.name} ---\n{text}\n")
    print("Done.")


def run_ocr(image_path: Path) -> str:
    with open(image_path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode("ascii")
    body = {
        "model": MODEL,
        "prompt": "Extract and return all text from this image. Preserve line breaks and reading order. Output only the extracted text.",
        "images": [b64],
        "stream": False,
    }
    req = Request(
        f"{OLLAMA_URL}/api/generate",
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except URLError as e:
        return f"[Error: Ollama not reachable at {OLLAMA_URL}. Start with: ollama serve] {e}"
    except HTTPError as e:
        body = e.read().decode("utf-8") if e.fp else ""
        return f"[HTTP Error {e.code}: {body}]"
    except json.JSONDecodeError as e:
        return f"[Invalid JSON from Ollama: {e}]"

    out = data.get("response", "")
    if not out and "error" in data:
        return f"[Ollama error: {data['error']}]"
    return out.strip()


if __name__ == "__main__":
    main()
