import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../useTheme';
import './NavBar.css';

const Navbar: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="glass-navbar">
            {/* Navigation Links */}
            <NavLink to="/" className="nav-link">
                {({ isActive }) => (
                    <motion.div
                        className={`nav-item ${isActive ? 'active' : ''}`}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                        <Home size={20} />
                        <span className="nav-text">Home</span>
                    </motion.div>
                )}
            </NavLink>

            <NavLink to="/dashboard" className="nav-link">
                {({ isActive }) => (
                    <motion.div
                        className={`nav-item ${isActive ? 'active' : ''}`}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                        <LayoutDashboard size={20} />
                        <span className="nav-text">Dashboard</span>
                    </motion.div>
                )}
            </NavLink>

            {/* Enhanced Theme Toggle */}
            <motion.button
                className="theme-toggle theme-toggle-enhanced"
                onClick={toggleTheme}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
                <AnimatePresence mode="wait">
                    {theme === 'dark' ? (
                        <motion.div
                            key="sun"
                            initial={{ rotate: -180, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 180, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Sun size={18} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="moon"
                            initial={{ rotate: 180, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -180, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Moon size={18} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </nav>
    );
};

export default Navbar;