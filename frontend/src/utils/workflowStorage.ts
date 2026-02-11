/**
 * Workflow Storage Utility
 * Manages localStorage operations for Quick Start workflows
 */

export interface WorkflowData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  currentStep: number;
  status: 'in-progress' | 'completed';
  step1Data: {
    companyName: string;
    industrySector: string;
    primaryRegion: string;
    country: string;
    linesOfBusiness: number;
    primaryContact1: {
      name: string;
      email: string;
      cell: string;
    };
    primaryContact2: {
      name: string;
      email: string;
      cell: string;
    };
    securedDropoffLocation: string;
    securePickupLocation: string;
  };
  step2Data?: {
    selectedTemplateId: string;
    templateName: string;
  };
  step3Data?: {
    selectedTemplateIds: string[];
    documentTemplates: Array<{
      id: string;
      name: string;
      lob: string;
      city: string;
      classification: 'machine-printed' | 'handwritten' | 'mixed';
      fieldsDetected: number;
      accuracy: number;
      status: 'draft' | 'testing' | 'active' | 'archived';
      processingPipeline: string;
    }>;
  };
  step4Data?: Record<string, unknown>;
  step5Data?: Record<string, unknown>;
  step6Data?: Record<string, unknown>;
}

const STORAGE_KEY = 'stella_workflows';

/**
 * Generate a unique workflow ID
 */
export const generateWorkflowId = (): string => {
  return `wf_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Get all workflows from localStorage
 */
export const getAllWorkflows = (): WorkflowData[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading workflows from localStorage:', error);
    return [];
  }
};

/**
 * Get a specific workflow by ID
 */
export const getWorkflowById = (id: string): WorkflowData | null => {
  const workflows = getAllWorkflows();
  return workflows.find((wf) => wf.id === id) || null;
};

/**
 * Save or update a workflow
 */
export const saveWorkflow = (workflow: WorkflowData): void => {
  try {
    const workflows = getAllWorkflows();
    const existingIndex = workflows.findIndex((wf) => wf.id === workflow.id);

    const updatedWorkflow = {
      ...workflow,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      workflows[existingIndex] = updatedWorkflow;
    } else {
      workflows.push(updatedWorkflow);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
  } catch (error) {
    console.error('Error saving workflow to localStorage:', error);
  }
};

/**
 * Delete a workflow by ID
 */
export const deleteWorkflow = (id: string): void => {
  try {
    const workflows = getAllWorkflows();
    const filtered = workflows.filter((wf) => wf.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting workflow from localStorage:', error);
  }
};

/**
 * Update workflow name
 */
export const updateWorkflowName = (id: string, newName: string): void => {
  try {
    const workflows = getAllWorkflows();
    const workflow = workflows.find((wf) => wf.id === id);

    if (workflow) {
      workflow.name = newName;
      workflow.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
    }
  } catch (error) {
    console.error('Error updating workflow name:', error);
  }
};

/**
 * Update workflow status
 */
export const updateWorkflowStatus = (
  id: string,
  status: 'in-progress' | 'completed'
): void => {
  try {
    const workflows = getAllWorkflows();
    const workflow = workflows.find((wf) => wf.id === id);

    if (workflow) {
      workflow.status = status;
      workflow.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
    }
  } catch (error) {
    console.error('Error updating workflow status:', error);
  }
};

/**
 * Create a new workflow with initial data
 */
export const createWorkflow = (step1Data: WorkflowData['step1Data']): WorkflowData => {
  const workflow: WorkflowData = {
    id: generateWorkflowId(),
    name: step1Data.companyName || 'Untitled Workflow',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentStep: 1,
    status: 'in-progress',
    step1Data,
  };

  saveWorkflow(workflow);
  return workflow;
};
