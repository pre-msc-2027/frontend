// StepContent.tsx
import React from 'react';

interface StepContentProps {
  title: string;
  description: string;
}

const StepContent: React.FC<StepContentProps> = ({ title, description }) => (
  <div className="ml-8 pb-10 transition-all duration-500 group-hover:translate-x-2">
    <h3 className="text-3xl font-bold mb-3 text-gray-800 group-hover:text-gray-900 transition-all duration-300 group-hover:scale-105 origin-left">
      {title}
    </h3>
    <p className="text-black-600 text-2xl group-hover:text-gray-700 transition-all duration-300 leading-relaxed max-w-md">
      {description}
    </p>
  </div>
);

export default StepContent;
