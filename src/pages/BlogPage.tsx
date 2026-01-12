import React from 'react';
import Window from '../components/Window';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { MOCK_NOTES } from '../data/mock-notes';

const BlogPage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const posts = MOCK_NOTES;

    return (
        <div className="blog-page" style={{ padding: '0 20px', maxWidth: '1000px', margin: '0 auto', paddingTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0 }}>{t('blogTitle')}</h1>
                <button className="retro-button" onClick={() => navigate('/blog/editor')}>
                    + Novo Post
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {posts.map((post) => (
                    <Window key={post.id} title={`${post.createdAt.split('T')[0] || 'draft'}-${post.slug}.md`}>
                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                            <div style={{ width: '200px', height: '120px', background: '#e0e0e0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#888' }} onClick={() => navigate(`/blog/${post.id}`)}>
                                [ FILE IMAGE ]
                            </div>
                            <div style={{ flex: 1, minWidth: '300px' }}>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', cursor: 'pointer' }} onClick={() => navigate(`/blog/${post.id}`)}>{post.title}</h2>
                                <p style={{ color: '#666', marginBottom: '1rem' }}>
                                    {post.description}
                                </p>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                    {post.tags.map(tag => (
                                        <span key={tag} style={{ background: '#eee', padding: '2px 8px', borderRadius: '4px', fontSize: '0.9rem' }}>#{tag}</span>
                                    ))}
                                </div>
                                <button className="retro-button" onClick={() => navigate(`/blog/${post.id}`)}>{t('readEntry') || 'Ler'}</button>
                            </div>
                        </div>
                    </Window>
                ))}
            </div>
        </div>
    );
};

export default BlogPage;
