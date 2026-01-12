import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { StudyNote, ContentBlock, ContentType, GridLayoutItem } from '../../types/study-notes';
import GridRenderer from './GridRenderer';
import { MOCK_NOTES } from '../../data/mock-notes';
import LayoutTemplateSelector from './LayoutTemplateSelector';

const NoteEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [showTemplateSelector, setShowTemplateSelector] = useState(false);

    // Default to a new note template
    const [note, setNote] = useState<StudyNote>({
        id: 'new-note',
        slug: 'new-study-note',
        title: 'Nova Nota de Estudo',
        description: 'Descrição da sua nota...',
        category: 'general',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        layout: [],
        blocks: {}
    });
    const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const foundNote = MOCK_NOTES.find(n => n.id === id);
            if (foundNote) {
                setNote(foundNote);
            }
        } else {
            // New note - show template selector automatically
            setShowTemplateSelector(true);
        }
    }, [id]);

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

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Template Selector Modal */}
            {showTemplateSelector && (
                <LayoutTemplateSelector
                    onSelect={handleTemplateSelect}
                    onCancel={() => setShowTemplateSelector(false)}
                />
            )}

            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Link to="/blog" style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block', textDecoration: 'none', color: 'black' }}>← Voltar</Link>
                    <h1>Editando: {note.title}</h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button className="retro-button" onClick={() => setShowTemplateSelector(true)}>🔲 Layout</button>
                    <button className="retro-button" onClick={() => addBlock('markdown')}>+ Texto</button>
                    <button className="retro-button" onClick={() => addBlock('code')}>+ Código</button>
                    <button className="retro-button" onClick={() => addBlock('image')}>+ Imagem</button>
                    <button className="retro-button" style={{ background: 'black', color: 'white' }} onClick={() => {
                        console.log(JSON.stringify(note, null, 2));
                        alert('JSON salvo no console! (Em breve: Download)');
                    }}>Salvar</button>
                </div>
            </div>

            <div style={{ border: '2px dashed #ccc', padding: '1rem', minHeight: '500px', background: '#f9f9f9' }}>
                <GridRenderer
                    note={note}
                    isEditable={true}
                    onLayoutChange={handleLayoutChange}
                    onBlockClick={setSelectedBlock}
                />
            </div>

            {/* Property Editor for Selected Block */}
            {selectedBlock && note.blocks[selectedBlock] && (
                <div className="retro-window" style={{ position: 'fixed', right: '20px', top: '100px', height: 'auto', maxHeight: '80vh', width: '350px', zIndex: 100, boxShadow: '-5px 5px 15px rgba(0,0,0,0.1)' }}>
                    <div className="retro-window-header">
                        <span>Editar Bloco</span>
                        <button onClick={() => setSelectedBlock(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>X</button>
                    </div>
                    <div className="retro-window-content" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Conteúdo</label>
                            <textarea
                                style={{ width: '100%', height: '200px', padding: '0.5rem', fontFamily: 'monospace' }}
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
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Linguagem</label>
                                <input
                                    type="text"
                                    style={{ width: '100%', padding: '0.5rem' }}
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
            )}
        </div>
    );
};

export default NoteEditor;
