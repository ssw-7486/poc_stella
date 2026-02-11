export interface DocumentTemplate {
  id: string;
  name: string;
  lob: string;
  city: string;
  classification: 'machine-printed' | 'handwritten' | 'mixed';
  fieldsDetected: number;
  accuracy: number;
  status: 'draft' | 'testing' | 'active' | 'archived';
  processingPipeline: string;
}

const cities = [
  'Los Angeles',
  'San Francisco',
  'San Diego',
  'Sacramento',
  'Oakland',
  'Fresno',
  'Long Beach',
  'Riverside',
];

const classifications: Array<'machine-printed' | 'handwritten' | 'mixed'> = [
  'machine-printed',
  'handwritten',
  'mixed',
];

// Generate 20 mock templates
export const MOCK_TEMPLATES: DocumentTemplate[] = Array.from({ length: 20 }, (_, index) => {
  const letter = String.fromCharCode(65 + index); // A, B, C, ..., T
  const lobIndex = index % 2; // Alternate between Traffic Enforcement and Parking Services
  const lob = lobIndex === 0 ? 'Traffic Enforcement' : 'Parking Services';
  const city = cities[index % cities.length];
  const classification = classifications[index % classifications.length];
  const fieldsDetected = Math.floor(Math.random() * 8) + 8; // 8-15 fields
  const accuracy = Number((Math.random() * 4.9 + 95).toFixed(1)); // 95.0-99.9%

  return {
    id: `template-${letter.toLowerCase()}`,
    name: lobIndex === 0
      ? `Traffic Violation Ticket (Type ${letter})`
      : `Parking Citation (Type ${letter})`,
    lob,
    city,
    classification,
    fieldsDetected,
    accuracy,
    status: 'active',
    processingPipeline: 'OCR (olmOCR 2) → Extract fields → Validate → Export',
  };
});
