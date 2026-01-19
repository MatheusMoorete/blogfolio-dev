import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import type { StudyNote } from '../../types/study-notes';
import TiptapEditor from './TiptapEditor';
import { supabase } from '../../lib/supabase';
import { Save, ArrowLeft } from 'lucide-react';

const NoteEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [note, setNote] = useState<StudyNote>({
        id: '',
        slug: '',
        title: 'Novo Post',
        subtitle: '',
        description: '',
        category: 'geral',
        tags: [],
        pinPosition: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: '<p>Comece a escrever seu post aqui...</p>',
        imageUrl: '',
    });
    const [status, setStatus] = useState<'draft' | 'published'>('draft');

    const fetchPost = async (postId: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', postId)
            .single();

        if (error) {
            console.error('Error fetching post:', error);
            alert('Erro ao carregar post');
        } else if (data) {
            // Handle both new (content as HTML string) and legacy (content.blocks) formats
            let htmlContent = '';
            if (typeof data.content === 'string') {
                htmlContent = data.content;
            } else if (data.content?.html) {
                htmlContent = data.content.html;
            } else if (data.content?.blocks) {
                // Legacy format - convert blocks to basic HTML
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
                            return `<img src="${block.content}" alt="image" />`;
                        default:
                            return `<p>${block.content}</p>`;
                    }
                }).join('\n');
            }

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
                content: htmlContent || '<p></p>',
                imageUrl: data.image_url || '',
            });
            setStatus(data.status as 'draft' | 'published');
        }
        setLoading(false);
    };

    useEffect(() => {
        Promise.resolve().then(() => {
            if (id && id !== 'new-note') {
                fetchPost(id);
            }
        });
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        const postData = {
            title: note.title,
            subtitle: note.subtitle,
            slug: note.slug || note.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
            description: note.description,
            category: note.category,
            tags: note.tags,
            pin_position: note.pinPosition,
            status: status,
            content: {
                html: note.content,
                image_url: note.imageUrl
            },
            updated_at: new Date().toISOString()
        };

        let error;
        if (note.id) {
            const { error: updateError } = await supabase
                .from('posts')
                .update(postData)
                .eq('id', note.id);
            error = updateError;
        } else {
            const { data, error: insertError } = await supabase
                .from('posts')
                .insert([postData])
                .select()
                .single();
            error = insertError;
            if (data) setNote(prev => ({ ...prev, id: data.id }));
        }

        if (error) {
            alert('Erro ao salvar: ' + error.message);
        } else {
            alert('Post salvo com sucesso!');
            if (!note.id) navigate('/admin/dashboard');
        }
        setSaving(false);
    };

    const handleContentChange = (html: string) => {
        setNote(prev => ({ ...prev, content: html }));
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Carregando editor...</div>;

    return (
        <div style={{ padding: '1rem', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Toolbar Principal */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                backgroundColor: '#fff',
                padding: '0.5rem 1rem',
                border: '2px solid #000',
                position: 'sticky',
                top: '0',
                zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', color: '#000', textDecoration: 'none' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <input
                        value={note.title}
                        onChange={e => setNote(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Título do Post"
                        style={{ fontSize: '1.2rem', fontWeight: 'bold', border: 'none', borderBottom: '1px solid #ccc', outline: 'none', width: '300px' }}
                    />
                    <input
                        value={note.subtitle}
                        onChange={e => setNote(prev => ({ ...prev, subtitle: e.target.value }))}
                        placeholder="Subtítulo do Post"
                        style={{ fontSize: '1rem', border: 'none', borderBottom: '1px solid #eee', outline: 'none', width: '250px', color: '#666' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value as 'draft' | 'published')}
                        style={{ padding: '0.4rem', border: '1px solid #000' }}
                    >
                        <option value="draft">Rascunho 🔒</option>
                        <option value="published">Publicado 🌍</option>
                    </select>

                    <button
                        className="retro-button"
                        style={{ background: '#000', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        <Save size={18} /> {saving ? 'Salvando...' : 'SALVAR'}
                    </button>
                </div>
            </div>

            {/* Configurações Secundárias */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.8rem', display: 'block' }}>Slug:</label>
                    <input
                        value={note.slug}
                        onChange={e => setNote(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="slug-do-post"
                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.8rem', display: 'block' }}>Categoria:</label>
                    <input
                        value={note.category}
                        onChange={e => setNote(prev => ({ ...prev, category: e.target.value }))}
                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.8rem', display: 'block' }}>Imagem de Capa (URL):</label>
                    <input
                        value={note.imageUrl}
                        onChange={e => setNote(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="https://exemplo.com/imagem.jpg"
                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ width: '120px' }}>
                    <label style={{ fontSize: '0.8rem', display: 'block' }}>Fixar (Pin):</label>
                    <select
                        value={note.pinPosition || ''}
                        onChange={e => setNote(prev => ({ ...prev, pinPosition: e.target.value ? parseInt(e.target.value) : null }))}
                        style={{ width: '100%', padding: '0.3rem', border: '1px solid #ccc' }}
                    >
                        <option value="">Nenhum</option>
                        <option value="1">Pin 1 (Esquerda)</option>
                        <option value="2">Pin 2 (Meio)</option>
                        <option value="3">Pin 3 (Direita)</option>
                    </select>
                </div>
            </div>

            {/* Editor Tiptap */}
            <TiptapEditor
                content={note.content}
                onChange={handleContentChange}
                editable={true}
            />
        </div>
    );
};

export default NoteEditor;
