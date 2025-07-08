import "./Dashboard.css";
import React from "react";
import PieChart from "./Component/PieChart.tsx";
import RulesCard from "./Component/RulesCard.tsx";
import LogsDashboard from "./Component/LogsDashboard.tsx";


const Dashboard: React.FC = () => {
    return (

        <div className="h-screen flex flex-col">
            {/* Header */}
            <div className="h-1/8 flex flex-row justify-between m-4">
                {/* Search Bar */}
                <div className="w-3/5 bg-primary">

                </div>
                {/* NavBar */}
                <div className="w-2/5 bg-secondary">

                </div>


            </div>

            {/* White Bar */}
            <div className="h-1 w-3/5 bg-secondary self-center"></div>

            {/* Main Content */}
            <div className="flex-grow m-4">
                <div className="flex flex-col lg:flex-row h-full gap-4">
                    {/* Left Side */}
                    <div className="w-full lg:w-3/5 bg-secondary h-full flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Content for the left side */}
                        <div className="w-full md:w-2/4 h-7/10 gap-4">
                            <div className="h-2/6 bg-secondary">
                                {/*Buttons*/}
                            </div>
                            <div className="h-4/6 flex flex-col items-center m-4 p-2 rounded-lg bg-bg border border-border">
                                {/* Pie Chart */}
                                <div className="h-9/10 w-full ">
                                    <PieChart />
                                </div>
                                <div className="h-1/10 justify-start w-full">
                                    <p className="text-2xl text-text">Analyse</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-2/4 h-7/10 m-4 bg-bg rounded-lg  border border-border">
                            <RulesCard/>
                        </div>
                    </div>
                    {/* Right Side */}
                    <div className="w-full lg:w-2/5 bg-bg rounded-lg border border-border h-full">
                        {/* Content for the right side */}
                        <LogsDashboard/>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;