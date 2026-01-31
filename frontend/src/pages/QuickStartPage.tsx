import { useState } from 'react';
import { Navigation } from '../components/ui/Navigation';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

interface FormData {
  companyName: string;
  industry: string;
  region: string;
  documentTypes: string[];
  monthlyVolume: string;
  peakMonths: string[];
  outputFormat: string;
  structuredData: boolean;
  template: string;
}

const STEPS = [
  { id: 1, title: 'Company Info', description: 'Tell us about your organization' },
  { id: 2, title: 'Document Types', description: 'What types of documents will you process?' },
  { id: 3, title: 'Volume Expectations', description: 'Help us scale your workflow' },
  { id: 4, title: 'Output Format', description: 'How would you like your data?' },
  { id: 5, title: 'Template Selection', description: 'Choose a workflow template' },
];

export function QuickStartPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    industry: '',
    region: '',
    documentTypes: [],
    monthlyVolume: '',
    peakMonths: [],
    outputFormat: '',
    structuredData: false,
    template: '',
  });

  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle finish - navigate to workflow editor or dashboard
      console.log('Wizard complete:', formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    // Only allow navigating to current or previous steps
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Input
              label="Company Name"
              value={formData.companyName}
              onChange={(e) => updateFormData('companyName', e.target.value)}
              placeholder="Enter your company name"
            />
            <div>
              <label className="block text-sm font-medium text-navy-darkest mb-2">
                Industry Sector
              </label>
              <select
                value={formData.industry}
                onChange={(e) => updateFormData('industry', e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-navy-dark bg-white text-navy-darkest focus:outline-none focus:ring-2 focus:ring-primary"
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
                Primary Region
              </label>
              <select
                value={formData.region}
                onChange={(e) => updateFormData('region', e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-navy-dark bg-white text-navy-darkest focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a region</option>
                <option value="north-america">North America</option>
                <option value="europe">Europe</option>
                <option value="asia-pacific">Asia Pacific</option>
                <option value="latin-america">Latin America</option>
                <option value="middle-east-africa">Middle East & Africa</option>
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <p className="text-navy-dark">Select the document types you need to process:</p>
            <div className="space-y-3">
              {['Invoices', 'Forms', 'Contracts', 'Receipts', 'Handwritten Notes', 'Medical Records', 'ID Documents'].map((type) => (
                <label key={type} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.documentTypes.includes(type)}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...formData.documentTypes, type]
                        : formData.documentTypes.filter((t) => t !== type);
                      updateFormData('documentTypes', newTypes);
                    }}
                    className="w-5 h-5 rounded border-navy-dark text-primary focus:ring-primary"
                  />
                  <span className="text-navy-darkest">{type}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-navy-darkest mb-2">
                Expected Monthly Volume
              </label>
              <select
                value={formData.monthlyVolume}
                onChange={(e) => updateFormData('monthlyVolume', e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-navy-dark bg-white text-navy-darkest focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select volume range</option>
                <option value="0-10k">0 - 10,000 documents</option>
                <option value="10k-100k">10,000 - 100,000 documents</option>
                <option value="100k-1m">100,000 - 1M documents</option>
                <option value="1m-5m">1M - 5M documents</option>
                <option value="5m+">5M+ documents</option>
              </select>
            </div>
            <div>
              <p className="text-sm font-medium text-navy-darkest mb-2">
                Peak Processing Months (optional)
              </p>
              <div className="grid grid-cols-3 gap-2">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                  <label key={month} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.peakMonths.includes(month)}
                      onChange={(e) => {
                        const newMonths = e.target.checked
                          ? [...formData.peakMonths, month]
                          : formData.peakMonths.filter((m) => m !== month);
                        updateFormData('peakMonths', newMonths);
                      }}
                      className="w-4 h-4 rounded border-navy-dark text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-navy-darkest">{month}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-navy-darkest mb-2">
                Preferred Output Format
              </label>
              <select
                value={formData.outputFormat}
                onChange={(e) => updateFormData('outputFormat', e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-navy-dark bg-white text-navy-darkest focus:outline-none focus:ring-2 focus:ring-primary"
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
      case 5:
        return (
          <div className="space-y-4">
            <p className="text-navy-dark mb-6">
              Choose a pre-built workflow template or start from scratch:
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'banking', name: 'Banking & Finance', description: 'Invoices, statements, compliance docs' },
                { id: 'insurance', name: 'Insurance Claims', description: 'Forms, medical records, ID verification' },
                { id: 'healthcare', name: 'Healthcare', description: 'Patient records, prescriptions, forms' },
                { id: 'blank', name: 'Start from Scratch', description: 'Build a custom workflow' },
              ].map((template) => (
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
                    <div>
                      <h3 className="font-semibold text-navy-darkest">{template.name}</h3>
                      <p className="text-sm text-navy-dark mt-1">{template.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getStepSummary = (step: number) => {
    switch (step) {
      case 1:
        return formData.companyName || formData.industry || formData.region
          ? [
              formData.companyName && `Company: ${formData.companyName}`,
              formData.industry && `Industry: ${formData.industry}`,
              formData.region && `Region: ${formData.region}`,
            ].filter(Boolean)
          : null;
      case 2:
        return formData.documentTypes.length > 0
          ? [`Selected: ${formData.documentTypes.join(', ')}`]
          : null;
      case 3:
        return formData.monthlyVolume || formData.peakMonths.length > 0
          ? [
              formData.monthlyVolume && `Volume: ${formData.monthlyVolume}`,
              formData.peakMonths.length > 0 && `Peak months: ${formData.peakMonths.join(', ')}`,
            ].filter(Boolean)
          : null;
      case 4:
        return formData.outputFormat || formData.structuredData
          ? [
              formData.outputFormat && `Format: ${formData.outputFormat.toUpperCase()}`,
              formData.structuredData && 'Structured data: Yes',
            ].filter(Boolean)
          : null;
      case 5:
        return formData.template
          ? [`Template: ${formData.template}`]
          : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-lightest-grey">
      <Navigation />

      <div className="flex">
        {/* Main Form Area - 65% */}
        <div className="w-[65%] p-8">
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
                      <div className={`flex-1 h-1 mx-2 ${
                        step.id < currentStep ? 'bg-primary' : 'bg-light-grey'
                      }`} />
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
              <p className="text-navy-dark mb-8">
                {STEPS[currentStep - 1].description}
              </p>

              <div className="bg-white rounded-lg p-6 border border-light-grey">
                {renderStepContent()}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <Button onClick={handleNext}>
                {currentStep === 5 ? 'Finish Setup' : 'Next'}
              </Button>
            </div>
          </div>
        </div>

        {/* Side Panel - 35% */}
        <div className="w-[35%] bg-white border-l border-light-grey p-8">
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
                      ? 'border-primary bg-primary-lighter/10 cursor-pointer hover:border-primary-medium'
                      : isCurrent
                      ? 'border-primary border-2'
                      : 'border-light-grey opacity-50'
                  }`}
                  onClick={() => isCompleted && goToStep(step.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                      isCompleted
                        ? 'bg-primary text-white'
                        : isCurrent
                        ? 'bg-primary text-white'
                        : 'bg-light-grey text-dark-grey'
                    }`}>
                      {isCompleted ? '✓' : step.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold ${
                        isLocked ? 'text-dark-grey' : 'text-navy-darkest'
                      }`}>
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
