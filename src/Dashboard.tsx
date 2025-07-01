import "./Dashboard.css";
import MenuRepo from "./Component/MenuRepo.tsx";
import React from "react";
import PieChart from "./Component/PieChart.tsx";
import LogsDashboard from "./Component/LogsDashboard.tsx";
import RulesCard from "./Component/RulesCard.tsx";

const Dashboard: React.FC = () => {
    return (
        <div className="h-screen flex flex-col lg:flex-row p-4">
            <div className="hidden lg:flex w-ful lg:w-1/6 h-4/6 self-center">
                <MenuRepo>
                </MenuRepo>
            </div>
                <div className="lg:w-5/6 flex justify-center flex-col lg:flex-row lg:items-stretch items-center p-4">
                    <div className="flex flex-col md:flex-row lg:flex-col">
                        <div className="p-2 w-full md:w-2/4 lg:w-full">
                            <PieChart/>
                        </div>
                        <div className="p-2 w-full md:w-2/4 lg:w-full">
                            <RulesCard/>
                        </div>
                    </div>

                    <div className="w-full md:2/4 lg:w-4/6 lg:h-4/6 m-4">
                        <LogsDashboard/>
                    </div>
                </div>
            </div>
            );
            };
            export default Dashboard;