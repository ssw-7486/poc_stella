/**
 * Mock Field Detection
 * Temporary mock data for Phase 0 - will be replaced with Ollama OCR integration
 */

import type { FieldDefinition } from '../types/template';

/**
 * Mock field detection for traffic ticket documents
 * Returns a realistic set of fields with varying confidence scores
 */
export const mockDetectFields = (): FieldDefinition[] => {
  return [
    {
      id: 'f1',
      name: 'Ticket Number',
      type: 'text',
      boundingBox: { x: 50, y: 100, width: 200, height: 30 },
      required: true,
      confidence: 95,
      autoDetected: true,
    },
    {
      id: 'f2',
      name: 'Driver Name',
      type: 'text',
      boundingBox: { x: 50, y: 140, width: 250, height: 30 },
      required: true,
      confidence: 92,
      autoDetected: true,
    },
    {
      id: 'f3',
      name: 'License Plate',
      type: 'text',
      boundingBox: { x: 50, y: 180, width: 150, height: 30 },
      required: true,
      confidence: 89,
      autoDetected: true,
    },
    {
      id: 'f4',
      name: 'Violation Date',
      type: 'date',
      boundingBox: { x: 50, y: 220, width: 180, height: 30 },
      required: true,
      confidence: 94,
      autoDetected: true,
    },
    {
      id: 'f5',
      name: 'Violation Code',
      type: 'text',
      boundingBox: { x: 50, y: 260, width: 120, height: 30 },
      required: true,
      confidence: 88,
      autoDetected: true,
    },
    {
      id: 'f6',
      name: 'Fine Amount',
      type: 'currency',
      boundingBox: { x: 50, y: 300, width: 100, height: 30 },
      required: true,
      confidence: 91,
      autoDetected: true,
    },
    {
      id: 'f7',
      name: 'Address',
      type: 'text',
      boundingBox: { x: 50, y: 340, width: 300, height: 30 },
      required: false,
      confidence: 85,
      autoDetected: true,
    },
    {
      id: 'f8',
      name: 'City',
      type: 'text',
      boundingBox: { x: 50, y: 380, width: 150, height: 30 },
      required: false,
      confidence: 90,
      autoDetected: true,
    },
    {
      id: 'f9',
      name: 'State',
      type: 'text',
      boundingBox: { x: 210, y: 380, width: 50, height: 30 },
      required: false,
      confidence: 93,
      autoDetected: true,
    },
    {
      id: 'f10',
      name: 'Zip Code',
      type: 'zip-code',
      boundingBox: { x: 270, y: 380, width: 100, height: 30 },
      required: false,
      confidence: 87,
      autoDetected: true,
    },
    {
      id: 'f11',
      name: 'Country',
      type: 'country-code',
      boundingBox: { x: 50, y: 420, width: 80, height: 30 },
      required: false,
      confidence: 96,
      autoDetected: true,
    },
    {
      id: 'f12',
      name: 'Phone',
      type: 'text',
      boundingBox: { x: 50, y: 460, width: 150, height: 30 },
      required: false,
      confidence: 82,
      autoDetected: true,
    },
  ];
};

/**
 * Get confidence color based on percentage
 */
export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 90) return 'text-green-600'; // High confidence
  if (confidence >= 70) return 'text-yellow-600'; // Medium confidence
  return 'text-red-600'; // Low confidence
};

/**
 * Get confidence badge variant
 */
export const getConfidenceBadge = (confidence: number): 'success' | 'warning' | 'error' => {
  if (confidence >= 90) return 'success';
  if (confidence >= 70) return 'warning';
  return 'error';
};
