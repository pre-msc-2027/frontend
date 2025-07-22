import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import "./RulesCard.css";

interface Rule {
    id: number;
    name: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    enabled: boolean;
}

const mockRules: Rule[] = [
    {
        id: 1,
        name: "SQL Injection Detection",
        description: "Detects potential SQL injection vulnerabilities",
        severity: 'critical',
        enabled: true
    },
    {
        id: 2,
        name: "XSS Prevention",
        description: "Prevents cross-site scripting attacks",
        severity: 'high',
        enabled: true
    },
    {
        id: 3,
        name: "Unused Variables",
        description: "Identifies unused variables in code",
        severity: 'medium',
        enabled: false
    },
    {
        id: 4,
        name: "Performance Bottlenecks",
        description: "Detects potential performance issues",
        severity: 'high',
        enabled: true
    },
    {
        id: 5,
        name: "CSRF Protection",
        description: "Validates CSRF token implementation",
        severity: 'high',
        enabled: true
    },
    {
        id: 6,
        name: "Memory Leaks",
        description: "Identifies potential memory leak patterns",
        severity: 'medium',
        enabled: false
    },
    {
        id: 7,
        name: "Accessibility Standards",
        description: "Ensures WCAG compliance",
        severity: 'medium',
        enabled: true
    },
    {
        id: 8,
        name: "API Rate Limiting",
        description: "Checks for proper rate limiting implementation",
        severity: 'high',
        enabled: false
    },
    {
        id: 9,
        name: "Code Complexity",
        description: "Measures cyclomatic complexity",
        severity: 'low',
        enabled: true
    },
    {
        id: 10,
        name: "Insecure Dependencies",
        description: "Scans for vulnerable dependencies",
        severity: 'critical',
        enabled: true
    },
    {
        id: 11,
        name: "Dead Code Elimination",
        description: "Identifies unreachable code blocks",
        severity: 'low',
        enabled: false
    },
    {
        id: 12,
        name: "SEO Best Practices",
        description: "Validates SEO optimization rules",
        severity: 'medium',
        enabled: true
    },
];

const RulesCard: React.FC = () => {
    const [selectedRules, setSelectedRules] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredRules = useMemo(() => {
        return mockRules.filter(rule => {
            const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rule.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
    }, [searchTerm]);

    const handleRuleToggle = (id: number) => {
        setSelectedRules(prev =>
            prev.includes(id) ? prev.filter(ruleId => ruleId !== id) : [...prev, id]
        );
    };


    const getSeverityColor = (severity: string) => {
        const colors = {
            critical: 'text-red-400',
            high: 'text-orange-400',
            medium: 'text-yellow-400',
            low: 'text-blue-400'
        };
        return colors[severity as keyof typeof colors] || colors.low;
    };

    return (
        <div className="h-full flex flex-col">
            {/* Search Bar */}
            <div className="search-container">
                <Search className="search-icon" size={16} />
                <input
                    type="text"
                    placeholder="Search rules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* Select All Button */}


            {/* Rules List */}
            <div className="rules-list">
                {filteredRules.length === 0 ? (
                    <div className="empty-state">
                        <p>No rules found</p>
                    </div>
                ) : (
                    filteredRules.map((rule, index) => (
                        <button
                            key={rule.id}
                            className={`rule-item ${selectedRules.includes(rule.id) ? 'selected' : ''} ${!rule.enabled ? 'disabled' : ''}`}
                            onClick={() => handleRuleToggle(rule.id)}
                            style={{ '--animation-delay': `${index * 0.05}s` } as React.CSSProperties}
                        >
                            <div className="rule-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedRules.includes(rule.id)}
                                    onChange={() => handleRuleToggle(rule.id)}
                                    className="checkbox-input"
                                />
                            </div>

                            <div className="rule-info">
                                <div className="rule-header">
                                    <h4 className="rule-name">{rule.name}</h4>
                                    <div className="rule-badges">
                                        <span className={`severity-badge ${rule.severity} ${getSeverityColor(rule.severity)}`}>
                                            {rule.severity}
                                        </span>

                                    </div>
                                </div>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

export default RulesCard;