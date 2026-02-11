import type { SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  fullWidth?: boolean;
}

export function Select({
  label,
  options,
  error,
  fullWidth = false,
  ...props
}: SelectProps) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-navy-darkest mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          {...props}
          className={`
            ${fullWidth ? 'w-full' : ''}
            pl-3 pr-10 py-2 text-sm
            border-2 ${error ? 'border-red' : 'border-navy-dark'}
            bg-primary-lighter text-navy-darkest
            rounded-[5px]
            appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
          `}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2307464C' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.75rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.25em 1.25em'
          }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red">{error}</p>
      )}
    </div>
  );
}
