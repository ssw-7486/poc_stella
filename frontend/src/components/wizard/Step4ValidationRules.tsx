import { memo } from 'react';
import { Toggle } from '../ui/Toggle';
import { Slider } from '../ui/Slider';
import { Checkbox } from '../ui/Checkbox';
import { Accordion, type AccordionItem } from '../ui/Accordion';
import { Button } from '../ui/Button';
import type { Step3Data } from './Step3DocumentTypes';

interface ValidationRule {
  id: string;
  fieldId: string;
  fieldName: string;
  ruleType: 'format' | 'range' | 'custom';
  ruleConfig: string;
  action: 'flag_for_review' | 'block' | 'warn';
  enabled: boolean;
}

interface ExternalValidationConfig {
  fieldId: string;
  fieldName: string;
  validationType: 'zip_code' | 'country_code' | 'state_code' | 'custom';
  enabled: boolean;
}

interface TemplateValidation {
  requiredFields: string[];
  validationRules: ValidationRule[];
  externalValidation: ExternalValidationConfig[];
}

export interface Step4Data {
  enableValidation: boolean;
  globalSettings: {
    confidenceThreshold: number;
    enableExternalValidation: boolean;
  };
  templateValidation: Record<string, TemplateValidation>;
}

interface Step4ValidationRulesProps {
  data: Step4Data;
  onChange: (data: Step4Data) => void;
  step3Data: Step3Data;
}

export const Step4ValidationRules = memo(function Step4ValidationRules({ data, onChange, step3Data }: Step4ValidationRulesProps) {
  const selectedTemplates = step3Data.documentTemplates.filter(t =>
    step3Data.selectedTemplateIds.includes(t.id)
  );

  const handleEnableValidationChange = (enabled: boolean) => {
    onChange({
      ...data,
      enableValidation: enabled
    });
  };

  const handleConfidenceThresholdChange = (threshold: number) => {
    onChange({
      ...data,
      globalSettings: {
        ...data.globalSettings,
        confidenceThreshold: threshold
      }
    });
  };

  const handleEnableRAGChange = (enabled: boolean) => {
    onChange({
      ...data,
      globalSettings: {
        ...data.globalSettings,
        enableExternalValidation: enabled
      }
    });
  };

  const handleRequiredFieldToggle = (templateId: string, fieldName: string) => {
    const templateConfig = data.templateValidation[templateId] || {
      requiredFields: [],
      validationRules: [],
      externalValidation: []
    };

    const requiredFields = templateConfig.requiredFields.includes(fieldName)
      ? templateConfig.requiredFields.filter(f => f !== fieldName)
      : [...templateConfig.requiredFields, fieldName];

    onChange({
      ...data,
      templateValidation: {
        ...data.templateValidation,
        [templateId]: {
          ...templateConfig,
          requiredFields
        }
      }
    });
  };

  const handleEditRule = () => {
    alert('Feature coming soon: Validation rule editor');
  };

  const handleAddRule = () => {
    alert('Feature coming soon: Add new validation rule');
  };

  const handleAddExternalValidation = () => {
    alert('Feature coming soon: Add external validation');
  };

  // Generate accordion items for each selected template
  const accordionItems: AccordionItem[] = selectedTemplates.map((template, index) => {
    const templateConfig = data.templateValidation[template.id] || {
      requiredFields: [],
      validationRules: [],
      externalValidation: []
    };

    // Mock field list based on template
    const fields = Array.from({ length: template.fieldsDetected }, (_, i) => ({
      id: `field-${i + 1}`,
      name: `Field ${i + 1}`
    }));

    return {
      id: template.id,
      defaultOpen: index === 0, // First template expanded by default
      title: (
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-semibold text-navy-darkest">{template.name}</span>
          <span className="text-xs text-dark-grey">
            {templateConfig.requiredFields.length} required •{' '}
            {templateConfig.validationRules.length} rules
          </span>
        </div>
      ),
      content: (
        <div className="space-y-6">
          {/* Required Fields */}
          <div>
            <h4 className="text-sm font-semibold text-navy-darkest mb-3">Required Fields</h4>
            <div className="grid grid-cols-2 gap-2">
              {fields.map((field) => (
                <Checkbox
                  key={field.id}
                  id={`${template.id}-${field.id}`}
                  label={field.name}
                  checked={templateConfig.requiredFields.includes(field.name)}
                  onChange={() => handleRequiredFieldToggle(template.id, field.name)}
                />
              ))}
            </div>
          </div>

          {/* Validation Rules */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-navy-darkest">Validation Rules</h4>
              <Button variant="outline" onClick={handleAddRule} className="text-xs px-3 py-1">
                + Add Rule
              </Button>
            </div>
            {templateConfig.validationRules.length > 0 ? (
              <div className="space-y-2">
                {templateConfig.validationRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between p-2 border border-light-grey rounded-[5px]"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-navy-darkest">{rule.fieldName}</div>
                      <div className="text-xs text-dark-grey">
                        {rule.ruleType} • {rule.action}
                      </div>
                    </div>
                    <Button variant="outline" onClick={handleEditRule} className="text-xs px-2 py-1">
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-dark-grey">No validation rules configured</p>
            )}
          </div>

          {/* External Validation (RAG) */}
          {data.globalSettings.enableExternalValidation && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-navy-darkest">External Validation (RAG)</h4>
                <Button variant="outline" onClick={handleAddExternalValidation} className="text-xs px-3 py-1">
                  + Add
                </Button>
              </div>
              {templateConfig.externalValidation.length > 0 ? (
                <div className="space-y-2">
                  {templateConfig.externalValidation.map((config) => (
                    <div
                      key={config.fieldId}
                      className="flex items-center justify-between p-2 border border-light-grey rounded-[5px]"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-navy-darkest">{config.fieldName}</div>
                        <div className="text-xs text-dark-grey">{config.validationType}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-dark-grey">No external validation configured</p>
              )}
            </div>
          )}
        </div>
      )
    };
  });

  return (
    <div className="space-y-8">
      {/* Global Settings */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-navy-darkest">Global Settings</h2>
        <p className="text-sm text-navy-dark">
          These settings apply to all templates in this workflow
        </p>

        <div className="space-y-6 bg-primary-lighter/20 p-4 rounded-[5px]">
          <Toggle
            id="enable-validation"
            checked={data.enableValidation}
            onChange={handleEnableValidationChange}
            label="Enable Validation"
            description="Apply validation rules to extracted data before export"
          />

          {data.enableValidation && (
            <>
              <Slider
                id="confidence-threshold"
                label="Confidence Threshold"
                min={50}
                max={100}
                value={data.globalSettings.confidenceThreshold}
                onChange={handleConfidenceThresholdChange}
                unit="%"
                marks={[
                  { value: 50, label: '50%' },
                  { value: 75, label: '75%' },
                  { value: 100, label: '100%' }
                ]}
              />

              <Toggle
                id="enable-rag"
                checked={data.globalSettings.enableExternalValidation}
                onChange={handleEnableRAGChange}
                label="Enable External Validation (RAG)"
                description="Validate extracted data against external databases (ZIP codes, state codes, etc.)"
              />
            </>
          )}
        </div>
      </div>

      {/* Per-Template Validation */}
      {data.enableValidation && selectedTemplates.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-navy-darkest">Per-Template Validation</h2>
          <p className="text-sm text-navy-dark">
            Configure validation rules for each document template
          </p>

          <Accordion items={accordionItems} allowMultiple={false} />
        </div>
      )}

      {/* Empty State */}
      {data.enableValidation && selectedTemplates.length === 0 && (
        <div className="text-center py-8 bg-primary-lighter/10 rounded-[5px]">
          <p className="text-sm text-dark-grey">
            No templates selected in Step 3. Please go back and select templates to configure validation.
          </p>
        </div>
      )}
    </div>
  );
});
