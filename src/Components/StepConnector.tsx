// StepConnector.tsx
import React from 'react';

interface StepConnectorProps {
  show: boolean;
}

const StepConnector: React.FC<StepConnectorProps> = ({ show }) => (
  show ? (
    <div className="absolute left-6 top-14 w-0.5 h-16 bg-gradient-to-b from-gray-200 to-gray-300 group-hover:from-gray-300 group-hover:to-gray-400 transition-all duration-300"></div>
  ) : null
);

export default StepConnector;
