// App.tsx - Remove Router wrapper
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Home from './HomePage';
import { useTheme } from './useTheme';
import './ThemeSystem.css';

const App: React.FC = () => {
    const { theme } = useTheme();

    React.useEffect(() => {
        document.body.className = `theme-${theme}`;
        document.documentElement.setAttribute('data-theme', theme);
        document.body.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }, [theme]);

    return (
        <div className={`app-wrapper theme-${theme}`}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </div>
    );
};

export default App;