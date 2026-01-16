import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const [clickCount, setClickCount] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogoClick = () => {
        const newCount = clickCount + 1;
        setClickCount(newCount);

        if (newCount >= 10) {
            setClickCount(0);
            window.dispatchEvent(new CustomEvent('trigger-bsod'));
        }
        setIsMenuOpen(false);
    };

    const handleNavClick = (e: React.MouseEvent, target: string) => {
        if (location.pathname === '/' || location.pathname === '') {
            e.preventDefault();
            const element = document.getElementById(target);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="full-width-header navbar-wrapper">
            <div className="navbar-container">
                <Link to="/" onClick={handleLogoClick} className="navbar-logo">
                    <div className="navbar-logo-icon"></div>
                    BLOGFÓLIO
                </Link>

                <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle menu">
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
                    <Link to="/blog" className="navbar-link" onClick={() => setIsMenuOpen(false)}>{t('blog')}</Link>
                    <Link to="/#projects" className="navbar-link" onClick={(e) => handleNavClick(e, 'projects')}>{t('projects')}</Link>
                    <Link to="/#about" className="navbar-link" onClick={(e) => handleNavClick(e, 'about')}>{t('about')}</Link>
                    <Link to="/#contact" className="navbar-link" onClick={(e) => handleNavClick(e, 'contact')}>{t('contact')}</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
