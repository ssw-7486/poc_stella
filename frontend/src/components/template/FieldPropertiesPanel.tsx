import { memo } from 'react';
import { Input } from '../ui/Input';
import { Checkbox } from '../ui/Checkbox';
import { Badge } from '../ui/Badge';
import type { FieldDefinition } from '../../types/template';
import { getConfidenceBadge } from '../../data/mockFieldDetection';

interface FieldPropertiesPanelProps {
  fields: FieldDefinition[];
  selectedFieldId: string | null;
  isPanelVisible: boolean;
  onFieldUpdate: (fieldId: string, updates: Partial<FieldDefinition>) => void;
  onFieldDelete: (fieldId: string) => void;
  onFieldAdd: () => void;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'currency', label: 'Currency' },
  { value: 'zip-code', label: 'Zip Code' },
  { value: 'country-code', label: 'Country Code' },
] as const;

export const FieldPropertiesPanel = memo(function FieldPropertiesPanel({
  fields,
  selectedFieldId,
  isPanelVisible,
  onFieldUpdate,
  onFieldDelete,
  onFieldAdd,
}: FieldPropertiesPanelProps) {
  const selectedField = fields.find((f) => f.id === selectedFieldId);

  // Determine layout based on panel visibility and screen width
  const layoutClass = isPanelVisible ? 'single-column' : 'two-column';

  // Calculate statistics
  const totalFields = fields.length;
  const highConfidence = fields.filter((f) => f.confidence >= 90).length;
  const mediumConfidence = fields.filter((f) => f.confidence >= 70 && f.confidence < 90).length;
  const lowConfidence = fields.filter((f) => f.confidence < 70).length;

  return (
    <div className="space-y-6">
      {/* Field Statistics */}
      <div className="bg-lightest-grey p-4 rounded-[5px] border border-light-grey">
        <h3 className="text-sm font-semibold text-navy-darkest mb-3">📊 Field Statistics</h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-dark-grey">Total Fields:</span>
            <span className="ml-2 font-semibold text-navy-darkest">{totalFields}</span>
          </div>
          <div></div>
          <div className="flex items-center gap-2">
            <Badge variant="success">🟢 High</Badge>
            <span className="text-navy-darkest font-medium">{highConfidence}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="warning">🟡 Medium</Badge>
            <span className="text-navy-darkest font-medium">{mediumConfidence}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="error">🔴 Low</Badge>
            <span className="text-navy-darkest font-medium">{lowConfidence}</span>
          </div>
        </div>
      </div>

      {/* Field List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-navy-darkest">Detected Fields</h3>
          <button
            onClick={onFieldAdd}
            className="text-xs text-primary hover:text-primary-medium font-medium"
          >
            + Add Field
          </button>
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          {fields.map((field) => (
            <button
              key={field.id}
              onClick={() => onFieldUpdate(field.id, {})}
              className={`
                w-full text-left p-3 rounded-[5px] border-2 transition-all
                ${
                  selectedFieldId === field.id
                    ? 'border-primary bg-primary-lightest'
                    : 'border-light-grey bg-white hover:border-navy-dark'
                }
              `}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-darkest truncate">
                    {field.name}
                  </p>
                  <p className="text-xs text-dark-grey mt-0.5">
                    {FIELD_TYPES.find((t) => t.value === field.type)?.label || field.type}
                  </p>
                </div>
                <Badge variant={getConfidenceBadge(field.confidence)}>
                  {field.confidence}%
                </Badge>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Field Properties */}
      {selectedField && (
        <div className="bg-white p-4 rounded-[5px] border-2 border-primary">
          <h3 className="text-sm font-semibold text-navy-darkest mb-4">⚙️ Field Properties</h3>

          <div className={`field-properties-panel ${layoutClass}`}>
            {/* Field Name - spans full width in both layouts */}
            <div className={layoutClass === 'two-column' ? 'col-span-2' : ''}>
              <Input
                label="Field Name"
                required
                value={selectedField.name}
                onChange={(e) => onFieldUpdate(selectedField.id, { name: e.target.value })}
                placeholder="e.g., Ticket Number"
              />
            </div>

            {/* Field Type */}
            <div>
              <label className="text-sm text-navy-darkest font-medium mb-2 block">
                Field Type <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedField.type}
                onChange={(e) =>
                  onFieldUpdate(selectedField.id, {
                    type: e.target.value as FieldDefinition['type'],
                  })
                }
                className="w-full px-4 py-2 rounded-[5px] border border-input-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {FIELD_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Required Checkbox */}
            <div>
              <Checkbox
                label="Required Field"
                checked={selectedField.required}
                onChange={(e) => onFieldUpdate(selectedField.id, { required: e.target.checked })}
              />
            </div>

            {/* Confidence (Read-only) - spans full width in 2-column layout */}
            <div className={layoutClass === 'two-column' ? 'col-span-2' : ''}>
              <label className="text-sm text-navy-darkest font-medium mb-2 block">
                Confidence
              </label>
              <div className="flex items-center gap-2">
                <Badge variant={getConfidenceBadge(selectedField.confidence)}>
                  {selectedField.confidence}%
                </Badge>
                {selectedField.autoDetected && (
                  <span className="text-xs text-dark-grey">Auto-detected</span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4 pt-4 border-t border-light-grey">
            <button
              onClick={() => onFieldDelete(selectedField.id)}
              className="px-3 py-1.5 text-xs border border-red-600 text-red-600 rounded-[5px] hover:bg-red-600 hover:text-white transition-colors"
            >
              🗑️ Delete
            </button>
            <button
              onClick={onFieldAdd}
              className="px-3 py-1.5 text-xs border border-navy-dark text-navy-dark rounded-[5px] hover:bg-navy-dark hover:text-white transition-colors"
            >
              📋 Duplicate
            </button>
          </div>
        </div>
      )}

      {/* No Selection State */}
      {!selectedField && fields.length > 0 && (
        <div className="text-center py-8 text-dark-grey">
          <p className="text-sm">Select a field to edit its properties</p>
        </div>
      )}

      {/* No Fields State */}
      {fields.length === 0 && (
        <div className="text-center py-8 text-dark-grey">
          <p className="text-sm">No fields detected yet</p>
          <p className="text-xs mt-2">Upload samples and click "Retry Detection"</p>
        </div>
      )}
    </div>
  );
});
