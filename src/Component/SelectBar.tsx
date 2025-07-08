import React from "react";
import "./SelectBar.css";

const fakeData = [
    {
        repo: "frontend-app",
        branches: ["main", "feature/login", "bugfix/navbar"],
    },
    {
        repo: "backend-service",
        branches: ["master", "develop", "release/v1.0"],
    },
    {
        repo: "devops-scripts",
        branches: ["production", "staging", "experimental"],
    },
];

export default function RepoBranchDropdown() {
    const handleSelect = (repo, branch) => {
        alert(`Redirecting to: ${repo}/${branch}`);
        // For real navigation:
        // window.location.href = `/path/${repo}/${branch}`;
    };

    return (
        <div className="dropdown-container">
            <div className="search-area">
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Select repository and branch..."
                    readOnly
                />
                <div className="dropdown-menu">
                    {fakeData.map((repo) => (
                        <div key={repo.repo} className="repo-item">
                            <div className="repo-name">{repo.repo}</div>
                            <div className="branch-submenu">
                                {repo.branches.map((branch) => (
                                    <div
                                        key={branch}
                                        className="branch-item"
                                        onClick={() => handleSelect(repo.repo, branch)}
                                    >
                                        {branch}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
