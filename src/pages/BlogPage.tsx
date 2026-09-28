import React, { useEffect, useState } from 'react';
import Window from '../components/Window';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { supabase } from '../lib/supabase';
import './Blog.css';
import type { StudyNote } from '../types/study-notes';
import { MOCK_NOTES } from '../data/mock-notes';
import { DICTIONARY_TERMS } from '../data/dictionary';
import { BookOpen, ArrowUpRight } from 'lucide-react';

const BlogPage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [posts, setPosts] = useState<StudyNote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPublishedPosts = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('status', 'published')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching posts:', error);
                setPosts(MOCK_NOTES);
            } else if (data && data.length > 0) {
                interface DatabasePost {
                    id: string;
                    slug: string;
                    title: string;
                    subtitle?: string;
                    description?: string;
                    category?: string;
                    tags?: string[];
                    pin_position: number | null;
                    created_at: string;
                    updated_at: string;
                    image_url?: string;
                    content: { html?: string; image_url?: string } | string;
                }

                const mappedPosts = data.map((post: DatabasePost) => ({
                    id: post.id,
                    slug: post.slug,
                    title: post.title,
                    subtitle: post.subtitle || '',
                    description: post.description || '',
                    imageUrl: post.image_url || (typeof post.content === 'object' && post.content !== null ? post.content?.image_url : '') || '',
                    category: post.category || 'geral',
                    tags: post.tags || [],
                    pinPosition: post.pin_position,
                    createdAt: post.created_at,
                    updatedAt: post.updated_at,
                    content: typeof post.content === 'string' ? post.content : (post.content?.html || ''),
                }));
                setPosts(mappedPosts);
            } else {
                setPosts(MOCK_NOTES);
            }
            setLoading(false);
        };

        fetchPublishedPosts();
    }, []);

    return (
        <div className="blog-page-container">
            <div className="blog-header-wrapper">
                <h1 style={{ margin: 0 }}>{t('blogTitle')}</h1>
                <p className="blog-page-subtitle">
                    {t('blogSubtitle')}
                </p>
            </div>

            {/* Banner Retrô do Dicionário dentro do Blog */}
            <div className="blog-dictionary-banner">
                <Window title="C:\WINDOWS\system32\dicionario_frontend.exe">
                    <div className="blog-dict-content">
                        <div className="blog-dict-info">
                            <div className="blog-dict-badge-row">
                                <span className="blog-dict-badge">GLOSSÁRIO TÉCNICO</span>
                                <span className="blog-dict-count">{DICTIONARY_TERMS.length} termos catalogados</span>
                            </div>
                            <h2 className="blog-dict-title">Dicionário Frontend</h2>
                            <p className="blog-dict-desc">
                                Definições objetivas dos principais conceitos e APIs da Web linkadas nos artigos do blog (como <code>window</code>, <code>dom</code>, <code>closure</code>, <code>virtual-dom</code>).
                            </p>
                            <div className="blog-dict-quick-terms">
                                <span className="quick-terms-label">Acesso rápido:</span>
                                {DICTIONARY_TERMS.slice(0, 5).map((term) => (
                                    <button
                                        key={term.slug}
                                        type="button"
                                        className="quick-term-chip"
                                        onClick={() => navigate(`/dicionario/${term.slug}`)}
                                        title={`Ver definição de ${term.term}`}
                                    >
                                        #{term.slug}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="blog-dict-action">
                            <button
                                className="retro-button blog-dict-open-btn"
                                onClick={() => navigate('/dicionario')}
                            >
                                <BookOpen size={15} />
                                <span>Abrir Dicionário</span>
                                <ArrowUpRight size={14} />
                            </button>
                        </div>
                    </div>
                </Window>
            </div>

            {/* Início da Lista de Posts */}
            <div className="blog-section-title-row">
                <h2 className="blog-section-heading">Posts</h2>
                {!loading && posts.length > 0 && (
                    <span className="blog-section-count">
                        {posts.length} publicação{posts.length > 1 ? 'ões' : ''}
                    </span>
                )}
            </div>

            <div className="blog-post-list">
                {loading ? (
                    <p>Conectando ao banco de dados...</p>
                ) : posts.length === 0 ? (
                    <p>Nenhum post publicado ainda. Volte em breve!</p>
                ) : (
                    posts.map((post) => (
                        <Window key={post.id} title={`${post.createdAt.split('T')[0]}-${post.slug}.md`}>
                            <div className="blog-post-card">
                                <div
                                    className="blog-post-image"
                                    style={{
                                        background: post.imageUrl ? `url(${post.imageUrl}) #f5f5f5` : '#e0e0e0',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                    onClick={() => navigate(`/blog/${post.slug}`)}
                                >
                                    {!post.imageUrl && '[ BLOG POST ]'}
                                </div>
                                <div className="blog-post-content">
                                    <h2 className="blog-post-title" onClick={() => navigate(`/blog/${post.slug}`)}>{post.title}</h2>
                                    {post.subtitle && <p className="blog-post-subtitle" style={{ fontSize: '0.9rem', color: '#888', fontStyle: 'italic', marginBottom: '0.5rem' }}>{post.subtitle}</p>}
                                    <p className="blog-post-description">
                                        {post.description}
                                    </p>
                                    <div className="blog-tags">
                                        {post.tags.map(tag => (
                                            <span key={tag} className="blog-tag">#{tag}</span>
                                        ))}
                                    </div>
                                    <button className="retro-button" onClick={() => navigate(`/blog/${post.slug}`)}>{t('readEntry') || 'Ler'}</button>
                                </div>
                            </div>
                        </Window>
                    ))
                )}
            </div>
        </div>
    );
};

export default BlogPage;
