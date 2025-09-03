import React, {useState, useEffect} from 'react';
import {Doughnut} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Analysis {
    status: string;
    summary: {
        total_files: number;
        files_with_vulnerabilities: number;
        vulnerabilities_found: number;
    };
    warnings: Warning[];
}

interface Warning {
    file: string;
    line: number;
    rule_id: number | string;
    id: number;
}

interface Rule {
    rule_id: string;
    name: string;
    description: string;
    tags: string[];
    parameters: RuleParameter[];
}

interface RuleParameter {
    type: string;
    name: string;
    default: any;
    description: string;
    options?: Record<string, any>;
}

interface AnalysisWithRules {
    analysis: Analysis;
    rules: Rule[];
}

interface PiechartProp{
    scanId: string;
}

const PieChart: React.FC<PiechartProp> = ({scanId}) => {
    const [analysisData, setAnalysisData] = useState<AnalysisWithRules | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const baseapiUrl = import.meta.env.VITE_API_URL_BACK

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${baseapiUrl}/scans/analyse_with_rules/${scanId}`);
            const data: AnalysisWithRules = response.data;
            setAnalysisData(data);
        } catch (err) {
            console.error("❌ Failed to fetch data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [scanId]);


    const generateChartData = () => {
        if (!analysisData) return null;

        const { analysis, rules } = analysisData;

        if (!analysis.warnings) return null;


        const ruleOccurrences = new Map<string, number>();

        analysis.warnings.forEach(warning => {
            const ruleId = warning.rule_id.toString();
            ruleOccurrences.set(ruleId, (ruleOccurrences.get(ruleId) || 0) + 1);
        });


        const labels: string[] = [];
        const data: number[] = [];
        const backgroundColors = ['#547fff', '#df4cd9', '#ffb272', '#2dd4bf', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];

        rules.forEach((rule) => {
            const occurrences = ruleOccurrences.get(rule.rule_id.toString()) || 0;

            if (occurrences > 0) {
                labels.push(rule.name);
                data.push(occurrences);
            }
        });


        return {
            labels,
            datasets: [
                {
                    label: 'Nombre d\'occurrences',
                    data,
                    backgroundColor: backgroundColors.slice(0, labels.length),
                    borderColor: '#fff',
                    borderWidth: 0,
                    hoverOffset: 12,
                    offset: 0,
                },
            ],
        };
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
            legend: {
                display: true,
                position: 'bottom' as const,
                labels: {
                    color: '#FFFFFF',
                    font: {
                        size: 12,
                    },
                    padding: 20,
                },
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const value = context.parsed;
                        const label = context.label;
                        return `${label}: ${value}`;
                    },
                },
            },
        },
        animation: {
            animateRotate: true,
            duration: 1200,
        },
        layout: {
            padding: 30,
        },
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white">Chargement des données...</div>
            </div>
        );
    }

    const chartData = generateChartData();

    if (!chartData || chartData.datasets[0].data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white">Aucune vulnérabilité détectée</div>
            </div>
        );
    }

    return (
        <div className="h-64">
            <Doughnut data={chartData} options={options}/>
        </div>
    );
};

export default PieChart;