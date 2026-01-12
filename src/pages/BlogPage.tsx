import React from 'react';
import Window from '../components/Window';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { MOCK_NOTES } from '../data/mock-notes';
import './Blog.css';

const BlogPage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const posts = MOCK_NOTES;

    return (
        <div className="blog-page-container">
            <div className="blog-page-header">
                <h1 className="blog-page-title">{t('blogTitle')}</h1>
                <button className="retro-button" onClick={() => navigate('/blog/editor')}>
                    + Novo Post
                </button>
            </div>

            <div className="blog-post-list">
                {posts.map((post) => (
                    <Window key={post.id} title={`${post.createdAt.split('T')[0] || 'draft'}-${post.slug}.md`}>
                        <div className="blog-post-card">
                            <div className="blog-post-image-placeholder" onClick={() => navigate(`/blog/${post.id}`)}>
                                [ FILE IMAGE ]
                            </div>
                            <div className="blog-post-content">
                                <h2 className="blog-post-title" onClick={() => navigate(`/blog/${post.id}`)}>{post.title}</h2>
                                <p className="blog-post-description">
                                    {post.description}
                                </p>
                                <div className="blog-tags">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="blog-tag">#{tag}</span>
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
