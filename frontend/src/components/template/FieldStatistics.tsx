import { memo } from 'react';
import { Badge } from '../ui/Badge';
import type { FieldDefinition } from '../../types/template';

interface FieldStatisticsProps {
  fields: FieldDefinition[];
}

export const FieldStatistics = memo(function FieldStatistics({ fields }: FieldStatisticsProps) {
  const totalFields = fields.length;
  const highConfidence = fields.filter((f) => f.confidence >= 90).length;
  const mediumConfidence = fields.filter((f) => f.confidence >= 70 && f.confidence < 90).length;
  const lowConfidence = fields.filter((f) => f.confidence < 70).length;

  return (
    <div className="bg-lightest-grey p-4 rounded-[5px] border border-light-grey">
      <div className="flex items-center gap-6 text-xs">
        <h3 className="text-sm font-semibold text-navy-darkest">📊 Field Statistics</h3>
        <div className="flex items-center gap-2">
          <span className="text-dark-grey">Total Fields:</span>
          <span className="font-semibold text-navy-darkest">{totalFields}</span>
        </div>
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
  );
});
