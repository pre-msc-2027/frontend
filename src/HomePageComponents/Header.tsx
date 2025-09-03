import React, { useEffect, useState } from 'react';
import { Code2 } from 'lucide-react';
import Navbar from "../Component/NavBar.tsx";

export const Header: React.FC = () => {
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
            <Code2 className="text-text w-7 h-7"/>
            <span className="text-3xl sm:text-4xl font-semibold text-text tracking-tight">
              SecuScan
            </span>
          </div>

          {/* Desktop Menu */}
          <Navbar/>
        </div>
      </div>
    </header>
  );
};
