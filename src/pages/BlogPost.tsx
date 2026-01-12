import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Window from '../components/Window';
import { useTranslation } from '../hooks/useTranslation';
import './Blog.css';

const BlogPost: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();

    // Mock post data
    const post = {
        title: id?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Blog Post',
        date: '2026-01-11',
        content: `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      
      Engenharia da Computação é fascinante porque... (Add more detail here).
    `
    };

    return (
        <div className="blog-post-container">
            <Link to="/blog" className="blog-back-link">{t('backToBlog')}</Link>
            <Window title={`${post.date}-journal.txt`}>
                <article className="blog-article">
                    <h1 className="blog-article-title">{post.title}</h1>
                    <div className="blog-article-content">
                        {post.content}
                    </div>
                    <div className="blog-article-footer">
                        <p>{t('endEntry')}</p>
                    </div>
                </article>
            </Window>
        </div>
    );
};

export default BlogPost;
