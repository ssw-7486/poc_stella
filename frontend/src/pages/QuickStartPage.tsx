import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { WizardLayout } from '../components/wizard/WizardLayout';
import { Step1CompanyInfo } from '../components/wizard/Step1CompanyInfo';
import { Step2TemplateSelection } from '../components/wizard/Step2TemplateSelection';
import { Step3DocumentTypes, type Step3Data } from '../components/wizard/Step3DocumentTypes';
import { Step4ValidationRules, type Step4Data } from '../components/wizard/Step4ValidationRules';
import { Step5VolumeEstimate, type Step5Data } from '../components/wizard/Step5VolumeEstimate';
import { Step6OutputFormat, type Step6Data } from '../components/wizard/Step6OutputFormat';
import { Step7ReviewAccept, type Step7Data } from '../components/wizard/Step7ReviewAccept';
import { MOCK_TEMPLATES } from '../data/mockTemplates';
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

  const [step3Data, setStep3Data] = useState<Step3Data>({
    selectedTemplateIds: [],
    documentTemplates: MOCK_TEMPLATES,
  });

  const [step4Data, setStep4Data] = useState<Step4Data>({
    enableValidation: true,
    globalSettings: {
      confidenceThreshold: 85,
      enableExternalValidation: true
    },
    templateValidation: {}
  });

  const [step5Data, setStep5Data] = useState<Step5Data>({
    skipVolumeEstimate: false,
    volumes: []
  });

  const [step6Data, setStep6Data] = useState<Step6Data>({
    json: {
      enabled: true,
      fileNaming: '{date}_{batch}_{index}.json',
      includeMetadata: true,
      includeConfidenceScores: true,
      prettyPrint: true,
      indentation: '2-spaces',
      schema: 'json-schema-v7',
      compression: 'none'
    },
    csv: {
      enabled: true,
      fileNaming: '{date}_{batch}_{index}.csv',
      delimiter: 'comma',
      includeHeaders: true,
      textQualifier: 'double-quotes',
      encoding: 'utf-8',
      escapeSpecialChars: true
    },
    selectedFormats: ['json', 'csv'],
    delivery: {
      method: 'pickup-location',
      location: '',
      schedule: 'immediate',
      notifyOnCompletion: true
    },
    auditTrail: {
      enabled: true,
      events: [
        { eventType: 'drop_off_arrived', enabled: true, metadata: [] },
        { eventType: 'left_for_processing', enabled: true, metadata: [] },
        { eventType: 'outputs_ready', enabled: true, metadata: [] },
        { eventType: 'transferred_to_customer', enabled: true, metadata: [] }
      ],
      retentionDays: 90
    }
  });

  const [step7Data, setStep7Data] = useState<Step7Data>({
    policiesAccepted: {
      dpa: false,
      sla: false,
      compliance: false,
      auditRetention: false
    },
    acceptedBy: '',
    acceptedAt: ''
  });

  // Load existing workflow if resuming
  useEffect(() => {
    const resumeId = searchParams.get('workflowId');
    if (resumeId) {
      const workflow = getWorkflowById(resumeId);
      if (workflow) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
        // Restore step 3 data if it exists
        if (workflow.step3Data) {
          setStep3Data({
            selectedTemplateIds: workflow.step3Data.selectedTemplateIds || [],
            documentTemplates: workflow.step3Data.documentTemplates || MOCK_TEMPLATES,
          });
        }
        // Restore step 4 data if it exists
        if (workflow.step4Data) {
          setStep4Data(workflow.step4Data as Step4Data);
        }
        // Restore step 5 data if it exists
        if (workflow.step5Data) {
          setStep5Data(workflow.step5Data as Step5Data);
        }
        // Restore step 6 data if it exists
        if (workflow.step6Data) {
          setStep6Data(workflow.step6Data as Step6Data);
        }
        // Restore step 7 data if it exists
        if (workflow.step7Data) {
          setStep7Data(workflow.step7Data as Step7Data);
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
      step3Data: step3Data.selectedTemplateIds.length > 0 ? step3Data : undefined,
      step4Data: step4Data,
      step5Data: step5Data,
      step6Data: step6Data,
      step7Data: step7Data.acceptedBy ? step7Data : undefined,
    };
  };

  const handleNext = () => {
    const workflowData = buildWorkflowData(currentStep + 1);

    if (currentStep < 7) {
      saveWorkflow(workflowData);
      setCurrentStep(currentStep + 1);
    } else {
      // Complete wizard
      workflowData.status = 'completed';
      workflowData.step7Data = {
        ...step7Data,
        acceptedAt: new Date().toISOString()
      };
      saveWorkflow(workflowData);
      navigate('/dashboard');
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

  const handleEditStep = (step: number) => {
    setCurrentStep(step);
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

  const generateStep3Summary = () => {
    if (!step3Data.selectedTemplateIds.length) return '';
    const count = step3Data.selectedTemplateIds.length;
    const selectedTemplates = MOCK_TEMPLATES.filter(t =>
      step3Data.selectedTemplateIds.includes(t.id)
    );
    const avgAccuracy = selectedTemplates.length > 0
      ? (selectedTemplates.reduce((sum, t) => sum + t.accuracy, 0) / count).toFixed(1)
      : '0.0';
    return `Types: ${count} template${count !== 1 ? 's' : ''}, Avg accuracy ${avgAccuracy}%`;
  };

  const generateStep4Summary = () => {
    if (!step4Data.enableValidation) return 'Validation: Disabled';
    const totalRules = Object.values(step4Data.templateValidation)
      .reduce((sum, cfg) => sum + cfg.validationRules.length, 0);
    const totalRequired = Object.values(step4Data.templateValidation)
      .reduce((sum, cfg) => sum + cfg.requiredFields.length, 0);
    const rag = step4Data.globalSettings.enableExternalValidation ? 'enabled' : 'disabled';
    return `Validation: ${totalRules} rules, ${totalRequired} required fields, RAG ${rag}`;
  };

  const generateStep5Summary = () => {
    if (step5Data.skipVolumeEstimate) return 'Volume: Skipped';
    const total = step5Data.volumes.reduce((sum, v) => sum + Number(v.expectedMonthlyVolume || 0), 0);
    return `Volume: ${total.toLocaleString()} docs/month across ${step5Data.volumes.length} LOB${step5Data.volumes.length !== 1 ? 's' : ''}`;
  };

  const generateStep6Summary = () => {
    const formats = step6Data.selectedFormats.length > 0
      ? step6Data.selectedFormats.join(' + ').toUpperCase()
      : 'None';
    const method = step6Data.delivery.schedule;
    return `Output: ${formats}, ${method} delivery, Audit enabled`;
  };

  const generateStep7Summary = () => {
    if (!step7Data.acceptedBy) return '';
    return `Review: Signed by ${step7Data.acceptedBy}`;
  };

  const stepSummaries = [
    generateStep1Summary(), // Step 1
    generateStep2Summary(), // Step 2
    generateStep3Summary(), // Step 3
    generateStep4Summary(), // Step 4
    generateStep5Summary(), // Step 5
    generateStep6Summary(), // Step 6
    generateStep7Summary()  // Step 7
  ];

  // Step-specific titles and subtitles
  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Let's set up your company";
      case 2: return "Choose a template";
      case 3: return "Document Types";
      case 4: return "Validation Rules";
      case 5: return "Volume Estimate";
      case 6: return "Output Format";
      case 7: return "Review & Accept";
      default: return `Step ${currentStep}`;
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1: return "This helps us customize your experience";
      case 2: return "Select a workflow template to get started quickly, or build your own from scratch";
      case 3: return "Select which document templates to include in this workflow";
      case 4: return "Configure validation rules for your document processing";
      case 5: return "Estimate your monthly document processing volume";
      case 6: return "Choose how processed documents will be delivered";
      case 7: return "Review your configuration and accept policies to complete setup";
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
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-navy-darkest mb-2">Templates Selected</h3>
              {step3Data.selectedTemplateIds.length > 0 ? (
                <div className="text-xs text-navy-dark space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Count:</span>
                    <span className="font-bold">{step3Data.selectedTemplateIds.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Avg Accuracy:</span>
                    <span className="font-bold text-green">
                      {(() => {
                        const selected = MOCK_TEMPLATES.filter(t =>
                          step3Data.selectedTemplateIds.includes(t.id)
                        );
                        return selected.length > 0
                          ? (selected.reduce((sum, t) => sum + t.accuracy, 0) / selected.length).toFixed(1)
                          : '0.0';
                      })()}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Fields:</span>
                    <span className="font-bold">
                      {MOCK_TEMPLATES.filter(t =>
                        step3Data.selectedTemplateIds.includes(t.id)
                      ).reduce((sum, t) => sum + t.fieldsDetected, 0)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-dark-grey">No templates selected yet</p>
              )}
            </div>
            <div className="border-t border-navy/10 pt-4">
              <h3 className="text-sm font-semibold text-navy-darkest mb-2">Need Help?</h3>
              <ul className="text-xs text-navy-dark space-y-2">
                <li>• These templates were created during onboarding and tested with your sample documents</li>
                <li>• All templates meet the 99.5% accuracy target</li>
                <li>• You can create new templates or modify existing ones at any time</li>
              </ul>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-navy-darkest mb-2">Validation Summary</h3>
              {step4Data.enableValidation ? (
                <div className="text-xs text-navy-dark space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Threshold:</span>
                    <span className="font-bold">{step4Data.globalSettings.confidenceThreshold}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">RAG:</span>
                    <span className="font-bold">{step4Data.globalSettings.enableExternalValidation ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-dark-grey">Validation disabled</p>
              )}
            </div>
            <div className="border-t border-navy/10 pt-4">
              <h3 className="text-sm font-semibold text-navy-darkest mb-2">About Validation</h3>
              <ul className="text-xs text-navy-dark space-y-2">
                <li>• Validation rules help ensure data accuracy</li>
                <li>• RAG validates against external databases</li>
                <li>• You can customize rules per template</li>
              </ul>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-navy-darkest mb-2">Volume Summary</h3>
              {!step5Data.skipVolumeEstimate && step5Data.volumes.length > 0 ? (
                <div className="text-xs text-navy-dark space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total/Month:</span>
                    <span className="font-bold text-green">
                      {step5Data.volumes.reduce((sum, v) => sum + Number(v.expectedMonthlyVolume || 0), 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">LOBs:</span>
                    <span className="font-bold">{step5Data.volumes.length}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-dark-grey">{step5Data.skipVolumeEstimate ? 'Skipped' : 'No volumes entered'}</p>
              )}
            </div>
            <div className="border-t border-navy/10 pt-4">
              <h3 className="text-sm font-semibold text-navy-darkest mb-2">Why Volume Matters</h3>
              <ul className="text-xs text-navy-dark space-y-2">
                <li>• Helps optimize resource allocation</li>
                <li>• Enables accurate capacity planning</li>
                <li>• You can skip and update later</li>
              </ul>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-navy-darkest mb-2">Output Summary</h3>
              {step6Data.selectedFormats.length > 0 ? (
                <div className="text-xs text-navy-dark space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Formats:</span>
                    <span className="font-bold">{step6Data.selectedFormats.join(' + ').toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Delivery:</span>
                    <span className="font-bold capitalize">{step6Data.delivery.schedule.replace(/-/g, ' ')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Audit Trail:</span>
                    <span className="font-bold text-green">Enabled</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-dark-grey">No formats selected</p>
              )}
            </div>
            <div className="border-t border-navy/10 pt-4">
              <h3 className="text-sm font-semibold text-navy-darkest mb-2">Output Options</h3>
              <ul className="text-xs text-navy-dark space-y-2">
                <li>• JSON: Structured data with metadata</li>
                <li>• CSV: Spreadsheet-friendly format</li>
                <li>• Audit trail required per G9</li>
              </ul>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-navy-darkest mb-2">Completion Status</h3>
              <div className="text-xs text-navy-dark space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Policies:</span>
                  <span className={`font-bold ${Object.values(step7Data.policiesAccepted).every(Boolean) ? 'text-green' : 'text-red'}`}>
                    {Object.values(step7Data.policiesAccepted).filter(Boolean).length}/4
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Signature:</span>
                  <span className={`font-bold ${step7Data.acceptedBy.trim().length >= 2 ? 'text-green' : 'text-red'}`}>
                    {step7Data.acceptedBy.trim().length >= 2 ? 'Complete' : 'Required'}
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t border-navy/10 pt-4">
              <h3 className="text-sm font-semibold text-navy-darkest mb-2">Final Steps</h3>
              <ul className="text-xs text-navy-dark space-y-2">
                <li>• Review all configuration steps</li>
                <li>• Accept all 4 policies</li>
                <li>• Provide electronic signature</li>
                <li>• Click "Complete Setup" to finish</li>
              </ul>
            </div>
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
      totalSteps={7}
      stepTitle={getStepTitle()}
      stepSubtitle={getStepSubtitle()}
      stepSummaries={stepSummaries}
      onNext={handleNext}
      onBack={currentStep > 1 ? handleBack : undefined}
      onCancel={handleCancel}
      onSaveAndExit={handleSaveAndExit}
      sidePanel={getSidePanel()}
      nextLabel={currentStep === 7 ? 'Complete Setup' : 'Next →'}
      nextDisabled={
        (currentStep === 2 && !step2Data.selectedTemplateId) ||
        (currentStep === 3 && step3Data.selectedTemplateIds.length === 0) ||
        (currentStep === 6 && step6Data.selectedFormats.length === 0) ||
        (currentStep === 7 && (
          !step7Data.policiesAccepted.dpa ||
          !step7Data.policiesAccepted.sla ||
          !step7Data.policiesAccepted.compliance ||
          !step7Data.policiesAccepted.auditRetention ||
          step7Data.acceptedBy.trim().length < 2
        ))
      }
      allowPanelToggle={currentStep === 3 || currentStep === 6}
    >
      {currentStep === 1 && (
        <Step1CompanyInfo data={step1Data} onChange={setStep1Data} />
      )}
      {currentStep === 2 && (
        <Step2TemplateSelection data={step2Data} onChange={setStep2Data} />
      )}
      {currentStep === 3 && (
        <Step3DocumentTypes data={step3Data} onChange={setStep3Data} />
      )}
      {currentStep === 4 && (
        <Step4ValidationRules
          data={step4Data}
          onChange={setStep4Data}
          step3Data={step3Data}
        />
      )}
      {currentStep === 5 && (
        <Step5VolumeEstimate
          data={step5Data}
          onChange={setStep5Data}
          step1LobCount={Number(step1Data.linesOfBusiness)}
        />
      )}
      {currentStep === 6 && (
        <Step6OutputFormat
          data={step6Data}
          onChange={setStep6Data}
          step1PickupLocation={step1Data.securePickupLocation}
        />
      )}
      {currentStep === 7 && (
        <Step7ReviewAccept
          data={step7Data}
          onChange={setStep7Data}
          stepSummaries={stepSummaries.slice(0, 6)}
          onEditStep={handleEditStep}
        />
      )}
    </WizardLayout>
  );
}
