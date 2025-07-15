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
        <div className="h-screen flex flex-col">
            {/* Header */}
            <div className="flex-none py-4 flex flex-row justify-between mx-4">
                <RepoBranchDropdown />
                <Navbar />
            </div>

            {/* White Bar */}
            <div className="h-1 w-3/5 bg-secondary self-center"></div>

            {/* Main Content */}
            <div className="flex-grow m-4">
                <div className="flex flex-col lg:flex-row h-full gap-4">
                    {/* Left Side */}
                    <div className="w-full lg:w-3/5 flex flex-col h-full gap-4">
                        {/* Top 5/8 area */}
                        <div className="flex flex-col md:flex-row flex-[5] gap-4">
                            {/* Left part: Action Card + Pie chart */}
                            <div className="flex flex-col w-full md:w-2/4 gap-4">
                                {/* Top Action Card */}
                                <div className="flex-1 bg-bg border border-border rounded-lg p-4">
                                    <p className="text-xl text-text">Action Card</p>
                                </div>

                                {/* Pie Chart */}
                                <div className="flex-[2] flex flex-col items-center p-4 bg-bg rounded-lg border border-border">
                                    <div className="flex-1 w-full">
                                        <PieChart />
                                    </div>
                                    <div className="pt-2 w-full">
                                        <p className="text-2xl text-text">Analyse</p>
                                    </div>
                                </div>
                            </div>

                            {/* Rules Card */}
                            <RulesCard />
                        </div>

                        {/* Bottom 3/8 area */}
                        <div className="flex-[3] bg-bg border border-border rounded-lg p-4">
                            <p className="text-xl text-text">Progression bar
                            </p>
                            <DevelopmentProgress currentStage={3} />

                        </div>
                    </div>


                    {/* Right Side */}
                    <div className="w-full lg:w-2/5 bg-bg rounded-lg border border-border flex flex-col p-4">
                        <LogsDashboard />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
