import { useEffect, useState } from "react";
import axios from "axios";
import "./SelectBar.css";
import { useNavigate } from "react-router-dom";
interface AnalysisData {
    scan_id: string;
    project_name: string;
    branch_id: string;
    repo_url: string;
    date: string;
}

interface BranchData {
    name: string;
    analyses: AnalysisData[];
}

interface RepoData {
    repo: string;
    repo_url: string;
    branches: BranchData[];
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
    const [token, setToken] = useState<string | null>(null);
    const [addedRepos, setAddedRepos] = useState<RepoData[]>([]);
    const [availableRepos, setAvailableRepos] = useState<UserRepo[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [expandedRepo, setExpandedRepo] = useState<string>("");
    const [expandedBranch, setExpandedBranch] = useState<string>("");
    const baseurl= import.meta.env.VITE_API_URL
    const baseapiUrl = import.meta.env.VITE_API_URL_BACK
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${baseurl}/auth/userinfo`, {
                    withCredentials: true,
                });
                setUsername(res.data.username);
                setToken(res.data.accessToken);
            } catch (err) {
                console.error("❌ Failed to fetch user info:", err);
            }
        };
        fetchUser();
    }, []);

    // Fetch repos and analyses after username is available
    useEffect(() => {
        if (!username) return;

            const fetchData = async () => {
                try {
                    // Fetch repos + branches + analyses
                    const repoRes = await axios.get(
                        `${baseapiUrl}/scans/summary/${username}`
                    );

                    const repos: RepoData[] = repoRes.data.map((r: any) => {
                        return {
                            repo: r.repo_url.split("/").pop() || r.repo_url, // last part of URL
                            repo_url: r.repo_url,
                            branches: (r.branches_id || []).map((branch: string) => ({
                                name: branch,
                                analyses: (r.analyses || [])
                                    .filter((a: any) => a.branch_id === branch)
                                    .map((a: any) => ({
                                        scan_id: a.scan_id,
                                        project_name: a.project_name,
                                        branch_id: a.branch_id,
                                        repo_url: r.repo_url,
                                        date: new Date().toLocaleDateString(),
                                    })),
                            })),
                        };
                    });

                    setAddedRepos(repos);

                    // Fetch GitHub repos (unchanged)
                    const ghRes = await axios.get(
                        `${import.meta.env.VITE_API_URL}/auth/repos`,
                        { withCredentials: true }
                    );
                    setAvailableRepos(ghRes.data);

                } catch (err) {
                    console.error("❌ Failed to fetch data:", err);
                }
            };

            fetchData();
        }, [username]);



    const handleRepoClick = (repo: RepoData) => {
        if (expandedRepo === repo.repo) {
            setExpandedRepo("");
            setExpandedBranch("");
        } else {
            setExpandedRepo(repo.repo);
            setExpandedBranch("");
        }
    };

    const handleBranchClick = (repo: RepoData, branchName: string) => {
        const key = `${repo.repo}-${branchName}`;
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
            const userInfo = await axios.get(`${baseurl}/auth/userinfo`, {
                withCredentials: true,
            });

            const branchRes = await axios.get(
                `${baseurl}/auth/repos/${repo.name}/branches`,
                { withCredentials: true }
            );
            const payload = {
                user: {
                    user_id: userInfo.data.username,
                    email: "placeholder@email.com",
                    name: userInfo.data.username,
                },
                branches_id: branchRes.data,
                repo_url: repo.html_url,
                rules: [
                    {
                        rule_id: "1",
                        parameters: [{ name: "OULA", value: 1 }],
                    },
                ],
            };

            await axios.post(`${baseapiUrl}/repositories/`, payload, {
                withCredentials: true,
            });

            // 🔥 Refresh repos after adding
            const repoRes = await axios.get(
                `${baseapiUrl}/scans/summary/${userInfo.data.username}`
            );

            const repos: RepoData[] = repoRes.data.map((r: any) => ({
                repo: r.repo_url.split("/").pop() || r.repo_url,
                repo_url: r.repo_url,
                branches: (r.branches_id || []).map((branch: string) => ({
                    name: branch,
                    analyses: (r.analyses || [])
                        .filter((a: any) => a.branch_id === branch)
                        .map((a: any) => ({
                            scan_id: a.scan_id,
                            project_name: a.project_name,
                            branch_id: a.branch_id,
                            repo_url: r.repo_url,
                            date: new Date().toLocaleDateString(),
                        })),
                })),
            }));

            setAddedRepos(repos);
            setShowModal(false);
        } catch (err: any) {
            if (err.response?.status === 400)
                alert("Repo already exists in backend");
            else console.error("❌ Failed to save repo:", err);
        }
    };

    const handleCreateScan = async (repo: RepoData, branch: string) => {
        if (!username) return;

        try {
            const response = await axios.post(`${baseapiUrl}/scans`, {
                token: token,
                project_name: repo.repo,
                scanned_by: username,
                scan_version: "1.0.0",
                scan_options: {
                    repo_url: repo.repo_url,
                    branch_id: branch,
                    use_ai_assistance: true,
                    max_depth: 3,
                    follow_symlinks: false,
                    target_type: "repository",
                    target_files: ["main.py", "utils.py"],
                    severity_min: "medium",
                    commit_hash: "",
                    rules_id:[]
                },
                auth_context: {
                    user_id: username,
                    user_role: "user",
                    session_id: "fake-session",
                },
                notes: "Auto scan from UI",
            });

            // Refresh data
            const repoRes = await axios.get(
                `${baseapiUrl}/scans/summary/${username}`
            );
            const repos: RepoData[] = repoRes.data.map((r: any) => {
                const branchMap: Record<string, AnalysisData[]> = {};
                r.analyses?.forEach((a: any) => {
                    if (!branchMap[a.branch_id]) branchMap[a.branch_id] = [];
                    branchMap[a.branch_id].push({
                        scan_id: a.scan_id,
                        project_name: a.project_name,
                        branch_id: a.branch_id,
                        repo_url: r.repo_url,
                        date: new Date().toLocaleDateString(),
                    });
                });
                return {
                    repo: r.repo_url.split("/").pop() || r.repo_url,
                    repo_url: r.repo_url,
                    branches: Object.entries(branchMap).map(([branch, analyses]) => ({
                        name: branch,
                        analyses,
                    })),
                };
            });
            setAddedRepos(repos);

            alert("Scan created successfully!");
            handleAnalysisSelect(response.data.scan_id);
        } catch (err) {
            console.error("❌ Failed to create scan:", err);
            alert("Failed to create scan. Please try again.");
        }
    };

    const availableToAdd = availableRepos.filter(
        (r) => !addedRepos.some((ar) => ar.repo_url === r.html_url)
    );

    const formatScanDate = (scanId: string) =>
        new Date(parseInt(scanId.slice(0, 8), 16) * 1000).toLocaleDateString();

    return (
        <div className="dropdown-container">
            <div className="search-area">
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Select repository, branch, and analysis..."
                    readOnly
                />
                <div className="dropdown-menu">
                    {addedRepos.length === 0 ? (
                        <div className="repo-item">No repositories added yet.</div>
                    ) : (
                        addedRepos.map((repo) => (
                            <div key={repo.repo} className="repo-item">
                                <div
                                    className={`repo-name ${
                                        expandedRepo === repo.repo ? "expanded" : ""
                                    }`}
                                    onClick={() => handleRepoClick(repo)}
                                >
                                    {repo.repo}{" "}
                                    <span className="expand-icon">
                    {expandedRepo === repo.repo ? "▼" : "▶"}
                  </span>
                                </div>
                                {expandedRepo === repo.repo && (
                                    <div className="branch-list">
                                        {repo.branches.map((branch) => {
                                            const key = `${repo.repo}-${branch.name}`;
                                            const isExpanded = expandedBranch === key;
                                            return (
                                                <div key={branch.name} className="branch-group">
                                                    <div
                                                        className={`branch-name ${
                                                            isExpanded ? "expanded" : ""
                                                        }`}
                                                        onClick={() => handleBranchClick(repo, branch.name)}
                                                    >
                                                        {branch.name}
                                                        <span className="branch-info">
                              {branch.analyses.length === 0 && " (No analyses)"}
                                                            {branch.analyses.length === 1 && " (1 analysis)"}
                                                            {branch.analyses.length > 1 &&
                                                                ` (${branch.analyses.length} analyses)`}
                            </span>
                                                        <span className="expand-icon">
                              {isExpanded ? "▼" : "▶"}
                            </span>
                                                    </div>
                                                    {isExpanded && (
                                                        <div className="analysis-list">
                                                            <div
                                                                className="analysis-item create-new"
                                                                onClick={() =>
                                                                    handleCreateScan(repo, branch.name)
                                                                }
                                                            >
                                                                + Create new analysis
                                                            </div>
                                                            {branch.analyses.map((a) => (
                                                                <div
                                                                    key={a.scan_id}
                                                                    className="analysis-item"
                                                                    onClick={() =>
                                                                        handleAnalysisSelect(a.scan_id)
                                                                    }
                                                                >
                                                                    {a.project_name}{" "}
                                                                    <span className="analysis-date">
                                    ({formatScanDate(a.scan_id)})
                                  </span>
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
                <button className="add-repo-button" onClick={handleAddRepo}>
                    + Add Repo
                </button>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={handleModalClose}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>Select a Repository to Add</h2>
                        <div className="repo-list">
                            {availableToAdd.length === 0 && (
                                <div>All repos are already added</div>
                            )}
                            {availableToAdd.map((repo) => (
                                <div key={repo.id} className="repo-choice">
                                    <div
                                        className="repo-choice-content"
                                        onClick={() => handleSelectRepo(repo)}
                                    >
                                        <div className="repo-choice-name">{repo.full_name}</div>
                                        {repo.description && (
                                            <div className="repo-choice-description">
                                                {repo.description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="modal-actions">
                            <button className="cancel-button" onClick={handleModalClose}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
