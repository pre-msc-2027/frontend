import React, { useState } from 'react';
import './HomePage.css';
import CardAnimated from "./Component/CardAnimated.tsx";

const Home: React.FC = () => {
    const [url, setUrl] = useState('');
    const [step, setStep] = useState(0);
    const steps = ["Initialize", "Analyzing Repo", "Logs & Deployment"];

    const handleAnalyze = () => {
        setStep(1);
        setTimeout(() => setStep(2), 2000);
        setTimeout(() => setStep(3), 4000);
    };

    return (
        <>
            <div>
                <div className="home-container">
                    <h1>GitHub Deployment Tool</h1>
                    <form className="repo-form" onSubmit={(e) => {
                        e.preventDefault();
                        handleAnalyze();
                    }}>
                        <input
                            type="text"
                            placeholder="Enter GitHub repo URL"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required/>
                        <button type="submit">Analyze Repository</button>
                    </form>

                    <div className="progress-bar">
                        {steps.map((s, index) => (
                            <div key={index}
                                 className={`step ${step > index ? 'done' : step === index ? 'active' : ''}`}>
                                {s}
                            </div>
                        ))}
                    </div>

                    <section className="description">
                        <h2>What We Do</h2>
                        <CardAnimated/>
                        <ul>
                            <li>🧠 Language Detection (JS, Python, PHP...)</li>
                            <li>⚙️ Automated Setup & Deployment</li>
                            <li>📦 Containerization & Hosting</li>
                        </ul>
                    </section>
                </div>
            </div>
        </>
    );
};

export default Home;
