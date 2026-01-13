import React, { useEffect, useState } from 'react';
import Window from '../components/Window';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { supabase } from '../lib/supabase';
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
                    description?: string;
                    category?: string;
                    tags?: string[];
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
        <div className="blog-page" style={{ padding: '0 20px', maxWidth: '1000px', margin: '0 auto', paddingTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0 }}>{t('blogTitle')}</h1>
                <button className="retro-button" onClick={() => navigate('/admin/dashboard')}>
                    Painel Admin
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {loading ? (
                    <p>Conectando ao banco de dados...</p>
                ) : posts.length === 0 ? (
                    <p>Nenhum post publicado ainda. Volte em breve!</p>
                ) : (
                    posts.map((post) => (
                        <Window key={post.id} title={`${post.createdAt.split('T')[0]}-${post.slug}.md`}>
                            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                                <div
                                    style={{
                                        width: '200px',
                                        height: '120px',
                                        background: post.imageUrl ? `url(${post.imageUrl}) #f5f5f5` : '#e0e0e0',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        color: '#888',
                                        border: '1px solid #ddd'
                                    }}
                                    onClick={() => navigate(`/blog/${post.slug}`)}
                                >
                                    {!post.imageUrl && '[ BLOG POST ]'}
                                </div>
                                <div style={{ flex: 1, minWidth: '300px' }}>
                                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', cursor: 'pointer' }} onClick={() => navigate(`/blog/${post.slug}`)}>{post.title}</h2>
                                    <p style={{ color: '#666', marginBottom: '1rem' }}>
                                        {post.description}
                                    </p>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                        {post.tags.map(tag => (
                                            <span key={tag} style={{ background: '#eee', padding: '2px 8px', borderRadius: '4px', fontSize: '0.9rem' }}>#{tag}</span>
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
