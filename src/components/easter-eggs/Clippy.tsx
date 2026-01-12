import React, { useState, useEffect } from 'react';
import './Clippy.css';
import clippyImg from '../../assets/clippy.png';

const Clippy: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        let timer: number;
        let isScrollingInProjects = false;

        const handleScroll = () => {
            const projectsSection = document.getElementById('projects');
            if (!projectsSection) return;

            const rect = projectsSection.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom >= 0;

            if (isInView && !isScrollingInProjects) {
                isScrollingInProjects = true;
                // Wait 5 seconds in projects section before showing Clippy
                timer = setTimeout(() => {
                    setMessage("Parece que você está procurando um desenvolvedor. Gostaria de ajuda para enviar um e-mail?");
                    setIsVisible(true);
                }, 5000);
            } else if (!isInView) {
                isScrollingInProjects = false;
                setIsVisible(false);
                clearTimeout(timer);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timer);
        };
    }, []);

    if (!isVisible) return null;

    const handleClick = () => {
        setIsVisible(false);
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="clippy-container">
            <div className="clippy-bubble">
                {message}
                <div className="clippy-bubble-tail"></div>
            </div>
            <img src={clippyImg} alt="Clippy" className="clippy-img" onClick={handleClick} />
        </div>
    );
};

export default Clippy;
