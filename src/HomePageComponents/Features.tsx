import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Code2, GitBranch, Monitor, Rocket, Zap } from 'lucide-react';

const features = [
  {
    icon: Code2,
    title: 'Multi-Language Support',
    description: 'Deploy React, Vue, Angular, Node.js, Python, and more with automatic detection.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized build pipelines and edge deployment for maximum performance.',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: GitBranch,
    title: 'Git Integration',
    description: 'Automatic deployments from your Git workflow with branch previews.',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    icon: Monitor,
    title: 'Real-time Monitoring',
    description: 'Comprehensive analytics and performance monitoring dashboard.',
    color: 'from-teal-500 to-cyan-500'
  },
  {
    icon: Brain,
    title: 'IA Assistance',
    description: 'Analyzes your code and automatically suggests smart pull requests.',
    color: 'from-pink-400 to-rose-500'
  },
  {
    icon: Rocket,
    title: 'Fast Deployment',
    description: 'Push your code and go live in seconds with zero configuration.',
    color: 'from-green-400 to-lime-500'
  }
];

export const Features: React.FC = () => {
  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-text mb-4">
            Why Choose SecuScan?
          </h2>
          <p className="text-3xl text-text max-w-4xl mx-auto">
            We help you audit and secure your repositories with ease, spot vulnerabilities, ensure compliance, and collaborate with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const direction = index % 2 === 0 ? -100 : 100;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: direction }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
                className="text-center group"
              >
                <div className={`bg-gradient-to-r ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-text" />
                </div>
                <h3 className="text-3xl font-bold text-text-title mb-2">{feature.title}</h3>
                <p className="text-text text-2xl">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
