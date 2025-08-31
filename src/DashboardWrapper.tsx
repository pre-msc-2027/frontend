import React from "react";
import { useSearchParams } from "react-router-dom";
import Dashboard from "./Dashboard";

const DashboardWrapper: React.FC = () => {
    const [searchParams] = useSearchParams();

    const encodedScan = searchParams.get("scan");
    const scan = encodedScan ? atob(encodedScan) : null;

    return <Dashboard scanId={scan} />;
};

export default DashboardWrapper;
