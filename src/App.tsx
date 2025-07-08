import { Routes, Route, useLocation } from 'react-router-dom';
import {AnimatePresence, easeInOut, motion} from 'framer-motion';
import Home from './Home/HomePage.tsx' ;
import Dashboard from './Dashboard';
import PrivateRoute from './Component/PrivateRoute.tsx';
import Navbar from "./Component/NavBar.tsx";
import RepoBranchSelector from "./Component/SelectBar.tsx";
import SelectBranch from "./Repo/SelectBranch.tsx"


function App() {
    const location = useLocation();

    // Animation variants for page transitions
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    const pageTransition = {
        duration: 0.4,
        ease: easeInOut,
    };

    return (
        <>
        <div className="bg-bg w-screen h-screen">
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route
                        path="/"
                        element={
                            <motion.div
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                variants={pageVariants}
                                transition={pageTransition}
                            >
                                <Home />
                            </motion.div>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <motion.div
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                variants={pageVariants}
                                transition={pageTransition}
                            >
                                <PrivateRoute><Dashboard /></PrivateRoute>
                            </motion.div>
                        }
                    />


                </Routes>
            </AnimatePresence>
        </div>
        </>
    );
}

export default App;
