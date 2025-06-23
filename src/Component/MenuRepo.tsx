import React from "react";
import '../index.css';
import Repo from "./Repo.tsx";

const MenuRepo: React.FC = () => {
    return (
        <div className="flex flex-col bg-sidebar rounded-lg p-4 h-full max-h-screen overflow-hidden">
            <div className="text-center mb-2">
                <p className="text-xl">GitHub Repositories</p>
            </div>

            <div className="h-0.5 w-full bg-gray-300 my-2"></div>

            <div className="flex flex-col gap-2 flex-grow overflow-hidden">
                <div className="shrink-0">
                    <p className="font-medium">Last One:</p>
                    <Repo />
                    <p className="mt-2 font-medium">My favorites:</p>
                </div>

                <div className="overflow-y-auto flex-grow rounded-md pr-1">
                    <Repo />
                    <Repo />
                    <Repo />
                </div>

                <div className="h-0.5 w-full bg-gray-300 my-2"></div>

                <div className="overflow-y-auto flex-grow rounded-md pr-1">
                    <Repo />
                    <Repo />
                    <Repo />
                    <Repo />
                    <Repo />
                    <Repo />
                    <Repo />
                    <Repo />
                </div>
            </div>
        </div>
    );
};

export default MenuRepo;
