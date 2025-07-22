import {
    FaBolt,
    FaSearch,
    FaRocket,
    FaClipboardList
} from "react-icons/fa";
import { RiGeminiFill } from "react-icons/ri";
import "./DevelopmentProgress.css";

const stageIcons = {
    Initialization: <FaBolt />,
    Analysis: <FaSearch />,
    AI: <RiGeminiFill />,
    Logs: <FaClipboardList />,
    Deploy: <FaRocket />
};

type StageLabel = keyof typeof stageIcons;

const stages: { id: number; label: StageLabel }[] = [
    { id: 1, label: "Initialization" },
    { id: 2, label: "Analysis" },
    { id: 3, label: "AI" },
    { id: 4, label: "Logs" },
    { id: 5, label: "Deploy" }
];


    export default function DevelopmentProgress({ currentStage }: { currentStage: number}) {
    return (
        <div className="progress-container">
            {stages.map((stage, index) => (
                <div key={stage.id} className="progress-step">
                    <div
                        className={`progress-circle ${
                            currentStage >= stage.id ? "completed" : ""
                        }`}
                    >
                        <span className="icon">{stageIcons[stage.label]}</span>
                    </div>
                    {index < stages.length - 1 && (
                        <div
                            className={`progress-line ${
                                currentStage > stage.id ? "completed" : ""
                            }`}
                        />
                    )}
                    <div className="progress-label">{stage.label}</div>
                </div>
            ))}
        </div>
    );
}
