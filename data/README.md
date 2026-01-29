# Local secured repository (MVP)

This folder is the **MVP implementation** of the secured drop-off and pickup location (FR-013). Each customer has an isolated area; no customer data is shared with others.

## Layout

```text
data/
├── .gitignore           # Customer files are not committed
├── README.md            # This file
└── customers/
    └── {customer_id}/   # One directory per customer (e.g. customer_001)
        ├── drop-off/    # Incoming documents (uploaded files)
        └── pickup/      # Outputs for customer (OCR results, exports)
```

- **drop-off**: Where uploaded documents land. Workers read from here for classification and OCR.
- **pickup**: Where processed outputs (e.g. extracted text, result files) are placed for the customer to retrieve.

## Usage (MVP)

- The app creates `data/customers/{customer_id}/drop-off/` and `data/customers/{customer_id}/pickup/` when needed (e.g. on first upload for that customer).
- Config: point storage at this folder via `STORAGE_PATH=./data` (or equivalent) for MVP.
- **Production**: Replace with cloud blob storage (Azure Blob or S3) with per-customer container/prefix; same logical layout.

## Audit

All lifecycle events (docs in, left for processing, outputs ready, transferred to customer) are recorded in the audit trail (G9). See architecture §3c and spec FR-013.
