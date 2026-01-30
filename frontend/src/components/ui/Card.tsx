import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-md p-6 shadow-sm ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-navy mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
}
