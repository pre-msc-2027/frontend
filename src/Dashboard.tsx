import "./Dashboard.css";
import React from "react";
import PieChart from "./Component/PieChart.tsx";


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
                <div className="flex flex-row h-full gap-4">
                    {/* Left Side */}
                    <div className="w-3/5 bg-secondary h-full flex flex-row">
                        {/* Content for the left side */}
                        <div className="w-2/4 h-7/10 bg-primary">
                            <div className="h-2/6 bg-secondary">
                                {/*Buttons*/}
                            </div>
                            <div className="h-4/6 flex flex-col items-center p-2 rounded-lg bg-bgsecondary">
                                {/* Pie Chart */}
                                <div className="h-9/10 w-full">
                                    <PieChart />
                                </div>
                                <div className="h-1/10 justify-start w-full">
                                    <p className="text-2xl text-white">Analyse</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-2/4 h-7/10 bg-bgsecondary">

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