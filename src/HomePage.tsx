import React from 'react';
import { Header } from './HomePageComponents/Header.tsx';
import ProcessingSteps from './HomePageComponents/ProcessingSteps.tsx';
import { Features } from './HomePageComponents/Features.tsx';
import { Footer } from './HomePageComponents/Footer.tsx';
import { Hero } from './HomePageComponents/Hero.tsx';

const Home: React.FC = () => {

    return (
        <div className="bg-gradient-to-b from-bg to-bg min-h-screen">
            <Header/>
            <Hero/>
            <ProcessingSteps/>
            <Features/>
            <Footer/>
        </div>
    );
};

export default Home;
