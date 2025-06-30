import "./Dashboard.css";
import MenuRepo from "./Component/MenuRepo.tsx";
import React from "react";
import PieChart from "./Component/PieChart.tsx";
import LogsDashboard from "./Component/LogsDashboard.tsx";

const Dashboard: React.FC = () => {
    return (
        <div className="w-screen h-screen flex flex-col lg:flex-row bg-bg">
            <div className="w-ful lg:w-1/6 h-4/6 flex self-center m-4">
                <MenuRepo>

                </MenuRepo>
            </div>
            <div className="lg:w-4/6 flex p-4 justify-center flex-col lg:flex-row lg:items-stretch items-center">
                <div className=" w-fit md:w-2xl md:2/4 lg:w-2/6 lg:h-2/6 m-4">
                    <PieChart/>
                </div>
                <div className="w-full md:2/4 lg:w-4/6 lg:h-4/6 m-4">
                    <LogsDashboard/>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;