import React from 'react';
import { Facebook, Twitter, Github, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="text-text py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-700 pb-8">
          <h3 className="text-2xl font-bold text-text mb-4 md:mb-0">
            SecuScan
          </h3>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-xl">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-xl">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-xl">Contact</a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
          <p className="text-gray-500 text-xl mb-4 sm:mb-0">
            © {new Date().getFullYear()} SecuScan. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors">
              <Facebook className="w-7 h-7" />
            </a>
            <a href="#" className="text-gray-500 hover:text-sky-400 transition-colors">
              <Twitter className="w-7 h-7" />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">
              <Github className="w-7 h-7" />
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-500 transition-colors">
              <Linkedin className="w-7 h-7" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
