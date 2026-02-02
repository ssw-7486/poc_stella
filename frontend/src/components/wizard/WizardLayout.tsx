import { ReactNode } from 'react';
import { Navigation } from '../ui/Navigation';

interface WizardStep {
  number: number;
  name: string;
  status: 'completed' | 'current' | 'pending';
}

interface WizardLayoutProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  stepSubtitle: string;
  children: ReactNode;
  sidePanel?: ReactNode;
  onNext: () => void;
  onBack?: () => void;
  onCancel: () => void;
  onSaveAndExit: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
}

const STEP_NAMES = [
  'Company Info',
  'Choose Template',
  'Document Types',
  'Validation Rules',
  'Volume Estimate',
  'Output Format'
];

export function WizardLayout({
  currentStep,
  totalSteps,
  stepTitle,
  stepSubtitle,
  children,
  sidePanel,
  onNext,
  onBack,
  onCancel,
  onSaveAndExit,
  nextDisabled = false,
  nextLabel = 'Next →'
}: WizardLayoutProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  const steps: WizardStep[] = STEP_NAMES.map((name, index) => ({
    number: index + 1,
    name,
    status: index + 1 < currentStep ? 'completed' : index + 1 === currentStep ? 'current' : 'pending'
  }));

  return (
    <div className="min-h-screen bg-lightest-grey">
      <Navigation />

      <div className="flex">
        {/* Main Content Area - 70% */}
        <div className="w-[70%] p-8">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="text-sm text-navy-dark mb-2">Step {currentStep} of {totalSteps}</div>
            <div className="w-full h-2 bg-light-grey rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Step Title & Subtitle */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-navy-darkest mb-2">{stepTitle}</h1>
            <p className="text-navy-dark">{stepSubtitle}</p>
          </div>

          {/* Main Form Content */}
          <div className="bg-white rounded-xl p-6 mb-6">
            {children}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between">
            <div className="space-x-4">
              <button
                onClick={onCancel}
                className="px-4 py-2 border-2 border-navy-dark text-navy-dark rounded-xl hover:bg-navy-dark hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSaveAndExit}
                className="px-4 py-2 bg-primary-medium text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Save & Exit
              </button>
            </div>

            <div className="space-x-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="px-4 py-2 bg-primary-medium text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                  ← Back
                </button>
              )}
              <button
                onClick={onNext}
                disabled={nextDisabled}
                className="px-6 py-2 bg-primary text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {nextLabel}
              </button>
            </div>
          </div>
        </div>

        {/* Side Panel - 30% */}
        <div className="w-[30%] bg-lightest-grey border-l border-light-grey p-6">
          {/* Progress Stepper */}
          <div className="bg-white rounded-xl p-4 mb-4">
            <h3 className="text-sm font-semibold text-navy-darkest mb-4">Your Progress</h3>
            <div className="space-y-3">
              {steps.map((step) => (
                <div key={step.number} className="flex items-center space-x-3">
                  {step.status === 'completed' && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                      ✓
                    </div>
                  )}
                  {step.status === 'current' && (
                    <div className="w-6 h-6 rounded-full bg-navy-darkest flex items-center justify-center text-white text-xs font-bold">
                      ●
                    </div>
                  )}
                  {step.status === 'pending' && (
                    <div className="w-6 h-6 rounded-full border-2 border-dark-grey flex items-center justify-center text-dark-grey text-xs">
                      ○
                    </div>
                  )}
                  <span className={`text-sm ${step.status === 'current' ? 'font-bold text-navy-darkest' : 'text-navy-dark'}`}>
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Side Panel Content */}
          {sidePanel && (
            <div className="bg-white rounded-xl p-4">
              {sidePanel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
