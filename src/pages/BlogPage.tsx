import React, { useEffect, useState } from 'react';
import Window from '../components/Window';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { supabase } from '../lib/supabase';
import './Blog.css';
import type { StudyNote, ContentBlock, GridLayoutItem } from '../types/study-notes';

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
            } else if (data) {
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
                    content: {
                        image_url?: string;
                        layout?: GridLayoutItem[];
                        blocks?: Record<string, ContentBlock>;
                    };
                }

                const mappedPosts = data.map((post: DatabasePost) => ({
                    id: post.id,
                    slug: post.slug,
                    title: post.title,
                    description: post.description || '',
                    imageUrl: post.content?.image_url || '',
                    category: post.category || 'geral',
                    tags: post.tags || [],
                    pinPosition: post.pin_position,
                    createdAt: post.created_at,
                    updatedAt: post.updated_at,
                    layout: post.content.layout || [],
                    blocks: post.content.blocks || {},
                }));
                setPosts(mappedPosts);
            }
            setLoading(false);
        };

        fetchPublishedPosts();
    }, []);

    return (
        <div className="blog-page-container">
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ margin: 0 }}>{t('blogTitle')}</h1>
                </div>
                <p className="blog-page-subtitle" style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '1.1rem', maxWidth: '800px' }}>
                    {t('blogSubtitle')}
                </p>
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
