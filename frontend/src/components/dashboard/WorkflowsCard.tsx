import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import {
  getAllWorkflows,
  deleteWorkflow,
  updateWorkflowName,
  type WorkflowData,
} from '../../utils/workflowStorage';

export function WorkflowsCard() {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<WorkflowData[]>(() => getAllWorkflows());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [inProgressExpanded, setInProgressExpanded] = useState(true);
  const [completedExpanded, setCompletedExpanded] = useState(false);

  const refreshWorkflows = () => {
    setWorkflows(getAllWorkflows());
  };

  const handleResume = (workflowId: string) => {
    navigate(`/quick-start?workflowId=${workflowId}`);
  };

  const handleEdit = (workflowId: string) => {
    // For completed workflows, always start at Step 1
    navigate(`/quick-start?workflowId=${workflowId}&step=1`);
  };

  const handleDelete = (workflowId: string) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      deleteWorkflow(workflowId);
      refreshWorkflows();
    }
  };

  const handleEditName = (workflow: WorkflowData) => {
    setEditingId(workflow.id);
    setEditName(workflow.name);
  };

  const handleSaveName = (workflowId: string) => {
    if (editName.trim()) {
      updateWorkflowName(workflowId, editName.trim());
      refreshWorkflows();
    }
    setEditingId(null);
    setEditName('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Group workflows by status - memoized to prevent re-filtering on every render
  const inProgressWorkflows = useMemo(
    () => workflows.filter((wf) => wf.status === 'in-progress'),
    [workflows]
  );
  const completedWorkflows = useMemo(
    () => workflows.filter((wf) => wf.status === 'completed'),
    [workflows]
  );

  // Render a single workflow card
  const renderWorkflow = (workflow: WorkflowData) => (
            <div
              key={workflow.id}
              className="border border-input-border rounded-[5px] p-4 hover:border-primary-medium transition-colors"
            >
              {/* Header: Name and Status with ID */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  {editingId === workflow.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-2 py-1 text-sm border border-primary rounded-[5px] flex-1"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveName(workflow.id);
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                      />
                      <button
                        onClick={() => handleSaveName(workflow.id)}
                        className="text-xs px-2 py-1 bg-primary text-white rounded-[5px] hover:opacity-90"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-xs px-2 py-1 border border-navy-dark text-navy-dark rounded-[5px] hover:bg-navy-dark hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-navy-darkest">
                        {workflow.name}
                      </h4>
                      <button
                        onClick={() => handleEditName(workflow)}
                        className="text-xs text-primary hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-navy-dark">
                    ID: {workflow.id}
                  </p>
                  <Badge variant={workflow.status === 'completed' ? 'success' : 'info'}>
                    {workflow.status === 'completed' ? 'Completed' : 'In Progress'}
                  </Badge>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <p className="text-xs text-navy-dark">Company</p>
                  <p className="font-medium text-navy-darkest">
                    {workflow.step1Data.companyName || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-navy-dark">Region</p>
                  <p className="font-medium text-navy-darkest">
                    {workflow.step1Data.primaryRegion || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-navy-dark">Created</p>
                  <p className="font-medium text-navy-darkest">
                    {formatDate(workflow.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-navy-dark">Last Updated</p>
                  <p className="font-medium text-navy-darkest">
                    {formatDate(workflow.updatedAt)}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <p className="text-xs text-navy-dark mb-1">
                  Progress: Step {workflow.currentStep} of 7
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((workflow.currentStep / 7) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {workflow.status === 'in-progress' && (
                  <button
                    onClick={() => handleResume(workflow.id)}
                    className="px-3 py-1.5 text-sm bg-primary text-white rounded-[5px] hover:opacity-90 transition-opacity"
                  >
                    Resume
                  </button>
                )}
                {workflow.status === 'completed' && (
                  <button
                    onClick={() => handleEdit(workflow.id)}
                    className="px-3 py-1.5 text-sm bg-primary-medium text-white rounded-[5px] hover:opacity-90 transition-opacity"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(workflow.id)}
                  className="px-3 py-1.5 text-sm border border-red-600 text-red-600 rounded-[5px] hover:bg-red-600 hover:text-white transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
  );

  if (workflows.length === 0) {
    return (
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-navy-darkest mb-2">
            Workflows
          </h3>
          <p className="text-sm text-navy-dark">
            No workflows yet. Start by clicking "Quick Start" to create your first workflow.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-navy-darkest mb-4">
          Workflows ({workflows.length})
        </h3>

        {/* In Progress Section */}
        {inProgressWorkflows.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setInProgressExpanded(!inProgressExpanded)}
              className="flex items-center justify-between w-full text-left mb-3 hover:text-primary transition-colors"
            >
              <h4 className="text-md font-semibold text-navy-darkest">
                In Progress ({inProgressWorkflows.length})
              </h4>
              <svg
                className={`w-5 h-5 text-navy-dark transition-transform ${
                  inProgressExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {inProgressExpanded && (
              <div className="space-y-3">
                {inProgressWorkflows.map((workflow) => renderWorkflow(workflow))}
              </div>
            )}
          </div>
        )}

        {/* Completed Section */}
        {completedWorkflows.length > 0 && (
          <div>
            <button
              onClick={() => setCompletedExpanded(!completedExpanded)}
              className="flex items-center justify-between w-full text-left mb-3 hover:text-primary transition-colors"
            >
              <h4 className="text-md font-semibold text-navy-darkest">
                Completed ({completedWorkflows.length})
              </h4>
              <svg
                className={`w-5 h-5 text-navy-dark transition-transform ${
                  completedExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {completedExpanded && (
              <div className="space-y-3">
                {completedWorkflows.map((workflow) => renderWorkflow(workflow))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
