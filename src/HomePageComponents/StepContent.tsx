// StepContent.tsx
import React from 'react';

interface StepContentProps {
  title: string;
  description: string;
}

const StepContent: React.FC<StepContentProps> = ({ title, description }) => (
    <div className="mt-6 text-center max-w-xs">
      <h3 className="text-3xl font-bold mb-2 text-black-800">
        {title}
      </h3>
      <p className="text-black-600 text-2xl leading-relaxed">
        {description}
      </p>
    </div>
  );

export default StepContent;