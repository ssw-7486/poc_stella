# Phase 0: olmOCR 2 small test — results

**Date**: _fill after run_  
**Environment**: MacBook Pro (fill: OS, RAM, Apple Silicon / Intel)  
**Ollama**: _version_  
**Model**: `richardyoung/olmocr2:7b-q8` (olmOCR 2)

---

## Steps run

1. Installed Ollama: _how (e.g. brew install ollama)_
2. Started Ollama: _e.g. ollama serve or app_
3. Pulled model: `ollama pull richardyoung/olmocr2:7b-q8`
4. Created sample image: `python scripts/ocr-test/make_sample.py`
5. Ran test: `python scripts/ocr-test/run_ocr_test.py`

---

## Results

### Sample 1: `sample_printed.png` (printed)

- **Expected text** (from image): Stella OCR Test, Printed line 1, Printed line 2, Phase 0 olmOCR 2 validation.
- **Extracted text**: _paste output_
- **Accuracy**: _acceptable / issues_
- **Latency**: _seconds per image (if noted)_

### Sample 2 (optional): _filename_ (printed / handwritten)

- **Expected**: _
- **Extracted**: _
- **Accuracy**: _
- **Latency**: _

---

## Issues / setup notes

_Any errors, timeouts, or setup issues (e.g. Xcode license, Ollama not in PATH)._

---

## Conclusion

- [ ] olmOCR 2 runs locally and returns text from sample images.
- [ ] Results documented. Proceed to Phase 1 (Setup) only after this passes.

**Verdict**: _Acceptable for MVP / Not acceptable (reason)._
