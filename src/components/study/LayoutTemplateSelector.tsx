import React from 'react';
import type { GridLayoutItem, ContentBlock } from '../../types/study-notes';

interface LayoutTemplate {
    id: string;
    name: string;
    preview: React.ReactNode; // Visual preview of the layout
    generate: () => { layout: GridLayoutItem[], blocks: Record<string, ContentBlock> };
}

// Helper to create empty placeholder blocks
const createPlaceholder = (id: string): ContentBlock => ({
    id,
    type: 'text',
    content: ''
});

// Define layout templates
const TEMPLATES: LayoutTemplate[] = [
    {
        id: 'single-column',
        name: '1 Coluna',
        preview: (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, height: 60 }}>
                <div style={{ background: '#ddd', borderRadius: 2 }}></div>
                <div style={{ background: '#ddd', borderRadius: 2 }}></div>
            </div>
        ),
        generate: () => ({
            layout: [
                { i: 'block-1', x: 0, y: 0, w: 12, h: 4 },
                { i: 'block-2', x: 0, y: 4, w: 12, h: 4 }
            ],
            blocks: {
                'block-1': createPlaceholder('block-1'),
                'block-2': createPlaceholder('block-2')
            }
        })
    },
    {
        id: 'two-columns',
        name: '2 Colunas',
        preview: (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, height: 60 }}>
                <div style={{ background: '#ddd', borderRadius: 2 }}></div>
                <div style={{ background: '#ddd', borderRadius: 2 }}></div>
            </div>
        ),
        generate: () => ({
            layout: [
                { i: 'block-1', x: 0, y: 0, w: 6, h: 6 },
                { i: 'block-2', x: 6, y: 0, w: 6, h: 6 }
            ],
            blocks: {
                'block-1': createPlaceholder('block-1'),
                'block-2': createPlaceholder('block-2')
            }
        })
    },
    {
        id: 'three-columns',
        name: '3 Colunas',
        preview: (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, height: 60 }}>
                <div style={{ background: '#ddd', borderRadius: 2 }}></div>
                <div style={{ background: '#ddd', borderRadius: 2 }}></div>
                <div style={{ background: '#ddd', borderRadius: 2 }}></div>
            </div>
        ),
        generate: () => ({
            layout: [
                { i: 'block-1', x: 0, y: 0, w: 4, h: 6 },
                { i: 'block-2', x: 4, y: 0, w: 4, h: 6 },
                { i: 'block-3', x: 8, y: 0, w: 4, h: 6 }
            ],
            blocks: {
                'block-1': createPlaceholder('block-1'),
                'block-2': createPlaceholder('block-2'),
                'block-3': createPlaceholder('block-3')
            }
        })
    },
    {
        id: 'sidebar-content',
        name: 'Sidebar + Conteúdo',
        preview: (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 2, height: 60 }}>
                <div style={{ background: '#bbb', borderRadius: 2 }}></div>
                <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr 1fr', gap: 2 }}>
                    <div style={{ background: '#ddd', borderRadius: 2 }}></div>
                    <div style={{ background: '#ddd', borderRadius: 2 }}></div>
                    <div style={{ background: '#ddd', borderRadius: 2 }}></div>
                </div>
            </div>
        ),
        generate: () => ({
            layout: [
                { i: 'sidebar', x: 0, y: 0, w: 4, h: 12 },
                { i: 'content-1', x: 4, y: 0, w: 8, h: 4 },
                { i: 'content-2', x: 4, y: 4, w: 8, h: 4 },
                { i: 'content-3', x: 4, y: 8, w: 8, h: 4 }
            ],
            blocks: {
                'sidebar': createPlaceholder('sidebar'),
                'content-1': createPlaceholder('content-1'),
                'content-2': createPlaceholder('content-2'),
                'content-3': createPlaceholder('content-3')
            }
        })
    },
    {
        id: 'featured-grid',
        name: 'Destaque + 3 Cols',
        preview: (
            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 2, height: 60 }}>
                <div style={{ background: '#bbb', borderRadius: 2 }}></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                    <div style={{ background: '#ddd', borderRadius: 2 }}></div>
                    <div style={{ background: '#ddd', borderRadius: 2 }}></div>
                    <div style={{ background: '#ddd', borderRadius: 2 }}></div>
                </div>
            </div>
        ),
        generate: () => ({
            layout: [
                { i: 'featured', x: 0, y: 0, w: 12, h: 6 },
                { i: 'col-1', x: 0, y: 6, w: 4, h: 4 },
                { i: 'col-2', x: 4, y: 6, w: 4, h: 4 },
                { i: 'col-3', x: 8, y: 6, w: 4, h: 4 }
            ],
            blocks: {
                'featured': createPlaceholder('featured'),
                'col-1': createPlaceholder('col-1'),
                'col-2': createPlaceholder('col-2'),
                'col-3': createPlaceholder('col-3')
            }
        })
    },
    {
        id: 'custom',
        name: 'Personalizado',
        preview: (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 60, background: '#f0f0f0', borderRadius: 4, border: '2px dashed #aaa' }}>
                <span style={{ fontSize: '1.5rem', color: '#888' }}>+</span>
            </div>
        ),
        generate: () => ({
            layout: [],
            blocks: {}
        })
    }
];

interface LayoutTemplateSelectorProps {
    onSelect: (layout: GridLayoutItem[], blocks: Record<string, ContentBlock>) => void;
    onCancel: () => void;
}

const LayoutTemplateSelector: React.FC<LayoutTemplateSelectorProps> = ({ onSelect, onCancel }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="retro-window" style={{ width: '600px', maxWidth: '90vw' }}>
                <div className="retro-window-header">
                    <span>Escolha um Layout</span>
                    <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                </div>
                <div className="retro-window-content" style={{ padding: '1.5rem' }}>
                    <p style={{ marginBottom: '1rem', color: '#666' }}>Selecione um template para começar. Você pode ajustar depois.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                        {TEMPLATES.map(template => (
                            <div
                                key={template.id}
                                onClick={() => {
                                    const { layout, blocks } = template.generate();
                                    onSelect(layout, blocks);
                                }}
                                style={{
                                    border: '2px solid #ccc',
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLDivElement).style.borderColor = '#000';
                                    (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.02)';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLDivElement).style.borderColor = '#ccc';
                                    (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                                }}
                            >
                                <div style={{ marginBottom: '0.5rem' }}>{template.preview}</div>
                                <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>{template.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LayoutTemplateSelector;
