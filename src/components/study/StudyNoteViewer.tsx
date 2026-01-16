import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import GridRenderer from './GridRenderer';
import { supabase } from '../../lib/supabase';
import type { StudyNote } from '../../types/study-notes';

const StudyNoteViewer: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // This 'id' is actually the slug
    const [note, setNote] = useState<StudyNote | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchPost = async (slug: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error('Error fetching post:', error);
        } else if (data) {
            setNote({
                id: data.id,
                slug: data.slug,
                title: data.title,
                subtitle: data.subtitle || '',
                description: data.description || '',
                category: data.category || 'geral',
                tags: data.tags || [],
                createdAt: data.created_at,
                updatedAt: data.updated_at,
                layout: data.content.layout || [],
                blocks: data.content.blocks || {},
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        if (id) {
            Promise.resolve().then(() => {
                fetchPost(id);
            });
        }
    }, [id]);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Carregando post...</div>;
    if (!note) return <div style={{ padding: '50px', textAlign: 'center' }}>Ops! Post não encontrado. <Link to="/blog">Voltar ao Blog</Link></div>;

    return (
        <div className="blog-post-view" style={{ padding: '1rem 0', width: '100%', maxWidth: '850px', margin: '0 auto', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', boxSizing: 'border-box' }}>
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

            <div style={{ background: '#fff', padding: '0', width: '100%', overflow: 'hidden' }}>
                <GridRenderer note={note} isEditable={false} />
            </div>

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
    );
};

export default StudyNoteViewer;
