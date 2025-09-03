// ProcessingSteps.tsx
import React, { useState, useEffect } from 'react';
import StepItem from './StepItem.tsx';
import { Github, FolderGit2, GitBranch, ShieldCheck } from "lucide-react";

const steps = [
    {
      title: "Connect GitHub",
      description: "Authenticate with your GitHub account to access your repositories.",
      icon: Github,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Select Repository",
      description: "Choose the repository to analyze from your GitHub account.",
      icon: FolderGit2,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Choose Branch",
      description: "Pick the specific branch you want to scan for security issues.",
      icon: GitBranch,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Start Analysis",
      description: "Launch the comprehensive security code analysis process.",
      icon: ShieldCheck,
      color: "from-orange-500 to-red-600",
    },
  ];

export const ProcessingSteps: React.FC = () => {
  const [visibleSteps, setVisibleSteps] = useState<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleSteps(steps.length);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
      <div className="relative py-20 px-4">
          <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                  <h2 className="text-5xl font-bold text-text mb-4">
                      Step-by-Step Process
                  </h2>
                  <p className="text-3xl text-text max-w-3xl mx-auto">
                      Follow our streamlined process to analyze your code for security vulnerabilities
                  </p>
              </div>

              <div className="relative flex flex-col md:flex-row justify-center items-center md:items-start gap-12 max-w-6xl mx-auto px-4 text-text">
                  {steps.map((step, index) => (
                      <StepItem
                          key={index}
                          step={step}
                          index={index}
                          isVisible={index < visibleSteps}
                      />
                  ))}
              </div>

          </div>
      </div>
  );
};

export default ProcessingSteps;
