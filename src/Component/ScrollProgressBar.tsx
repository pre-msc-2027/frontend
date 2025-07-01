'use client';

import { useEffect, useState, useRef } from 'react';
import './ScrollProgressBar.css';
import Card from "./Card.tsx";

const steps = ['Introduction', 'About', 'Services', 'Projects', 'Contact'];

export default function ScrollProgressBar() {
    const [currentStep, setCurrentStep] = useState(0);
    const sectionsRef = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = sectionsRef.current.findIndex(el => el === entry.target);
                    if (entry.isIntersecting) {
                        setCurrentStep(index);
                    }
                });
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.6,
            }
        );

        sectionsRef.current.forEach((section) => {
            if (section) observer.observe(section);
        });

        return () => {
            sectionsRef.current.forEach((section) => {
                if (section) observer.unobserve(section);
            });
        };
    }, []);

    return (
        <div className="progress-container">
            <div className="progress-bar">
                {steps.map((label, i) => (
                    <div key={i} className={`step ${i <= currentStep ? 'active' : ''}`}>
                        <div className="circle" />
                        <span>{label}</span>
                    </div>
                ))}
            </div>

            <div className="content">
                {steps.map((label, i) => (
                    <Card
                        key={i}
                        className="Small"
                    >
                        <h2>{label}</h2>
                        <p>Content for {label} goes here...</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
