import React, { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import "./RulesCard.css";
import axios from "axios";

interface RuleParameter {
    type: string;
    name: string;
    default: string;
    description: string;
    options?: Record<string, number>;
}

interface Rule {
    rule_id: string;
    name: string;
    description: string;
    tags: string[];
    parameters: RuleParameter[];
    severity?: "low" | "medium" | "high" | "critical";
    enabled?: boolean;
}

const RulesCard: React.FC = () => {
    const [rules, setRules] = useState<Rule[]>([]);
    const [selectedRules, setSelectedRules] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchRules = async () => {
        try {
            const response = await axios.get<Rule[]>(`${import.meta.env.VITE_API_URL}/rules/`, {
                withCredentials: true,
            });

            const rulesWithDefaults = response.data.map(rule => ({
                ...rule,
                severity: rule.severity || "low",
                enabled: rule.enabled ?? true
            }));

            setRules(rulesWithDefaults);
            console.log("✅ Rules fetched:", rulesWithDefaults);
        } catch (err) {
            console.error("❌ Error fetching rules:", err);
            alert("Failed to fetch rules from the API");
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    const filteredRules = useMemo(() => {
        return rules.filter(rule => {
            const matchesSearch =
                rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rule.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
    }, [rules, searchTerm]);

    const handleRuleToggle = (id: string) => {
        setSelectedRules(prev =>
            prev.includes(id) ? prev.filter(ruleId => ruleId !== id) : [...prev, id]
        );
    };

    const getSeverityColor = (severity: string) => {
        const colors: Record<string, string> = {
            critical: 'text-red-400',
            high: 'text-orange-400',
            medium: 'text-yellow-400',
            low: 'text-blue-400'
        };
        return colors[severity] || colors.low;
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

            {/* Rules List */}
            <div className="rules-list">
                {filteredRules.length === 0 ? (
                    <div className="empty-state">
                        <p>No rules found</p>
                    </div>
                ) : (
                    filteredRules.map((rule, index) => (
                        <button
                            key={rule.rule_id}
                            className={`rule-item ${selectedRules.includes(rule.rule_id) ? 'selected' : ''} ${!rule.enabled ? 'disabled' : ''}`}
                            onClick={() => handleRuleToggle(rule.rule_id)}
                            style={{ '--animation-delay': `${index * 0.05}s` } as React.CSSProperties}
                        >
                            <div className="rule-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedRules.includes(rule.rule_id)}
                                    onChange={() => handleRuleToggle(rule.rule_id)}
                                    className="checkbox-input"
                                />
                            </div>

                            <div className="rule-info">
                                <div className="rule-header">
                                    <h4 className="rule-name">{rule.name}</h4>
                                    <div className="rule-badges">
                                        <span className={`severity-badge ${rule.severity} ${getSeverityColor(rule.severity!)}`}>
                                            {rule.severity}
                                        </span>
                                    </div>
                                </div>
                                <p>{rule.description}</p>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

export default RulesCard;