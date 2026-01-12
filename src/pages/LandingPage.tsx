import React from 'react';
import Window from '../components/Window';
import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

import heroImg from '../assets/soueu.webp';
import syncmanagerImg from '../assets/syncmanager.png';
import unitaskImg from '../assets/unitask.png';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    React.useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [location.hash]);

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section style={{ display: 'flex', gap: '2rem', marginBottom: '4rem', alignItems: 'center' }}>
                <div style={{ flex: '1.5' }}>
                    <h1 style={{ fontSize: '2.2rem', lineHeight: '1.2', marginBottom: '0.2rem', fontWeight: 400 }}>
                        {t('heroGreeting')} {t('heroIntro')}<strong>{t('heroName')}</strong>
                    </h1>
                    <p style={{ fontSize: '2.2rem', lineHeight: '1.2', marginBottom: '0.5rem', color: '#333', fontWeight: 400 }}>
                        {t('heroSub')}
                    </p>
                    <p style={{ fontSize: '1rem', marginBottom: '2rem', color: '#666', fontStyle: 'italic' }}>
                        "{t('heroCatchphrase')}"
                    </p>
                    <button className="retro-button" onClick={() => {
                        const projectsSection = document.getElementById('projects');
                        projectsSection?.scrollIntoView({ behavior: 'smooth' });
                    }}>{t('viewProjects')}</button>
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <Window title="hello.img" className="hero-image">
                        <div style={{ overflow: 'hidden', display: 'flex' }}>
                            <img
                                src={heroImg}
                                alt="Hero"
                                style={{ width: '300px', height: '200px', objectFit: 'cover', display: 'block' }}
                            />
                        </div>
                    </Window>
                </div>
            </section>

            {/* Quick Links */}
            <section style={{ marginBottom: '4rem', position: 'relative', zIndex: 1 }}>
                <h3 style={{ marginBottom: '1rem' }}>{t('quickLinks')}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'black', border: '2px solid black' }}>
                    {[
                        { key: 'blog', label: t('blog'), path: '/blog', isExternal: true },
                        { key: 'projects', label: t('projects'), path: '/#projects', isExternal: false },
                        { key: 'about', label: t('about'), path: '/#about', isExternal: false },
                        { key: 'contact', label: t('contact'), path: '/#contact', isExternal: false }
                    ].map(link => (
                        <div key={link.key} onClick={() => {
                            if (link.isExternal) {
                                navigate(link.path);
                            } else {
                                const element = document.getElementById(link.key);
                                element?.scrollIntoView({ behavior: 'smooth' });
                            }
                        }} style={{ background: 'white', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                            <span>{link.label}</span>
                            <ArrowUpRight size={18} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Highlighted Middle Section */}
            <div className="bg-pattern section-highlight" style={{ marginBottom: '4rem' }}>
                {/* About Section */}
                <section id="about" style={{ marginBottom: '4rem' }}>
                    <Window title="about_me.txt">
                        <h2 style={{ marginBottom: '1rem' }}>{t('aboutTitle')}</h2>
                        <p style={{ lineHeight: '1.6', fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>
                            {t('aboutText')}
                        </p>
                    </Window>
                </section>

                <section id="projects">
                    <h2 style={{ marginBottom: '1.5rem' }}>{t('projects')}</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                        {[
                            {
                                id: 1,
                                title: 'SyncManager',
                                description: 'Sistema de gerenciamento sincronizado para otimização de fluxos de trabalho.',
                                date: '2026-01-11',
                                image: syncmanagerImg,
                                link: 'https://www.syncmanager.space/login',
                                detailsLink: 'https://github.com/MatheusMoorete/SyncManager'
                            },
                            {
                                id: 2,
                                title: 'UniTask',
                                description: 'Plataforma integrada para gerenciamento de tarefas acadêmicas e produtividade.',
                                date: '2026-01-11',
                                image: unitaskImg,
                                link: 'https://www.unitask.space/',
                                detailsLink: 'https://github.com/MatheusMoorete/UniTask'
                            }
                        ].map(project => (
                            <Window key={project.id} title={`${project.date}-project-${project.id}.html`}>
                                <div
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        background: project.image ? `url(${project.image}) #f8f9fa` : '#eee',
                                        backgroundSize: 'contain',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                        marginBottom: '1rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderBottom: '1px solid black'
                                    }}
                                    onClick={() => project.link !== '#' && window.open(project.link, '_blank')}
                                >
                                    {!project.image && (project.link !== '#' ? '🔗 Abrir Projeto' : '📁 Placeholder')}
                                </div>
                                <h3 style={{ marginBottom: '0.5rem' }}>{project.title}</h3>
                                <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1.5rem' }}>
                                    {project.description}
                                </p>
                                <button
                                    className="retro-button"
                                    onClick={() => {
                                        if (project.detailsLink.startsWith('http')) {
                                            window.open(project.detailsLink, '_blank');
                                        } else {
                                            navigate(project.detailsLink);
                                        }
                                    }}
                                >
                                    {t('viewDetails')}
                                </button>
                            </Window>
                        ))}
                    </div>
                </section>
            </div>

            {/* Blog Preview Section */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2>{t('fromBlog')}</h2>
                    <a href="/blog" onClick={(e) => { e.preventDefault(); navigate('/blog'); }} style={{ textDecoration: 'underline', fontSize: '0.9rem' }}>{t('viewAll')}</a>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                    {[
                        { title: 'Computer Arch', id: 'computer-architecture-101' },
                        { title: 'Operating Systems', id: 'operating-systems-design' },
                        { title: 'Data Structures', id: 'data-structures-in-modern-apps' }
                    ].map((post, i) => (
                        <Window key={i} title={`post-0${i + 1}.pdf`} style={{ cursor: 'pointer' }}>
                            <div onClick={() => navigate(`/blog/${post.id}`)}>
                                <div style={{ height: '100px', background: '#f5f5f5', marginBottom: '0.5rem' }}></div>
                                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{post.title}</h4>
                            </div>
                        </Window>
                    ))}
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '2px solid var(--border-color)' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>{t('contact')}</h2>
                <Window title="social_links.txt">
                    <div style={{ display: 'flex', gap: '2rem', padding: '1rem 0', justifyContent: 'center' }}>
                        {/* LinkedIn */}
                        <a
                            href="https://www.linkedin.com/in/matheus-moorete/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '1rem 1.5rem',
                                border: '2px solid black',
                                textDecoration: 'none',
                                color: 'black',
                                background: '#f0f0f0',
                                transition: 'all 0.2s',
                                flex: 1,
                                minWidth: 0
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLAnchorElement).style.background = '#0077B5';
                                (e.currentTarget as HTMLAnchorElement).style.color = 'white';
                                (e.currentTarget as HTMLAnchorElement).style.borderColor = '#0077B5';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLAnchorElement).style.background = '#f0f0f0';
                                (e.currentTarget as HTMLAnchorElement).style.color = 'black';
                                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'black';
                            }}
                        >
                            <Linkedin size={24} />
                            <div style={{ overflow: 'hidden' }}>
                                <div style={{ fontWeight: 'bold' }}>LinkedIn</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.8, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>@matheus-moorete</div>
                            </div>
                        </a>

                        {/* GitHub */}
                        <a
                            href="https://github.com/MatheusMoorete"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '1rem 1.5rem',
                                border: '2px solid black',
                                textDecoration: 'none',
                                color: 'black',
                                background: '#f0f0f0',
                                transition: 'all 0.2s',
                                flex: 1,
                                minWidth: 0
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLAnchorElement).style.background = '#24292e';
                                (e.currentTarget as HTMLAnchorElement).style.color = 'white';
                                (e.currentTarget as HTMLAnchorElement).style.borderColor = '#24292e';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLAnchorElement).style.background = '#f0f0f0';
                                (e.currentTarget as HTMLAnchorElement).style.color = 'black';
                                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'black';
                            }}
                        >
                            <Github size={24} />
                            <div style={{ overflow: 'hidden' }}>
                                <div style={{ fontWeight: 'bold' }}>GitHub</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.8, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>@MatheusMoorete</div>
                            </div>
                        </a>

                        {/* Email */}
                        <a
                            href="mailto:matheus.moorete@gmail.com"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '1rem 1.5rem',
                                border: '2px solid black',
                                textDecoration: 'none',
                                color: 'black',
                                background: '#f0f0f0',
                                transition: 'all 0.2s',
                                flex: 1,
                                minWidth: 0
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLAnchorElement).style.background = '#D44638';
                                (e.currentTarget as HTMLAnchorElement).style.color = 'white';
                                (e.currentTarget as HTMLAnchorElement).style.borderColor = '#D44638';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLAnchorElement).style.background = '#f0f0f0';
                                (e.currentTarget as HTMLAnchorElement).style.color = 'black';
                                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'black';
                            }}
                        >
                            <Mail size={24} />
                            <div style={{ overflow: 'hidden' }}>
                                <div style={{ fontWeight: 'bold' }}>Email</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.8, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>matheus.moorete@gmail.com</div>
                            </div>
                        </a>
                    </div>
                </Window>
            </section>
        </div >
    );
};

export default LandingPage;
