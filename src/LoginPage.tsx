import React from 'react';
import Blob from './Component/Blob.tsx';
import Launcher from './Component/Launcher.tsx';
import './LoginPage.css';

const LoginPage: React.FC = () => {
    return (
        <Blob>
            <div className="blob-content">
                <div className="grid-container">
                    <div className="grid-item">
                        <Launcher />
                    </div>
                    <div className="grid-item">
                        <h1>Welcome to <span>SecuScan</span></h1>
                        <p>To get started, log in with your GitHub account.</p>
                        <p>This site allows you to deploy any web project easily and efficiently.</p>
                        <button className="github-button">
                            Login with GitHub
                        </button>
                    </div>
                </div>
            </div>
        </Blob>
    );
};

export default LoginPage;
