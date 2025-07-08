import React from 'react';
import { motion, type Variants  } from 'framer-motion';
import { CodeBackground } from './CodeBackground.tsx';
import { AnimatedText } from './AnimatedText.tsx';
import { loginWithGitHub } from '../../Api/service/authServices.ts';

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};


export const Hero: React.FC = () => {
  const animatedWords = [
    'insights',
    'metrics',
    'patterns',
    'commits',
    'code',
    'issues',
    'pullrequests',
    'stats',
    'trends',
    'activity',
    'velocity',
    'quality',
    'performance',
    'security',
    'health',
    'structure',
  ];

  const handleLogin = () => {
    loginWithGitHub();
  };

  // @ts-ignore
  return (
    <motion.div
      className="relative bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 overflow-hidden min-h-screen flex items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <CodeBackground />

      {/* Background patterns */}
      <div className="absolute inset-0 " />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/30" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.h1
          className="text-7xl sm:text-8xl lg:text-9xl font-bold text-gray-900 mb-8 tracking-tight leading-none"
          variants={itemVariants}
        >
          Uncover your repository
          <br />
          <AnimatedText
            texts={animatedWords}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent inline-block"
          />
        </motion.h1>

        <motion.p
          className="text-3xl text-gray-700 mb-16 max-w-3xl mx-auto leading-relaxed font-medium"
          variants={itemVariants}
        >
          A powerful tool that analyzes GitHub repositories to extract key insights, trends, and metrics.
          Built for developers, teams, and open-source maintainers.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            className="group bg-gray-900 hover:bg-gray-800 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center space-x-3 shadow-xl"
            onClick={handleLogin}
          >
            <span className="text-2xl">Connect GitHub</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};
