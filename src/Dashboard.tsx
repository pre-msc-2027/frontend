import "./Dashboard.css";
import MenuRepo from "./Component/MenuRepo.tsx";
import React from "react";

const Dashboard: React.FC = () => {
    return (
        <div className="w-screen h-screen flex">
            <div className="w-1/6 h-4/6 flex self-center m-4">
                <MenuRepo>

                </MenuRepo>
            </div>
            <div>

            </div>
        </div>
    );
};
export default Dashboard;