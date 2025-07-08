import React, { useEffect, useState } from 'react';
import { Code2, Menu, X, Github } from 'lucide-react';
import Navbar from "../../Component/NavBar.txt";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100); // délai pour déclencher l'animation (légèrement après le montage)
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex items-center justify-between h-28 py-8">
          
          {/* Logo */}
          <div
            className={`flex items-center space-x-2 transition-all duration-700 ease-out
              ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}
          >
            <Code2 className="text-gray-900 w-7 h-7" />
            <span className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">
              SecuScan
            </span>
          </div>

          {/* Desktop Menu */}
          <Navbar/>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-xl p-3 shadow-lg hover:bg-white transition-all duration-200"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute right-4 top-24 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-xl p-5 min-w-[220px] space-y-2 z-50">
              {['Home', 'Dashboard', 'Profile'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block px-4 py-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl transition-all duration-150 text-2xl font-medium"
                >
                  {item}
                </a>
              ))}

              <div className="border-t border-gray-200 my-2"></div>
              
              <a
                href="https://github.com/ton-projet"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center px-4 py-3 bg-black hover:bg-gray-900 text-white rounded-xl text-base font-medium gap-2 transition-transform hover:scale-105"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
