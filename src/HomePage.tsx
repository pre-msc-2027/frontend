import React, { useState } from 'react';
import './HomePage.css';
import { Header } from './Components/Header.tsx';
import ProcessingSteps from './Components/ProcessingSteps.tsx';
import { Features } from './Components/Features.tsx';
import { Footer } from './Components/Footer.tsx';
import { Hero } from './Components/Hero.tsx';

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
