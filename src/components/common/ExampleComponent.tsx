import React from 'react';

interface ExampleComponentProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export const ExampleComponent: React.FC<ExampleComponentProps> = ({
  title,
  children,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}; 