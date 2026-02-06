import { useState } from 'react';

interface Step2Data {
  selectedTemplateId: string;
  templateName: string;
}

interface Step2TemplateSelectionProps {
  data: Step2Data;
  onChange: (data: Step2Data) => void;
}

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  documentTypes: string;
  setupTime: string;
  icon: React.ReactNode;
  isBlank?: boolean;
}

// Simple SVG icons for each sector
const InvoiceIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    <rect x="8" y="4" width="32" height="40" rx="3" stroke="currentColor" strokeWidth="2" />
    <line x1="14" y1="14" x2="34" y2="14" stroke="currentColor" strokeWidth="2" />
    <line x1="14" y1="20" x2="34" y2="20" stroke="currentColor" strokeWidth="2" />
    <line x1="14" y1="26" x2="26" y2="26" stroke="currentColor" strokeWidth="2" />
    <line x1="14" y1="34" x2="20" y2="34" stroke="currentColor" strokeWidth="2" />
    <line x1="28" y1="34" x2="34" y2="34" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const MixedDocsIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    <rect x="6" y="6" width="28" height="36" rx="3" stroke="currentColor" strokeWidth="2" />
    <rect x="14" y="2" width="28" height="36" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
    <line x1="20" y1="12" x2="36" y2="12" stroke="currentColor" strokeWidth="2" />
    <line x1="20" y1="18" x2="36" y2="18" stroke="currentColor" strokeWidth="2" />
    <line x1="20" y1="24" x2="30" y2="24" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const HealthcareIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    <rect x="16" y="8" width="16" height="32" rx="2" stroke="currentColor" strokeWidth="2" />
    <rect x="8" y="16" width="32" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const BankingIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    <path d="M24 4L4 18H44L24 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <rect x="4" y="38" width="40" height="4" rx="1" stroke="currentColor" strokeWidth="2" />
    <line x1="10" y1="18" x2="10" y2="38" stroke="currentColor" strokeWidth="2" />
    <line x1="20" y1="18" x2="20" y2="38" stroke="currentColor" strokeWidth="2" />
    <line x1="28" y1="18" x2="28" y2="38" stroke="currentColor" strokeWidth="2" />
    <line x1="38" y1="18" x2="38" y2="38" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const InsuranceIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    <path d="M24 4L8 12V24C8 34 24 44 24 44C24 44 40 34 40 24V12L24 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <polyline points="18,24 22,28 30,20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ScratchIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
    <line x1="24" y1="16" x2="24" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="24" x2="32" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const TEMPLATES: TemplateOption[] = [
  {
    id: 'basic-invoice',
    name: 'Basic Invoice Processing',
    description: 'Pre-configured workflow for standard invoice documents with automated field extraction and validation.',
    documentTypes: 'Invoices, purchase orders, receipts',
    setupTime: '~3 min',
    icon: <InvoiceIcon />,
  },
  {
    id: 'mixed-document',
    name: 'Mixed Document Processing',
    description: 'Handles both handwritten and machine-printed documents with automatic classification and routing.',
    documentTypes: 'Mixed handwritten & printed forms',
    setupTime: '~5 min',
    icon: <MixedDocsIcon />,
  },
  {
    id: 'healthcare-form',
    name: 'Healthcare Form Processing',
    description: 'Optimized for medical forms, patient records, and clinical documents with compliance checks.',
    documentTypes: 'Patient forms, clinical records, claims',
    setupTime: '~4 min',
    icon: <HealthcareIcon />,
  },
  {
    id: 'banking',
    name: 'Banking',
    description: 'Tailored for financial documents including account applications, loan forms, and transaction records.',
    documentTypes: 'Applications, statements, KYC docs',
    setupTime: '~4 min',
    icon: <BankingIcon />,
  },
  {
    id: 'insurance',
    name: 'Insurance',
    description: 'Designed for policy documents, claims processing, and underwriting forms with risk assessment rules.',
    documentTypes: 'Policies, claims, underwriting forms',
    setupTime: '~4 min',
    icon: <InsuranceIcon />,
  },
  {
    id: 'start-from-scratch',
    name: 'Start from Scratch',
    description: 'Build a custom workflow from the ground up. All settings will be blank for you to configure.',
    documentTypes: '',
    setupTime: '',
    icon: <ScratchIcon />,
    isBlank: true,
  },
];

export function Step2TemplateSelection({ data, onChange }: Step2TemplateSelectionProps) {
  // Layout toggle: 'A' = centered icon-top cards, 'B' = compact icon-left cards
  const [layout, setLayout] = useState<'A' | 'B'>('A');

  const handleSelect = (template: TemplateOption) => {
    onChange({
      selectedTemplateId: template.id,
      templateName: template.name,
    });
  };

  const isSelected = (id: string) => data.selectedTemplateId === id;

  return (
    <div>
      {/* Layout toggle for review */}
      <div className="flex items-center gap-3 mb-6 p-3 bg-primary-lightest rounded-[5px]">
        <span className="text-xs font-semibold text-navy-darkest uppercase">Layout Preview:</span>
        <button
          onClick={() => setLayout('A')}
          className={`px-3 py-1 text-xs rounded-[5px] transition-colors ${
            layout === 'A'
              ? 'bg-navy-darkest text-white'
              : 'bg-white text-navy-dark border border-navy-dark'
          }`}
        >
          Option A: Icon Top
        </button>
        <button
          onClick={() => setLayout('B')}
          className={`px-3 py-1 text-xs rounded-[5px] transition-colors ${
            layout === 'B'
              ? 'bg-navy-darkest text-white'
              : 'bg-white text-navy-dark border border-navy-dark'
          }`}
        >
          Option B: Icon Left
        </button>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-3 gap-4">
        {TEMPLATES.map((template) => (
          <div key={template.id}>
            {layout === 'A'
              ? renderCardA(template, isSelected(template.id), () => handleSelect(template))
              : renderCardB(template, isSelected(template.id), () => handleSelect(template))
            }
          </div>
        ))}
      </div>

      {/* Validation message */}
      {!data.selectedTemplateId && (
        <p className="text-xs text-dark-grey mt-4 text-center">
          Select a template to continue
        </p>
      )}
    </div>
  );
}

/**
 * Option A: Icon centered at top, content below
 * Gallery-style cards with visual emphasis on the icon
 */
function renderCardA(
  template: TemplateOption,
  selected: boolean,
  onSelect: () => void
) {
  const isBlank = template.isBlank;

  // Normal state colors
  const normalBg = isBlank ? 'bg-gray-lightest' : 'bg-white';
  const normalBorder = isBlank ? 'border-dark-grey' : 'border-light-grey';
  const normalText = 'text-navy-darkest';
  const normalDesc = isBlank ? 'text-dark-grey' : 'text-navy-dark';
  const normalIcon = isBlank ? 'text-dark-grey' : 'text-primary';

  // Selected state: reversed colors
  const selectedBg = isBlank ? 'bg-navy-dark' : 'bg-navy-darkest';
  const selectedBorder = isBlank ? 'border-navy-dark' : 'border-navy-darkest';
  const selectedText = 'text-white';
  const selectedDesc = 'text-primary-lighter';
  const selectedIcon = 'text-primary-light';

  const bg = selected ? selectedBg : normalBg;
  const border = selected ? selectedBorder : normalBorder;
  const text = selected ? selectedText : normalText;
  const desc = selected ? selectedDesc : normalDesc;
  const icon = selected ? selectedIcon : normalIcon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left p-5 rounded-[5px] border-2 ${bg} ${border} transition-all duration-200 hover:shadow-md cursor-pointer min-h-[220px] flex flex-col`}
    >
      {/* Icon */}
      <div className={`${icon} mb-4 flex justify-center`}>
        {template.icon}
      </div>

      {/* Name */}
      <h3 className={`text-sm font-semibold ${text} mb-2 text-center`}>
        {template.name}
      </h3>

      {/* Description */}
      <p className={`text-xs ${desc} mb-3 text-center flex-1`}>
        {template.description}
      </p>

      {/* Footer: doc types and setup time */}
      {!isBlank && (
        <div className={`text-xs ${desc} border-t ${selected ? 'border-navy-dark' : 'border-light-grey'} pt-2 mt-auto`}>
          <p className="mb-1">
            <span className={`font-medium ${text}`}>Docs:</span> {template.documentTypes}
          </p>
          <p>
            <span className={`font-medium ${text}`}>Setup:</span> {template.setupTime}
          </p>
        </div>
      )}
    </button>
  );
}

/**
 * Option B: Icon on left, content stacked on right
 * Compact, scannable layout with horizontal card structure
 */
function renderCardB(
  template: TemplateOption,
  selected: boolean,
  onSelect: () => void
) {
  const isBlank = template.isBlank;

  // Normal state colors
  const normalBg = isBlank ? 'bg-gray-lightest' : 'bg-white';
  const normalBorder = isBlank ? 'border-dark-grey' : 'border-light-grey';
  const normalText = 'text-navy-darkest';
  const normalDesc = isBlank ? 'text-dark-grey' : 'text-navy-dark';
  const normalIcon = isBlank ? 'text-dark-grey' : 'text-primary';

  // Selected state: reversed colors
  const selectedBg = isBlank ? 'bg-navy-dark' : 'bg-navy-darkest';
  const selectedBorder = isBlank ? 'border-navy-dark' : 'border-navy-darkest';
  const selectedText = 'text-white';
  const selectedDesc = 'text-primary-lighter';
  const selectedIcon = 'text-primary-light';

  const bg = selected ? selectedBg : normalBg;
  const border = selected ? selectedBorder : normalBorder;
  const text = selected ? selectedText : normalText;
  const desc = selected ? selectedDesc : normalDesc;
  const icon = selected ? selectedIcon : normalIcon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-[5px] border-2 ${bg} ${border} transition-all duration-200 hover:shadow-md cursor-pointer min-h-[220px] flex flex-col`}
    >
      {/* Top row: icon + name */}
      <div className="flex items-start gap-3 mb-2">
        <div className={`${icon} flex-shrink-0`}>
          {template.icon}
        </div>
        <h3 className={`text-sm font-semibold ${text} leading-tight`}>
          {template.name}
        </h3>
      </div>

      {/* Description */}
      <p className={`text-xs ${desc} mb-3 flex-1`}>
        {template.description}
      </p>

      {/* Footer: doc types and setup time */}
      {!isBlank && (
        <div className={`text-xs ${desc} border-t ${selected ? 'border-navy-dark' : 'border-light-grey'} pt-2 mt-auto`}>
          <p className="mb-1">
            <span className={`font-medium ${text}`}>Docs:</span> {template.documentTypes}
          </p>
          <p>
            <span className={`font-medium ${text}`}>Setup:</span> {template.setupTime}
          </p>
        </div>
      )}
    </button>
  );
}
