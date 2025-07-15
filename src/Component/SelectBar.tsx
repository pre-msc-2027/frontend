import React, { useState } from "react";
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
    // State: repos user has added
    const [addedRepos, setAddedRepos] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleSelect = (repo, branch) => {
        alert(`Redirecting to: ${repo}/${branch}`);
        // For real navigation:
        // window.location.href = `/path/${repo}/${branch}`;
    };

    const handleAddRepo = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleRepoAdd = (repo) => {
        // Avoid duplicates
        if (!addedRepos.find((r) => r.repo === repo.repo)) {
            setAddedRepos([...addedRepos, repo]);
        }
        setShowModal(false);
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
                    {addedRepos.length === 0 ? (
                        <div className="repo-item">No repositories added yet.</div>
                    ) : (
                        addedRepos.map((repo) => (
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
                        {fakeData.map((repo) => (
                            <button
                                key={repo.repo}
                                className="repo-choice"
                                onClick={() => handleRepoAdd(repo)}
                                disabled={addedRepos.find((r) => r.repo === repo.repo)}
                            >
                                {repo.repo}
                            </button>
                        ))}
                        <button onClick={handleModalClose}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}
