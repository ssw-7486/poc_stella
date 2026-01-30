import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm font-medium text-navy"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            px-4 py-3
            rounded-md
            bg-input-section-bg
            border border-input-border
            text-navy
            placeholder:text-navy/50
            focus:outline-none
            focus:ring-2
            focus:ring-blue
            focus:border-transparent
            transition-all
            min-h-[44px]
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
