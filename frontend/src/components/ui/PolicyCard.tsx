import { Checkbox } from './Checkbox';

interface PolicyCardProps {
  title: string;
  description: string;
  checked: boolean;
  onCheck: (checked: boolean) => void;
  id?: string;
}

export function PolicyCard({
  title,
  description,
  checked,
  onCheck,
  id
}: PolicyCardProps) {
  const handleViewDocument = () => {
    // Phase 2 feature - stub with alert
    alert('Feature coming soon: Policy document viewer');
  };

  return (
    <div className="border border-light-grey rounded-[5px] p-4 bg-white">
      {/* Header with Checkbox */}
      <div className="flex items-start gap-3 mb-3">
        <Checkbox
          id={id}
          checked={checked}
          onChange={(e) => onCheck(e.target.checked)}
          className="mt-0.5"
        />
        <label
          htmlFor={id}
          className="flex-1 text-sm font-semibold text-navy-darkest cursor-pointer"
        >
          {title}
        </label>
      </div>

      {/* Description */}
      <p className="text-sm text-navy-dark mb-3 ml-7">{description}</p>

      {/* View Document Link */}
      <button
        type="button"
        onClick={handleViewDocument}
        className="text-xs text-primary hover:text-primary-medium transition-colors font-medium ml-7"
      >
        View Document →
      </button>
    </div>
  );
}
