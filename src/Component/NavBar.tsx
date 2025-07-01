import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';
import { Home, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [theme, setTheme] = React.useState<'light' | 'dark'>(
        localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
    );

    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

    return (

            <nav className="glass-navbar">
                {/* HOME */}
                <NavLink to="/" className="nav-link">
                    {({ isActive }) => (
                        <motion.div
                            className="nav-item"
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <Home size={24} />
                            <AnimatePresence>
                                {isActive && (
                                    <motion.span
                                        className="nav-text"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 5 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        Home
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </NavLink>

                <NavLink to="/dashboard" className="nav-link">
                    {({ isActive }) => (
                        <motion.div
                            className="nav-item"
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <LayoutDashboard size={24} />
                            <AnimatePresence>
                                {isActive && (
                                    <motion.span
                                        className="nav-text"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 5 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        Dashboard
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </NavLink>



                <motion.button
                    className="theme-toggle"
                    onClick={toggleTheme}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </motion.button>
            </nav>

    );
};

export default Navbar;
