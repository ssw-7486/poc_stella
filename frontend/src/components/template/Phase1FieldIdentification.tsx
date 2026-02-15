import { memo, useState } from 'react';
import { UploadZone } from './UploadZone';
import { ImageViewer } from './ImageViewer';
import { FieldPropertiesPanel } from './FieldPropertiesPanel';
import type { Phase1Data, FieldDefinition } from '../../types/template';
import { mockDetectFields } from '../../data/mockFieldDetection';

interface Phase1FieldIdentificationProps {
  data: Phase1Data;
  onChange: (data: Phase1Data) => void;
  isPanelVisible: boolean;
}

export const Phase1FieldIdentification = memo(function Phase1FieldIdentification({
  data,
  onChange,
  isPanelVisible,
}: Phase1FieldIdentificationProps) {
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const handleUpload = (samples: Phase1Data['samples']) => {
    onChange({
      ...data,
      samples,
    });
  };

  const handleRetryDetection = () => {
    // Mock field detection
    const detectedFields = mockDetectFields();
    onChange({
      ...data,
      fields: detectedFields,
      detectionStatus: 'complete',
      detectionAttempts: data.detectionAttempts + 1,
    });

    // Auto-select first field
    if (detectedFields.length > 0) {
      setSelectedFieldId(detectedFields[0].id);
    }
  };

  const handleFieldUpdate = (fieldId: string, updates: Partial<FieldDefinition>) => {
    const updatedFields = data.fields.map((field) =>
      field.id === fieldId ? { ...field, ...updates } : field
    );
    onChange({
      ...data,
      fields: updatedFields,
    });

    // Set as selected
    setSelectedFieldId(fieldId);
  };

  const handleFieldDelete = (fieldId: string) => {
    const updatedFields = data.fields.filter((f) => f.id !== fieldId);
    onChange({
      ...data,
      fields: updatedFields,
    });

    // Clear selection if deleted field was selected
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(updatedFields.length > 0 ? updatedFields[0].id : null);
    }
  };

  const handleFieldAdd = () => {
    const newField: FieldDefinition = {
      id: `f${Date.now()}`,
      name: 'New Field',
      type: 'text',
      boundingBox: { x: 50, y: 100, width: 200, height: 30 },
      required: false,
      confidence: 0,
      autoDetected: false,
    };

    onChange({
      ...data,
      fields: [...data.fields, newField],
    });

    setSelectedFieldId(newField.id);
  };

  const currentSample = data.samples.length > 0 ? data.samples[0] : null;

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <UploadZone samples={data.samples} onUpload={handleUpload} maxFiles={3} />

      {/* Detection Button */}
      {data.samples.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-primary-lightest rounded-[5px] border border-primary-light">
          <div>
            <p className="text-sm font-medium text-navy-darkest">
              {data.fields.length === 0 ? 'Ready to detect fields' : `${data.fields.length} fields detected`}
            </p>
            <p className="text-xs text-dark-grey mt-1">
              {data.detectionAttempts === 0
                ? 'Click "Detect Fields" to auto-detect form fields'
                : `Detection run ${data.detectionAttempts} time(s)`}
            </p>
          </div>
          <button
            onClick={handleRetryDetection}
            disabled={data.detectionStatus === 'processing'}
            className="px-4 py-2 text-sm bg-primary text-white rounded-[5px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {data.detectionStatus === 'processing' ? 'Processing...' : 'Retry Detection'}
          </button>
        </div>
      )}

      {/* Main Content - Image + Field Properties */}
      {data.samples.length > 0 && data.fields.length > 0 && (
        <div className={`grid gap-6 ${isPanelVisible ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
          {/* Image Viewer */}
          <ImageViewer
            sample={currentSample}
            currentSampleIndex={0}
            totalSamples={data.samples.length}
          />

          {/* Field Properties */}
          <FieldPropertiesPanel
            fields={data.fields}
            selectedFieldId={selectedFieldId}
            isPanelVisible={isPanelVisible}
            onFieldUpdate={handleFieldUpdate}
            onFieldDelete={handleFieldDelete}
            onFieldAdd={handleFieldAdd}
          />
        </div>
      )}

      {/* Empty State */}
      {data.samples.length === 0 && (
        <div className="text-center py-12 text-dark-grey">
          <p className="text-sm">Upload sample documents to begin</p>
        </div>
      )}
    </div>
  );
});
