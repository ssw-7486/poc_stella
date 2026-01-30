import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = `
    px-6 py-3
    rounded-md
    font-medium
    transition-all duration-200
    min-h-[44px] min-w-[44px]
    flex items-center justify-center
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantStyles = {
    primary: 'bg-blue text-white hover:opacity-90 active:scale-[0.98]',
    secondary: 'bg-green text-white hover:opacity-90 active:scale-[0.98]',
    outline: 'border-2 border-blue text-blue bg-transparent hover:bg-blue hover:text-white',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
