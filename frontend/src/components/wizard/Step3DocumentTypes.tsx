import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '../ui/Checkbox';
import { Button } from '../ui/Button';
import { MOCK_TEMPLATES, type DocumentTemplate } from '../../data/mockTemplates';

export interface Step3Data {
  selectedTemplateIds: string[];
  documentTemplates: DocumentTemplate[];
}

interface Step3DocumentTypesProps {
  data: Step3Data;
  onChange: (data: Step3Data) => void;
}

export const Step3DocumentTypes = memo(function Step3DocumentTypes({ data, onChange }: Step3DocumentTypesProps) {
  const navigate = useNavigate();

  const handleTemplateToggle = (templateId: string) => {
    const isSelected = data.selectedTemplateIds.includes(templateId);
    const newSelectedIds = isSelected
      ? data.selectedTemplateIds.filter(id => id !== templateId)
      : [...data.selectedTemplateIds, templateId];

    onChange({
      ...data,
      selectedTemplateIds: newSelectedIds,
    });
  };

  const handleViewDetails = () => {
    // Phase 2 feature - stub with toast message
    alert('Feature coming soon: Template details modal');
  };

  const handleCreateTemplate = () => {
    navigate('/create-template');
  };

  const handleViewLibrary = () => {
    // Phase 2 feature - stub with toast message
    alert('Feature coming soon: Template library with filters and search');
  };

  // Calculate summary statistics
  const selectedCount = data.selectedTemplateIds.length;
  const selectedTemplates = MOCK_TEMPLATES.filter(t =>
    data.selectedTemplateIds.includes(t.id)
  );
  const avgAccuracy = selectedCount > 0
    ? (selectedTemplates.reduce((sum, t) => sum + t.accuracy, 0) / selectedCount).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-navy-darkest">Your Document Templates</h2>
          <p className="text-sm text-navy-dark mt-1">
            Based on the samples you provided during onboarding, we've created templates for your document types:
          </p>
        </div>
      </div>

      {/* Template Cards - Single Column Scrollable List */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {MOCK_TEMPLATES.map((template) => {
          const isSelected = data.selectedTemplateIds.includes(template.id);

          return (
            <div
              key={template.id}
              className={`
                border-2 bg-white p-6 rounded-[5px] transition-all
                ${isSelected
                  ? 'border-primary shadow-md'
                  : 'border-light-grey hover:border-navy-dark'
                }
              `}
            >
              {/* Card Header - Checkbox + Title + View Details */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <Checkbox
                    id={`template-${template.id}`}
                    checked={isSelected}
                    onChange={() => handleTemplateToggle(template.id)}
                    className="mt-1"
                  />
                  <label
                    htmlFor={`template-${template.id}`}
                    className="text-lg font-semibold text-navy-darkest cursor-pointer select-none"
                  >
                    {template.name}
                  </label>
                </div>
                <Button
                  variant="outline"
                  onClick={handleViewDetails}
                  className="text-xs px-3 py-1.5 flex-shrink-0"
                >
                  View Details
                </Button>
              </div>

              {/* Divider */}
              <div className="border-b border-light-grey mb-4"></div>

              {/* Template Metadata - Row 1 */}
              <div className="flex items-center gap-4 mb-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-dark-grey font-medium">LOB:</span>
                  <span className="text-navy-darkest">{template.lob}</span>
                </div>
                <span className="text-dark-grey">|</span>
                <div className="flex items-center gap-2">
                  <span className="text-dark-grey font-medium">City:</span>
                  <span className="text-navy-darkest">{template.city}</span>
                </div>
                <span className="text-dark-grey">|</span>
                <div className="flex items-center gap-2">
                  <span className="text-dark-grey font-medium">Classification:</span>
                  <span className="text-navy-darkest capitalize">{template.classification}</span>
                </div>
              </div>

              {/* Template Metadata - Row 2 */}
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-dark-grey font-medium">Fields:</span>
                  <span className="text-navy-darkest">{template.fieldsDetected} detected</span>
                </div>
                <span className="text-dark-grey">|</span>
                <div className="flex items-center gap-2">
                  <span className="text-dark-grey font-medium">Accuracy:</span>
                  <span className="text-green font-semibold">{template.accuracy}% ✓</span>
                </div>
                <span className="text-dark-grey">|</span>
                <div className="flex items-center gap-2">
                  <span className="text-dark-grey font-medium">Status:</span>
                  <span className="text-navy-darkest capitalize">{template.status}</span>
                </div>
              </div>

              {/* Processing Pipeline */}
              <div className="bg-primary-lighter/30 p-3 rounded-[5px]">
                <div className="text-xs text-dark-grey font-medium mb-1">Processing:</div>
                <div className="text-sm text-navy-darkest font-mono">{template.processingPipeline}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 pt-4 border-t border-light-grey">
        <Button
          variant="outline"
          onClick={handleCreateTemplate}
          className="text-sm"
        >
          + Create New Template
        </Button>
        <Button
          variant="outline"
          onClick={handleViewLibrary}
          className="text-sm"
        >
          View Template Library
        </Button>
      </div>

      {/* Footer Summary */}
      <div className="flex items-center gap-4 text-sm font-medium text-navy-darkest bg-primary-lighter/20 p-4 rounded-[5px]">
        <div>
          <span className="text-dark-grey">Selected:</span>{' '}
          <span className="font-bold">{selectedCount}</span> template{selectedCount !== 1 ? 's' : ''}
        </div>
        <span className="text-dark-grey">|</span>
        <div>
          <span className="text-dark-grey">Avg Accuracy:</span>{' '}
          <span className={`font-bold ${selectedCount > 0 ? 'text-green' : 'text-dark-grey'}`}>
            {avgAccuracy}%
          </span>
        </div>
      </div>
    </div>
  );
});
