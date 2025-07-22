import { useState } from "react";
import "./SelectBar.css";

// Type definitions
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
    url: string;
    description?: string;
    private: boolean;
}

export default function RepoBranchDropdown() {
    const [addedRepos, setAddedRepos] = useState<RepoData[]>([
        {
            repo: "frontend-app",
            repo_url: "https://github.com/user/frontend-app",
            branches: ["main", "feature/login", "bugfix/navbar"],
        },
        {
            repo: "backend-service",
            repo_url: "https://github.com/user/backend-service",
            branches: ["master", "develop", "release/v1.0"],
        },
    ]);

    const [availableRepos] = useState<UserRepo[]>([
        {
            id: "1",
            name: "frontend-app",
            full_name: "user/frontend-app",
            url: "https://github.com/user/frontend-app",
            description: "React frontend application",
            private: false,
        },
        {
            id: "2",
            name: "backend-service",
            full_name: "user/backend-service",
            url: "https://github.com/user/backend-service",
            description: "Node.js API backend service",
            private: false,
        },
        {
            id: "3",
            name: "devops-scripts",
            full_name: "user/devops-scripts",
            url: "https://github.com/user/devops-scripts",
            description: "DevOps automation scripts and configurations",
            private: true,
        },
        {
            id: "4",
            name: "mobile-app",
            full_name: "user/mobile-app",
            url: "https://github.com/user/mobile-app",
            description: "React Native mobile application",
            private: false,
        },
        {
            id: "5",
            name: "data-pipeline",
            full_name: "user/data-pipeline",
            url: "https://github.com/user/data-pipeline",
            description: "Python data processing pipeline",
            private: true,
        },
    ]);

    const [fakeAnalyses] = useState<AnalysisData[]>([
        {
            scan_id: "1642678800000-abc123",
            project_name: "Security Scan v1.2",
            branch_id: "main",
            repo_url: "https://github.com/user/frontend-app",
            date: "2024-01-20",
        },
        {
            scan_id: "1642765200000-def456",
            project_name: "Code Quality Check",
            branch_id: "main",
            repo_url: "https://github.com/user/frontend-app",
            date: "2024-01-21",
        },
        {
            scan_id: "1642851600000-ghi789",
            project_name: "Dependency Audit",
            branch_id: "feature/login",
            repo_url: "https://github.com/user/frontend-app",
            date: "2024-01-22",
        },
        {
            scan_id: "1642938000000-jkl012",
            project_name: "Performance Analysis",
            branch_id: "master",
            repo_url: "https://github.com/user/backend-service",
            date: "2024-01-23",
        },
        {
            scan_id: "1643024400000-mno345",
            project_name: "Security Scan v1.3",
            branch_id: "develop",
            repo_url: "https://github.com/user/backend-service",
            date: "2024-01-24",
        },
    ]);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedRepo, setSelectedRepo] = useState<string>("");
    const [selectedBranch, setSelectedBranch] = useState<string>("");
    const [expandedRepo, setExpandedRepo] = useState<string>("");
    const [expandedBranch, setExpandedBranch] = useState<string>("");

    const getAnalysesForRepo = (repoUrl: string, branchId: string): AnalysisData[] => {
        return fakeAnalyses.filter(
            analysis => analysis.repo_url === repoUrl && analysis.branch_id === branchId
        );
    };

    const handleRepoClick = (repo: RepoData): void => {
        if (expandedRepo === repo.repo) {
            setExpandedRepo("");
            setExpandedBranch("");
        } else {
            setExpandedRepo(repo.repo);
            setExpandedBranch("");
            setSelectedRepo(repo.repo);
        }
    };

    const handleBranchClick = (repo: RepoData, branch: string): void => {
        const branchKey = `${repo.repo}-${branch}`;

        if (expandedBranch === branchKey) {
            setExpandedBranch("");
        } else {
            setExpandedBranch(branchKey);
            setSelectedBranch(branch);
        }
    };

    const handleAnalysisSelect = (scanId: string): void => {
        console.log(`Navigating to analysis: ${scanId}`);
        // Simulate navigation
        alert(`Would navigate to: /analysis/${scanId}`);
    };

    const handleBranchSelect = (repo: RepoData, branch: string): void => {
        setSelectedRepo(repo.repo);
        setSelectedBranch(branch);

        const analyses = getAnalysesForRepo(repo.repo_url, branch);

        if (analyses.length === 0) {
            console.log(`No analyses for ${repo.repo}/${branch}, would create new`);
            alert(`Would navigate to: /dashboard?repo=${repo.repo_url}&branch=${branch}`);
        } else if (analyses.length === 1) {
            handleAnalysisSelect(analyses[0].scan_id);
        }
        // If multiple analyses exist, they remain visible in the dropdown
    };

    const handleAddRepo = (): void => {
        setShowModal(true);
    };

    const handleModalClose = (): void => {
        setShowModal(false);
    };

    const handleRepoAdd = (userRepo: UserRepo): void => {
        const newRepo: RepoData = {
            repo: userRepo.name,
            repo_url: userRepo.url,
            branches: ["main", "develop", "master"], // Default branches
        };

        if (!addedRepos.find((r) => r.repo === newRepo.repo)) {
            setAddedRepos([...addedRepos, newRepo]);
            console.log(`Added repository: ${userRepo.name}`);
        }
        setShowModal(false);
    };

    const formatScanDate = (scanId: string): string => {
        try {
            const timestamp = parseInt(scanId.split('-')[0]) || Date.now();
            return new Date(timestamp).toLocaleDateString();
        } catch {
            return new Date().toLocaleDateString();
        }
    };

    const updateSearchBarPlaceholder = (): string => {
        if (selectedRepo && selectedBranch) {
            return `${selectedRepo} / ${selectedBranch}`;
        } else if (selectedRepo) {
            return `${selectedRepo} - Select branch...`;
        }
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
                        addedRepos.map((repo) => (
                            <div key={repo.repo} className="repo-item">
                                <div
                                    className={`repo-name ${expandedRepo === repo.repo ? 'expanded' : ''}`}
                                    onClick={() => handleRepoClick(repo)}
                                >
                                    {repo.repo}
                                    <span className="expand-icon">
                                        {expandedRepo === repo.repo ? '▼' : '▶'}
                                    </span>
                                </div>

                                {expandedRepo === repo.repo && (
                                    <div className="branch-list">
                                        {repo.branches.map((branch) => {
                                            const analyses = getAnalysesForRepo(repo.repo_url, branch);
                                            const branchKey = `${repo.repo}-${branch}`;
                                            const isExpanded = expandedBranch === branchKey;

                                            return (
                                                <div key={branch} className="branch-group">
                                                    <div
                                                        className={`branch-name ${isExpanded ? 'expanded' : ''}`}
                                                        onClick={() => handleBranchClick(repo, branch)}
                                                    >
                                                        {branch}
                                                        <span className="branch-info">
                                                            {analyses.length === 0 && (
                                                                <span className="no-analysis"> (No analyses)</span>
                                                            )}
                                                            {analyses.length === 1 && (
                                                                <span className="single-analysis"> (1 analysis)</span>
                                                            )}
                                                            {analyses.length > 1 && (
                                                                <span className="multiple-analyses"> ({analyses.length} analyses)</span>
                                                            )}
                                                        </span>
                                                        <span className="expand-icon">
                                                            {isExpanded ? '▼' : '▶'}
                                                        </span>
                                                    </div>

                                                    {isExpanded && (
                                                        <div className="analysis-list">
                                                            {analyses.length === 0 ? (
                                                                <div
                                                                    className="analysis-item create-new"
                                                                    onClick={() => handleBranchSelect(repo, branch)}
                                                                >
                                                                     Create new analysis
                                                                </div>
                                                            ) : (
                                                                analyses.map((analysis) => (
                                                                    <div
                                                                        key={analysis.scan_id}
                                                                        className="analysis-item"
                                                                        onClick={() => handleAnalysisSelect(analysis.scan_id)}
                                                                        title={`Click to view analysis: ${analysis.scan_id}`}
                                                                    >
                                                                        {analysis.project_name}
                                                                        <span className="analysis-date">
                                                                            ({formatScanDate(analysis.scan_id)})
                                                                        </span>
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
                            {availableRepos.map((repo) => {
                                const isAlreadyAdded = addedRepos.find((r) => r.repo === repo.name);
                                return (
                                    <button
                                        key={repo.id}
                                        className={`repo-choice ${isAlreadyAdded ? 'disabled' : ''}`}
                                        onClick={() => handleRepoAdd(repo)}
                                        disabled={!!isAlreadyAdded}
                                    >
                                        <div className="repo-choice-content">
                                            <div className="repo-choice-name">
                                                {repo.full_name}
                                            </div>
                                            {repo.description && (
                                                <div className="repo-choice-description">
                                                    {repo.description}
                                                </div>
                                            )}
                                        </div>
                                        {isAlreadyAdded && <span className="added-label"> ✓ Added</span>}
                                    </button>
                                );
                            })}
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