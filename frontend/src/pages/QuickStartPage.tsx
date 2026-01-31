import { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import { Navigation } from '../components/ui/Navigation';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { CountrySelect } from '../components/ui/CountrySelect';

interface BusinessRule {
  id: string;
  name: string;
  description: string;
  documentTypes: string[];
  fileTypes: string[];
  rules: string;
  logic: string;
  isExpanded: boolean;
}

interface LineOfBusiness {
  id: string;
  name: string;
  monthlyVolume: string;
  annualVolume: string;
  peakMonths: string[];
}

interface FormData {
  // Step 1: Company Info
  companyName: string;
  sector: string;
  region: string;
  country: string;
  numberOfLOB: number;
  contact1Name: string;
  contact1Email: string;
  contact1Cell: string;
  contact2Name: string;
  contact2Email: string;
  contact2Cell: string;
  secureDropLocation: string;
  securePickupLocation: string;

  // Step 2: Template Selection
  template: string;

  // Step 3: Document Types
  documentTypes: {
    [key: string]: {
      selected: boolean;
      fileFormats: string[];
    };
  };

  // Step 4: Business Rules
  businessRules: BusinessRule[];

  // Step 5: Volume Expectations
  linesOfBusiness: LineOfBusiness[];

  // Step 6: Output Format
  outputFormat: string;
  structuredData: boolean;
}

const STEPS = [
  { id: 1, title: 'Company Info', description: 'Tell us about your organization' },
  { id: 2, title: 'Template Selection', description: 'Choose a pre-built workflow template' },
  { id: 3, title: 'Document Types', description: 'What types of documents will you process?' },
  { id: 4, title: 'Business Rules', description: 'Define rules for document processing' },
  { id: 5, title: 'Volume Expectations', description: 'Help us scale your workflow' },
  { id: 6, title: 'Output Format', description: 'How would you like your data?' },
];

const DOCUMENT_TYPES = [
  'Invoices',
  'Forms',
  'Contracts',
  'Receipts',
  'Handwritten Notes',
  'Medical Records',
  'ID Documents',
];

const FILE_FORMATS = ['PDF', 'JPEG', 'PNG', 'TIFF', 'CSV'];

const DROPDOWN_ARROW_SVG = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2307464C' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`;

const TEMPLATES = [
  {
    id: 'banking',
    name: 'Banking & Finance',
    description: 'Pre-configured for financial documents',
    steps: ['Company Info', 'Document Types', 'Business Rules', 'Volumes', 'Outputs'],
  },
  {
    id: 'insurance',
    name: 'Insurance Claims',
    description: 'Optimized for insurance workflows',
    steps: ['Company Info', 'Document Types', 'Business Rules', 'Volumes', 'Outputs'],
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'HIPAA-compliant medical records processing',
    steps: ['Company Info', 'Document Types', 'Business Rules', 'Volumes', 'Outputs'],
  },
  {
    id: 'government',
    name: 'Government',
    description: 'Public sector document management',
    steps: ['Company Info', 'Document Types', 'Business Rules', 'Volumes', 'Outputs'],
  },
  {
    id: 'scratch',
    name: 'Start from Scratch',
    description: 'Build a custom workflow from the ground up',
    steps: ['Custom Configuration'],
  },
];

export function QuickStartPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showTemplatePreview, setShowTemplatePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    sector: '',
    region: '',
    country: '',
    numberOfLOB: 1,
    contact1Name: '',
    contact1Email: '',
    contact1Cell: '',
    contact2Name: '',
    contact2Email: '',
    contact2Cell: '',
    secureDropLocation: '',
    securePickupLocation: '',
    template: '',
    documentTypes: DOCUMENT_TYPES.reduce((acc, type) => ({
      ...acc,
      [type]: { selected: false, fileFormats: [] },
    }), {}),
    businessRules: [
      {
        id: '1',
        name: 'Document Classification Rule',
        description: 'Automatically classify documents based on content patterns',
        documentTypes: ['Invoices', 'Forms'],
        fileTypes: ['PDF', 'TIFF'],
        rules: 'If document contains invoice number field, classify as Invoice',
        logic: '// Example classification logic\nif (document.hasField("invoiceNumber")) {\n  return "Invoice";\n}',
        isExpanded: true,
      },
    ],
    linesOfBusiness: [
      { id: '1', name: '', monthlyVolume: '', annualVolume: '', peakMonths: [] },
    ],
    outputFormat: '',
    structuredData: false,
  });

  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Wizard complete:', formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const addBusinessRule = () => {
    const newRule: BusinessRule = {
      id: Date.now().toString(),
      name: '',
      description: '',
      documentTypes: [],
      fileTypes: [],
      rules: '',
      logic: '',
      isExpanded: true,
    };
    updateFormData('businessRules', [...formData.businessRules, newRule]);
  };

  const updateBusinessRule = (id: string, field: string, value: any) => {
    updateFormData(
      'businessRules',
      formData.businessRules.map((rule) =>
        rule.id === id ? { ...rule, [field]: value } : rule
      )
    );
  };

  const deleteBusinessRule = (id: string) => {
    updateFormData(
      'businessRules',
      formData.businessRules.filter((rule) => rule.id !== id)
    );
  };

  const toggleRuleExpanded = (id: string) => {
    updateFormData(
      'businessRules',
      formData.businessRules.map((rule) =>
        rule.id === id ? { ...rule, isExpanded: !rule.isExpanded } : rule
      )
    );
  };

  const updateLOB = (id: string, field: string, value: any) => {
    updateFormData(
      'linesOfBusiness',
      formData.linesOfBusiness.map((lob) =>
        lob.id === id ? { ...lob, [field]: value } : lob
      )
    );
  };

  const selectStyles = {
    backgroundImage: DROPDOWN_ARROW_SVG,
    backgroundPosition: 'right 0.75rem center',
    backgroundRepeat: 'no-repeat' as const,
    backgroundSize: '1.25em 1.25em',
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Input
              label="Company Name *"
              value={formData.companyName}
              onChange={(e) => updateFormData('companyName', e.target.value)}
              placeholder="Enter your company name"
            />

            <div>
              <label className="block text-sm font-medium text-navy-darkest mb-2">
                Industry Sector *
              </label>
              <select
                value={formData.sector}
                onChange={(e) => updateFormData('sector', e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-navy-dark bg-white text-navy-darkest focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                style={selectStyles}
              >
                <option value="">Select an industry</option>
                <option value="banking">Banking & Finance</option>
                <option value="insurance">Insurance</option>
                <option value="healthcare">Healthcare</option>
                <option value="government">Government & Public Sector</option>
                <option value="legal">Legal Services</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-darkest mb-2">
                Primary Region *
              </label>
              <select
                value={formData.region}
                onChange={(e) => updateFormData('region', e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-navy-dark bg-white text-navy-darkest focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                style={selectStyles}
              >
                <option value="">Select a region</option>
                <option value="north-america">North America</option>
                <option value="europe">Europe</option>
                <option value="asia-pacific">Asia Pacific</option>
                <option value="latin-america">Latin America</option>
                <option value="middle-east-africa">Middle East & Africa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-darkest mb-2">
                Country *
              </label>
              <CountrySelect
                value={formData.country}
                onChange={(value) => updateFormData('country', value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-darkest mb-2">
                No. of Lines of Business Being Processed *
              </label>
              <input
                type="number"
                min="1"
                value={formData.numberOfLOB}
                onChange={(e) => {
                  const num = parseInt(e.target.value) || 1;
                  updateFormData('numberOfLOB', num);
                  // Adjust LOB array to match
                  const currentLOBs = formData.linesOfBusiness;
                  if (num > currentLOBs.length) {
                    const newLOBs = [...currentLOBs];
                    for (let i = currentLOBs.length; i < num; i++) {
                      newLOBs.push({
                        id: (i + 1).toString(),
                        name: '',
                        monthlyVolume: '',
                        annualVolume: '',
                        peakMonths: [],
                      });
                    }
                    updateFormData('linesOfBusiness', newLOBs);
                  } else if (num < currentLOBs.length) {
                    updateFormData('linesOfBusiness', currentLOBs.slice(0, num));
                  }
                }}
                className="w-full px-4 py-3 rounded-md border border-navy-dark bg-white text-navy-darkest focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Primary Contact 1 - Name *"
                value={formData.contact1Name}
                onChange={(e) => updateFormData('contact1Name', e.target.value)}
                placeholder="Full name"
              />
              <Input
                label="Primary Contact 1 - Email *"
                type="email"
                value={formData.contact1Email}
                onChange={(e) => updateFormData('contact1Email', e.target.value)}
                placeholder="email@company.com"
              />
              <Input
                label="Primary Contact 1 - Cell *"
                type="tel"
                value={formData.contact1Cell}
                onChange={(e) => updateFormData('contact1Cell', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Primary Contact 2 - Name"
                value={formData.contact2Name}
                onChange={(e) => updateFormData('contact2Name', e.target.value)}
                placeholder="Full name"
              />
              <Input
                label="Primary Contact 2 - Email"
                type="email"
                value={formData.contact2Email}
                onChange={(e) => updateFormData('contact2Email', e.target.value)}
                placeholder="email@company.com"
              />
              <Input
                label="Primary Contact 2 - Cell"
                type="tel"
                value={formData.contact2Cell}
                onChange={(e) => updateFormData('contact2Cell', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <Input
              label="Secured Drop-off Location (Files) *"
              value={formData.secureDropLocation}
              onChange={(e) => updateFormData('secureDropLocation', e.target.value)}
              placeholder="s3://bucket-name/drop-off or https://storage.example.com/drop"
            />

            <Input
              label="Secure Pick-up Location (Files) *"
              value={formData.securePickupLocation}
              onChange={(e) => updateFormData('securePickupLocation', e.target.value)}
              placeholder="s3://bucket-name/pickup or https://storage.example.com/pickup"
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <p className="text-navy-dark mb-6">
              Choose a pre-built workflow template optimized for your industry, or start from scratch:
            </p>
            <div className="grid grid-cols-2 gap-4">
              {TEMPLATES.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all border-2 ${
                    formData.template === template.id
                      ? 'border-primary bg-primary-lighter/20'
                      : 'border-light-grey hover:border-primary-medium'
                  }`}
                  onClick={() => updateFormData('template', template.id)}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      checked={formData.template === template.id}
                      onChange={() => updateFormData('template', template.id)}
                      className="mt-1 w-5 h-5 text-primary focus:ring-primary"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-navy-darkest">{template.name}</h3>
                      <p className="text-sm text-navy-dark mt-1">{template.description}</p>
                      {formData.template === template.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowTemplatePreview(template.id);
                          }}
                          className="mt-2 text-sm text-primary hover:underline"
                        >
                          View included steps →
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {showTemplatePreview && (
              <Card className="bg-primary-lighter/10 border-primary">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-navy-darkest">
                    {TEMPLATES.find((t) => t.id === showTemplatePreview)?.name} - Included Steps
                  </h4>
                  <button
                    onClick={() => setShowTemplatePreview(null)}
                    className="text-navy-dark hover:text-navy-darkest"
                  >
                    ✕
                  </button>
                </div>
                <ul className="space-y-1">
                  {TEMPLATES.find((t) => t.id === showTemplatePreview)?.steps.map((step, index) => (
                    <li key={index} className="text-sm text-navy-dark flex items-center">
                      <span className="text-primary mr-2">✓</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <p className="text-navy-dark mb-4">
              Select the document types you need to process and their file formats:
            </p>
            <div className="space-y-3">
              {DOCUMENT_TYPES.map((type) => (
                <div key={type} className="border border-light-grey rounded-md p-4">
                  <label className="flex items-center space-x-3 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={formData.documentTypes[type].selected}
                      onChange={(e) => {
                        updateFormData('documentTypes', {
                          ...formData.documentTypes,
                          [type]: {
                            ...formData.documentTypes[type],
                            selected: e.target.checked,
                          },
                        });
                      }}
                      className="w-5 h-5 rounded border-navy-dark text-primary focus:ring-primary"
                    />
                    <span className="font-medium text-navy-darkest">{type}</span>
                  </label>
                  {formData.documentTypes[type].selected && (
                    <div className="ml-8 flex flex-wrap gap-3">
                      {FILE_FORMATS.map((format) => (
                        <label key={format} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.documentTypes[type].fileFormats.includes(format)}
                            onChange={(e) => {
                              const formats = formData.documentTypes[type].fileFormats;
                              const newFormats = e.target.checked
                                ? [...formats, format]
                                : formats.filter((f) => f !== format);
                              updateFormData('documentTypes', {
                                ...formData.documentTypes,
                                [type]: {
                                  ...formData.documentTypes[type],
                                  fileFormats: newFormats,
                                },
                              });
                            }}
                            className="w-4 h-4 rounded border-navy-dark text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-navy-darkest">{format}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <p className="text-navy-dark mb-4">
              Define business rules for document processing. Rules can be added, edited, or removed:
            </p>
            <div className="space-y-3">
              {formData.businessRules.map((rule) => (
                <Card
                  key={rule.id}
                  className="border-2 border-light-grey hover:border-primary-medium transition-all"
                >
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleRuleExpanded(rule.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-primary font-bold">
                        {rule.isExpanded ? '▼' : '▶'}
                      </span>
                      <h4 className="font-semibold text-navy-darkest">
                        {rule.name || 'Untitled Rule'}
                      </h4>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBusinessRule(rule.id);
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>

                  {rule.isExpanded && (
                    <div className="mt-4 space-y-4">
                      <Input
                        label="Rule Name *"
                        value={rule.name}
                        onChange={(e) => updateBusinessRule(rule.id, 'name', e.target.value)}
                        placeholder="e.g., Invoice Validation"
                      />

                      <div>
                        <label className="block text-sm font-medium text-navy-darkest mb-2">
                          Description
                        </label>
                        <textarea
                          value={rule.description}
                          onChange={(e) =>
                            updateBusinessRule(rule.id, 'description', e.target.value)
                          }
                          placeholder="Describe what this rule does..."
                          rows={2}
                          className="w-full px-4 py-3 rounded-md border border-navy-dark bg-white text-navy-darkest focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-navy-darkest mb-2">
                          Document Types *
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {DOCUMENT_TYPES.map((type) => (
                            <label
                              key={type}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={rule.documentTypes.includes(type)}
                                onChange={(e) => {
                                  const types = e.target.checked
                                    ? [...rule.documentTypes, type]
                                    : rule.documentTypes.filter((t) => t !== type);
                                  updateBusinessRule(rule.id, 'documentTypes', types);
                                }}
                                className="w-4 h-4 rounded border-navy-dark text-primary focus:ring-primary"
                              />
                              <span className="text-sm text-navy-darkest">{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-navy-darkest mb-2">
                          File Types *
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {FILE_FORMATS.map((format) => (
                            <label
                              key={format}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={rule.fileTypes.includes(format)}
                                onChange={(e) => {
                                  const types = e.target.checked
                                    ? [...rule.fileTypes, format]
                                    : rule.fileTypes.filter((t) => t !== format);
                                  updateBusinessRule(rule.id, 'fileTypes', types);
                                }}
                                className="w-4 h-4 rounded border-navy-dark text-primary focus:ring-primary"
                              />
                              <span className="text-sm text-navy-darkest">{format}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-navy-darkest mb-2">
                          Rules *
                        </label>
                        <textarea
                          value={rule.rules}
                          onChange={(e) => updateBusinessRule(rule.id, 'rules', e.target.value)}
                          placeholder="e.g., Add field1 + field2 to equal total"
                          rows={2}
                          className="w-full px-4 py-3 rounded-md border border-navy-dark bg-white text-navy-darkest focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-navy-darkest mb-2">
                          Logic (Code)
                        </label>
                        <div className="border border-navy-dark rounded-md overflow-hidden">
                          <Editor
                            value={rule.logic}
                            onValueChange={(code) =>
                              updateBusinessRule(rule.id, 'logic', code)
                            }
                            highlight={(code) => highlight(code, languages.javascript, 'javascript')}
                            padding={12}
                            style={{
                              fontFamily: '"Fira code", "Fira Mono", monospace',
                              fontSize: 14,
                              backgroundColor: '#f5f5f5',
                              minHeight: '120px',
                            }}
                            placeholder="// Write your logic here..."
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}

              <button
                onClick={addBusinessRule}
                className="w-full py-3 border-2 border-dashed border-primary text-primary font-medium rounded-md hover:bg-primary-lighter/10 transition-all"
              >
                + Add Another Rule
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <p className="text-navy-dark mb-4">
              Define volume expectations for each line of business:
            </p>
            {formData.linesOfBusiness.map((lob, index) => (
              <Card key={lob.id} className="border-2 border-light-grey">
                <h4 className="font-semibold text-navy-darkest mb-4">
                  Line of Business {index + 1}
                </h4>
                <div className="space-y-4">
                  <Input
                    label="Name *"
                    value={lob.name}
                    onChange={(e) => updateLOB(lob.id, 'name', e.target.value)}
                    placeholder="e.g., Retail Banking, Claims Processing"
                  />

                  <div>
                    <label className="block text-sm font-medium text-navy-darkest mb-2">
                      Expected Monthly Volume *
                    </label>
                    <select
                      value={lob.monthlyVolume}
                      onChange={(e) => updateLOB(lob.id, 'monthlyVolume', e.target.value)}
                      className="w-full px-4 py-3 rounded-md border border-navy-dark bg-white text-navy-darkest focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                      style={selectStyles}
                    >
                      <option value="">Select volume range</option>
                      <option value="0-10k">0 - 10,000 documents</option>
                      <option value="10k-100k">10,000 - 100,000 documents</option>
                      <option value="100k-1m">100,000 - 1M documents</option>
                      <option value="1m-5m">1M - 5M documents</option>
                      <option value="5m+">5M+ documents</option>
                    </select>
                  </div>

                  <Input
                    label="Expected Annual Volume *"
                    value={lob.annualVolume}
                    onChange={(e) => updateLOB(lob.id, 'annualVolume', e.target.value)}
                    placeholder="e.g., 2,500,000"
                  />

                  <div>
                    <label className="block text-sm font-medium text-navy-darkest mb-2">
                      Peak Processing Months
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
                        (month) => (
                          <label key={month} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={lob.peakMonths.includes(month)}
                              onChange={(e) => {
                                const months = e.target.checked
                                  ? [...lob.peakMonths, month]
                                  : lob.peakMonths.filter((m) => m !== month);
                                updateLOB(lob.id, 'peakMonths', months);
                              }}
                              className="w-4 h-4 rounded border-navy-dark text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-navy-darkest">{month}</span>
                          </label>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-navy-darkest mb-2">
                Preferred Output Format *
              </label>
              <select
                value={formData.outputFormat}
                onChange={(e) => updateFormData('outputFormat', e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-navy-dark bg-white text-navy-darkest focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                style={selectStyles}
              >
                <option value="">Select format</option>
                <option value="json">JSON (structured data)</option>
                <option value="csv">CSV (tabular data)</option>
                <option value="xml">XML (enterprise systems)</option>
                <option value="txt">Plain Text</option>
              </select>
            </div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.structuredData}
                onChange={(e) => updateFormData('structuredData', e.target.checked)}
                className="w-5 h-5 rounded border-navy-dark text-primary focus:ring-primary"
              />
              <span className="text-navy-darkest">
                Extract structured data (key-value pairs, tables)
              </span>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepSummary = (step: number) => {
    switch (step) {
      case 1:
        return formData.companyName || formData.sector
          ? [
              formData.companyName && `Company: ${formData.companyName}`,
              formData.sector && `Sector: ${formData.sector}`,
              formData.region && `Region: ${formData.region}`,
            ].filter(Boolean)
          : null;
      case 2:
        return formData.template
          ? [`Template: ${TEMPLATES.find((t) => t.id === formData.template)?.name}`]
          : null;
      case 3:
        const selectedDocs = Object.entries(formData.documentTypes)
          .filter(([_, data]) => data.selected)
          .map(([type]) => type);
        return selectedDocs.length > 0
          ? [`Selected: ${selectedDocs.join(', ')}`]
          : null;
      case 4:
        return formData.businessRules.length > 0
          ? [`${formData.businessRules.length} rule(s) defined`]
          : null;
      case 5:
        const definedLOBs = formData.linesOfBusiness.filter((lob) => lob.name);
        return definedLOBs.length > 0
          ? [`${definedLOBs.length} line(s) of business`]
          : null;
      case 6:
        return formData.outputFormat
          ? [`Format: ${formData.outputFormat.toUpperCase()}`]
          : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="flex">
        {/* Main Form Area - 65% */}
        <div className="w-[65%] p-8 bg-white">
          <div className="max-w-3xl">
            {/* Horizontal Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                {STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center flex-1">
                    <button
                      onClick={() => goToStep(step.id)}
                      disabled={step.id > currentStep}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        step.id < currentStep
                          ? 'bg-primary text-white cursor-pointer hover:bg-primary-medium'
                          : step.id === currentStep
                          ? 'bg-primary text-white'
                          : 'bg-light-grey text-dark-grey cursor-not-allowed'
                      }`}
                    >
                      {step.id < currentStep ? '✓' : step.id}
                    </button>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2 ${
                          step.id < currentStep ? 'bg-primary' : 'bg-light-grey'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-navy-dark text-center">
                Step {currentStep} of {STEPS.length}
              </p>
            </div>

            {/* Step Content */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-navy-darkest mb-2">
                {STEPS[currentStep - 1].title}
              </h1>
              <p className="text-navy-dark mb-8">{STEPS[currentStep - 1].description}</p>

              <div className="bg-lightest-grey rounded-lg p-6 border border-light-grey">
                {renderStepContent()}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                Back
              </Button>
              <Button onClick={handleNext}>
                {currentStep === 6 ? 'Finish Setup' : 'Next'}
              </Button>
            </div>
          </div>
        </div>

        {/* Side Panel - 35% */}
        <div className="w-[35%] bg-[#efefef] p-8 border-l border-light-grey">
          <h2 className="text-xl font-bold text-navy-darkest mb-6">Setup Progress</h2>

          <div className="space-y-4">
            {STEPS.map((step) => {
              const summary = getStepSummary(step.id);
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              const isLocked = step.id > currentStep;

              return (
                <Card
                  key={step.id}
                  className={`transition-all ${
                    isCompleted
                      ? 'border-primary bg-white cursor-pointer hover:border-primary-medium'
                      : isCurrent
                      ? 'border-primary border-2 bg-white'
                      : 'border-light-grey opacity-50 bg-white'
                  }`}
                  onClick={() => isCompleted && goToStep(step.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                        isCompleted
                          ? 'bg-primary text-white'
                          : isCurrent
                          ? 'bg-primary text-white'
                          : 'bg-light-grey text-dark-grey'
                      }`}
                    >
                      {isCompleted ? '✓' : step.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-semibold ${
                          isLocked ? 'text-dark-grey' : 'text-navy-darkest'
                        }`}
                      >
                        {step.title}
                      </h3>
                      {isCurrent && (
                        <p className="text-sm text-primary font-medium mt-1">→ In Progress</p>
                      )}
                      {isCompleted && summary && (
                        <div className="mt-2 space-y-1">
                          {summary.map((item, index) => (
                            <p key={index} className="text-sm text-navy-dark">
                              {item}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
