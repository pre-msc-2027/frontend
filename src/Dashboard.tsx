import "./Dashboard.css";
import React from "react";
import PieChart from "./Component/PieChart.tsx";
import RulesCard from "./Component/RulesCard.tsx";


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
                    <div className="lg:w-3/5 bg-secondary h-full flex flex-row">
                        {/* Content for the left side */}
                        <div className="w-2/4 h-7/10 ">
                            <div className="h-2/6 bg-secondary">
                                {/*Buttons*/}
                            </div>
                            <div className="h-4/6 flex flex-col items-center m-4 p-2 rounded-lg bg-bgsecondary border border-border">
                                {/* Pie Chart */}
                                <div className="h-9/10 w-full ">
                                    <PieChart />
                                </div>
                                <div className="h-1/10 justify-start w-full">
                                    <p className="text-2xl text-white">Analyse</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-2/4 h-7/10 m-4 bg-bgsecondary rounded-lg  border border-border">
                            <RulesCard/>
                        </div>
                    </div>
                    {/* Right Side */}
                    <div className="w-2/5 bg-primary h-full">
                        {/* Content for the right side */}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;