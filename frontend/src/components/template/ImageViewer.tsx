import { memo } from 'react';
import type { UploadedSample } from '../../types/template';

interface ImageViewerProps {
  sample: UploadedSample | null;
  currentSampleIndex?: number;
  totalSamples?: number;
}

export const ImageViewer = memo(function ImageViewer({
  sample,
  currentSampleIndex = 0,
  totalSamples = 0,
}: ImageViewerProps) {
  if (!sample) {
    return (
      <div className="border-2 border-dashed border-light-grey rounded-[5px] p-12 text-center bg-lightest-grey">
        <p className="text-sm text-dark-grey">No sample selected</p>
        <p className="text-xs text-dark-grey mt-2">Upload samples to begin field detection</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-navy-darkest">Document Preview</h3>
          {totalSamples > 0 && (
            <p className="text-xs text-dark-grey mt-1">
              Sample {currentSampleIndex + 1} of {totalSamples}
            </p>
          )}
        </div>
      </div>

      {/* Placeholder Image Area */}
      <div className="border-2 border-light-grey rounded-[5px] bg-white p-8 min-h-[400px] flex flex-col items-center justify-center">
        <div className="text-center space-y-3 max-w-md">
          <div className="w-16 h-16 mx-auto bg-primary-lighter rounded-full flex items-center justify-center">
            <span className="text-2xl">📄</span>
          </div>
          <div>
            <p className="text-sm font-medium text-navy-darkest">{sample.fileName}</p>
            <p className="text-xs text-dark-grey mt-1">
              Image viewer with bounding box overlay will be implemented in Sprint 3
            </p>
          </div>
          <div className="pt-4 border-t border-light-grey">
            <p className="text-xs text-dark-grey">
              For Phase 0, we're using mock field detection.
              <br />
              Real PDF/image rendering + SVG bounding boxes coming soon.
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder Controls */}
      <div className="flex items-center justify-center gap-3">
        <button className="px-3 py-1.5 text-xs border border-navy-dark text-navy-dark rounded-[5px] hover:bg-navy-dark hover:text-white transition-colors">
          Show All
        </button>
        <button className="px-3 py-1.5 text-xs border border-navy-dark text-navy-dark rounded-[5px] hover:bg-navy-dark hover:text-white transition-colors">
          Show Labels
        </button>
        <button className="px-3 py-1.5 text-xs border border-navy-dark text-navy-dark rounded-[5px] hover:bg-navy-dark hover:text-white transition-colors">
          Show Inputs
        </button>
      </div>
    </div>
  );
});
