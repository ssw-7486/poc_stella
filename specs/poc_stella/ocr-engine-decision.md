# OCR Engine Selection: Stella

**Date**: 2025-01-29 | **Spec**: [spec.md](./spec.md) | **Research**: [research.md](./research.md)

Comparison of the three candidate local OCR engines and recommendation for **MVP (MacBook Pro local demo)** and **production**.

---

## Requirements (from spec)

- **Local only** — no customer data sent to external ML (FR-023, G6).
- **Printed vs. handwritten paths** — hybrid architecture; classification routes to appropriate engine (FR-002, FR-003).
- **99.9% accuracy target** (constitution); higher accuracy reduces human review.
- **MVP runs on MacBook Pro** — no server; functional local demo (technical-specs.md §9).
- **Production** — secured in the cloud; scales to any volume; optional per-customer local LLM tuning (G8).

---

## Candidate comparison

| Criterion | olmOCR 2 (Allen AI) | LightOnOCR-1B-1025 (and 2-1B) | DeepSeek-OCR-2 |
|-----------|---------------------|--------------------------------|----------------|
| **Printed text** | Yes | Yes | Yes |
| **Handwritten text** | Yes | Yes | Yes |
| **Single model for both** | Yes (one model for printed + handwritten) | Yes | Yes |
| **License** | Apache 2.0 | Apache 2.0 | Apache 2.0 |
| **Mac / Apple Silicon** | **Yes** — Ollama, MLX, LM Studio; Metal GPU | Unclear — PyTorch/Transformers may run (MPS or CPU) | **Yes** via community MLX port (e.g. MLX-Video-OCR-DeepSeek-Apple-Silicon) |
| **Linux / NVIDIA (production)** | Yes (Hugging Face, vLLM) | Yes (vLLM from v0.11.1+, Transformers) | Yes (CUDA; Hugging Face, vLLM) |
| **Model size** | ~7B params; 4.7–9.5 GB (quantized) | ~1B params; 2.34 GB | Larger; CUDA-oriented |
| **Speed / cost** | Good; ~$178/M pages on own GPU (Allen AI claim) | **Very fast** — 5.71 pp/s on H100; &lt;$0.01/1k pages | High accuracy; speed depends on hardware |
| **Fine-tuning / local LLM** | Yes — toolkit for fine-tuning on own docs | Model can be adapted | Yes (standard HF stack) |
| **Tables, layout, math** | Yes | Yes (tables, receipts, forms, multi-column, math) | Yes (document understanding) |
| **Source** | [olmocr.allenai.org](https://olmocr.allenai.org), GitHub allenai/olmocr, Hugging Face | Hugging Face lightonai/LightOnOCR-1B-1025; LightOnOCR-2-1B newer | Hugging Face deepseek-ai/DeepSeek-OCR-2, GitHub |

---

## Recommendation

### MVP (MacBook Pro local demo)

**Primary engine: olmOCR 2 (Allen AI)**

- **Mac support**: Native options (Ollama, MLX, LM Studio) with Metal on Apple Silicon — no community port required.
- **Single model**: Handles both printed and handwritten; MVP can use **one engine** for both classification paths (classification still decides “printed” vs “handwritten” for routing and metrics; same backend model).
- **License**: Apache 2.0; fine-tunable for future per-customer tuning (G8).
- **Operational**: Single stack to install and run on a laptop (e.g. Ollama + olmOCR 2).

**Fallback for MVP**: If olmOCR 2 is too heavy on base MacBook (e.g. 8 GB RAM), evaluate **LightOnOCR-1B-1025** or **LightOnOCR-2-1B** (smaller, faster); confirm Mac/PyTorch MPS or CPU runs acceptably.

### Production (cloud, any volume)

- **Option A (simplest)**: Standardize on **olmOCR 2** for both printed and handwritten paths; scale via worker count and GPU nodes; optional per-customer fine-tuning.
- **Option B (hybrid)**: Use **LightOnOCR-1B** (or 2-1B) for the **printed** path (speed, cost) and **olmOCR 2** or **DeepSeek-OCR-2** for the **handwritten** path (accuracy on difficult script). Requires two runtimes; better fit when volume is very high and printed dominates.
- **DeepSeek-OCR-2**: Strong accuracy; use where NVIDIA GPU is available and latency/accuracy justify it; Mac not required in production.

### Summary

| Context | Engine(s) | Reason |
|---------|-----------|--------|
| **MVP (MacBook Pro)** | **olmOCR 2** | Native Mac (Ollama/MLX); one model for printed + handwritten; Apache 2.0; fine-tunable. |
| **Production (single engine)** | **olmOCR 2** | Same stack as MVP; scales with workers/GPU; optional tuning. |
| **Production (hybrid)** | **LightOnOCR-1B/2-1B** (printed) + **olmOCR 2** or **DeepSeek-OCR-2** (handwritten) | Throughput and cost on printed; accuracy on handwritten. |

---

## Note on “Local AI OCR v2.2.2”

The spec and research originally listed **“Local AI OCR (v2.2.2)”**. This may refer to:

- The **th1nhhdk/local_ai_ocr** GitHub project (community), or  
- A versioned wrapper or fork; or  
- **olmOCR 2** under a different name.

For Stella we treat **olmOCR 2 (Allen AI)** as the primary “local AI OCR” candidate: open, documented, Mac-friendly, and one model for both printed and handwritten. If the team has a specific v2.2.2 binary or repo, it can be evaluated against this comparison and swapped in for MVP if it fits the same constraints (local only, Mac-capable, printable + handwritten).

---

## Phase 0: Ollama model for olmOCR 2

For the Phase 0 small test (see [tasks.md](./tasks.md) T0a, [quickstart.md](./quickstart.md) Step 0):

- **Install Ollama**: [ollama.com](https://ollama.com) or `brew install ollama`.
- **Pull olmOCR 2** (community image of Allen AI olmOCR-2-7B):  
  `ollama pull richardyoung/olmocr2:7b-q8`  
  (~9.5 GB; then run `ollama serve` or use the Ollama app.)
- **Minimal test**: Use `scripts/ocr-test/run_ocr_test.py`; document results in [ocr-test-results.md](./ocr-test-results.md).

---

## Next steps

1. **Lock MVP choice**: Confirm **olmOCR 2** for MVP (or LightOnOCR-1B if Mac testing shows olmOCR 2 is too heavy).
2. **Implement**: Worker(s) call olmOCR 2 via Ollama API or Python/Node binding; classification still sets “printed” vs “handwritten” for audit and future hybrid split.
3. **Production**: Decide single-engine (olmOCR 2) vs hybrid (LightOn + olmOCR/DeepSeek) once volume and cost are measurable.
