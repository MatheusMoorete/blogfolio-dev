import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const Navbar: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();

    const handleNavClick = (e: React.MouseEvent, target: string) => {
        if (location.pathname === '/' || location.pathname === '') {
            e.preventDefault();
            const element = document.getElementById(target);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <nav className="full-width-header" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', padding: '10px 0', alignItems: 'center' }}>
                <Link to="/" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', borderRight: '2px solid black', paddingRight: '15px' }}>
                    <div className="retro-control" style={{ background: 'black' }}></div>
                    BLOGFOLIO
                </Link>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <Link to="/blog" style={{ textDecoration: 'none' }}>{t('blog')}</Link>
                    <Link to="/#projects" onClick={(e) => handleNavClick(e, 'projects')} style={{ textDecoration: 'none' }}>{t('projects')}</Link>
                    <Link to="/#about" onClick={(e) => handleNavClick(e, 'about')} style={{ textDecoration: 'none' }}>{t('about')}</Link>
                    <Link to="/" style={{ textDecoration: 'none' }}>{t('contact')}</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
