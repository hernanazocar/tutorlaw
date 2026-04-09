import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-[#e9ecef] shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {children}
    </div>
  );
}
