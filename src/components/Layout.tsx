import React from 'react';
import Navbar from './Navbar';
import { useTranslation } from '../hooks/useTranslation';

import './Layout.css';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { t } = useTranslation();

    return (
        <div className="layout-container">
            <Navbar />
            <main className="layout-main">
                {children}
            </main>
            <footer className="layout-footer">
                {t('footer').replace('{year}', new Date().getFullYear().toString())}
            </footer>
        </div>
    );
};

export default Layout;
