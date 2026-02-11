import { Checkbox } from '../ui/Checkbox';
import { Select, type SelectOption } from '../ui/Select';
import { Input } from '../ui/Input';

interface JSONConfig {
  enabled: boolean;
  fileNaming: string;
  includeMetadata: boolean;
  includeConfidenceScores: boolean;
  prettyPrint: boolean;
  indentation: '2-spaces' | '4-spaces' | 'tabs';
  schema: 'json-schema-v7' | 'custom';
  compression: 'none' | 'gzip' | 'zip';
}

interface CSVConfig {
  enabled: boolean;
  fileNaming: string;
  delimiter: 'comma' | 'semicolon' | 'tab';
  includeHeaders: boolean;
  textQualifier: 'double-quotes' | 'single-quotes' | 'none';
  encoding: 'utf-8' | 'utf-16' | 'iso-8859-1';
  escapeSpecialChars: boolean;
}

interface DeliveryConfig {
  method: 'pickup-location' | 's3-bucket' | 'sftp' | 'api-webhook';
  location: string;
  schedule: 'immediate' | 'hourly' | 'daily' | 'weekly' | 'custom';
  notifyOnCompletion: boolean;
}

interface AuditEventConfig {
  eventType: 'drop_off_arrived' | 'left_for_processing' | 'outputs_ready' | 'transferred_to_customer';
  enabled: boolean;
  metadata: string[];
}

export interface Step6Data {
  json: JSONConfig;
  csv: CSVConfig;
  selectedFormats: ('json' | 'csv')[];
  delivery: DeliveryConfig;
  auditTrail: {
    enabled: boolean;
    events: AuditEventConfig[];
    retentionDays: number;
  };
}

interface Step6OutputFormatProps {
  data: Step6Data;
  onChange: (data: Step6Data) => void;
  step1PickupLocation?: string;
}

const DELIVERY_METHOD_OPTIONS: SelectOption[] = [
  { value: 'pickup-location', label: 'Secure Pick-up Location' },
  { value: 's3-bucket', label: 'Amazon S3 Bucket' },
  { value: 'sftp', label: 'SFTP Server' },
  { value: 'api-webhook', label: 'API Webhook' }
];

const DELIVERY_SCHEDULE_OPTIONS: SelectOption[] = [
  { value: 'immediate', label: 'Immediate (as soon as ready)' },
  { value: 'hourly', label: 'Hourly Batch' },
  { value: 'daily', label: 'Daily Batch' },
  { value: 'weekly', label: 'Weekly Batch' },
  { value: 'custom', label: 'Custom Schedule' }
];

export function Step6OutputFormat({ data, onChange, step1PickupLocation }: Step6OutputFormatProps) {
  const handleFormatToggle = (format: 'json' | 'csv', enabled: boolean) => {
    const newSelectedFormats = enabled
      ? [...data.selectedFormats, format]
      : data.selectedFormats.filter(f => f !== format);

    onChange({
      ...data,
      [format]: {
        ...data[format],
        enabled
      },
      selectedFormats: newSelectedFormats
    });
  };

  const handleDeliveryChange = (field: keyof DeliveryConfig, value: string | boolean) => {
    onChange({
      ...data,
      delivery: {
        ...data.delivery,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-navy-darkest mb-2">Output Format</h2>
        <p className="text-sm text-navy-dark">
          Configure how processed documents will be delivered to you
        </p>
      </div>

      {/* JSON Configuration */}
      <div className="border border-light-grey rounded-[5px] p-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-navy-darkest">JSON Output</h3>
          <Checkbox
            id="enable-json"
            checked={data.json.enabled}
            onChange={(e) => handleFormatToggle('json', e.target.checked)}
            label="Enable JSON"
          />
        </div>

        {data.json.enabled && (
          <div className="space-y-4 pt-4 border-t border-light-grey">
            <Input
              label="File Naming Pattern"
              placeholder="e.g., {date}_{batch}_{index}.json"
              value={data.json.fileNaming}
              onChange={(e) => onChange({
                ...data,
                json: { ...data.json, fileNaming: e.target.value }
              })}
            />

            <div className="grid grid-cols-2 gap-4">
              <Checkbox
                id="json-metadata"
                label="Include Metadata"
                checked={data.json.includeMetadata}
                onChange={(e) => onChange({
                  ...data,
                  json: { ...data.json, includeMetadata: e.target.checked }
                })}
              />

              <Checkbox
                id="json-confidence"
                label="Include Confidence Scores"
                checked={data.json.includeConfidenceScores}
                onChange={(e) => onChange({
                  ...data,
                  json: { ...data.json, includeConfidenceScores: e.target.checked }
                })}
              />

              <Checkbox
                id="json-pretty"
                label="Pretty Print"
                checked={data.json.prettyPrint}
                onChange={(e) => onChange({
                  ...data,
                  json: { ...data.json, prettyPrint: e.target.checked }
                })}
              />
            </div>
          </div>
        )}
      </div>

      {/* CSV Configuration */}
      <div className="border border-light-grey rounded-[5px] p-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-navy-darkest">CSV Output</h3>
          <Checkbox
            id="enable-csv"
            checked={data.csv.enabled}
            onChange={(e) => handleFormatToggle('csv', e.target.checked)}
            label="Enable CSV"
          />
        </div>

        {data.csv.enabled && (
          <div className="space-y-4 pt-4 border-t border-light-grey">
            <Input
              label="File Naming Pattern"
              placeholder="e.g., {date}_{batch}_{index}.csv"
              value={data.csv.fileNaming}
              onChange={(e) => onChange({
                ...data,
                csv: { ...data.csv, fileNaming: e.target.value }
              })}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Delimiter"
                options={[
                  { value: 'comma', label: 'Comma (,)' },
                  { value: 'semicolon', label: 'Semicolon (;)' },
                  { value: 'tab', label: 'Tab' }
                ]}
                value={data.csv.delimiter}
                onChange={(e) => onChange({
                  ...data,
                  csv: { ...data.csv, delimiter: e.target.value as CSVConfig['delimiter'] }
                })}
                fullWidth
              />

              <Select
                label="Text Qualifier"
                options={[
                  { value: 'double-quotes', label: 'Double Quotes (")' },
                  { value: 'single-quotes', label: "Single Quotes (')" },
                  { value: 'none', label: 'None' }
                ]}
                value={data.csv.textQualifier}
                onChange={(e) => onChange({
                  ...data,
                  csv: { ...data.csv, textQualifier: e.target.value as CSVConfig['textQualifier'] }
                })}
                fullWidth
              />

              <Checkbox
                id="csv-headers"
                label="Include Headers"
                checked={data.csv.includeHeaders}
                onChange={(e) => onChange({
                  ...data,
                  csv: { ...data.csv, includeHeaders: e.target.checked }
                })}
              />

              <Checkbox
                id="csv-escape"
                label="Escape Special Characters"
                checked={data.csv.escapeSpecialChars}
                onChange={(e) => onChange({
                  ...data,
                  csv: { ...data.csv, escapeSpecialChars: e.target.checked }
                })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Delivery Configuration */}
      <div className="border border-light-grey rounded-[5px] p-4 bg-white">
        <h3 className="text-lg font-semibold text-navy-darkest mb-4">Delivery Settings</h3>

        <div className="space-y-4">
          <Select
            label="Delivery Method"
            options={DELIVERY_METHOD_OPTIONS}
            value={data.delivery.method}
            onChange={(e) => handleDeliveryChange('method', e.target.value)}
            fullWidth
          />

          <Input
            label="Delivery Location"
            placeholder={step1PickupLocation || "Enter location..."}
            value={data.delivery.location}
            onChange={(e) => handleDeliveryChange('location', e.target.value)}
          />

          <Select
            label="Delivery Schedule"
            options={DELIVERY_SCHEDULE_OPTIONS}
            value={data.delivery.schedule}
            onChange={(e) => handleDeliveryChange('schedule', e.target.value)}
            fullWidth
          />

          <Checkbox
            id="notify-completion"
            label="Notify on Completion"
            description="Send email notification when files are ready"
            checked={data.delivery.notifyOnCompletion}
            onChange={(e) => handleDeliveryChange('notifyOnCompletion', e.target.checked)}
          />
        </div>
      </div>

      {/* Audit Trail (Read-Only) */}
      <div className="border-2 border-primary/30 rounded-[5px] p-4 bg-primary-lighter/10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-navy-darkest">Audit Trail</h3>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-[5px]">
            REQUIRED (G9 Compliance)
          </span>
        </div>

        <p className="text-sm text-navy-dark mb-4">
          All document processing events are automatically logged for compliance and auditing purposes.
          This feature cannot be disabled.
        </p>

        <div className="space-y-2">
          {data.auditTrail.events.map((event) => (
            <div
              key={event.eventType}
              className="flex items-center justify-between p-2 bg-white rounded-[5px]"
            >
              <span className="text-sm text-navy-darkest">{event.eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
              <span className="text-xs text-green font-semibold">✓ Enabled</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-navy/10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-navy-darkest">Retention Period</span>
            <span className="text-sm font-bold text-navy-darkest">{data.auditTrail.retentionDays} days</span>
          </div>
        </div>
      </div>

      {/* Validation Warning */}
      {data.selectedFormats.length === 0 && (
        <div className="bg-red/10 border border-red/30 rounded-[5px] p-4">
          <p className="text-sm text-red font-medium">
            ⚠️ Please select at least one output format (JSON or CSV) to proceed
          </p>
        </div>
      )}
    </div>
  );
}
