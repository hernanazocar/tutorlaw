import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg border border-[#e8e4da] shadow-sm ${className}`}>
      {children}
    </div>
  );
}
