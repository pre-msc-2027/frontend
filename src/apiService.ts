// api/services.ts
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const api = axios.create({
    baseURL: apiUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor to include auth token if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('github_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Types based on API documentation
export interface ScanOptions {
    repo_url: string;
    use_ai_assistance: boolean;
    max_depth: number;
    follow_symlinks: boolean;
    target_type: string;
    target_files?: string[];
    severity_min: 'low' | 'medium' | 'high' | 'critical';
    branch_id: string;
    commit_hash?: string;
}

export interface AuthContext {
    user_id: string;
    user_role: string;
    session_id: string;
}

export interface CreateScanRequest {
    project_name: string;
    scanned_by: string;
    scan_version: string;
    scan_options: ScanOptions;
    auth_context: AuthContext;
    notes?: string;
}

export interface Vulnerability {
    file: string;
    line: number;
    type: string;
    severity: string;
    description: string;
    recommendation: string;
}

export interface Warning {
    file: string;
    line: number;
    rule_id: number;
    id: number;
}

export interface Analysis {
    status: string;
    summary: {
        total_files: number;
        files_with_vulnerabilities: number;
        vulnerabilities_found: number;
    };
    vulnerabilities: Vulnerability[];
    warnings: Warning[];
}

export interface AiComment {
    warning_id: number;
    original: string;
    fixed: string;
}

export interface Dependency {
    name: string;
    version: string;
    vulnerability?: {
        cve_id: string;
        severity: string;
        description: string;
        recommendation: string;
    };
}

export interface LogEntry {
    timestamp: number;
    message: string;
    error?: string;
}

export interface Scan {
    scan_id: string;
    timestamp: string;
    project_name: string;
    scanned_by: string;
    scan_version: string;
    scan_options: ScanOptions;
    auth_context: AuthContext;
    notes?: string;
    analysis?: Analysis;
    ai_comment?: AiComment[];
    dependencies?: Dependency[];
    logs?: LogEntry[];
}

export interface RepoSummary {
    repo_url: string;
    analyses: {
        scan_id: string;
        project_name: string;
        branch_id: string;
    }[];
}

export interface User {
    id: string;
    email: string;
    name: string;
}

export interface RuleParameter {
    name: string;
    value: any;
}

export interface RepoRule {
    rule_id: string;
    parameters: RuleParameter[];
}

export interface Repository {
    user: User;
    repo_url: string;
    rules: RepoRule[];
}

export interface RuleParameterDef {
    type: string;
    name: string;
    default: any;
    description: string;
    options?: Record<string, any>;
}

export interface Rule {
    rule_id: string;
    name: string;
    description: string;
    tags: string[];
    parameters: RuleParameterDef[];
}

export interface GitHubRepo {
    id: string;
    name: string;
    full_name: string;
    url: string;
    description?: string;
    private: boolean;
    branches?: string[];
}

// Auth Services
export const authService = {
    loginWithGitHub: () => {
        window.location.href = `${apiUrl}/auth/github`;
    },

    handleGitHubCallback: async (code: string, state: string) => {
        try {
            const response = await axios.get(`${apiUrl}/auth/callback`, {
                params: { code, state }
            });

            // Store token if provided
            if (response.data.token) {
                localStorage.setItem('github_token', response.data.token);
            }

            return response.data;
        } catch (error) {
            console.error('Error during GitHub callback:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('github_token');
    },

    getStoredToken: () => {
        return localStorage.getItem('github_token');
    }
};

// GitHub Repository Services
export const githubService = {
    // Get user's GitHub repositories
    getUserRepos: async (): Promise<GitHubRepo[]> => {
        try {
            const response = await api.get('/github/repos');
            return response.data;
        } catch (error) {
            console.error('Error fetching GitHub repos:', error);
            throw error;
        }
    },

    // Get branches for a specific repository
    getRepoBranches: async (repoFullName: string): Promise<string[]> => {
        try {
            const response = await api.get(`/github/repos/${encodeURIComponent(repoFullName)}/branches`);
            return response.data;
        } catch (error) {
            console.error('Error fetching repo branches:', error);
            throw error;
        }
    }
};

// Scan Services
export const scanService = {
    // Get scan summary for user
    getScanSummary: async (userId: string): Promise<RepoSummary[]> => {
        try {
            const response = await api.get(`/scans/summary/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching scan summary:', error);
            throw error;
        }
    },

    // Get specific scan details
    getScan: async (scanId: string): Promise<Scan> => {
        try {
            const response = await api.get(`/scans/${scanId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching scan:', error);
            throw error;
        }
    },

    // Get scan options
    getScanOptions: async (scanId: string): Promise<ScanOptions> => {
        try {
            const response = await api.get(`/scans/options/${scanId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching scan options:', error);
            throw error;
        }
    },

    // Create new scan
    createScan: async (scanData: CreateScanRequest): Promise<Scan> => {
        try {
            const response = await api.post('/scans/', scanData);
            return response.data;
        } catch (error) {
            console.error('Error creating scan:', error);
            throw error;
        }
    },

    // Add log to scan
    addScanLog: async (scanId: string, logEntry: Omit<LogEntry, 'timestamp'>): Promise<void> => {
        try {
            const logData = {
                ...logEntry,
                timestamp: Math.floor(Date.now() / 1000)
            };
            await api.post(`/scans/logs/${scanId}`, logData);
        } catch (error) {
            console.error('Error adding scan log:', error);
            throw error;
        }
    },

    // Add AI comment to scan
    addAiComment: async (scanId: string, comment: AiComment): Promise<void> => {
        try {
            await api.post(`/scans/ai_comment/${scanId}`, comment);
        } catch (error) {
            console.error('Error adding AI comment:', error);
            throw error;
        }
    },

    // Add analysis results
    addAnalysis: async (scanId: string, analysis: Analysis): Promise<void> => {
        try {
            await api.post(`/scans/analyse/${scanId}`, analysis);
        } catch (error) {
            console.error('Error adding analysis:', error);
            throw error;
        }
    },

    // Get analysis with rules
    getAnalysisWithRules: async (scanId: string): Promise<{ analysis: Analysis; rules: Rule[] }> => {
        try {
            const response = await api.get(`/scans/analyse_with_rules/${scanId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching analysis with rules:', error);
            throw error;
        }
    }
};

// Repository Services
export const repositoryService = {
    // Get user repositories
    getUserRepositories: async (userId: string): Promise<Repository[]> => {
        try {
            const response = await api.get(`/repositories/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user repositories:', error);
            throw error;
        }
    },

    // Create repository
    createRepository: async (repository: Repository): Promise<Repository> => {
        try {
            const response = await api.post('/repositories/', repository);
            return response.data;
        } catch (error) {
            console.error('Error creating repository:', error);
            throw error;
        }
    },

    // Get repository by URL
    getRepository: async (repoUrl: string): Promise<Repository> => {
        try {
            const response = await api.get(`/repositories/${encodeURIComponent(repoUrl)}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching repository:', error);
            throw error;
        }
    }
};

// Rule Services
export const ruleService = {
    // Get all rules
    getAllRules: async (): Promise<Rule[]> => {
        try {
            const response = await api.get('/rules/');
            return response.data;
        } catch (error) {
            console.error('Error fetching rules:', error);
            throw error;
        }
    },

    // Get specific rule
    getRule: async (ruleId: string): Promise<Rule> => {
        try {
            const response = await api.get(`/rules/${ruleId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching rule:', error);
            throw error;
        }
    },

    // Create rule
    createRule: async (rule: Rule): Promise<Rule> => {
        try {
            const response = await api.post('/rules/', rule);
            return response.data;
        } catch (error) {
            console.error('Error creating rule:', error);
            throw error;
        }
    }
};

// Utility function to handle API errors
export const handleApiError = (error: any) => {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            // Server responded with error status
            console.error('API Error:', error.response.status, error.response.data);
            return {
                message: error.response.data?.message || 'An error occurred',
                status: error.response.status
            };
        } else if (error.request) {
            // Request was made but no response
            console.error('Network Error:', error.request);
            return {
                message: 'Network error - please check your connection',
                status: 0
            };
        }
    }

    console.error('Unexpected Error:', error);
    return {
        message: 'An unexpected error occurred',
        status: 500
    };
};