'use client';

import React from 'react';
import './Card.css';

interface Card {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<Card> = ({ children, className = '' }) => {
    return (
        <div className={`glassy-card ${className}`}>
            {children}
        </div>
    );
};

export default Card;