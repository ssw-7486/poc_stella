import { forwardRef, type InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className = '', ...props }, ref) => {
    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="checkbox"
            className={`
              w-4 h-4
              rounded-[5px]
              border-2 border-navy-dark
              bg-white
              checked:bg-primary checked:border-primary
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              transition-colors duration-200
              cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="ml-3">
            {label && (
              <label
                htmlFor={props.id}
                className="text-sm font-medium text-navy-darkest cursor-pointer select-none"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-dark-grey mt-0.5">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
