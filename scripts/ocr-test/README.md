# Phase 0: olmOCR 2 small test

Minimal test to validate olmOCR 2 on your Mac (Ollama) before building the Stella pipeline. See [tasks.md](../../specs/poc_stella/tasks.md) Phase 0 and [quickstart.md](../../specs/poc_stella/quickstart.md) Step 0.

## Prerequisites

1. **Ollama** installed and running:
   - Install: [ollama.com](https://ollama.com) or `brew install ollama`
   - Start: run `ollama serve` (or launch the Ollama app)
2. **olmOCR 2** model pulled:
   ```bash
   ollama pull richardyoung/olmocr2:7b-q8
   ```
   (This is the Ollama community image for Allen AI’s olmOCR-2-7B; ~9.5 GB.)

## Sample images

- **Option A**: Generate a printed sample:
  ```bash
  python3 -m pip install Pillow
  python3 scripts/ocr-test/make_sample.py
  ```
  This creates `samples/sample_printed.png`.
- **Option B**: Add your own PNG/JPEG under `samples/` (e.g. one printed, one handwritten).
- See `samples/README.md` for more sources (e.g. olmocr.allenai.org demo samples).

## Run the test

```bash
# From repo root
python3 scripts/ocr-test/run_ocr_test.py

# Or with explicit images
python3 scripts/ocr-test/run_ocr_test.py path/to/image1.png path/to/image2.png
```

The script sends each image to olmOCR 2 via the Ollama API and prints the extracted text.

## Document results

After running, record accuracy, latency, and any errors in [specs/poc_stella/ocr-test-results.md](../../specs/poc_stella/ocr-test-results.md) (or in [ocr-engine-decision.md](../../specs/poc_stella/ocr-engine-decision.md)). Proceed to Phase 1 only after the olmOCR 2 test passes.
