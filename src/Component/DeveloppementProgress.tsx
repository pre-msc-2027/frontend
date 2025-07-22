import {
    FaBolt,
    FaSearch,
    FaRocket,
    FaClipboardList
} from "react-icons/fa";
import { RiGeminiFill } from "react-icons/ri";
import "./DevelopmentProgress.css";

// Define the stage label type
type StageLabel = "Initialization" | "Analysis" | "AI" | "Logs" | "Deploy";

// Type the stageIcons object properly
const stageIcons: Record<StageLabel, React.ReactElement> = {
    Initialization: <FaBolt />,
    Analysis: <FaSearch />,
    AI: <RiGeminiFill />,
    Logs: <FaClipboardList />,
    Deploy: <FaRocket />
};

// Type the stageColors object properly
const stageColors: Record<StageLabel, {
    main: string;
    light: string;
    glow: string;
}> = {
    Initialization: {
        main: "rgba(239, 68, 68, 0.8)",
        light: "rgba(239, 68, 68, 0.2)",
        glow: "rgba(239, 68, 68, 0.4)"
    },
    Analysis: {
        main: "rgba(59, 130, 246, 0.8)",
        light: "rgba(59, 130, 246, 0.2)",
        glow: "rgba(59, 130, 246, 0.4)"
    },
    AI: {
        main: "rgba(168, 85, 247, 0.8)",
        light: "rgba(168, 85, 247, 0.2)",
        glow: "rgba(168, 85, 247, 0.4)"
    },
    Logs: {
        main: "rgba(34, 197, 94, 0.8)",
        light: "rgba(34, 197, 94, 0.2)",
        glow: "rgba(34, 197, 94, 0.4)"
    },
    Deploy: {
        main: "rgba(251, 191, 36, 0.8)",
        light: "rgba(251, 191, 36, 0.2)",
        glow: "rgba(251, 191, 36, 0.4)"
    }
};

// Type the stages array properly
const stages: Array<{
    id: number;
    label: StageLabel;
    description: string;
}> = [
    { id: 1, label: "Initialization", description: "Setting up environment" },
    { id: 2, label: "Analysis", description: "Code scanning in progress" },
    { id: 3, label: "AI", description: "AI processing results" },
    { id: 4, label: "Logs", description: "Generating reports" },
    { id: 5, label: "Deploy", description: "Finalizing deployment" }
];

interface DevelopmentProgressProps {
    currentStage: number;
}

export default function DevelopmentProgress({ currentStage }: DevelopmentProgressProps) {
    const getStageStatus = (stageId: number) => {
        if (currentStage > stageId) return 'completed';
        if (currentStage === stageId) return 'active';
        return 'pending';
    };


    return (
        <div className="progress-wrapper">
            {/* Progress Overview */}

            {/* Desktop Layout */}
            <div className="progress-container desktop-layout">
                {stages.map((stage, index) => {
                    const status = getStageStatus(stage.id);
                    const colors = stageColors[stage.label]; // Now TypeScript knows this is safe
                    const icon = stageIcons[stage.label];     // Now TypeScript knows this is safe

                    return (
                        <div key={stage.id} className="progress-step">
                            {/* Connection Line */}
                            {index < stages.length - 1 && (
                                <div className={`progress-line ${status === 'completed' ? 'completed' : ''}`}>
                                    <div className="line-fill" />
                                </div>
                            )}

                            {/* Stage Circle */}
                            <div
                                className={`progress-circle ${status}`}
                                style={{
                                    '--stage-color': colors.main,
                                    '--stage-light': colors.light,
                                    '--stage-glow': colors.glow
                                } as React.CSSProperties}
                            >
                                <div className="circle-background" />
                                <span className="icon">{icon}</span>

                                {/* Completion Checkmark */}
                                {status === 'completed' && (
                                    <div className="completion-check">✓</div>
                                )}

                                {/* Active Pulse */}
                                {status === 'active' && (
                                    <div className="active-pulse" />
                                )}
                            </div>

                            {/* Stage Info */}
                            <div className="progress-info">
                                <div className="progress-label">{stage.label}</div>
                                <div className="progress-description">{stage.description}</div>

                                {/* Stage Status Indicator */}
                                <div className={`status-indicator ${status}`}>
                                    {status === 'completed' && '✅ Complete'}
                                    {status === 'active' && '🔄 In Progress'}
                                    {status === 'pending' && '⏳ Pending'}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mobile Layout */}
            <div className="progress-container mobile-layout">
                {stages.map((stage, index) => {
                    const status = getStageStatus(stage.id);
                    const colors = stageColors[stage.label]; // Now TypeScript knows this is safe
                    const icon = stageIcons[stage.label];     // Now TypeScript knows this is safe

                    return (
                        <div key={stage.id} className="mobile-progress-item">
                            <div className="mobile-step-content">
                                {/* Circle */}
                                <div
                                    className={`mobile-progress-circle ${status}`}
                                    style={{
                                        '--stage-color': colors.main,
                                        '--stage-light': colors.light,
                                        '--stage-glow': colors.glow
                                    } as React.CSSProperties}
                                >
                                    <span className="icon">{icon}</span>
                                    {status === 'completed' && <div className="completion-check">✓</div>}
                                    {status === 'active' && <div className="active-pulse" />}
                                </div>

                                {/* Info */}
                                <div className="mobile-progress-info">
                                    <div className="mobile-progress-header">
                                        <span className="mobile-progress-label">{stage.label}</span>
                                        <span className={`mobile-status-indicator ${status}`}>
                                            {status === 'completed' && '✅'}
                                            {status === 'active' && '🔄'}
                                            {status === 'pending' && '⏳'}
                                        </span>
                                    </div>
                                    <div className="mobile-progress-description">{stage.description}</div>
                                </div>
                            </div>

                            {/* Connection Line for Mobile */}
                            {index < stages.length - 1 && (
                                <div className={`mobile-progress-line ${status === 'completed' ? 'completed' : ''}`}>
                                    <div className="mobile-line-fill" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}