// StepItem.tsx
import React from 'react';
import StepIcon from './StepIcon.tsx';
import StepContent from './StepContent.tsx';
import StepConnector from './StepConnector.tsx';

interface Step {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

interface StepItemProps {
  step: Step;
  index: number;
  isVisible: boolean;
}

const StepItem: React.FC<StepItemProps> = ({ step, index, isVisible }) => (
  <div
    className={`relative flex items-start group transition-all duration-700 transform ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
    }`}
    style={{ transitionDelay: `${index * 200}ms` }}
  >
    <StepConnector show={index < 3 /* ou steps.length - 1 si exporté */} />
    <StepIcon icon={step.icon} color={step.color} />
    <StepContent title={step.title} description={step.description} />
  </div>
);

export default StepItem;
