// StepConnector.tsx
import React from 'react';

interface StepConnectorProps {
  show: boolean;
}

const StepConnector: React.FC<StepConnectorProps> = ({ show }) => (
  show ? (
    <div className="absolute top-6 left-12 h-0.5 w-24 bg-gradient-to-r from-gray-200 to-gray-300" />
  ) : null
);


export default StepConnector;
