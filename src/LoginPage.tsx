import React from 'react';
import './LoginPage.css';
import { loginWithGitHub } from "./Api/service/authServices.ts";

const LoginPage: React.FC = () => {
    const handleLogin = () => {
        loginWithGitHub();
    }
    return (
            <div className="blob-content">
                <div className="grid-container">
                    <div className="grid-item">
                    </div>
                    <div className="grid-item">
                        <h1>Welcome to <br/><span>SecuScan</span></h1>
                        <p>To get started, log in with your GitHub account.</p>
                        <p>This site allows you to deploy any web project easily and efficiently.</p>
                        <button className="github-button" onClick={handleLogin}>
                            Login with GitHub
                        </button>
                    </div>
                </div>
            </div>
    );
};

export default LoginPage;
