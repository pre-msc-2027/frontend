import React from 'react';
import { 
  GitBranch, 
  Search, 
  FileText, 
  Rocket, 
  CheckCircle, 
  Loader2,
  Globe
} from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'pending' | 'active' | 'completed' | 'error';
}

interface DeploymentStepsProps {
  currentStep?: string;
  isAnalyzing?: boolean;
}

export const DeploymentSteps: React.FC<DeploymentStepsProps> = ({ 
  currentStep = 'initialize', 
  isAnalyzing = false 
}) => {
  const steps: Step[] = [
    {
      id: 'initialize',
      title: 'Initialize',
      description: 'Repository connection',
      icon: GitBranch,
      status: currentStep === 'initialize' ? (isAnalyzing ? 'active' : 'pending') : 
             ['analyze', 'build', 'deploy', 'complete'].includes(currentStep) ? 'completed' : 'pending'
    },
    {
      id: 'analyze',
      title: 'Analyze',
      description: 'Code & dependencies',
      icon: Search,
      status: currentStep === 'analyze' ? 'active' : 
             ['build', 'deploy', 'complete'].includes(currentStep) ? 'completed' : 'pending'
    },
    {
      id: 'build',
      title: 'Build',
      description: 'Compile & optimize',
      icon: FileText,
      status: currentStep === 'build' ? 'active' : 
             ['deploy', 'complete'].includes(currentStep) ? 'completed' : 'pending'
    },
    {
      id: 'deploy',
      title: 'Deploy',
      description: 'Push to production',
      icon: Rocket,
      status: currentStep === 'deploy' ? 'active' : 
             currentStep === 'complete' ? 'completed' : 'pending'
    },
    {
      id: 'complete',
      title: 'Live',
      description: 'Ready to access',
      icon: Globe,
      status: currentStep === 'complete' ? 'completed' : 'pending'
    }
  ];

  const getStepStyles = (step: Step) => {
    const baseStyles = "relative flex flex-col items-center text-center transition-all duration-500";
    
    switch (step.status) {
      case 'completed':
        return `${baseStyles} text-green-400`;
      case 'active':
        return `${baseStyles} text-blue-400 scale-105`;
      case 'error':
        return `${baseStyles} text-red-400`;
      default:
        return `${baseStyles} text-slate-500`;
    }
  };

  const getIconStyles = (step: Step) => {
    const baseStyles = "w-15 h-15 rounded-full flex items-center justify-center mb-3 transition-all duration-500 border-2";
    
    switch (step.status) {
      case 'completed':
        return `${baseStyles} bg-green-500/20 border-green-500 text-green-400`;
      case 'active':
        return `${baseStyles} bg-blue-500/20 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/25`;
      case 'error':
        return `${baseStyles} bg-red-500/20 border-red-500 text-red-400`;
      default:
        return `${baseStyles} border-slate-600 text-slate-500`;
    }
  };


  return (
    <div className="max-w-4xl mx-auto mt-12 mb-8">
      <div className="relative">
        <div className="flex justify-between items-start">
          {steps.map((step) => {
            const StepIcon = step.icon;
            
            return (
              <div key={step.id} className="flex-1 relative">
                <div className={getStepStyles(step)}>
                  <div className={getIconStyles(step)}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : step.status === 'active' ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <StepIcon className="w-6 h-6" />
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-xl mb-1">{step.title}</h3>
                  <p className="text-xm opacity-75">{step.description}</p>
                  
                  {/* Progress indicator dot */}
                  <div className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full transition-all duration-500 ${
                    step.status === 'completed' ? 'bg-green-500' :
                    step.status === 'active' ? 'bg-blue-500 animate-pulse' :
                    'bg-slate-600'
                  }`} />
                </div>
                
                {/* Connector line
                {nextStep && (
                  <div className={getConnectorStyles(step, nextStep)} />
                )} */}
              </div>
            );
          })}
        </div>
        
        {/* Progress bar background
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-700 -z-10" /> */}
      </div>
      
      {/* Status message */}
      <div className="text-center mt-8">
        {currentStep === 'initialize' && !isAnalyzing && (
          <p className="text-slate-400 text-2xl">Enter your GitHub repository URL to begin deployment</p>
        )}
        {currentStep === 'initialize' && isAnalyzing && (
          <p className="text-blue-400 text-2xl">Connecting to repository...</p>
        )}
        {currentStep === 'analyze' && (
          <p className="text-blue-400 text-2xl">Analyzing project structure and dependencies...</p>
        )}
        {currentStep === 'build' && (
          <p className="text-blue-400 text-2xl">Building your application...</p>
        )}
        {currentStep === 'deploy' && (
          <p className="text-blue-400 text-2xl">Deploying to production servers...</p>
        )}
        {currentStep === 'complete' && (
          <p className="text-green-400 text-2xl">Your application is now live and accessible!</p>
        )}
      </div>
    </div>
  );
};