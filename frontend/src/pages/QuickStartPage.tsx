import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WizardLayout } from '../components/wizard/WizardLayout';
import { Step1CompanyInfo } from '../components/wizard/Step1CompanyInfo';

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
  const [currentStep, setCurrentStep] = useState(1);

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

  const handleNext = () => {
    // TODO: Add validation
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      // TODO: Complete wizard
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
    // TODO: Save draft to database
    alert('Progress saved! You can resume from the Dashboard.');
    navigate('/dashboard');
  };

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
