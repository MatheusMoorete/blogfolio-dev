import React, { useEffect, useState } from 'react';
import { useKonamiCode } from '../../hooks/useKonamiCode';
import './HackerMode.css';

const HackerMode: React.FC = () => {
    const [isActive, setIsActive] = useState(false);

    useKonamiCode(() => {
        setIsActive(prev => !prev);
    });

    useEffect(() => {
        if (isActive) {
            document.body.classList.add('hacker-mode-active');
        } else {
            document.body.classList.remove('hacker-mode-active');
        }
    }, [isActive]);

    if (!isActive) return null;

    return (
        <>
            <div className="scanlines-overlay" />
            <div className="crt-flicker" />
            <div style={{
                position: 'fixed',
                bottom: '10px',
                right: '10px',
                color: '#00ff41',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                zIndex: 10000,
                background: 'rgba(0,0,0,0.8)',
                padding: '2px 8px',
                border: '1px solid #00ff41'
            }}>
                HACKER_MODE: ACTIVE
            </div>
        </>
    );
};

export default HackerMode;
