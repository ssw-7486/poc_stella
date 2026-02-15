/**
 * Template Types
 * Type definitions for Create Template feature
 */

export interface UploadedSample {
  fileName: string;
  fileSize: number;
  uploadedAt: string;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FieldDefinition {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'zip-code' | 'country-code';
  boundingBox: BoundingBox;
  required: boolean;
  confidence: number; // 0-100
  autoDetected: boolean;
}

export interface ExtractedField {
  fieldId: string;
  fieldName: string;
  extractedValue: string;
  confidence: number;
  needsReview: boolean;
}

export interface Correction {
  fieldId: string;
  sampleFileName: string;
  extractedValue: string;
  correctedValue: string;
  issueType: 'ocr-error' | 'missing-field' | 'wrong-box' | 'validation-error';
  timestamp: string;
}

export interface TestResult {
  sampleFileName: string;
  extractedFields: ExtractedField[];
  totalFields: number;
  correctFields: number;
  corrections: Correction[];
  avgConfidence: number;
}

export interface Phase1Data {
  samples: UploadedSample[];
  fields: FieldDefinition[];
  detectionStatus: 'idle' | 'processing' | 'complete' | 'error';
  detectionAttempts: number;
}

export interface Phase2Data {
  testSamples: UploadedSample[];
  currentSampleIndex: number;
  currentFieldIndex: number;
  corrections: Correction[];
  extractionResults: TestResult[];
}

export interface Phase3Data {
  overallAccuracy: number;
  fieldAccuracies: Record<string, number>; // fieldId -> accuracy %
  targetAccuracy: number; // Default 99.5
  approved: boolean;
  approvedAt?: string;
}

export interface TemplateDraft {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  currentPhase: 1 | 2 | 3;
  status: 'draft' | 'testing' | 'active' | 'archived';
  phase1Data?: Phase1Data;
  phase2Data?: Phase2Data;
  phase3Data?: Phase3Data;
}
