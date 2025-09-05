import React, { useState, useMemo } from 'react';
import { Search, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import './LogsDashboard.css';

interface Log {
    timestamp: number;
    message: string;
    error?: number | null;
}

interface AI {
    warning_id: number;
    original: string;
    fixed: string;
}

interface Analysis{
    file: string;
    line: number;
    rule_id: number;
    id: number;
}

interface LogsDashboardProps {
    logs?: Log[];
    Analysis?: Analysis[];
    ai_comment?: AI[];
}

const levelIcons = {
    Logs: <Info size={16} className="text-blue-400" />,
    Analysis: <AlertTriangle size={16} className="text-yellow-400" />,
    AI: <AlertCircle size={16} className="text-red-400" />
};

const LogsDashboard: React.FC<LogsDashboardProps> = ({ logs = [], Analysis = [], ai_comment = [],}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevels, setSelectedLevels] = useState<string[]>(['Logs', 'Analysis', 'AI']);

    const unifiedData = useMemo(() => {
        const logEntries = logs.map(log => ({
            type: 'Logs',
            timestamp: log.timestamp,
            message: log.message,
            level: 'info'
        }));

        const analysisEntries = Analysis.map(item => ({
            type: 'Analysis',
            timestamp: Date.now(),
            message: `Rule ${item.rule_id} violation at ${item.file}:${item.line}`,
            level: 'warning'
        }));

        const aiEntries = ai_comment.map(item => ({
            type: 'AI',
            timestamp: Date.now(),
            message: `AI Suggestion: ${item.original} → ${item.fixed}`,
            level: 'info'
        }));

        return [...logEntries, ...analysisEntries, ...aiEntries];
    }, [logs, Analysis, ai_comment]);

    const filteredLogs = useMemo(() => {
        return unifiedData.filter(entry =>
            entry.message.toLowerCase().includes(searchTerm.toLowerCase()) &&
            selectedLevels.includes(entry.type)
        );
    }, [unifiedData, searchTerm, selectedLevels]);

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

    const logCounts = useMemo(() => ({
        Logs: unifiedData.filter(entry => entry.type === 'Logs').length,
        Analysis: unifiedData.filter(entry => entry.type === 'Analysis').length,
        AI: unifiedData.filter(entry => entry.type === 'AI').length
    }), [unifiedData]);


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
                    {(['Logs', 'Analysis', 'AI'] as const).map(level => (
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
                        {filteredLogs.map((entry, index) => {
                            const { date, time } = formatTimestamp(entry.timestamp);
                            return (
                                <div
                                    key={index}
                                    className={`log-row ${getLogLevelClass(entry.level)}`}
                                    style={{ '--animation-delay': `${index * 0.02}s` } as React.CSSProperties}
                                >
                                    <div className="log-cell timestamp">
                                        <div className="timestamp-date">{date}</div>
                                        <div className="timestamp-time">{time}</div>
                                    </div>
                                    <div className="log-cell level">
                                        <div className="level-badge">
                                            {levelIcons[entry.type as keyof typeof levelIcons]}
                                            <span>{entry.type}</span>
                                        </div>
                                    </div>
                                    <div className="log-cell message">{entry.message}</div>
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
