import React from "react";
import { useSearchParams } from "react-router-dom";
import Dashboard from "./Dashboard";

const DashboardWrapper: React.FC = () => {
    const [searchParams] = useSearchParams();

    const repo = searchParams.get("repo") || "default-repo";
    const branch = searchParams.get("branch") || "default-branch";
    const scan = searchParams.get("scan") || "default-scan";

    // La clé unique force le remount quand un param change
    const key = `${repo}-${branch}-${scan}`;

    return <Dashboard key={key} />;
};

export default DashboardWrapper;
