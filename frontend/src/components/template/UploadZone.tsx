import { memo, type ChangeEvent } from 'react';
import type { UploadedSample } from '../../types/template';

interface UploadZoneProps {
  samples: UploadedSample[];
  onUpload: (newSamples: UploadedSample[]) => void;
  maxFiles?: number;
}

export const UploadZone = memo(function UploadZone({
  samples,
  onUpload,
  maxFiles = 10,
}: UploadZoneProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newSamples: UploadedSample[] = Array.from(files).map((file) => ({
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
    }));

    onUpload([...samples, ...newSamples]);

    // Reset input
    e.target.value = '';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const canUploadMore = samples.length < maxFiles;

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-navy-darkest">Upload Samples</h3>
          <p className="text-xs text-dark-grey mt-1">
            {samples.length === 0 ? 'Upload 2-3 sample documents' : `${samples.length} file(s) uploaded`}
          </p>
        </div>
        {canUploadMore && (
          <label className="px-4 py-2 text-sm bg-primary text-white rounded-[5px] hover:opacity-90 transition-opacity cursor-pointer">
            + Add Files
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* File List */}
      {samples.length > 0 && (
        <div className="space-y-2">
          {samples.map((sample, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-lightest-grey rounded-[5px] border border-light-grey"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                  ✓
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-navy-darkest font-medium truncate">
                    {sample.fileName}
                  </p>
                  <p className="text-xs text-dark-grey">
                    {formatFileSize(sample.fileSize)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const updated = samples.filter((_, i) => i !== index);
                  onUpload(updated);
                }}
                className="flex-shrink-0 text-xs text-red-600 hover:text-red-800 px-2 py-1"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Hint */}
      {samples.length === 0 && (
        <div className="border-2 border-dashed border-light-grey rounded-[5px] p-8 text-center">
          <p className="text-sm text-dark-grey mb-2">No files uploaded yet</p>
          <p className="text-xs text-dark-grey">
            Accepted formats: PDF, JPG, PNG
          </p>
        </div>
      )}
    </div>
  );
});
