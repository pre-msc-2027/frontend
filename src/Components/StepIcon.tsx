// StepIcon.tsx
import React from 'react';

interface StepIconProps {
  icon: React.ElementType;
  color: string;
}

const StepIcon: React.FC<StepIconProps> = ({ icon: Icon, color }) => (
  <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-gradient-to-r ${color} transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3`}>
    <Icon className="w-6 h-6 text-white transition-all duration-300 group-hover:rotate-12" />
  </div>
);

export default StepIcon;
