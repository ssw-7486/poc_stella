import { memo } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Checkbox } from '../ui/Checkbox';
import { Badge } from '../ui/Badge';
import type { FieldDefinition } from '../../types/template';
import { getConfidenceBadge } from '../../data/mockFieldDetection';

interface FieldPropertiesEditorProps {
  field: FieldDefinition | null;
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
];

export const FieldPropertiesEditor = memo(function FieldPropertiesEditor({
  field,
  isPanelVisible,
  onFieldUpdate,
  onFieldDelete,
  onFieldAdd,
}: FieldPropertiesEditorProps) {
  const layoutClass = isPanelVisible ? 'single-column' : 'two-column';

  if (!field) {
    return (
      <div className="text-center py-8 text-dark-grey">
        <p className="text-sm">Select a field to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-[5px] border-2 border-primary">
      <h3 className="text-sm font-semibold text-navy-darkest mb-4">⚙️ Field Properties</h3>

      <div className={`field-properties-panel ${layoutClass}`}>
        {/* Field Name - spans full width in both layouts */}
        <div className={layoutClass === 'two-column' ? 'col-span-2' : ''}>
          <Input
            label="Field Name"
            required
            value={field.name}
            onChange={(e) => onFieldUpdate(field.id, { name: e.target.value })}
            placeholder="e.g., Ticket Number"
          />
        </div>

        {/* Field Type */}
        <div>
          <Select
            label="Field Type"
            options={FIELD_TYPES}
            value={field.type}
            onChange={(e) =>
              onFieldUpdate(field.id, {
                type: e.target.value as FieldDefinition['type'],
              })
            }
            required
            fullWidth
          />
        </div>

        {/* Required Checkbox */}
        <div>
          <Checkbox
            label="Required Field"
            checked={field.required}
            onChange={(e) => onFieldUpdate(field.id, { required: e.target.checked })}
          />
        </div>

        {/* Confidence (Read-only) - spans full width in 2-column layout */}
        <div className={layoutClass === 'two-column' ? 'col-span-2' : ''}>
          <label className="text-sm text-navy-darkest font-medium mb-2 block">
            Confidence
          </label>
          <div className="flex items-center gap-2">
            <Badge variant={getConfidenceBadge(field.confidence)}>
              {field.confidence}%
            </Badge>
            {field.autoDetected && (
              <span className="text-xs text-dark-grey">Auto-detected</span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4 pt-4 border-t border-light-grey">
        <button
          onClick={() => onFieldDelete(field.id)}
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
  );
});
