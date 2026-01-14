import React from 'react';
import Navbar from './Navbar';
import { useTranslation } from '../hooks/useTranslation';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { t } = useTranslation();

    return (
        <div style={{
            display: 'grid',
            gridTemplateRows: 'auto 1fr auto',
            minHeight: '100vh',
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '0 20px',
            boxSizing: 'border-box',
            width: '100%'
        }}>
            <Navbar />
            <main style={{ width: '100%', overflow: 'hidden' }}>
                {children}
            </main>
            <footer style={{
                marginTop: '1.5rem',
                padding: '2rem 0',
                textAlign: 'center',
                borderTop: '2px solid black',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                width: '100%'
            }}>
                {t('footer').replace('{year}', new Date().getFullYear().toString())}
            </footer>
        </div>
    );
};

export default Layout;
