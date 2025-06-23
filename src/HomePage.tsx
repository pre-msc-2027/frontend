import React from 'react';
import Blob from "./Component/Blob.tsx";

const Home: React.FC = () => {
    return (
        <Blob>
            <h1>Welcome to the website</h1>
            <p>To get started, log in with your GitHub account.</p>
            <p>This site allows you to deploy any web project easily and efficiently.</p>
            <button className="github-button">
                Login with GitHub
            </button>
        </Blob>
    );
};

export default Home;
