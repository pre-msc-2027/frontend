import { useEffect, useState } from "react";
import "./SelectBar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface UserRepo {
    id: string;
    name: string;
    full_name: string;
    html_url: string;
    description?: string;
    private: boolean;
}

interface Analysis {
    scan_id: string;
    project_name: string;
    branch_id: string;
}

interface RepoApiResponse {
    repo_url: string;
    analyses: Analysis[];
}

export default function RepoBranchDropdown() {
    const navigate = useNavigate();
    const [addedRepos, setAddedRepos] = useState<RepoApiResponse[]>([]);
    const [availableRepos, setAvailableRepos] = useState<UserRepo[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRepo, setSelectedRepo] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("");
    const [expandedRepo, setExpandedRepo] = useState("");
    const [expandedBranch, setExpandedBranch] = useState("");

    // Get Repo Already Added in the DB
    const fetchAddedRepos = async () => {
        try {
            const response = await axios.get<RepoApiResponse[]>(
                `${import.meta.env.VITE_API_URL}/scans/summary`,
                { withCredentials: true }
            );
            setAddedRepos(response.data);
        } catch (err) {
            console.error("Error fetching added repos:", err);
        }
    };

    // Get repo from github account
    const fetchAvailableRepos = async () => {
        try {
            const response = await axios.get<UserRepo[]>(
                `${import.meta.env.VITE_API_URL}/auth/repos`,
                { withCredentials: true }
            );
            setAvailableRepos(response.data);
        } catch (err) {
            console.error("Error fetching available repos:", err);
        }
    };

    useEffect(() => {
        fetchAddedRepos();
        fetchAvailableRepos();
    }, []);

    const handleRepoClick = (repoUrl: string) => {
        setExpandedRepo(prev => (prev === repoUrl ? "" : repoUrl));
        setExpandedBranch("");
        setSelectedRepo(repoUrl);
    };

    const handleBranchClick = (repoUrl: string, branchName: string) => {
        const branchKey = `${repoUrl}-${branchName}`;
        setExpandedBranch(prev => (prev === branchKey ? "" : branchKey));
        setSelectedBranch(branchName);
    };


    const handleBranchSelect = (scan_id: string) => {
        const encodedScanId = btoa(scan_id);

        navigate(`/dashboard?scan=${encodeURIComponent(encodedScanId)}`);
    };



    const handleSelectRepo = async (repo: UserRepo) => {
        try {
            const branchResponse = await axios.get<string[]>(
                `${import.meta.env.VITE_API_URL}/auth/repos/${repo.name}/branches`,
                { withCredentials: true }
            );
            const newRepo: RepoApiResponse = {
                repo_url: repo.html_url,
                analyses: branchResponse.data.map(branch => ({
                    scan_id: `new-${branch}`,
                    project_name: branch,
                    branch_id: branch
                }))
            };
            setAddedRepos(prev => [...prev, newRepo]);
            setShowModal(false);
        } catch (err) {
            console.error("Error fetching branches for repo:", repo.full_name, err);
        }
    };

    const handleAddRepo = () => setShowModal(true);
    const handleModalClose = () => setShowModal(false);

    const updateSearchBarPlaceholder = () => {
        if (selectedRepo && selectedBranch) return `${selectedRepo} / ${selectedBranch}`;
        if (selectedRepo) return `${selectedRepo} - Select branch...`;
        return "Select repository, branch, and analysis...";
    };

    return (
        <div className="dropdown-container">
            <div className="search-area">
                <input
                    type="text"
                    className="search-bar"
                    placeholder={updateSearchBarPlaceholder()}
                    readOnly
                />
                <div className="dropdown-menu">
                    {addedRepos.length === 0 ? (
                        <div className="repo-item">No repositories added yet.</div>
                    ) : (
                        addedRepos.map(repo => {
                            const branchMap: Record<string, Analysis[]> = {};
                            repo.analyses.forEach(a => {
                                if (!branchMap[a.branch_id]) branchMap[a.branch_id] = [];
                                branchMap[a.branch_id].push(a);
                            });

                            return (
                                <div key={repo.repo_url} className="repo-item">
                                    <div
                                        className={`repo-name ${expandedRepo === repo.repo_url ? "expanded" : ""}`}
                                        onClick={() => handleRepoClick(repo.repo_url)}
                                    >
                                        {repo.repo_url.split("/").pop()}{" "}
                                        <span>{expandedRepo === repo.repo_url ? "▼" : "▶"}</span>
                                    </div>

                                    {expandedRepo === repo.repo_url && (
                                        <div className="branch-list">
                                            {Object.entries(branchMap).map(([branchName, analyses]) => {
                                                const branchKey = `${repo.repo_url}-${branchName}`;
                                                return (
                                                    <div key={branchName} className="branch-group">
                                                        <div
                                                            className={`branch-name ${expandedBranch === branchKey ? "expanded" : ""}`}
                                                            onClick={() => handleBranchClick(repo.repo_url, branchName)}
                                                        >
                                                            {branchName} <span>{expandedBranch === branchKey ? "▼" : "▶"}</span>
                                                        </div>

                                                        {expandedBranch === branchKey && (
                                                            <div className="analysis-list">
                                                                {analyses.length === 0 ? (
                                                                    <div
                                                                        className="analysis-item create-new"
                                                                        onClick={() => handleBranchSelect(a.scan_id)}
                                                                    >
                                                                        Create new analysis
                                                                    </div>
                                                                ) : (
                                                                    analyses.map(a => (
                                                                        <div
                                                                            key={a.scan_id}
                                                                            className="analysis-item"
                                                                            onClick={() => handleBranchSelect(a.scan_id )}
                                                                        >
                                                                            <p className="text-purple-500">Go to the Analyse</p>
                                                                        </div>
                                                                    ))
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
                <button className="add-repo-button" onClick={handleAddRepo}>+ Add Repo</button>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={handleModalClose}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Select a Repository to Add</h2>
                        <div className="repo-list">
                            {availableRepos.map(repo => (
                                <div key={repo.id} className="repo-choice" onClick={() => handleSelectRepo(repo)}>
                                    <div className="repo-choice-content">
                                        <div className="repo-choice-name">{repo.full_name}</div>
                                        {repo.description && <div className="repo-choice-description">{repo.description}</div>}
                                    </div>
                                    {repo.private && <span className="private-label">Private</span>}
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
