import "./Dashboard.css";
import React from "react";
import PieChart from "./Component/PieChart.tsx";
import RulesCard from "./Component/RulesCard.tsx";
import RepoBranchDropdown from "./Component/SelectBar.tsx";
import Navbar from "./Component/NavBar.tsx";
import LogsDashboard from "./Component/LogsDashboard.tsx";
import DevelopmentProgress from "./Component/DeveloppementProgress.tsx";

const Dashboard: React.FC = () => {
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Header */}
            <div className="basis-[10%] flex-none flex flex-row justify-between m-2">
                <RepoBranchDropdown />
                <Navbar />
            </div>

            {/* Main Content */}
            <div className="basis-[90%] flex-grow overflow-hidden m-4">
                <div className="flex flex-col lg:flex-row gap-4 h-full">
                    {/* Left Side */}
                    <div className="w-full lg:w-3/5 flex flex-col gap-4 h-full overflow-hidden">
                        {/* Top area */}
                        <div className="flex flex-col md:flex-row gap-4 h-5/7">
                            {/* Left half */}
                            <div className="flex flex-col w-full md:w-2/4 gap-4">
                                <div className="flex-1 bg-bg border border-border rounded-lg p-4">
                                    <p className="text-xl text-text">Action Card</p>
                                </div>
                                <div className="flex-[2] flex flex-col items-center p-4 bg-bg rounded-lg border border-border overflow-hidden">
                                    <div className="flex-1 w-full overflow-hidden">
                                        <PieChart />
                                    </div>
                                    <div className="pt-2 w-full">
                                        <p className="text-2xl text-text">Analyse</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right half */}
                            <div className="w-2/4 overflow-hidden">
                                <RulesCard />
                            </div>
                        </div>

                        {/* Bottom area */}
                        <div className="flex-[3] bg-bg border border-border rounded-lg p-4 overflow-hidden h-2/7">
                            <p className="text-xl text-text">Progression bar</p>
                            <DevelopmentProgress currentStage={3} />
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="w-full lg:w-2/5 bg-bg rounded-lg border border-border flex flex-col p-4 overflow-hidden">
                        <LogsDashboard />
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Dashboard;
