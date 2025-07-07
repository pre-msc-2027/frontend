import React from 'react';

export const CodeBackground: React.FC = () => {
  const codeSnippets = [
    { text: '</>', x: '10%', y: '20%', delay: '0s', size: 'text-lg', direction: 'float-right' },
    { text: 'C++', x: '80%', y: '15%', delay: '0.5s', size: 'text-base', direction: 'float-left' },
    { text: '<html>', x: '15%', y: '70%', delay: '1s', size: 'text-lg', direction: 'float-up' },
    { text: 'Java', x: '75%', y: '60%', delay: '1.5s', size: 'text-base', direction: 'float-down' },
    { text: 'React', x: '20%', y: '40%', delay: '2s', size: 'text-xl', direction: 'float-diagonal' },
    { text: 'Python', x: '85%', y: '80%', delay: '2.5s', size: 'text-lg', direction: 'float-circle' },
    { text: 'Node.js', x: '5%', y: '85%', delay: '3s', size: 'text-base', direction: 'float-right' },
    { text: 'TypeScript', x: '70%', y: '35%', delay: '3.5s', size: 'text-lg', direction: 'float-left' },
    { text: '{...}', x: '25%', y: '10%', delay: '4s', size: 'text-2xl', direction: 'float-up' },
    { text: 'CSS', x: '90%', y: '45%', delay: '4.5s', size: 'text-base', direction: 'float-down' },
    { text: 'const', x: '35%', y: '65%', delay: '5s', size: 'text-sm', direction: 'float-diagonal' },
    { text: 'function()', x: '50%', y: '25%', delay: '5.5s', size: 'text-base', direction: 'float-circle' },
    { text: 'import', x: '12%', y: '55%', delay: '6s', size: 'text-sm', direction: 'float-right' },
    { text: 'export', x: '88%', y: '65%', delay: '6.5s', size: 'text-sm', direction: 'float-left' },
  ];

  const devopsIcons = [
    { text: '⚙️', x: '30%', y: '25%', delay: '1s', direction: 'spin-slow' },
    { text: '🐳', x: '60%', y: '70%', delay: '2s', direction: 'float-wave' },
    { text: '☁️', x: '40%', y: '80%', delay: '3s', direction: 'float-drift' },
    { text: '🔧', x: '85%', y: '25%', delay: '4s', direction: 'spin-slow' },
    { text: '📊', x: '10%', y: '50%', delay: '5s', direction: 'float-wave' },
    { text: '🚀', x: '65%', y: '20%', delay: '6s', direction: 'float-rocket' },
    { text: '⚡', x: '45%', y: '15%', delay: '7s', direction: 'flash' },
    { text: '🔒', x: '25%', y: '75%', delay: '8s', direction: 'float-drift' },
  ];

  return (
    <>
      {/* Styles CSS pour les animations */}
      <style>{`
        @keyframes float-right {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          25% { transform: translateX(15px) translateY(-10px); }
          50% { transform: translateX(30px) translateY(0px); }
          75% { transform: translateX(15px) translateY(10px); }
        }
        
        @keyframes float-left {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          25% { transform: translateX(-15px) translateY(-10px); }
          50% { transform: translateX(-30px) translateY(0px); }
          75% { transform: translateX(-15px) translateY(10px); }
        }
        
        @keyframes float-up {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-40px) translateX(0px); }
          75% { transform: translateY(-20px) translateX(-10px); }
        }
        
        @keyframes float-down {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(20px) translateX(-10px); }
          50% { transform: translateY(40px) translateX(0px); }
          75% { transform: translateY(20px) translateX(10px); }
        }
        
        @keyframes float-diagonal {
          0%, 100% { transform: translate(0px, 0px); }
          25% { transform: translate(20px, -20px); }
          50% { transform: translate(40px, -40px); }
          75% { transform: translate(20px, -20px); }
        }
        
        @keyframes float-circle {
          0% { transform: translate(0px, 0px); }
          25% { transform: translate(25px, -25px); }
          50% { transform: translate(0px, -50px); }
          75% { transform: translate(-25px, -25px); }
          100% { transform: translate(0px, 0px); }
        }
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes float-wave {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.1); }
        }
        
        @keyframes float-drift {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          33% { transform: translate(15px, -15px) rotate(5deg); }
          66% { transform: translate(-15px, -30px) rotate(-5deg); }
        }
        
        @keyframes float-rocket {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-50px) rotate(10deg); }
        }
        
        @keyframes flash {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        
        .float-right { animation: float-right 8s ease-in-out infinite; }
        .float-left { animation: float-left 8s ease-in-out infinite; }
        .float-up { animation: float-up 10s ease-in-out infinite; }
        .float-down { animation: float-down 10s ease-in-out infinite; }
        .float-diagonal { animation: float-diagonal 12s ease-in-out infinite; }
        .float-circle { animation: float-circle 15s ease-in-out infinite; }
        .spin-slow { animation: spin-slow 20s linear infinite; }
        .float-wave { animation: float-wave 6s ease-in-out infinite; }
        .float-drift { animation: float-drift 14s ease-in-out infinite; }
        .float-rocket { animation: float-rocket 7s ease-in-out infinite; }
        .flash { animation: flash 3s ease-in-out infinite; }
      `}</style>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Code snippets avec mouvement */}
        {codeSnippets.map((snippet, index) => (
          <div
            key={index}
            className={`absolute font-mono font-semibold text-gray-400 opacity-60 hover:opacity-80 transition-opacity ${snippet.size} ${snippet.direction}`}
            style={{
              left: snippet.x,
              top: snippet.y,
              animationDelay: snippet.delay,
              textShadow: '0 0 10px rgba(59, 130, 246, 0.3)',
            }}
          >
            {snippet.text}
          </div>
        ))}
        
        {/* DevOps icons avec mouvement */}
        {devopsIcons.map((icon, index) => (
          <div
            key={index}
            className={`absolute text-3xl opacity-40 hover:opacity-60 transition-opacity ${icon.direction}`}
            style={{
              left: icon.x,
              top: icon.y,
              animationDelay: icon.delay,
              filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.2))',
            }}
          >
            {icon.text}
          </div>
        ))}
      </div>
    </>
  );
};