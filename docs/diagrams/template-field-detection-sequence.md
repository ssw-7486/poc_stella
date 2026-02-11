# Template Creation - Field Detection & Correction Sequence

**Purpose:** Detailed sequence diagram showing field identification loop and data extraction with external validation

**Related Documents:**
- [SESSION_2026-02-10_template-creation-steps3-6.md](../sessions/SESSION_2026-02-10_template-creation-steps3-6.md)
- [Plan File](../../.claude/plans/velvety-weaving-nest.md) (Part 1, Section 1.3)

---

## Participants

- **Admin**: Administrator creating and testing template
- **System**: Template creation application
- **OCR Engine**: olmOCR 2 (or other OCR service)
- **RAG**: Reference Augmented Generation for external validation
- **Database**: Stores templates, corrections, test results

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Admin
    participant System
    participant OCR as OCR Engine<br/>(olmOCR 2)
    participant RAG as RAG/External<br/>Validation
    participant DB as Database

    Admin->>System: Upload Sample Document #1
    System->>OCR: Process Document (full page)
    OCR-->>System: Raw OCR Text + Layout + Bounding Boxes
    System->>System: Identify Field Boundaries<br/>(Layout Analysis)
    System->>Admin: Present Detected Fields<br/>(Name, Location, Type, Boundary Box)

    rect rgb(240, 240, 255)
        Note over Admin,System: Field Confirmation Loop
        loop For Each Detected Field
            Admin->>System: Review Field (name, location, type, boundary)
            alt Field Incorrect
                Admin->>System: Correct Field<br/>(Rename, Reposition, Change Type)
                System->>DB: Log Correction<br/>(Field ID, Old Value, New Value)
            else Field Correct
                Admin->>System: Confirm Field
            end
        end
    end

    Admin->>System: Request Field Extraction Test
    Admin->>System: Upload Test Sample #2
    System->>OCR: Extract Field Data<br/>(Per Bounding Box)
    OCR-->>System: Extracted Values + Confidence Scores

    rect rgb(255, 240, 240)
        Note over System,RAG: External Validation
        loop For Each External Validation Field
            System->>RAG: Validate Field Value<br/>(e.g., zip code, country code)
            RAG-->>System: Validation Result<br/>(Valid/Invalid + Suggestions)
        end
    end

    System->>Admin: Present Extracted Data<br/>(Per Field + Confidence + Validation)

    rect rgb(255, 255, 240)
        Note over Admin,System: Data Correction Loop
        loop For Each Extracted Field
            Admin->>System: Review Extracted Value
            alt Value Incorrect
                Admin->>System: Correct Value<br/>(Input Correct Value)
                System->>DB: Log Correction<br/>(Field, Extracted, Corrected, Type)
                System->>System: Calculate Delta<br/>(OCR Error vs. Validation Error)
            else Value Correct
                Admin->>System: Approve Value
            end
        end
    end

    System->>System: Calculate Accuracy %<br/>(Correct Fields / Total Fields)
    System->>DB: Store Test Result<br/>(Accuracy, Corrections, Confidence)
    System->>Admin: Show Accuracy Report<br/>(Overall, Per-Field, Trend)

    alt Accuracy < Target
        Admin->>Admin: Upload More Samples<br/>(Iterate)
    else Accuracy >= Target
        Admin->>System: Approve Template<br/>(Mark as Active)
        System->>DB: Save Template + All Test Data
    end
```

---

## Key Interactions

### Field Identification Phase
1. **Upload & Scan**: Admin uploads sample, system processes with OCR
2. **Field Detection**: System identifies field boundaries via layout analysis
3. **Field Confirmation**: Admin reviews each field, corrects if needed
4. **Correction Logging**: All corrections logged for learning

### Data Extraction Phase
5. **Extract**: System extracts data per field using bounding boxes
6. **External Validation**: System validates applicable fields via RAG (zip codes, etc.)
7. **Review & Correct**: Admin reviews extracted values, corrects errors
8. **Accuracy Calculation**: System calculates per-field and overall accuracy

### Approval Phase
9. **Accuracy Check**: If accuracy < target → upload more samples
10. **Approval**: Once accuracy ≥ target → admin approves template
11. **Storage**: Save template with all test data and corrections

---

## External Validation Types

Supported via RAG:
- **zip_code**: Validate against postal code databases
- **country_code**: Validate against ISO country codes
- **state_code**: Validate against US state codes
- **custom**: Custom validation queries

---

## Correction Types Tracked

- **OCR_error**: OCR misread the value
- **validation_error**: Value failed external validation
- **missing_field**: Field not detected
- **wrong_field**: Wrong bounding box
- **formatting**: Correct value, wrong format

---

**Last Updated:** 2026-02-10
**Related Diagrams:**
- [template-creation-high-level-flow.md](template-creation-high-level-flow.md)
- [template-accuracy-tracking-flow.md](template-accuracy-tracking-flow.md)
- [template-external-validation-flow.md](template-external-validation-flow.md)
