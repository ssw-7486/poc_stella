import { useState, useEffect, memo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navigation } from '../components/ui/Navigation';
import type { TemplateDraft, Phase1Data, Phase2Data, Phase3Data } from '../types/template';
import {
  getTemplateDraftById,
  saveTemplateDraft,
  generateTemplateId,
} from '../utils/templateStorage';

export const CreateTemplatePage = memo(function CreateTemplatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State management
  const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3>(1);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState<string>('');

  const [phase1Data, setPhase1Data] = useState<Phase1Data>({
    samples: [],
    fields: [],
    detectionStatus: 'idle',
    detectionAttempts: 0,
  });

  const [phase2Data, setPhase2Data] = useState<Phase2Data>({
    testSamples: [],
    currentSampleIndex: 0,
    currentFieldIndex: 0,
    corrections: [],
    extractionResults: [],
  });

  const [phase3Data, setPhase3Data] = useState<Phase3Data>({
    overallAccuracy: 0,
    fieldAccuracies: {},
    targetAccuracy: 99.5,
    approved: false,
  });

  // Panel toggle state (per-phase)
  const panelStorageKey = `create_template_phase${currentPhase}_panel_visible`;
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(() => {
    const stored = localStorage.getItem(panelStorageKey);
    return stored !== null ? stored === 'true' : true; // Default: visible
  });

  // Persist panel state
  useEffect(() => {
    localStorage.setItem(panelStorageKey, String(isPanelVisible));
  }, [isPanelVisible, panelStorageKey]);

  // Resume draft from URL params (runs once on mount)
  useEffect(() => {
    const draftId = searchParams.get('draftId');
    if (draftId) {
      const draft = getTemplateDraftById(draftId);
      if (draft) {
        // Initialization from URL params
        setTemplateId(draft.id);
        setTemplateName(draft.name);
        setCurrentPhase(draft.currentPhase);
        if (draft.phase1Data) setPhase1Data(draft.phase1Data);
        if (draft.phase2Data) setPhase2Data(draft.phase2Data);
        if (draft.phase3Data) setPhase3Data(draft.phase3Data);
      }
    } else {
      // New template
      const newId = generateTemplateId();
      setTemplateId(newId);
      setTemplateName('Untitled Template');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build draft object
  const buildDraft = (phaseOverride?: number): TemplateDraft => {
    return {
      id: templateId!,
      name: templateName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentPhase: (phaseOverride as 1 | 2 | 3) ?? currentPhase,
      status: 'draft',
      phase1Data,
      phase2Data,
      phase3Data,
    };
  };

  // Save draft
  const handleSaveDraft = () => {
    const draft = buildDraft();
    saveTemplateDraft(draft);
    alert(`Draft "${templateName}" saved successfully!`);
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentPhase < 3) {
      const draft = buildDraft(currentPhase + 1);
      saveTemplateDraft(draft);
      setCurrentPhase((currentPhase + 1) as 1 | 2 | 3);
    }
  };

  const handleBack = () => {
    if (currentPhase > 1) {
      setCurrentPhase((currentPhase - 1) as 1 | 2 | 3);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      navigate('/quick-start?step=3');
    }
  };

  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  // Calculate progress
  const progressPercentage = (currentPhase / 3) * 100;

  // Phase names
  const PHASE_NAMES = [
    'Field Identification',
    'Data Extraction',
    'Accuracy & Approval',
  ];

  const phaseStatus = (phase: number): 'completed' | 'current' | 'pending' => {
    if (phase < currentPhase) return 'completed';
    if (phase === currentPhase) return 'current';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-lightest-grey">
      <Navigation />

      <div className="flex">
        {/* Main Content Area */}
        <div className={`p-8 transition-all duration-300 ${isPanelVisible ? 'w-[70%]' : 'w-full'}`}>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-navy-dark">Phase {currentPhase} of 3</div>
              <button
                onClick={togglePanel}
                className="text-xs text-primary hover:text-primary-medium transition-colors font-medium"
              >
                {isPanelVisible ? '← Hide Panel' : 'Show Panel →'}
              </button>
            </div>
            <div className="w-full h-2 bg-light-grey rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Phase Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-navy-darkest mb-2">Create Template</h1>
            <p className="text-navy-dark">{PHASE_NAMES[currentPhase - 1]}</p>
          </div>

          {/* Template Name Input */}
          {currentPhase === 1 && (
            <div className="mb-6">
              <label className="text-sm text-navy-darkest font-medium mb-2 block">
                Template Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full px-4 py-2 rounded-[5px] border border-input-border focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Traffic Ticket Template"
              />
            </div>
          )}

          {/* Phase Content */}
          <div className="bg-white rounded-xl p-6 mb-6">
            {currentPhase === 1 && (
              <div className="text-center py-12 text-navy-dark">
                <p className="text-lg">Phase 1: Field Identification</p>
                <p className="text-sm mt-2">Upload samples → Auto-detect fields → Review properties</p>
                <p className="text-xs mt-4 text-dark-grey">(Components will be added next)</p>
              </div>
            )}

            {currentPhase === 2 && (
              <div className="text-center py-12 text-navy-dark">
                <p className="text-lg">Phase 2: Data Extraction & Testing</p>
                <p className="text-sm mt-2">Upload test samples → Review extracted data → Log corrections</p>
                <p className="text-xs mt-4 text-dark-grey">(Components will be added next)</p>
              </div>
            )}

            {currentPhase === 3 && (
              <div className="text-center py-12 text-navy-dark">
                <p className="text-lg">Phase 3: Accuracy & Approval</p>
                <p className="text-sm mt-2">Calculate accuracy → Approve if ≥{phase3Data.targetAccuracy}%</p>
                <p className="text-xs mt-4 text-dark-grey">(Components will be added next)</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between">
            <div className="space-x-3">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-sm border-2 border-navy-dark text-navy-dark rounded-[5px] hover:bg-navy-dark hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDraft}
                className="px-3 py-1.5 text-sm bg-primary-medium text-white rounded-[5px] hover:opacity-90 transition-opacity"
              >
                Save Draft
              </button>
            </div>

            <div className="space-x-3">
              {currentPhase > 1 && (
                <button
                  onClick={handleBack}
                  className="px-3 py-1.5 text-sm bg-primary-medium text-white rounded-[5px] hover:opacity-90 transition-opacity"
                >
                  ← Back
                </button>
              )}
              {currentPhase < 3 && (
                <button
                  onClick={handleNext}
                  disabled={!templateName.trim()}
                  className="px-4 py-1.5 text-sm bg-primary text-white rounded-[5px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              )}
              {currentPhase === 3 && (
                <button
                  onClick={() => alert('Approve Template feature coming next')}
                  className="px-4 py-1.5 text-sm bg-primary text-white rounded-[5px] hover:opacity-90 transition-opacity"
                >
                  Approve Template
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        {isPanelVisible && (
          <div className="w-[30%] bg-lightest-grey border-l border-light-grey p-6 transition-all duration-300">
            {/* Progress Tracker */}
            <div className="bg-white rounded-xl p-4 mb-4">
              <h3 className="text-sm font-semibold text-navy-darkest mb-4">Your Progress</h3>
              <div className="space-y-3">
                {PHASE_NAMES.map((name, index) => {
                  const phase = index + 1;
                  const status = phaseStatus(phase);

                  return (
                    <div key={phase} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {status === 'completed' && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                            ✓
                          </div>
                        )}
                        {status === 'current' && (
                          <div className="w-6 h-6 rounded-full bg-navy-darkest flex items-center justify-center text-white text-xs font-bold">
                            ●
                          </div>
                        )}
                        {status === 'pending' && (
                          <div className="w-6 h-6 rounded-full border-2 border-dark-grey flex items-center justify-center text-dark-grey text-xs">
                            ○
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm ${status === 'current' ? 'font-bold text-navy-darkest' : 'text-navy-dark'}`}>
                          {name}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Help Tips */}
            <div className="bg-white rounded-xl p-4">
              <h3 className="text-sm font-semibold text-navy-darkest mb-3">💡 Tips</h3>
              <ul className="text-xs text-dark-grey space-y-2">
                {currentPhase === 1 && (
                  <>
                    <li>• Upload 2-3 sample documents</li>
                    <li>• System will auto-detect fields</li>
                    <li>• Review and correct as needed</li>
                    <li>• Hide panel for more workspace</li>
                  </>
                )}
                {currentPhase === 2 && (
                  <>
                    <li>• Upload ~10 test samples</li>
                    <li>• Use Tab to navigate fields</li>
                    <li>• Press Ctrl+M to mark correct</li>
                    <li>• Log corrections for accuracy</li>
                  </>
                )}
                {currentPhase === 3 && (
                  <>
                    <li>• Target: ≥99.5% accuracy</li>
                    <li>• Review per-field breakdown</li>
                    <li>• Upload more samples if needed</li>
                    <li>• Approve to integrate with wizard</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
