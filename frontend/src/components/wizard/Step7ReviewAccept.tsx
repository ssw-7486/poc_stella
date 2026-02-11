import { memo } from 'react';
import { PolicyCard } from '../ui/PolicyCard';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export interface Step7Data {
  policiesAccepted: {
    dpa: boolean;
    sla: boolean;
    compliance: boolean;
    auditRetention: boolean;
  };
  acceptedBy: string;
  acceptedAt: string;
}

interface Step7ReviewAcceptProps {
  data: Step7Data;
  onChange: (data: Step7Data) => void;
  stepSummaries: string[];
  onEditStep: (step: number) => void;
}

export const Step7ReviewAccept = memo(function Step7ReviewAccept({
  data,
  onChange,
  stepSummaries,
  onEditStep
}: Step7ReviewAcceptProps) {
  const handlePolicyToggle = (policy: keyof Step7Data['policiesAccepted'], checked: boolean) => {
    onChange({
      ...data,
      policiesAccepted: {
        ...data.policiesAccepted,
        [policy]: checked
      }
    });
  };

  const handleSignatureChange = (signature: string) => {
    onChange({
      ...data,
      acceptedBy: signature
    });
  };

  const allPoliciesAccepted = Object.values(data.policiesAccepted).every(Boolean);
  const canComplete = allPoliciesAccepted && data.acceptedBy.trim().length >= 2;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-navy-darkest mb-2">Review & Accept</h2>
        <p className="text-sm text-navy-dark">
          Review your workflow configuration and accept our policies to complete setup
        </p>
      </div>

      {/* Step Summaries */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-navy-darkest">Configuration Summary</h3>

        {stepSummaries.slice(0, 6).map((summary, index) => {
          const stepNumber = index + 1;
          const stepNames = [
            'Company Info',
            'Template Selection',
            'Document Types',
            'Validation Rules',
            'Volume Estimate',
            'Output Format'
          ];

          return (
            <div
              key={stepNumber}
              className="flex items-center justify-between p-4 border border-light-grey rounded-[5px] bg-white"
            >
              <div className="flex-1">
                <div className="text-sm font-semibold text-navy-darkest mb-1">
                  Step {stepNumber}: {stepNames[index]}
                </div>
                {summary ? (
                  <div className="text-xs text-navy-dark">{summary}</div>
                ) : (
                  <div className="text-xs text-dark-grey italic">Not completed</div>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => onEditStep(stepNumber)}
                className="text-xs px-3 py-1 ml-4"
              >
                Edit
              </Button>
            </div>
          );
        })}
      </div>

      {/* Policies Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-navy-darkest">Security & Privacy Policies</h3>
        <p className="text-sm text-navy-dark">
          Please review and accept the following policies to proceed
        </p>

        <div className="space-y-3">
          <PolicyCard
            id="policy-dpa"
            title="Data Processing Agreement (DPA)"
            description="Defines how we process, store, and protect your document data. Includes GDPR and CCPA compliance requirements."
            checked={data.policiesAccepted.dpa}
            onCheck={(checked) => handlePolicyToggle('dpa', checked)}
          />

          <PolicyCard
            id="policy-sla"
            title="Service Level Agreement (SLA)"
            description="Guarantees 99.9% uptime, 2.3s average processing time, and 98.5% accuracy rate. Includes support response times and escalation procedures."
            checked={data.policiesAccepted.sla}
            onCheck={(checked) => handlePolicyToggle('sla', checked)}
          />

          <PolicyCard
            id="policy-compliance"
            title="Compliance & Security Policy"
            description="Outlines our SOC 2 Type II certification, ISO 27001 compliance, and data encryption standards (AES-256 at rest, TLS 1.3 in transit)."
            checked={data.policiesAccepted.compliance}
            onCheck={(checked) => handlePolicyToggle('compliance', checked)}
          />

          <PolicyCard
            id="policy-audit"
            title="Audit Trail & Retention Policy"
            description="All processing events are logged for 90 days minimum (G9 requirement). Customer data retained for 30 days post-processing, then securely deleted."
            checked={data.policiesAccepted.auditRetention}
            onCheck={(checked) => handlePolicyToggle('auditRetention', checked)}
          />
        </div>
      </div>

      {/* Electronic Signature */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-navy-darkest">Electronic Signature</h3>
        <p className="text-sm text-navy-dark">
          By providing your name below, you electronically sign and agree to all policies listed above
        </p>

        <Input
          label="Accepted By (Full Name) *"
          placeholder="Enter your full name"
          value={data.acceptedBy}
          onChange={(e) => handleSignatureChange(e.target.value)}
          required
        />
        <p className="text-xs text-dark-grey mt-1">Minimum 2 characters required</p>

        {data.acceptedBy && (
          <div className="text-xs text-dark-grey">
            By signing, you confirm that you have authority to accept these policies on behalf of your organization.
          </div>
        )}
      </div>

      {/* Completion Status */}
      {!canComplete && (
        <div className="bg-primary-lighter/20 border border-primary/30 rounded-[5px] p-4">
          <h4 className="text-sm font-semibold text-navy-darkest mb-2">Before you can complete:</h4>
          <ul className="text-sm text-navy-dark space-y-1">
            {!allPoliciesAccepted && (
              <li>✗ Accept all 4 security & privacy policies</li>
            )}
            {data.acceptedBy.trim().length < 2 && (
              <li>✗ Provide your electronic signature (full name)</li>
            )}
          </ul>
        </div>
      )}

      {canComplete && (
        <div className="bg-green/10 border border-green/30 rounded-[5px] p-4">
          <p className="text-sm font-semibold text-green">
            ✓ Ready to complete! Click "Complete Setup" below to finish.
          </p>
        </div>
      )}
    </div>
  );
});
