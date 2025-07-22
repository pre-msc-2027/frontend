import React, { useState, useMemo } from 'react';
import { Search, AlertTriangle, Info, AlertCircle, Bug } from 'lucide-react';
import './LogsDashboard.css';

interface LogEntry {
    id: number;
    timestamp: string;
    level: 'debug' | 'info' | 'warning' | 'error';
    message: string;
    source?: string;
}

const mockLogs: LogEntry[] = [
    {
        id: 1,
        timestamp: '2024-01-15 14:32:15',
        level: 'info',
        message: 'Application started successfully on port 3000',
        source: 'server.js'
    },
    {
        id: 2,
        timestamp: '2024-01-15 14:32:18',
        level: 'info',
        message: 'Database connection established',
        source: 'database.js'
    },
    {
        id: 3,
        timestamp: '2024-01-15 14:35:22',
        level: 'warning',
        message: 'Low disk space detected: 85% usage on /var/log',
        source: 'system-monitor.js'
    },
    {
        id: 4,
        timestamp: '2024-01-15 14:38:45',
        level: 'error',
        message: 'Failed to connect to external API: timeout after 30s',
        source: 'api-client.js'
    },
    {
        id: 5,
        timestamp: '2024-01-15 14:39:12',
        level: 'debug',
        message: 'Processing user authentication request',
        source: 'auth.js'
    },
    {
        id: 6,
        timestamp: '2024-01-15 14:40:01',
        level: 'info',
        message: 'User admin@example.com logged in successfully',
        source: 'auth.js'
    },
    {
        id: 7,
        timestamp: '2024-01-15 14:42:33',
        level: 'warning',
        message: 'High memory usage detected: 78% of available RAM',
        source: 'system-monitor.js'
    },
    {
        id: 8,
        timestamp: '2024-01-15 14:45:17',
        level: 'error',
        message: 'SQL injection attempt blocked from IP 192.168.1.100',
        source: 'security.js'
    },
    {
        id: 9,
        timestamp: '2024-01-15 14:46:22',
        level: 'debug',
        message: 'Cache miss for key: user_sessions_cache',
        source: 'cache.js'
    },
    {
        id: 10,
        timestamp: '2024-01-15 14:48:55',
        level: 'info',
        message: 'Backup process completed successfully',
        source: 'backup.js'
    },
    {
        id: 11,
        timestamp: '2024-01-15 14:50:12',
        level: 'error',
        message: 'Payment processing failed: invalid card number',
        source: 'payment.js'
    },
    {
        id: 12,
        timestamp: '2024-01-15 14:52:08',
        level: 'warning',
        message: 'SSL certificate expires in 7 days',
        source: 'ssl-monitor.js'
    }
];

const levelIcons = {
    debug: <Bug size={16} className="text-gray-400" />,
    info: <Info size={16} className="text-blue-400" />,
    warning: <AlertTriangle size={16} className="text-yellow-400" />,
    error: <AlertCircle size={16} className="text-red-400" />
};

const LogsDashboard: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevels, setSelectedLevels] = useState<string[]>(['debug', 'info', 'warning', 'error']);

    const filteredLogs = useMemo(() => {
        return mockLogs.filter(log => {
            const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.timestamp.includes(searchTerm);
            const matchesLevel = selectedLevels.includes(log.level);
            return matchesSearch && matchesLevel;
        });
    }, [searchTerm, selectedLevels]);

    const handleLevelToggle = (level: string) => {
        setSelectedLevels(prev =>
            prev.includes(level)
                ? prev.filter(l => l !== level)
                : [...prev, level]
        );
    };


    const getLogLevelClass = (level: string) => {
        const classes = {
            debug: 'log-level-debug',
            info: 'log-level-info',
            warning: 'log-level-warning',
            error: 'log-level-error'
        };
        return classes[level as keyof typeof classes] || classes.info;
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString()
        };
    };

    const logCounts = {
        debug: mockLogs.filter(log => log.level === 'debug').length,
        info: mockLogs.filter(log => log.level === 'info').length,
        warning: mockLogs.filter(log => log.level === 'warning').length,
        error: mockLogs.filter(log => log.level === 'error').length
    };

    return (
        <div className="logs-dashboard">
            {/* Header Section */}

            {/* Search and Filters */}
            <div className="logs-controls">
                {/* Search Bar */}
                <div className="search-container">
                    <Search className="search-icon" size={16} />
                    <input
                        type="text"
                        placeholder="Search logs, sources, or timestamps..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                {/* Level Filters */}
                <div className="level-filters">


                    <div className="level-checkboxes">
                        {(['debug', 'info', 'warning', 'error'] as const).map(level => (
                            <label key={level} className={`level-checkbox ${level}`}>
                                <input
                                    type="checkbox"
                                    checked={selectedLevels.includes(level)}
                                    onChange={() => handleLevelToggle(level)}
                                />
                                <span className="checkbox-custom"></span>
                                <span className="level-icon">{levelIcons[level]}</span>
                                <span className="level-name">{level}</span>
                                <span className="level-count">({logCounts[level]})</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Logs Table */}
            <div className="logs-table-container">
                {filteredLogs.length === 0 ? (
                    <div className="empty-state">
                        <Search size={48} className="empty-icon" />
                        <h4>No logs found</h4>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    <>
                        {/* Table Header */}
                        <div className="logs-table-header">
                            <div className="header-cell timestamp">Timestamp</div>
                            <div className="header-cell level">Level</div>
                            <div className="header-cell message">Message</div>
                            <div className="header-cell source">Source</div>
                        </div>

                        {/* Table Body */}
                        <div className="logs-table-body">
                            {filteredLogs.map((log, index) => {
                                const { date, time } = formatTimestamp(log.timestamp);
                                return (
                                    <div
                                        key={log.id}
                                        className={`log-row ${getLogLevelClass(log.level)}`}
                                        style={{ '--animation-delay': `${index * 0.02}s` } as React.CSSProperties}
                                    >
                                        <div className="log-cell timestamp">
                                            <div className="timestamp-date">{date}</div>
                                            <div className="timestamp-time">{time}</div>
                                        </div>
                                        <div className="log-cell level">
                                            <div className="level-badge">
                                                {levelIcons[log.level]}
                                                <span>{log.level}</span>
                                            </div>
                                        </div>
                                        <div className="log-cell message">
                                            <span className="message-text">{log.message}</span>
                                        </div>
                                        <div className="log-cell source">
                                            <span className="source-text">{log.source}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LogsDashboard;