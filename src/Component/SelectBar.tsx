import { useEffect, useState } from "react";
import axios from "axios";
import "./SelectBar.css";
import {useNavigate} from "react-router-dom";

interface RepoData {
    repo: string;
    repo_url: string;
    branches: string[];
}

interface AnalysisData {
    scan_id: string;
    project_name: string;
    branch_id: string;
    repo_url: string;
    date: string;
}

interface UserRepo {
    id: string;
    name: string;
    full_name: string;
    html_url: string;
    description?: string;
    private: boolean;
    branches?: string[];
}

export default function RepoBranchDropdown() {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string | null>(null);
    const [addedRepos, setAddedRepos] = useState<RepoData[]>([]);
    const [availableRepos, setAvailableRepos] = useState<UserRepo[]>([]);
    const [userAnalyses, setUserAnalyses] = useState<AnalysisData[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [expandedRepo, setExpandedRepo] = useState<string>("");
    const [expandedBranch, setExpandedBranch] = useState<string>("");

    // Fetch logged-in user info
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("http://localhost:5000/auth/userinfo", { withCredentials: true });
                setUsername(res.data.username);
            } catch (err) {
                console.error("❌ Failed to fetch user info:", err);
            }
        };
        fetchUser();
    }, []);

    // Fetch user analyses
    const fetchUserAnalyses = async (currentUsername: string) => {
        try {
            const scansRes = await axios.get(`http://localhost:8001/scans/summary/${currentUsername}`);
            const analyses: AnalysisData[] = [];
            scansRes.data.forEach((r: any) => {
                r.analyses.forEach((a: any) => {
                    analyses.push({
                        scan_id: a.scan_id,
                        project_name: a.project_name,
                        branch_id: a.branch_id,
                        repo_url: r.repo_url,
                        date: new Date(parseInt(a.scan_id)).toLocaleDateString(),
                    });
                });
            });
            setUserAnalyses(analyses);
        } catch (err) {
            console.error("❌ Failed to fetch analyses:", err);
        }
    };

    // Fetch repos and analyses after username is available
    useEffect(() => {
        if (!username) return;

        const fetchData = async () => {
            try {
                // Saved repos
                const repoRes = await axios.get(`http://localhost:8001/repositories/user/${username}`);
                const repos: RepoData[] = repoRes.data.map((r: any) => ({
                    repo: r.name,
                    repo_url: r.repo_url,
                    branches: r.branches || [],
                }));
                setAddedRepos(repos);

                // User scans/analyses
                await fetchUserAnalyses(username);

                // Available GitHub repos
                const ghRes = await axios.get(`${import.meta.env.VITE_API_URL}/auth/repos`, { withCredentials: true });
                setAvailableRepos(ghRes.data);
            } catch (err) {
                console.error("❌ Failed to fetch data:", err);
            }
        };

        fetchData();
    }, [username]);

    const getAnalysesForRepo = (repoUrl: string, branchId: string) =>
        userAnalyses.filter(a => a.repo_url === repoUrl && a.branch_id === branchId);

    const handleRepoClick = (repo: RepoData) => {
        if (expandedRepo === repo.repo) {
            setExpandedRepo("");
            setExpandedBranch("");
        } else {
            setExpandedRepo(repo.repo);
            setExpandedBranch("");
        }
    };

    const handleBranchClick = (repo: RepoData, branch: string) => {
        const key = `${repo.repo}-${branch}`;
        setExpandedBranch(expandedBranch === key ? "" : key);
    };

    const handleAnalysisSelect = (scanId: string) => {
        const encodedScanId = btoa(scanId);
        navigate(`/dashboard?scan=${encodeURIComponent(encodedScanId)}`);
    };

    const handleAddRepo = () => setShowModal(true);
    const handleModalClose = () => setShowModal(false);

    const handleSelectRepo = async (repo: UserRepo) => {
        try {
            const userInfo = await axios.get("http://localhost:5000/auth/userinfo", { withCredentials: true });
            const branchRes = await axios.get(`${import.meta.env.VITE_API_URL}/auth/repos/${repo.name}/branches`, { withCredentials: true });
            const branches = branchRes.data;

            const payload = {
                username: userInfo.data.username,
                repo_url: repo.html_url,
                name: repo.name,
                rules: [],
                branches,
            };

            await axios.post("http://localhost:8001/repositories/", payload, { withCredentials: true });
            setAddedRepos(prev => [...prev, { repo: repo.name, repo_url: repo.html_url, branches }]);
            setShowModal(false);
        } catch (err: any) {
            if (err.response?.status === 400) alert("Repo already exists in backend");
            else console.error("❌ Failed to save repo:", err);
        }
    };

    const handleCreateScan = async (repo: RepoData, branch: string) => {
        if (!username) return;

        try {
            console.log(username);
            const response = await axios.post("http://localhost:8001/scans", {
                project_name: repo.repo,
                scanned_by: username,
                scan_version: "1.0.0",
                scan_options: {
                    repo_url: repo.repo_url,
                    branch_id: branch
                },
                auth_context: {
                    user_id: username,
                    user_role: "user",
                    session_id: "fake-session"
                },
                notes: "Auto scan from UI"
            });

            console.log("✅ Scan created:", response.data);

            // Refresh the analyses data after creating scan
            await fetchUserAnalyses(username);

            // Optionally show success message
            alert("Scan created successfully!");
            handleAnalysisSelect(response.data.scan_id);

        } catch (err) {
            console.error("❌ Failed to create scan:", err);
            alert("Failed to create scan. Please try again.");
        }
    };


    const availableToAdd = availableRepos.filter(r => !addedRepos.some(ar => ar.repo_url === r.html_url));

    const formatScanDate = (scanId: string) => new Date(parseInt(scanId.split('-')[0])).toLocaleDateString();

    return (
        <div className="dropdown-container">
            <div className="search-area flex flex-row md:flex-col lg:flex-row">
                <input
                    type="text"
                    className="search-bar sm:w-full md:w-3/5"
                    placeholder="Select repository, branch, and analysis..."
                    readOnly
                />
                <div className="dropdown-menu">
                    {addedRepos.length === 0 ? (
                        <div className="repo-item">No repositories added yet.</div>
                    ) : (
                        addedRepos.map(repo => (
                            <div key={repo.repo} className="repo-item">
                                <div className={`repo-name ${expandedRepo === repo.repo ? "expanded" : ""}`} onClick={() => handleRepoClick(repo)}>
                                    {repo.repo} <span className="expand-icon">{expandedRepo === repo.repo ? '▼' : '▶'}</span>
                                </div>
                                {expandedRepo === repo.repo && (
                                    <div className="branch-list">
                                        {repo.branches.map(branch => {
                                            const analyses = getAnalysesForRepo(repo.repo_url, branch);
                                            const key = `${repo.repo}-${branch}`;
                                            const isExpanded = expandedBranch === key;
                                            return (
                                                <div key={branch} className="branch-group">
                                                    <div className={`branch-name ${isExpanded ? "expanded" : ""}`} onClick={() => handleBranchClick(repo, branch)}>
                                                        {branch} <span className="branch-info">
                                                            {analyses.length === 0 && " (No analyses)"}
                                                        {analyses.length === 1 && " (1 analysis)"}
                                                        {analyses.length > 1 && ` (${analyses.length} analyses)`}
                                                        </span>
                                                        <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
                                                    </div>
                                                    {isExpanded && (
                                                        <div className="analysis-list">
                                                            {/* Always show create new analysis button */}
                                                            <div
                                                                className="analysis-item create-new"
                                                                onClick={() => handleCreateScan(repo, branch)}
                                                            >
                                                                Create new analysis
                                                            </div>
                                                            {/* Show existing analyses */}
                                                            {analyses.map(a => (
                                                                <div key={a.scan_id} className="analysis-item" onClick={() => handleAnalysisSelect(a.scan_id)}>
                                                                    {a.project_name} <span className="analysis-date">({formatScanDate(a.scan_id)})</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
                <button className="add-repo-button p-4 w-fit" onClick={handleAddRepo}>+ Add Repo</button>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={handleModalClose}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Select a Repository to Add</h2>
                        <div className="repo-list">
                            {availableToAdd.length === 0 && <div>All repos are already added</div>}
                            {availableToAdd.map(repo => (
                                <div key={repo.id} className="repo-choice">
                                    <div className="repo-choice-content" onClick={() => handleSelectRepo(repo)}>
                                        <div className="repo-choice-name">{repo.full_name}</div>
                                        {repo.description && <div className="repo-choice-description">{repo.description}</div>}
                                    </div>

                                </div>
                            ))}
                        </div>
                        <div className="modal-actions">
                            <button className="cancel-button" onClick={handleModalClose}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}