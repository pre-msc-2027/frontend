import React, {useEffect} from "react";
import PieChart from "./Component/PieChart.tsx";
import RulesCard from "./Component/RulesCard.tsx";
import RepoBranchDropdown from "./Component/SelectBar.tsx";
import Navbar from "./Component/NavBar.tsx";
import LogsDashboard from "./Component/LogsDashboard.tsx";
import DevelopmentProgress from "./Component/DeveloppementProgress.tsx";
import { useTheme } from "./useTheme";
import "./Dashboard.css";
import axios from "axios";

interface DashboardProps {
    scanId: string | null;
    key: string | null;
}


const Dashboard: React.FC<DashboardProps> = ({ key, scanId }) => {
    const { theme } = useTheme();


    return (
        <div className={`dashboard-container lg:h-screen flex flex-col overflow-hidden  gap-4 theme-${theme}`}>
            {/* Header with glassmorphism */}
            <div className=" flex-none flex flex-row justify-between items-center">
                <RepoBranchDropdown />
                <Navbar />
            </div>
            {/* Main Content */}
            <div className="dashboard-main basis-[80%] flex-grow overflow-hidden mt-4">
                <div className="flex flex-col lg:flex-row gap-6 h-full">
                    {/* Left Side */}
                    <div className="w-full lg:w-3/5 flex flex-col gap-6 h-full overflow-hidden">
                        {/* Top area */}
                        <div className="flex flex-col md:flex-row gap-6 h-3/5">
                            {/* Left half */}
                            <div className="flex flex-col w-full md:w-2/4 gap-6">
                                {/* Action Card */}
                                <div className="action-card flex-1">
                                    <h2 className="glass-title">Quick Actions</h2>
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <button className="glass-card p-3 text-center hover:scale-105 transition-transform">

                                            <p className="text-sm mt-2">Analyse</p>
                                        </button>
                                        <button className="glass-card p-3 text-center hover:scale-105 transition-transform">

                                            <p className="text-sm mt-2">Get to site</p>
                                        </button>
                                    </div>
                                </div>

                                {/* Pie Chart Card */}
                                <div className="pie-chart-card flex-[2]">
                                    <div className="flex-1 w-full overflow-hidden">
                                        <PieChart />
                                    </div>
                                    <div className="pt-4 w-full text-center">
                                        <h2 className="glass-subtitle">Analysis Overview</h2>
                                    </div>
                                </div>
                            </div>

                            {/* Right half - Rules Card */}
                            <div className="md:w-2/4 lg:h-full">
                                <div className="rules-card h-full">
                                    <h2 className="glass-title">Security Rules</h2>
                                    <RulesCard />
                                </div>
                            </div>
                        </div>

                        {/* Bottom area - Progress Card */}
                        <div className="progress-card flex-[2] h-2/5 overflow-hidden">
                            <h2 className="glass-title">Development Progress</h2>
                            <div className="mt-4">
                                <DevelopmentProgress currentStage={3} />
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Logs Dashboard */}
                    <div className="w-full lg:w-2/5 logs-card flex flex-col overflow-hidden">
                        <h2 className="glass-title">System Logs</h2>
                        <div className="flex-1 overflow-hidden">
                            <LogsDashboard />
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

