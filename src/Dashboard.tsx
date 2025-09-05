import React, {useEffect, useState} from "react";
import PieChart from "./Component/PieChart.tsx";
import RulesCard from "./Component/RulesCard.tsx";
import RepoBranchDropdown from "./Component/SelectBar.tsx";
import Navbar from "./Component/NavBar.tsx";
import LogsDashboard from "./Component/LogsDashboard.tsx";
import DevelopmentProgress from "./Component/DeveloppementProgress.tsx";
import { useTheme } from "./useTheme";
import "./Dashboard.css";
import axios from "axios";

interface DashboardProps {
    scanId: string ;
}
interface ScanOptions {
    repo_url: string;
    use_ai_assistance: boolean;
    max_depth: number;
    follow_symlinks: boolean;
    target_type: string;
    target_files: string[];
    severity_min: string;
    branch_id: string;
    commit_hash: string;
}

interface AuthContext {
    user_id: string;
    user_role: string;
    session_id: string;
}

interface Vulnerability {
    file: string;
    line: number;
    type: string;
    severity: string;
    description: string;
    recommendation: string;
}

interface Warning {
    file: string;
    line: number;
    rule_id: number;
    id: number;
}

interface AnalysisSummary {
    total_files: number;
    files_with_vulnerabilities: number;
    vulnerabilities_found: number;
}

interface Analysis {
    status: string;
    summary: AnalysisSummary;
    vulnerabilities: Vulnerability[];
    warnings: Warning[];
}

interface AIComment {
    warning_id: number;
    original: string;
    fixed: string;
}

interface DependencyVulnerability {
    cve_id: string;
    severity: "low" | "medium" | "high" | "critical" | string;
    description: string;
    recommendation: string;
}

interface Dependency {
    name: string;
    version: string;
    vulnerability?: DependencyVulnerability;
}

interface Log {
    timestamp: number;
    message: string;
    error?:  number | null;
}

export interface ScanResult {
    scan_id: string;
    timestamp: string; // ISO string
    project_name: string;
    scanned_by: string;
    scan_version: string;
    scan_options: ScanOptions;
    auth_context: AuthContext;
    notes?: string;
    analysis: Analysis;
    ai_comment?: AIComment[];
    dependencies?: Dependency[];
    logs?: Log[];
}



const Dashboard: React.FC<DashboardProps> = ({ scanId }) => {
    const { theme } = useTheme();
    const [analyse, setAnalyse] = useState<ScanResult | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [isCreatingScan, setIsCreatingScan] = useState(false);
    const baseapiUrl = import.meta.env.VITE_API_URL_BACK
    const baseurl= import.meta.env.VITE_API_URL
    const [selectedRules, setSelectedRules] = useState<string[]>([]);

    // Fetch logged-in user info
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${baseurl}/auth/userinfo`, { withCredentials: true });
                setUsername(res.data.username);
            } catch (err) {
                console.error("❌ Failed to fetch user info:", err);
            }
        };
        fetchUser();
    }, []);

    // Get analyse
    const fetchScan = async () => {
        try {
            const response = await axios.get<ScanResult>(
                `${baseapiUrl}/scans/${scanId}`,
                {
                    withCredentials: true,
                }
            );

            setAnalyse(response.data);
            console.log(analyse);

        } catch (err) {
            console.error("Error fetching available scan:", err);
        }
    };

    useEffect(() => {
        if (scanId != null){
            fetchScan();
        }
    }, [scanId]);

    const handleDownload = () => {
        if (!analyse) return;

        const json = JSON.stringify(analyse, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `analyse_${analyse.scan_id || "result"}.json`;
        link.click();

        URL.revokeObjectURL(url);
    };

    const handleCreateAnalyse = async () => {
        if (!username || !analyse) {
            alert("Please select a scan first or ensure you're logged in.");
            return;
        }

        setIsCreatingScan(true);

        try {
            const response = await axios.post(`${baseapiUrl}/scans`, {
                project_name: analyse.project_name,
                scanned_by: username,
                scan_version: "1.0.0",
                scan_options: {
                    repo_url: analyse.scan_options.repo_url,
                    branch_id: analyse.scan_options.branch_id
                },
                auth_context: {
                    user_id: username,
                    user_role: "user",
                    session_id: "fake-session"
                },
                notes: "New analysis from Dashboard"
            });

            console.log("✅ Scan created:", response.data);

            // Update the current analyse to the new one
            setAnalyse(response.data);

            // Update URL with new scan ID
            const encodedScanId = btoa(response.data.scan_id);
            window.history.pushState({}, '', `/dashboard?scan=${encodeURIComponent(encodedScanId)}`);

            alert("New analysis created successfully!");

        } catch (err) {
            console.error("❌ Failed to create scan:", err);
            alert("Failed to create analysis. Please try again.");
        } finally {
            setIsCreatingScan(false);
        }
    };

    const getCurrentStage = (analyse: ScanResult | null): number => {
        if (!analyse || !analyse.analysis) return 1;

        const status = analyse.analysis.status;

        if (status === "pending" || status === "running") {
            return 1;
        }
        if (status === "completed") {
            return 2;
        }
        if (analyse.ai_comment && analyse.ai_comment.length > 0) {
            return 3;
        }
        if (analyse.logs && analyse.logs.length > 0) {
            return 4;
        }
        return 5;
    };


    return (
        <div className={`dashboard-container lg:h-screen flex flex-col overflow-hidden  gap-4 theme-${theme}`}>
            {/* Header */}
            <div className=" flex-none flex flex-row justify-between items-center p-4">
                <div className="w-full md:w-3/4">
                    <RepoBranchDropdown selectedRules={selectedRules} />
                </div>
                <div className="md:w-fit">
                    <Navbar />
                </div>

            </div>
            {/* Main  */}
            <div className="dashboard-main basis-[80%] flex-grow overflow-hidden mt-4">
                <div className="flex flex-col lg:flex-row gap-6 h-full">
                    {/* Left Side */}
                    <div className="w-full lg:w-3/5 flex flex-col gap-6 h-full overflow-hidden">
                        {/* Top area */}
                        <div className="flex flex-col md:flex-row gap-6 h-3/5">
                            {/* Left half */}
                            <div className="flex flex-col w-full md:w-2/4 gap-6">
                                {/* Action Card */}
                                <div className="action-card flex-1">
                                    <h2 className="glass-title">Quick Actions</h2>
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <button
                                            className={`glass-card p-3 text-center hover:scale-105 transition-transform ${
                                                isCreatingScan ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                            onClick={handleCreateAnalyse}
                                            disabled={isCreatingScan || !analyse}
                                        >
                                            <p className="text-sm mt-2">
                                                {isCreatingScan ? 'Creating...' : 'New Analyse'}
                                            </p>
                                        </button>
                                        <button
                                            onClick={handleDownload}
                                            className="glass-card p-3 text-center hover:scale-105 transition-transform"
                                            disabled={!analyse}
                                        >
                                            <p className="text-sm mt-2">Download Analyse result</p>
                                        </button>
                                    </div>
                                </div>

                                {/* Pie Chart  */}
                                <div className="pie-chart-card flex-[2]">
                                    <div className="flex-1 w-full overflow-hidden">
                                        <PieChart scanId={scanId} />
                                    </div>
                                    <div className="pt-4 w-full text-center">
                                        <h2 className="glass-subtitle">Analysis Overview</h2>
                                    </div>
                                </div>
                            </div>

                            {/* Right half - Rules Card */}
                            <div className="md:w-2/4 lg:h-full">
                                <div className="rules-card h-full">
                                    <h2 className="glass-title">Security Rules</h2>
                                    <RulesCard
                                        selectedRules={selectedRules}
                                        onSelectedRulesChange={setSelectedRules}
                                    />

                                </div>
                            </div>
                        </div>

                        {/* Bottom area - Progress Card */}
                        <div className="progress-card flex-[2] h-2/5 overflow-hidden">
                            <h2 className="glass-title">Development Progress</h2>
                            <div className="mt-4">
                                <DevelopmentProgress currentStage={getCurrentStage(analyse)} />
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Logs Dashboard */}
                    <div className="w-full lg:w-2/5 logs-card flex flex-col overflow-hidden">
                        <h2 className="glass-title">System Logs</h2>
                        <div className="flex-1 overflow-hidden">
                            <LogsDashboard logs={analyse?.logs} ai_comment={analyse?.ai_comment} Analysis={analyse?.analysis.warnings}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;