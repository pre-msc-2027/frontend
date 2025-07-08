import { useState } from "react";
import { GitBranch, ChevronDown, Search, Book } from "lucide-react";

// Mock data pour les tests
const repositories = [
  {
    id: 1,
    name: "mon-projet",
    url: "https://github.com/user/mon-projet",
    branches: ["main", "develop", "feature/auth", "hotfix/bug-123"]
  },
  {
    id: 2,
    name: "autre-repo",
    url: "https://github.com/user/autre-repo",
    branches: ["main", "staging", "production"]
  },
  {
    id: 3,
    name: "test-project",
    url: "https://github.com/user/test-project",
    branches: ["main", "dev", "feature/new-ui"]
  }
];

const SearchBranchSelector = () => {
  const [selectedRepo, setSelectedRepo] = useState(repositories[0]);
  const [selectedBranch, setSelectedBranch] = useState("main");
  const [showBranches, setShowBranches] = useState(false);
  const [showRepos, setShowRepos] = useState(false);

  const handleRepoChange = (repo) => {
    setSelectedRepo(repo);
    setSelectedBranch(repo.branches[0]); // Sélectionner la première branche du nouveau repo
    setShowRepos(false);
  };

  const handleBranchChange = (branch) => {
    setSelectedBranch(branch);
    setShowBranches(false);
  };

  return (
    <div className="p-4 bg-[#0d1117] min-h-screen">
      <div className="relative flex items-center bg-[#0d1117] rounded-full border border-[#30363d] overflow-hidden w-full max-w-2xl mx-auto">
        <input
          type="text"
          value={`${selectedRepo.url}/tree/${selectedBranch}`}
          className="bg-transparent text-sm text-white px-4 py-2 w-full outline-none"
          readOnly
          placeholder="Repository branch URL"
          title="Repository branch URL"
        />

        {/* Sélecteur de repository */}
        <div className="relative">
          <div
            className="flex items-center border-l border-[#30363d] px-4 gap-1 text-white cursor-pointer hover:bg-[#21262d] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setShowRepos(!showRepos);
              setShowBranches(false); // Fermer l'autre dropdown
            }}
          >
            <Book size={16} />
            <span className="text-sm font-semibold">{selectedRepo.name}</span>
            <ChevronDown 
              size={16} 
              className={`transform transition-transform ${showRepos ? 'rotate-180' : ''}`}
            />
          </div>
          
          {showRepos && (
            <div className="absolute right-0 top-full mt-1 w-64 bg-[#161b22] border border-[#30363d] rounded-md shadow-lg z-20">
              {repositories.map((repo) => (
                <div
                  key={repo.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRepoChange(repo);
                  }}
                  className={`px-3 py-2 text-sm hover:bg-[#21262d] cursor-pointer ${
                    selectedRepo.id === repo.id ? 'bg-[#21262d] text-blue-400' : 'text-white'
                  }`}
                >
                  <div className="font-medium">{repo.name}</div>
                  <div className="text-xs text-gray-400">{repo.url}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sélecteur de branche */}
        <div className="relative">
          <div
            className="flex items-center border-l border-[#30363d] px-4 gap-1 text-white cursor-pointer hover:bg-[#21262d] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setShowBranches(!showBranches);
              setShowRepos(false); // Fermer l'autre dropdown
            }}
          >
            <GitBranch size={16} />
            <span className="text-sm font-semibold">{selectedBranch}</span>
            <ChevronDown 
              size={16} 
              className={`transform transition-transform ${showBranches ? 'rotate-180' : ''}`}
            />
          </div>
          
          {showBranches && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-[#161b22] border border-[#30363d] rounded-md shadow-lg z-20">
              {selectedRepo.branches.map((branch) => (
                <div
                  key={branch}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBranchChange(branch);
                  }}
                  className={`px-3 py-2 text-sm hover:bg-[#21262d] cursor-pointer ${
                    selectedBranch === branch ? 'bg-[#21262d] text-blue-400' : 'text-white'
                  }`}
                >
                  {branch}
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="px-4 text-white hover:bg-[#21262d] transition-colors" title="Search">
          <Search size={16} />
        </button>
      </div>

      {/* Overlay pour fermer les dropdowns en cliquant à l'extérieur */}
      {(showBranches || showRepos) && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => {
            setShowBranches(false);
            setShowRepos(false);
          }}
        />
      )}
    </div>
  );
};

export default SearchBranchSelector;