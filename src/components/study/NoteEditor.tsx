import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import type { StudyNote, ContentBlock, ContentType, GridLayoutItem } from '../../types/study-notes';
import GridRenderer from './GridRenderer';
import LayoutTemplateSelector from './LayoutTemplateSelector';
import { supabase } from '../../lib/supabase';
import { Save, ArrowLeft, Layout as LayoutIcon, Type, Code, Image as ImageIcon } from 'lucide-react';

const NoteEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showTemplateSelector, setShowTemplateSelector] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [note, setNote] = useState<StudyNote>({
        id: '',
        slug: '',
        title: 'Novo Post',
        description: '',
        category: 'geral',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        layout: [],
        blocks: {},
        imageUrl: '',
    });
    const [status, setStatus] = useState<'draft' | 'published'>('draft');
    const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
    const [editorPos, setEditorPos] = useState({ x: window.innerWidth - 650, y: window.innerHeight - 550 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setEditorPos({
                    x: e.clientX - dragStart.x,
                    y: e.clientY - dragStart.y
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStart]);

    useEffect(() => {
        if (id && id !== 'new-note') {
            fetchPost(id);
        } else {
            setShowTemplateSelector(true);
        }
    }, [id]);

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
            // Map table columns to StudyNote structure
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
                imageUrl: data.content.image_url || '',
            });
            setStatus(data.status as 'draft' | 'published');
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        const postData = {
            title: note.title,
            slug: note.slug || note.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
            description: note.description,
            category: note.category,
            tags: note.tags,
            status: status,
            content: {
                layout: note.layout,
                blocks: note.blocks,
                image_url: note.imageUrl
            },
            updated_at: new Date().toISOString()
        };

        let error;
        if (note.id) {
            // Update
            const { error: updateError } = await supabase
                .from('posts')
                .update(postData)
                .eq('id', note.id);
            error = updateError;
        } else {
            // Insert
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

    const handleTemplateSelect = (layout: GridLayoutItem[], blocks: Record<string, ContentBlock>) => {
        setNote(prev => ({
            ...prev,
            layout,
            blocks
        }));
        setShowTemplateSelector(false);
    };

    const handleLayoutChange = (newLayout: any) => {
        setNote(prev => ({ ...prev, layout: newLayout }));
    };

    const addBlock = (type: ContentType) => {
        const blockId = `block-${Date.now()}`;
        const y = note.layout && note.layout.length > 0
            ? Math.max(...note.layout.map(l => l.y + l.h))
            : 0;

        const newLayoutItem = { i: blockId, x: 0, y, w: 4, h: 4 };
        const newBlock: ContentBlock = {
            id: blockId,
            type,
            content: type === 'text' || type === 'markdown' ? 'Novo bloco de texto' : type === 'code' ? 'console.log("Hello")' : 'https://placehold.co/600x400'
        };

        setNote(prev => ({
            ...prev,
            layout: [...prev.layout, newLayoutItem],
            blocks: { ...prev.blocks, [blockId]: newBlock }
        }));
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Carregando editor...</div>;

    return (
        <div style={{ padding: '1rem', maxWidth: '1400px', margin: '0 auto' }}>
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
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value as any)}
                        style={{ padding: '0.4rem', border: '1px solid #000' }}
                    >
                        <option value="draft">Rascunho 🔒</option>
                        <option value="published">Publicado 🌍</option>
                    </select>

                    <button className="retro-button" onClick={() => setShowTemplateSelector(true)} title="Template de Layout">
                        <LayoutIcon size={18} />
                    </button>
                    <button className="retro-button" onClick={() => addBlock('markdown')} title="Adicionar Texto">
                        <Type size={18} />
                    </button>
                    <button className="retro-button" onClick={() => addBlock('code')} title="Adicionar Código">
                        <Code size={18} />
                    </button>
                    <button className="retro-button" onClick={() => addBlock('image')} title="Adicionar Imagem">
                        <ImageIcon size={18} />
                    </button>

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
                    <small style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.2rem', display: 'block' }}>
                    </small>
                </div>
            </div>

            {/* Template Selector Modal */}
            {showTemplateSelector && (
                <LayoutTemplateSelector
                    onSelect={handleTemplateSelect}
                    onCancel={() => setShowTemplateSelector(false)}
                />
            )}

            {/* Área do Grid */}
            <div style={{ border: '2px solid #000', padding: '1rem', minHeight: '600px', background: '#fff', boxShadow: '5px 5px 0px rgba(0,0,0,0.1)' }}>
                <GridRenderer
                    note={note}
                    isEditable={true}
                    onLayoutChange={handleLayoutChange}
                    onBlockClick={setSelectedBlock}
                />
            </div>

            {/* Property Editor for Selected Block */}
            {selectedBlock && note.blocks[selectedBlock] && (
                <div className="retro-window" style={{
                    position: 'fixed',
                    left: `${editorPos.x}px`,
                    top: `${editorPos.y}px`,
                    height: 'auto',
                    width: 'min(90vw, 600px)',
                    zIndex: 1000, // Garantir que fique acima de tudo
                    boxShadow: '10px 10px 0px rgba(0,0,0,0.2)',
                    resize: 'both',
                    overflow: 'auto',
                    minWidth: '300px',
                    minHeight: '400px',
                    background: 'white'
                }}>
                    <div
                        className="retro-window-header"
                        style={{ cursor: 'move', userSelect: 'none' }}
                        onMouseDown={(e) => {
                            setIsDragging(true);
                            setDragStart({
                                x: e.clientX - editorPos.x,
                                y: e.clientY - editorPos.y
                            });
                        }}
                    >
                        <span>Propriedades do Bloco</span>
                        <button onClick={() => setSelectedBlock(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                    </div>
                    <div className="retro-window-content" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', height: 'calc(100% - 40px)' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold', fontSize: '0.8rem' }}>Conteúdo (Markdown/URL)</label>
                            <textarea
                                style={{
                                    width: '100%',
                                    flex: 1, // Faz o textarea crescer com a janela
                                    minHeight: '200px',
                                    padding: '0.5rem',
                                    fontFamily: 'monospace',
                                    border: '1px solid #000',
                                    resize: 'vertical' // Permite aumentar o texto para baixo
                                }}
                                value={note.blocks[selectedBlock].content}
                                onChange={e => {
                                    const val = e.target.value;
                                    setNote(prev => ({
                                        ...prev,
                                        blocks: {
                                            ...prev.blocks,
                                            [selectedBlock]: { ...prev.blocks[selectedBlock], content: val }
                                        }
                                    }))
                                }}
                            />
                        </div>
                        {note.blocks[selectedBlock].type === 'code' && (
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold', fontSize: '0.8rem' }}>Linguagem</label>
                                <input
                                    type="text"
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #000' }}
                                    value={note.blocks[selectedBlock].language || ''}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setNote(prev => ({
                                            ...prev,
                                            blocks: {
                                                ...prev.blocks,
                                                [selectedBlock]: { ...prev.blocks[selectedBlock], language: val }
                                            }
                                        }))
                                    }}
                                />
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="retro-button" style={{ flex: 1 }} onClick={() => setSelectedBlock(null)}>Fechar</button>
                            <button className="retro-button" style={{ borderColor: 'red', color: 'red' }} onClick={() => {
                                setNote(prev => {
                                    const newBlocks = { ...prev.blocks };
                                    delete newBlocks[selectedBlock];
                                    return {
                                        ...prev,
                                        layout: prev.layout.filter(l => l.i !== selectedBlock),
                                        blocks: newBlocks
                                    };
                                });
                                setSelectedBlock(null);
                            }}>Excluir Bloco</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoteEditor;
