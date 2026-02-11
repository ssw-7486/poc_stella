import type { ChangeEvent } from 'react';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  label?: string;
  disabled?: boolean;
}

export function RadioGroup({
  name,
  value,
  onChange,
  options,
  label,
  disabled = false
}: RadioGroupProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-sm font-medium text-navy-darkest">
          {label}
        </label>
      )}

      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="radio"
                id={`${name}-${option.value}`}
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={handleChange}
                disabled={disabled}
                className={`
                  w-4 h-4 rounded-full border-2 border-navy-dark
                  text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2
                  cursor-pointer transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              />
            </div>
            <div className="ml-3 flex-1">
              <label
                htmlFor={`${name}-${option.value}`}
                className={`text-sm font-medium text-navy-darkest ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
              >
                {option.label}
              </label>
              {option.description && (
                <p className="text-xs text-dark-grey mt-0.5">
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
