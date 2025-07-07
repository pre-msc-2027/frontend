// StepIcon.tsx
import React from 'react';

interface StepIconProps {
  icon: React.ElementType;
  color: string;
}

const StepIcon: React.FC<StepIconProps> = ({ icon: Icon, color }) => (
  <div className={`mb-4 w-14 h-14 flex items-center justify-center rounded-full shadow-lg bg-gradient-to-r ${color} transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3`}>
    <Icon className="w-6 h-6 text-white transition-all duration-300 group-hover:rotate-12" />
  </div>
);

export default StepIcon;
