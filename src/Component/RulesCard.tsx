import React, {useState, useMemo, useEffect} from "react";
import { Search } from "lucide-react";
import "./RulesCard.css";
import axios from "axios";

interface RuleParameterOptions {
    low?: number;
    medium?: number;
    high?: number;
    [key: string]: any;
}

interface RuleParameter {
    type: string;
    name: string;
    default: string | number | boolean;
    description: string;
    options?: RuleParameterOptions;
}

interface Rule {
    rule_id: string;
    name: string;
    description: string;
    tags: string[];
    parameters: RuleParameter[];
}

const RulesCard: React.FC = () => {
    const [rules, setRules] = useState<Rule[]>([]);
    const [selectedRules, setSelectedRules] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const baseapiUrl = import.meta.env.VITE_API_URL_BACK

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const response = await axios.get<Rule[]>(`${baseapiUrl}/rules/`, {
                    withCredentials: true,
                });
                setRules(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchRules();
    }, []);

    const filteredRules = useMemo(() => {
        return rules.filter(rule => {
            const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rule.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
    }, [rules, searchTerm]);

    const handleRuleToggle = (ruleId: string) => {
        setSelectedRules(prev =>
            prev.includes(ruleId) ? prev.filter(id => id !== ruleId) : [...prev, ruleId]
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

            {/* Rules List */}
            <div className="rules-list">
                {filteredRules.length === 0 ? (
                    <div className="empty-state">
                        <p>No rules found</p>
                    </div>
                ) : (
                    filteredRules.map((rule, index) => {
                        const severity = rule.parameters.find(p => p.name === 'severity')?.default || 'medium';
                        return (
                            <button
                                key={rule.rule_id}
                                className={`rule-item ${selectedRules.includes(rule.rule_id) ? 'selected' : ''}`}
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
                                            <span className={`severity-badge ${severity} ${getSeverityColor(severity as string)}`}>
                                                {severity}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default RulesCard;