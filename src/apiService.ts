import React from "react";

export interface ScanOptions {
    repo_url: string;
    use_ai_assistance: boolean;
    max_depth: number;
    follow_symlinks: boolean;
    target_type: string;
    target_files: string[];
    severity_min: 'low' | 'medium' | 'high' | 'critical';
    branch_id: string;
    commit_hash?: string;
}

export interface AuthContext {
    user_id: string;
    user_role: string;
    session_id: string;
}

export interface Vulnerability {
    file: string;
    line: number;
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
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
    status: 'pending' | 'running' | 'completed' | 'failed';
    summary: {
        total_files: number;
        files_with_vulnerabilities: number;
        vulnerabilities_found: number;
    };
    vulnerabilities: Vulnerability[];
    warnings: Warning[];
}

export interface Dependency {
    name: string;
    version: string;
    vulnerability?: {
        cve_id: string;
        severity: 'low' | 'medium' | 'high' | 'critical';
        description: string;
        recommendation: string;
    };
}

export interface LogEntry {
    timestamp: number;
    message: string;
    error: string | null;
}

export interface ScanOut {
    scan_id: string;
    timestamp: string;
    project_name: string;
    scanned_by: string;
    scan_version: string;
    scan_options: ScanOptions;
    auth_context: AuthContext;
    notes: string;
    analysis?: Analysis;
    dependencies?: Dependency[];
    logs?: LogEntry[];
}

export interface ScanSummary {
    scan_id: string;
    project_name: string;
    branch_id: string;
}

export interface RepoSummary {
    repo_url: string;
    analyses: ScanSummary[];
}

export interface User {
    id: string;
    email: string;
    name: string;
}

export interface RuleParameter {
    name: string;
    value: string;
}

export interface RepoRule {
    rule_id: string;
    parameters: RuleParameter[];
}

export interface RepoOut {
    user: User;
    repo_url: string;
    rules: RepoRule[];
}

export interface RuleParameterDefinition {
    type: string;
    name: string;
    default: string;
    description: string;
    options?: { [key: string]: number };
}

export interface RuleOut {
    rule_id: string;
    name: string;
    description: string;
    tags: string[];
    parameters: RuleParameterDefinition[];
}

export interface CreateScanRequest {
    project_name: string;
    scanned_by: string;
    scan_version: string;
    scan_options: ScanOptions;
    auth_context: AuthContext;
    notes: string;
}

export interface AddLogRequest {
    timestamp: number;
    message: string;
    error: string | null;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Configuration
export interface ApiConfig {
    baseUrl: string;
    timeout?: number;
}

class ApiService {
    private token: string | null = null;
    private config: ApiConfig;

    constructor(config: ApiConfig) {
        this.config = {
            timeout: 30000,
            ...config
        };
    }

    setToken(token: string): void {
        this.token = token;
    }

    getToken(): string | null {
        return this.token;
    }

    private async request<T>(
        url: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                ...options.headers,
            };

            if (this.token) {
                headers['Authorization'] = `Bearer ${this.token}`;
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

            const fullUrl = url.startsWith('http') ? url : `${this.config.baseUrl}${url}`;

            const response = await fetch(fullUrl, {
                ...options,
                headers,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            return {
                success: true,
                data: data,
            };
        } catch (error) {
            console.error('API request failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            };
        }
    }

    // SCANS endpoints
    async getScansSummary(user: string): Promise<ApiResponse<RepoSummary[]>> {
        return this.request<RepoSummary[]>(`/scans/summary/${encodeURIComponent(user)}`);
    }

    async getScan(scanId: string): Promise<ApiResponse<ScanOut>> {
        return this.request<ScanOut>(`/scans/${scanId}`);
    }

    async getScanOptions(scanId: string): Promise<ApiResponse<ScanOptions>> {
        return this.request<ScanOptions>(`/scans/options/${scanId}`);
    }

    async createScan(scanRequest: CreateScanRequest): Promise<ApiResponse<ScanOut>> {
        return this.request<ScanOut>('/scans/', {
            method: 'POST',
            body: JSON.stringify(scanRequest),
        });
    }

    async addLogToScan(scanId: string, logEntry: AddLogRequest): Promise<ApiResponse<boolean>> {
        return this.request<boolean>(`/scans/logs/${scanId}`, {
            method: 'POST',
            body: JSON.stringify(logEntry),
        });
    }

    async addAnalysisToScan(scanId: string, analysis: Analysis): Promise<ApiResponse<boolean>> {
        return this.request<boolean>(`/scans/analyse/${scanId}`, {
            method: 'POST',
            body: JSON.stringify(analysis),
        });
    }

    async getAnalysisWithRules(scanId: string): Promise<ApiResponse<any>> {
        return this.request<any>(`/scans/analyse_with_rules/${scanId}`);
    }

    // REPOSITORIES endpoints
    async getUserRepositories(user: string): Promise<ApiResponse<RepoOut[]>> {
        return this.request<RepoOut[]>(`/repositories/user/${encodeURIComponent(user)}`);
    }

    async createRepository(repo: Omit<RepoOut, 'user'>): Promise<ApiResponse<RepoOut>> {
        return this.request<RepoOut>('/repositories/', {
            method: 'POST',
            body: JSON.stringify(repo),
        });
    }

    async getRepositoryByUrl(repoUrl: string): Promise<ApiResponse<RepoOut>> {
        return this.request<RepoOut>(`/repositories/${encodeURIComponent(repoUrl)}`);
    }

    // RULES endpoints
    async getAllRules(): Promise<ApiResponse<RuleOut[]>> {
        return this.request<RuleOut[]>('/rules/');
    }

    async getRule(ruleId: string): Promise<ApiResponse<RuleOut>> {
        return this.request<RuleOut>(`/rules/${ruleId}`);
    }

    async createRule(rule: RuleOut): Promise<ApiResponse<RuleOut>> {
        return this.request<RuleOut>('/rules/', {
            method: 'POST',
            body: JSON.stringify(rule),
        });
    }

    // Utility methods for dashboard integration
    async getDashboardData(userId: string): Promise<{
        repositories: RepoOut[];
        repoSummaries: RepoSummary[];
        rules: RuleOut[];
        error?: string;
    }> {
        try {
            const [reposResponse, summariesResponse, rulesResponse] = await Promise.all([
                this.getUserRepositories(userId),
                this.getScansSummary(userId),
                this.getAllRules(),
            ]);

            return {
                repositories: reposResponse.data || [],
                repoSummaries: summariesResponse.data || [],
                rules: rulesResponse.data || [],
                error: [reposResponse, summariesResponse, rulesResponse]
                    .find(r => !r.success)?.error,
            };
        } catch (error) {
            return {
                repositories: [],
                repoSummaries: [],
                rules: [],
                error: 'Failed to fetch dashboard data',
            };
        }
    }

    // Helper method to format pie chart data from analysis results
    formatPieChartData(analysis: Analysis) {
        const severityCount = {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
        };

        // Count vulnerabilities by severity
        analysis.vulnerabilities.forEach(vuln => {
            severityCount[vuln.severity]++;
        });

        return {
            labels: ['Critical', 'High', 'Medium', 'Low'],
            datasets: [
                {
                    label: 'Vulnerabilities',
                    data: [severityCount.critical, severityCount.high, severityCount.medium, severityCount.low],
                    backgroundColor: ['#ff4444', '#ff8800', '#ffaa00', '#2dd4bf'],
                    borderColor: '#fff',
                    borderWidth: 0,
                    hoverOffset: 12,
                    offset: 0,
                },
            ],
        };
    }

    // Helper method to format logs for the logs component
    formatLogsForDisplay(logs: LogEntry[]) {
        return logs.map(log => ({
            timestamp: new Date(log.timestamp * 1000).toLocaleString(),
            level: log.error ? 'Error' : 'Info',
            message: log.message,
            id: log.timestamp.toString(),
        }));
    }

    // Helper method to get progress stage from scan status
    getProgressStage(analysis?: Analysis): number {
        if (!analysis) return 1;

        const stageMap: { [key: string]: number } = {
            'pending': 1,
            'running': 2,
            'completed': 5,
            'failed': 0,
        };
        return stageMap[analysis.status] || 1;
    }

    // Helper to redirect to repository
    redirectToRepository(repoUrl: string): void {
        window.open(repoUrl, '_blank');
    }

    // Helper to start a new analysis
    async startAnalysis(
        projectName: string,
        userId: string,
        repoUrl: string,
        branchId: string,
        selectedRules: string[],
        useAI: boolean = false
    ): Promise<ApiResponse<ScanOut>> {
        const scanRequest: CreateScanRequest = {
            project_name: projectName,
            scanned_by: userId,
            scan_version: "1.0.0",
            scan_options: {
                repo_url: repoUrl,
                use_ai_assistance: useAI,
                max_depth: 3,
                follow_symlinks: false,
                target_type: "auto",
                target_files: [],
                severity_min: "medium",
                branch_id: branchId,
            },
            auth_context: {
                user_id: userId,
                user_role: "user",
                session_id: Date.now().toString(),
            },
            notes: `Analysis started for ${projectName} on branch ${branchId}`,
        };

        return this.createScan(scanRequest);
    }
}

// Repository redirect helper
export function redirectToRepository(repoUrl: string): void {
    window.open(repoUrl, '_blank');
}

// Polling utility for scan status
export class ScanPoller {
    private apiService: ApiService;
    private intervalId: NodeJS.Timeout | null = null;
    private callbacks: {
        onUpdate?: (scan: ScanOut) => void;
        onComplete?: (analysis: Analysis) => void;
        onError?: (error: string) => void;
    } = {};

    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }

    start(
        scanId: string,
        callbacks: {
            onUpdate?: (scan: ScanOut) => void;
            onComplete?: (analysis: Analysis) => void;
            onError?: (error: string) => void;
        },
        intervalMs: number = 3000
    ): void {
        this.callbacks = callbacks;

        this.intervalId = setInterval(async () => {
            try {
                const scanResponse = await this.apiService.getScan(scanId);

                if (!scanResponse.success || !scanResponse.data) {
                    this.callbacks.onError?.('Failed to get scan status');
                    this.stop();
                    return;
                }

                const scan = scanResponse.data;
                this.callbacks.onUpdate?.(scan);

                if (scan.analysis?.status === 'completed') {
                    this.callbacks.onComplete?.(scan.analysis);
                    this.stop();
                } else if (scan.analysis?.status === 'failed') {
                    this.callbacks.onError?.('Analysis failed');
                    this.stop();
                }
            } catch (error) {
                this.callbacks.onError?.('Polling error occurred');
                this.stop();
            }
        }, intervalMs);
    }

    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

// Create and export singleton instance
const apiConfig: ApiConfig = {
    baseUrl: '10.84.108.154:8000',
};

export const apiService = new ApiService(apiConfig);
export default apiService;

// Custom React hooks for easy integration

// Custom hook for repository data
export function useRepositories(userId: string) {
    const [repositories, setRepositories] = React.useState<RepoOut[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const fetchRepositories = React.useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        const response = await apiService.getUserRepositories(userId);

        if (response.success && response.data) {
            setRepositories(response.data);
        } else {
            setError(response.error || 'Failed to fetch repositories');
        }

        setLoading(false);
    }, [userId]);

    React.useEffect(() => {
        fetchRepositories();
    }, [fetchRepositories]);

    return { repositories, loading, error, refetch: fetchRepositories };
}

// Custom hook for scan summaries
export function useScanSummaries(userId: string) {
    const [summaries, setSummaries] = React.useState<RepoSummary[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const fetchSummaries = React.useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        const response = await apiService.getScansSummary(userId);

        if (response.success && response.data) {
            setSummaries(response.data);
        } else {
            setError(response.error || 'Failed to fetch scan summaries');
        }

        setLoading(false);
    }, [userId]);

    React.useEffect(() => {
        fetchSummaries();
    }, [fetchSummaries]);

    return { summaries, loading, error, refetch: fetchSummaries };
}

export function useRules() {
    const [rules, setRules] = React.useState<RuleOut[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const fetchRules = React.useCallback(async () => {
        setLoading(true);
        setError(null);

        const response = await apiService.getAllRules();

        if (response.success && response.data) {
            setRules(response.data);
        } else {
            setError(response.error || 'Failed to fetch rules');
        }

        setLoading(false);
    }, []);

    React.useEffect(() => {
        fetchRules();
    }, [fetchRules]);

    return { rules, loading, error, refetch: fetchRules };
}

// Custom hook for a specific scan
export function useScan(scanId: string | null) {
    const [scan, setScan] = React.useState<ScanOut | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const fetchScan = React.useCallback(async () => {
        if (!scanId) return;

        setLoading(true);
        setError(null);

        const response = await apiService.getScan(scanId);

        if (response.success && response.data) {
            setScan(response.data);
        } else {
            setError(response.error || 'Failed to fetch scan');
        }

        setLoading(false);
    }, [scanId]);

    React.useEffect(() => {
        fetchScan();
    }, [fetchScan]);

    return { scan, loading, error, refetch: fetchScan };
}