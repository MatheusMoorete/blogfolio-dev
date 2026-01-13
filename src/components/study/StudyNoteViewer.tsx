import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import GridRenderer from './GridRenderer';
import { supabase } from '../../lib/supabase';
import type { StudyNote } from '../../types/study-notes';

const StudyNoteViewer: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // This 'id' is actually the slug
    const [note, setNote] = useState<StudyNote | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchPost(id);
        }
    }, [id]);

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

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Carregando post...</div>;
    if (!note) return <div style={{ padding: '50px', textAlign: 'center' }}>Ops! Post não encontrado. <Link to="/blog">Voltar ao Blog</Link></div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3rem', borderBottom: '1px solid #eee', paddingBottom: '2rem' }}>
                <Link to="/blog" style={{ textDecoration: 'none', color: '#666', fontSize: '0.9rem', display: 'block', marginBottom: '1rem' }}>← Voltar para o Blog</Link>
                <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-sans)', marginBottom: '1rem' }}>{note.title}</h1>
                <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '1.5rem', lineHeight: '1.6' }}>{note.description}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {note.tags.map(tag => (
                        <span key={tag} style={{ background: '#f0f0f0', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem' }}>#{tag}</span>
                    ))}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#999' }}>
                    {new Date(note.createdAt).toLocaleDateString('pt-BR')} • {note.category.toUpperCase()}
                </div>
            </div>

            <div style={{ background: '#fff', padding: '1rem' }}>
                <GridRenderer note={note} isEditable={false} />
            </div>

            <div style={{ marginTop: '5rem', padding: '3rem 1rem', borderTop: '2px dashed #ccc', textAlign: 'center', color: '#bbb', fontSize: '0.9rem' }}>
                <p>Obrigado por ler este conteúdo! 🚀</p>
                <p style={{ marginTop: '0.5rem' }}>Desenvolvido com carinho no meu Blog-folio.</p>
            </div>
        </div>
    );
};

export default StudyNoteViewer;
