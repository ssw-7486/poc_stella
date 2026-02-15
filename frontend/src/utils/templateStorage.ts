/**
 * Template Storage Utility
 * Manages localStorage operations for Create Template drafts
 */

import type { TemplateDraft } from '../types/template';
import type { DocumentTemplate } from '../data/mockTemplates';

const STORAGE_KEY = 'stella_template_drafts';

/**
 * Generate a unique template ID
 */
export const generateTemplateId = (): string => {
  return `tmpl_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Get all template drafts from localStorage
 */
export const getAllTemplateDrafts = (): TemplateDraft[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading template drafts from localStorage:', error);
    return [];
  }
};

/**
 * Get a specific template draft by ID
 */
export const getTemplateDraftById = (id: string): TemplateDraft | null => {
  const drafts = getAllTemplateDrafts();
  return drafts.find((draft) => draft.id === id) || null;
};

/**
 * Save or update a template draft
 */
export const saveTemplateDraft = (draft: TemplateDraft): void => {
  try {
    const drafts = getAllTemplateDrafts();
    const existingIndex = drafts.findIndex((d) => d.id === draft.id);

    const updatedDraft = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      drafts[existingIndex] = updatedDraft;
    } else {
      drafts.push(updatedDraft);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  } catch (error) {
    console.error('Error saving template draft to localStorage:', error);
  }
};

/**
 * Delete a template draft by ID
 */
export const deleteTemplateDraft = (id: string): void => {
  try {
    const drafts = getAllTemplateDrafts();
    const filtered = drafts.filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting template draft from localStorage:', error);
  }
};

/**
 * Create a new template draft with initial data
 */
export const createTemplateDraft = (name: string): TemplateDraft => {
  const draft: TemplateDraft = {
    id: generateTemplateId(),
    name: name || 'Untitled Template',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentPhase: 1,
    status: 'draft',
  };

  saveTemplateDraft(draft);
  return draft;
};

/**
 * Approve template: convert draft to active template
 * Returns the new template that should be added to MOCK_TEMPLATES
 */
export const approveTemplate = (draft: TemplateDraft): DocumentTemplate => {
  if (!draft.phase1Data || !draft.phase3Data) {
    throw new Error('Cannot approve template: missing phase data');
  }

  const template: DocumentTemplate = {
    id: `template-${draft.name.toLowerCase().replace(/\s+/g, '-')}`,
    name: draft.name,
    lob: 'Traffic Enforcement', // TODO: Extract from wizard context
    city: 'San Francisco', // TODO: Extract from wizard context
    classification: 'mixed', // TODO: Determine from samples
    fieldsDetected: draft.phase1Data.fields.length,
    accuracy: draft.phase3Data.overallAccuracy,
    status: 'active',
    processingPipeline: 'OCR (olmOCR 2) → Extract fields → Validate → Export',
  };

  // Delete the draft after approval
  deleteTemplateDraft(draft.id);

  return template;
};

/**
 * Update template draft name
 */
export const updateTemplateDraftName = (id: string, newName: string): void => {
  try {
    const drafts = getAllTemplateDrafts();
    const draft = drafts.find((d) => d.id === id);

    if (draft) {
      draft.name = newName;
      draft.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    }
  } catch (error) {
    console.error('Error updating template draft name:', error);
  }
};

/**
 * Update template draft status
 */
export const updateTemplateDraftStatus = (
  id: string,
  status: TemplateDraft['status']
): void => {
  try {
    const drafts = getAllTemplateDrafts();
    const draft = drafts.find((d) => d.id === id);

    if (draft) {
      draft.status = status;
      draft.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    }
  } catch (error) {
    console.error('Error updating template draft status:', error);
  }
};
