import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg p-6 border border-light-grey ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
