import { useEffect, memo } from 'react';
import { Input } from '../ui/Input';
import { Select, type SelectOption } from '../ui/Select';
import { Button } from '../ui/Button';

interface VolumeEstimate {
  lobId: string;
  lobName: string;
  expectedMonthlyVolume: number | string;
  peakProcessingPeriod: string;
}

export interface Step5Data {
  skipVolumeEstimate: boolean;
  volumes: VolumeEstimate[];
}

interface Step5VolumeEstimateProps {
  data: Step5Data;
  onChange: (data: Step5Data) => void;
  step1LobCount: number;
}

const PEAK_PERIOD_OPTIONS: SelectOption[] = [
  { value: '', label: 'Select period...' },
  { value: 'monthly-end', label: 'End of Month' },
  { value: 'quarterly-end', label: 'End of Quarter' },
  { value: 'fiscal-year-end', label: 'Fiscal Year End' },
  { value: 'tax-season', label: 'Tax Season' },
  { value: 'holiday-season', label: 'Holiday Season' },
  { value: 'other', label: 'Other' }
];

export const Step5VolumeEstimate = memo(function Step5VolumeEstimate({ data, onChange, step1LobCount }: Step5VolumeEstimateProps) {
  // Initialize volumes array based on Step 1 LOB count
  useEffect(() => {
    if (!data.skipVolumeEstimate && data.volumes.length !== step1LobCount) {
      const newVolumes: VolumeEstimate[] = Array.from({ length: step1LobCount }, (_, i) => {
        // Preserve existing data if available
        if (data.volumes[i]) {
          return data.volumes[i];
        }
        return {
          lobId: `lob-${i + 1}`,
          lobName: '',
          expectedMonthlyVolume: '',
          peakProcessingPeriod: ''
        };
      });

      onChange({
        ...data,
        volumes: newVolumes
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step1LobCount, data.skipVolumeEstimate]); // Don't include data.volumes to avoid infinite loop

  const handleSkipToggle = () => {
    if (!data.skipVolumeEstimate) {
      // Confirm before skipping
      if (confirm('Skip volume estimate? You can add this information later in Settings.')) {
        onChange({
          ...data,
          skipVolumeEstimate: true,
          volumes: []
        });
      }
    } else {
      onChange({
        ...data,
        skipVolumeEstimate: false,
        volumes: Array.from({ length: step1LobCount }, (_, i) => ({
          lobId: `lob-${i + 1}`,
          lobName: '',
          expectedMonthlyVolume: '',
          peakProcessingPeriod: ''
        }))
      });
    }
  };

  const handleVolumeChange = (index: number, field: keyof VolumeEstimate, value: string | number) => {
    const newVolumes = [...data.volumes];
    newVolumes[index] = {
      ...newVolumes[index],
      [field]: value
    };

    onChange({
      ...data,
      volumes: newVolumes
    });
  };

  // Calculate total monthly volume
  const totalVolume = data.volumes.reduce((sum, vol) => {
    const volume = typeof vol.expectedMonthlyVolume === 'string'
      ? parseInt(vol.expectedMonthlyVolume) || 0
      : vol.expectedMonthlyVolume;
    return sum + volume;
  }, 0);

  if (data.skipVolumeEstimate) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 bg-primary-lighter/10 rounded-[5px]">
          <p className="text-sm text-dark-grey mb-4">
            Volume estimate skipped. You can add this information later in Settings.
          </p>
          <Button variant="outline" onClick={handleSkipToggle}>
            Provide Volume Estimate
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-navy-darkest mb-2">Volume Estimate</h2>
        <p className="text-sm text-navy-dark">
          Help us understand your expected document processing volume for capacity planning
        </p>
      </div>

      {/* LOB Sections */}
      <div className="space-y-6">
        {data.volumes.map((volume, index) => (
          <div
            key={volume.lobId}
            className="border border-light-grey rounded-[5px] p-4 bg-white"
          >
            <h3 className="text-sm font-semibold text-navy-darkest mb-4">
              Line of Business {index + 1}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="LOB Name *"
                placeholder="e.g., Traffic Citations"
                value={volume.lobName}
                onChange={(e) => handleVolumeChange(index, 'lobName', e.target.value)}
                required
              />

              <Input
                label="Expected Monthly Volume *"
                type="number"
                placeholder="e.g., 5000"
                value={volume.expectedMonthlyVolume}
                onChange={(e) => handleVolumeChange(index, 'expectedMonthlyVolume', e.target.value)}
                required
                min="0"
              />

              <div className="col-span-2">
                <Select
                  label="Peak Processing Period (Optional)"
                  options={PEAK_PERIOD_OPTIONS}
                  value={volume.peakProcessingPeriod}
                  onChange={(e) => handleVolumeChange(index, 'peakProcessingPeriod', e.target.value)}
                  fullWidth
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total Summary */}
      <div className="bg-primary-lighter/20 p-4 rounded-[5px]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-navy-darkest">Total Monthly Volume</span>
          <span className="text-2xl font-bold text-primary">
            {totalVolume.toLocaleString()} documents
          </span>
        </div>
      </div>

      {/* Skip Option */}
      <div className="text-center pt-4 border-t border-light-grey">
        <button
          type="button"
          onClick={handleSkipToggle}
          className="text-sm text-primary hover:text-primary-medium transition-colors"
        >
          Skip This Step →
        </button>
      </div>
    </div>
  );
});
