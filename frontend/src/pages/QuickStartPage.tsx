import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { WizardLayout } from '../components/wizard/WizardLayout';
import { Step1CompanyInfo } from '../components/wizard/Step1CompanyInfo';
import { Step2TemplateSelection } from '../components/wizard/Step2TemplateSelection';
import {
  createWorkflow,
  saveWorkflow,
  getWorkflowById,
  type WorkflowData,
} from '../utils/workflowStorage';

interface Step1Data {
  companyName: string;
  industrySector: string;
  primaryRegion: string;
  country: string;
  linesOfBusiness: string;
  primaryContact1: {
    name: string;
    email: string;
    cell: string;
  };
  primaryContact2: {
    name: string;
    email: string;
    cell: string;
  };
  securedDropoffLocation: string;
  securePickupLocation: string;
}

interface Step2Data {
  selectedTemplateId: string;
  templateName: string;
}

export function QuickStartPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [workflowId, setWorkflowId] = useState<string | null>(null);

  // Initialize form data with default country
  const [step1Data, setStep1Data] = useState<Step1Data>({
    companyName: '',
    industrySector: '',
    primaryRegion: '',
    country: 'United States', // Pre-selected based on locale
    linesOfBusiness: '',
    primaryContact1: {
      name: '',
      email: '',
      cell: ''
    },
    primaryContact2: {
      name: '',
      email: '',
      cell: ''
    },
    securedDropoffLocation: '',
    securePickupLocation: ''
  });

  const [step2Data, setStep2Data] = useState<Step2Data>({
    selectedTemplateId: '',
    templateName: '',
  });

  // Load existing workflow if resuming
  useEffect(() => {
    const resumeId = searchParams.get('workflowId');
    if (resumeId) {
      const workflow = getWorkflowById(resumeId);
      if (workflow) {
        setWorkflowId(workflow.id);
        setCurrentStep(workflow.currentStep);
        // Convert number to string for form field
        setStep1Data({
          ...workflow.step1Data,
          linesOfBusiness: String(workflow.step1Data.linesOfBusiness || ''),
        });
        // Restore step 2 data if it exists
        if (workflow.step2Data) {
          setStep2Data({
            selectedTemplateId: workflow.step2Data.selectedTemplateId || '',
            templateName: workflow.step2Data.templateName || '',
          });
        }
      }
    }
  }, [searchParams]);

  const buildWorkflowData = (stepOverride?: number): WorkflowData => {
    const currentWorkflowId = workflowId || createWorkflow({
      ...step1Data,
      linesOfBusiness: Number(step1Data.linesOfBusiness) || 0,
    }).id;
    if (!workflowId) {
      setWorkflowId(currentWorkflowId);
    }

    return {
      id: currentWorkflowId,
      name: step1Data.companyName || 'Untitled Workflow',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentStep: stepOverride ?? currentStep,
      status: 'in-progress',
      step1Data: {
        ...step1Data,
        linesOfBusiness: Number(step1Data.linesOfBusiness) || 0,
      },
      step2Data: step2Data.selectedTemplateId ? step2Data : undefined,
    };
  };

  const handleNext = () => {
    const workflowData = buildWorkflowData(currentStep + 1);

    if (currentStep < 6) {
      saveWorkflow(workflowData);
      setCurrentStep(currentStep + 1);
    } else {
      // Complete wizard
      workflowData.status = 'completed';
      saveWorkflow(workflowData);
      navigate('/workflows');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    if (confirm('Cancel setup? All progress will be lost.')) {
      navigate('/dashboard');
    }
  };

  const handleSaveAndExit = () => {
    const workflowData = buildWorkflowData();
    saveWorkflow(workflowData);
    alert('Progress saved! You can resume from the Dashboard.');
    navigate('/dashboard');
  };

  // Generate step summaries
  const generateStep1Summary = () => {
    const parts = [];

    // Company Details
    if (step1Data.companyName) parts.push(`Company: ${step1Data.companyName}`);
    if (step1Data.industrySector) parts.push(`Industry: ${step1Data.industrySector}`);
    if (step1Data.primaryRegion) parts.push(`Region: ${step1Data.primaryRegion}`);
    if (step1Data.country) parts.push(`Country: ${step1Data.country}`);
    if (step1Data.linesOfBusiness) parts.push(`Lines of Business: ${step1Data.linesOfBusiness}`);

    // Primary Contacts
    if (step1Data.primaryContact1.name) parts.push(`Contact 1: ${step1Data.primaryContact1.name}`);
    if (step1Data.primaryContact1.email) parts.push(`Email: ${step1Data.primaryContact1.email}`);
    if (step1Data.primaryContact1.cell) parts.push(`Cell: ${step1Data.primaryContact1.cell}`);

    if (step1Data.primaryContact2.name) parts.push(`Contact 2: ${step1Data.primaryContact2.name}`);
    if (step1Data.primaryContact2.email) parts.push(`Email: ${step1Data.primaryContact2.email}`);
    if (step1Data.primaryContact2.cell) parts.push(`Cell: ${step1Data.primaryContact2.cell}`);

    // File Locations
    if (step1Data.securedDropoffLocation) parts.push(`Drop-off: ${step1Data.securedDropoffLocation}`);
    if (step1Data.securePickupLocation) parts.push(`Pick-up: ${step1Data.securePickupLocation}`);

    return parts.join(' • ');
  };

  const generateStep2Summary = () => {
    if (step2Data.templateName) {
      return `Template: ${step2Data.templateName}`;
    }
    return '';
  };

  const stepSummaries = [
    generateStep1Summary(), // Step 1
    generateStep2Summary(), // Step 2
    '', // Step 3
    '', // Step 4
    '', // Step 5
    ''  // Step 6
  ];

  // Step-specific titles and subtitles
  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Let's set up your company";
      case 2: return "Choose a template";
      default: return `Step ${currentStep}`;
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1: return "This helps us customize your experience";
      case 2: return "Select a workflow template to get started quickly, or build your own from scratch";
      default: return "";
    }
  };

  // Step-specific side panel content
  const getSidePanel = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 className="text-sm font-semibold text-navy-darkest mb-2">Need Help?</h3>
            <ul className="text-xs text-navy-dark space-y-2">
              <li>• Required fields are marked with an asterisk (*)</li>
              <li>• You can edit this information later in Settings</li>
              <li>• Contact support if you need assistance</li>
            </ul>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-sm font-semibold text-navy-darkest mb-2">Template Summary</h3>
            {step2Data.templateName ? (
              <div className="text-xs text-navy-dark space-y-2">
                <p><span className="font-medium">Selected:</span> {step2Data.templateName}</p>
                {step2Data.selectedTemplateId !== 'start-from-scratch' && (
                  <p>This template will pre-fill your document types, validation rules, and output settings in the following steps.</p>
                )}
                {step2Data.selectedTemplateId === 'start-from-scratch' && (
                  <p>You will configure all settings manually in the following steps.</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-dark-grey">Select a template to see details</p>
            )}
          </div>
        );
      default:
        return (
          <div>
            <h3 className="text-sm font-semibold text-navy-darkest mb-2">Need Help?</h3>
            <ul className="text-xs text-navy-dark space-y-2">
              <li>• Contact support if you need assistance</li>
            </ul>
          </div>
        );
    }
  };

  return (
    <WizardLayout
      currentStep={currentStep}
      totalSteps={6}
      stepTitle={getStepTitle()}
      stepSubtitle={getStepSubtitle()}
      stepSummaries={stepSummaries}
      onNext={handleNext}
      onBack={currentStep > 1 ? handleBack : undefined}
      onCancel={handleCancel}
      onSaveAndExit={handleSaveAndExit}
      sidePanel={getSidePanel()}
      nextLabel={currentStep === 6 ? 'Finish Setup' : 'Next →'}
      nextDisabled={currentStep === 2 && !step2Data.selectedTemplateId}
    >
      {currentStep === 1 && (
        <Step1CompanyInfo data={step1Data} onChange={setStep1Data} />
      )}
      {currentStep === 2 && (
        <Step2TemplateSelection data={step2Data} onChange={setStep2Data} />
      )}
      {currentStep === 3 && (
        <div className="text-center py-12 text-navy-dark">
          <p>Step 3: Document Types</p>
          <p className="text-sm">Coming soon...</p>
        </div>
      )}
      {currentStep === 4 && (
        <div className="text-center py-12 text-navy-dark">
          <p>Step 4: Validation Rules</p>
          <p className="text-sm">Coming soon...</p>
        </div>
      )}
      {currentStep === 5 && (
        <div className="text-center py-12 text-navy-dark">
          <p>Step 5: Volume Estimate</p>
          <p className="text-sm">Coming soon...</p>
        </div>
      )}
      {currentStep === 6 && (
        <div className="text-center py-12 text-navy-dark">
          <p>Step 6: Output Format</p>
          <p className="text-sm">Coming soon...</p>
        </div>
      )}
    </WizardLayout>
  );
}
