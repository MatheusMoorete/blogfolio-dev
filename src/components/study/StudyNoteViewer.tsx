import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import QuickNavigation from '../QuickNavigation';
import type { StudyNote } from '../../types/study-notes';
import './TiptapEditor.css';
import './StudyNoteViewer.css';

const StudyNoteViewer: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // This 'id' is actually the slug
    const [note, setNote] = useState<StudyNote | null>(null);
    const [loading, setLoading] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);

    const addIdsToH2s = useCallback((html: string): string => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const h2Elements = doc.querySelectorAll('h2');

        h2Elements.forEach((h2, index) => {
            if (!h2.id) {
                h2.id = `heading-${index}`;
            }
        });

        return doc.body.innerHTML;
    }, []);

    const fetchPost = useCallback(async (slug: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error('Error fetching post:', error);
        } else if (data) {
            let htmlContent = '';
            if (typeof data.content === 'string') {
                htmlContent = data.content;
            } else if (data.content?.html) {
                htmlContent = data.content.html;
            } else if (data.content?.blocks) {
                const blocks = data.content.blocks as Record<string, { type: string; content: string; language?: string }>;
                const layout = data.content.layout as Array<{ i: string; y: number; x: number }> || [];
                const sortedItems = [...layout].sort((a, b) => a.y - b.y || a.x - b.x);

                htmlContent = sortedItems.map(item => {
                    const block = blocks[item.i];
                    if (!block) return '';

                    switch (block.type) {
                        case 'markdown':
                        case 'text':
                            return `<p>${block.content}</p>`;
                        case 'code':
                            return `<pre><code>${block.content}</code></pre>`;
                        case 'image':
                            return `<img src="${block.content}" alt="image" class="tiptap-image" />`;
                        default:
                            return `<p>${block.content}</p>`;
                    }
                }).join('\n');
            }

            const processedHtml = addIdsToH2s(htmlContent);

            setNote({
                id: data.id,
                slug: data.slug,
                title: data.title,
                subtitle: data.subtitle || '',
                description: data.description || '',
                category: data.category || 'geral',
                tags: data.tags || [],
                pinPosition: data.pin_position,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
                content: processedHtml || '',
            });
        }
        setLoading(false);
    }, [addIdsToH2s]);

    useEffect(() => {
        if (id) {
            Promise.resolve().then(() => {
                fetchPost(id);
            });
        }
    }, [id, fetchPost]);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Carregando post...</div>;
    if (!note) return <div style={{ padding: '50px', textAlign: 'center' }}>Ops! Post não encontrado. <Link to="/blog">Voltar ao Blog</Link></div>;

    return (
        <div className="blog-post-viewer-container">
            <div className="blog-post-layout-with-nav">
                <main className="blog-post-main-content-full">
                    <div className="blog-post-view">
                        <div style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.8rem', paddingLeft: '0', paddingRight: '1rem' }}>
                            <Link to="/blog" style={{ textDecoration: 'none', color: '#666', fontSize: '0.75rem', display: 'block', marginBottom: '0.5rem' }}>← Voltar para o Blog</Link>
                            <h1 className="blog-article-title" style={{ marginBottom: '0.2rem', lineHeight: '1' }}>{note.title}</h1>
                            {note.subtitle && <p className="blog-post-subtitle" style={{ fontSize: '1.1rem', color: '#666', fontStyle: 'italic', marginBottom: '0.5rem' }}>{note.subtitle}</p>}
                            <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.4rem', lineHeight: '1.4' }}>{note.description}</p>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                                {note.tags.map(tag => (
                                    <span key={tag} style={{ background: '#f0f0f0', padding: '2px 10px', borderRadius: '20px', fontSize: '0.7rem' }}>#{tag}</span>
                                ))}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#999' }}>
                                {new Date(note.createdAt).toLocaleDateString('pt-BR')} • {note.category.toUpperCase()}
                            </div>
                        </div>

                        <div className="blog-post-layout-with-nav-content">
                            <aside className="blog-post-sidebar">
                                <QuickNavigation contentRef={contentRef} />
                            </aside>

                            <div className="blog-post-content-area">

                                {/* Render HTML content from Tiptap */}
                                <div
                                    className="tiptap-content"
                                    style={{ background: '#fff', padding: '1rem 0', width: '100%' }}
                                >
                                    <div
                                        ref={contentRef}
                                        className="tiptap"
                                        dangerouslySetInnerHTML={{ __html: note.content }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* EOF outside grid - full width */}
                        <div style={{
                            marginTop: '4rem',
                            padding: '2rem 1rem',
                            textAlign: 'center',
                            color: '#000',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            opacity: 1,
                            userSelect: 'none',
                            width: '100%',
                            boxSizing: 'border-box',
                            overflowX: 'auto'
                        }}>
                            <pre style={{ display: 'inline-block', textAlign: 'center', lineHeight: '1.2', margin: '0 auto', minWidth: 'min-content' }}>
                                {`__________________________________________________________________
[ EOF - END OF FILE ]
__________________________________________________________________`}
                            </pre>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudyNoteViewer;
