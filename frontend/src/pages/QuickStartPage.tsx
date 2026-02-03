import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { WizardLayout } from '../components/wizard/WizardLayout';
import { Step1CompanyInfo } from '../components/wizard/Step1CompanyInfo';
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
      }
    }
  }, [searchParams]);

  const handleNext = () => {
    // Save current progress
    const currentWorkflowId = workflowId || createWorkflow({
      ...step1Data,
      linesOfBusiness: Number(step1Data.linesOfBusiness) || 0,
    }).id;
    if (!workflowId) {
      setWorkflowId(currentWorkflowId);
    }

    // Update workflow with current data
    const workflowData: WorkflowData = {
      id: currentWorkflowId,
      name: step1Data.companyName || 'Untitled Workflow',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentStep: currentStep + 1,
      status: 'in-progress',
      step1Data: {
        ...step1Data,
        linesOfBusiness: Number(step1Data.linesOfBusiness) || 0,
      },
    };

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
    // Create or update workflow
    const currentWorkflowId = workflowId || createWorkflow({
      ...step1Data,
      linesOfBusiness: Number(step1Data.linesOfBusiness) || 0,
    }).id;

    const workflowData: WorkflowData = {
      id: currentWorkflowId,
      name: step1Data.companyName || 'Untitled Workflow',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentStep: currentStep,
      status: 'in-progress',
      step1Data: {
        ...step1Data,
        linesOfBusiness: Number(step1Data.linesOfBusiness) || 0,
      },
    };

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

  const stepSummaries = [
    generateStep1Summary(), // Step 1
    '', // Step 2 - not yet implemented
    '', // Step 3
    '', // Step 4
    '', // Step 5
    ''  // Step 6
  ];

  // Side panel content
  const sidePanel = (
    <div>
      <h3 className="text-sm font-semibold text-navy-darkest mb-2">Need Help?</h3>
      <ul className="text-xs text-navy-dark space-y-2">
        <li>• Required fields are marked with an asterisk (*)</li>
        <li>• You can edit this information later in Settings</li>
        <li>• Contact support if you need assistance</li>
      </ul>
    </div>
  );

  return (
    <WizardLayout
      currentStep={currentStep}
      totalSteps={6}
      stepTitle={currentStep === 1 ? "Let's set up your company" : "Step " + currentStep}
      stepSubtitle={currentStep === 1 ? "This helps us customize your experience" : ""}
      stepSummaries={stepSummaries}
      onNext={handleNext}
      onBack={currentStep > 1 ? handleBack : undefined}
      onCancel={handleCancel}
      onSaveAndExit={handleSaveAndExit}
      sidePanel={sidePanel}
      nextLabel={currentStep === 6 ? 'Finish Setup' : 'Next →'}
    >
      {currentStep === 1 && (
        <Step1CompanyInfo data={step1Data} onChange={setStep1Data} />
      )}
      {currentStep === 2 && (
        <div className="text-center py-12 text-navy-dark">
          <p>Step 2: Template Selection</p>
          <p className="text-sm">Coming soon...</p>
        </div>
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
