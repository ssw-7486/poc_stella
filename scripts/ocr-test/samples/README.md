# Sample images for Phase 0 olmOCR 2 test

Use **at least one printed** and optionally one **handwritten** image to validate olmOCR 2.

## Create a printed sample

From repo root:

```bash
python3 -m pip install Pillow
python3 scripts/ocr-test/make_sample.py
```

This creates `sample_printed.png` in this folder.

## Other sources

- **[olmocr.allenai.org](https://olmocr.allenai.org)** — Demo page offers sample documents (academic, math, handwriting, historical). Use “Try the demo” and save a PNG/JPEG from a sample, or use your own upload.
- **Your own files**: Add any PNG or JPEG (printed or handwritten) here; `run_ocr_test.py` will use them by default (up to 2) if you don’t pass paths on the command line.

## Naming

Any `.png` or `.jpg` in this directory is picked up when you run `run_ocr_test.py` with no arguments (alphabetically, first two).
