import React, { useState, useMemo } from 'react';
import { Search, AlertTriangle, Info, AlertCircle, Bug } from 'lucide-react';
import './LogsDashboard.css';

interface Log {
    timestamp: number;
    message: string;
    error?: number | null; // 0 = info, 1 = warning, 2 = error
}

interface LogsDashboardProps {
    logs?: Log[];
}

const levelIcons = {
    info: <Info size={16} className="text-blue-400" />,
    warning: <AlertTriangle size={16} className="text-yellow-400" />,
    error: <AlertCircle size={16} className="text-red-400" />
};

const LogsDashboard: React.FC<LogsDashboardProps> = ({ logs = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevels, setSelectedLevels] = useState<string[]>(['info', 'warning', 'error']);

    const logsWithLevel = useMemo(() => {
        return logs.map(log => {
            let level: 'info' | 'warning' | 'error' = 'info';
            if (log.error === 1) level = 'warning';
            else if (log.error === 2) level = 'error';
            return { ...log, level };
        });
    }, [logs]);

    const filteredLogs = useMemo(() => {
        return logsWithLevel.filter(log =>
            log.message.toLowerCase().includes(searchTerm.toLowerCase()) &&
            selectedLevels.includes(log.level)
        );
    }, [logsWithLevel, searchTerm, selectedLevels]);

    const handleLevelToggle = (level: string) => {
        setSelectedLevels(prev =>
            prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
        );
    };

    const getLogLevelClass = (level: string) => {
        const classes = {
            info: 'log-level-info',
            warning: 'log-level-warning',
            error: 'log-level-error'
        };
        return classes[level as keyof typeof classes] || classes.info;
    };

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString()
        };
    };

    const logCounts = {
        info: logsWithLevel.filter(log => log.level === 'info').length,
        warning: logsWithLevel.filter(log => log.level === 'warning').length,
        error: logsWithLevel.filter(log => log.level === 'error').length
    };

    return (
        <div className="logs-dashboard">
            {/* Search */}
            <div className="logs-controls">
                <div className="search-container">
                    <Search className="search-icon" size={16} />
                    <input
                        type="text"
                        placeholder="Search logs..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                {/* Level Filters */}
                <div className="level-filters">
                    {(['info', 'warning', 'error'] as const).map(level => (
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

            {/* Logs Table */}
            <div className="logs-table-container">
                {filteredLogs.length === 0 ? (
                    <div className="empty-state">
                        <Search size={48} className="empty-icon" />
                        <h4>No logs found</h4>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    <div className="logs-table-body">
                        {filteredLogs.map((log, index) => {
                            const { date, time } = formatTimestamp(log.timestamp);
                            return (
                                <div
                                    key={index}
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
                                    <div className="log-cell message">{log.message}</div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LogsDashboard;
