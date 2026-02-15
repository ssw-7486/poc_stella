import { memo } from 'react';
import { Badge } from '../ui/Badge';
import type { FieldDefinition } from '../../types/template';
import { getConfidenceBadge } from '../../data/mockFieldDetection';

interface DetectedFieldsListProps {
  fields: FieldDefinition[];
  selectedFieldId: string | null;
  onFieldSelect: (fieldId: string) => void;
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

export const DetectedFieldsList = memo(function DetectedFieldsList({
  fields,
  selectedFieldId,
  onFieldSelect,
  onFieldAdd,
}: DetectedFieldsListProps) {
  return (
    <div className="bg-white p-4 rounded-[5px] border-2 border-primary">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-navy-darkest">Detected Fields</h3>
        <button
          onClick={onFieldAdd}
          className="text-xs text-primary hover:text-primary-medium font-medium"
        >
          + Add Field
        </button>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {fields.map((field) => (
          <button
            key={field.id}
            onClick={() => onFieldSelect(field.id)}
            className={`
              w-full text-left p-2.5 rounded-[5px] border-2 transition-all
              ${
                selectedFieldId === field.id
                  ? 'border-primary bg-primary-lightest'
                  : 'border-light-grey bg-lightest-grey hover:border-navy-dark'
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
  );
});
