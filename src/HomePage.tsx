import React from 'react';
import './HomePage.css';
import { Header } from './HomePageComponents/Header.tsx';
import ProcessingSteps from './HomePageComponents/ProcessingSteps.tsx';
import { Features } from './HomePageComponents/Features.tsx';
import { Footer } from './HomePageComponents/Footer.tsx';
import { Hero } from './HomePageComponents/Hero.tsx';

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
