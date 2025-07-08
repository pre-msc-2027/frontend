import React from 'react';
import { Header } from './Component/Header.tsx';
import ProcessingSteps from './Component/ProcessingSteps.tsx';
import { Features } from './Component/Features.tsx';
import { Footer } from './Component/Footer.tsx';
import { Hero } from './Component/Hero.tsx';

const Home: React.FC = () => {

    return (
        <>
            <Header/>
            <Hero/>
            <ProcessingSteps/>
            <Features/>
            <Footer/>
        </>
    );
};

export default Home;
