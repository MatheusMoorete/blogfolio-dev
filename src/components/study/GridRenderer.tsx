import React from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import type { StudyNote, ContentBlock } from '../../types/study-notes';
import Window from '../Window';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface GridRendererProps {
    note: StudyNote;
    isEditable?: boolean;
    onLayoutChange?: (layout: any) => void;
    onBlockClick?: (blockId: string) => void;
}

const BlockRenderer: React.FC<{ block: ContentBlock }> = ({ block }) => {
    switch (block.type) {
        case 'markdown':
        case 'text':
            return (
                <div className="markdown-content" style={{ height: '100%', overflowY: 'auto' }}>
                    {block.content ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {block.content}
                        </ReactMarkdown>
                    ) : (
                        <em style={{ color: '#888' }}>Empty text block...</em>
                    )}
                </div>
            );
        case 'code':
            return (
                <div style={{
                    background: '#1a1a1a',
                    color: '#f0f0f0',
                    padding: '1rem',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    height: '100%',
                    overflow: 'auto',
                    border: '1px solid #333'
                }}>
                    <div style={{
                        borderBottom: '1px solid #333',
                        marginBottom: '0.5rem',
                        paddingBottom: '0.5rem',
                        fontSize: '0.8rem',
                        opacity: 0.7
                    }}>
                        {block.language || 'text'}
                    </div>
                    <pre style={{ margin: 0 }}>
                        <code>{block.content}</code>
                    </pre>
                </div>
            );
        case 'image':
            return (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eee' }}>
                    {block.content?.startsWith('http') ? (
                        <img src={block.content} alt="Block content" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    ) : (
                        <span style={{ color: '#666' }}>[Image Block]</span>
                    )}
                </div>
            );
        default:
            return <div>Unknown block type</div>;
    }
};

const GridRenderer: React.FC<GridRendererProps> = ({ note, isEditable = false, onLayoutChange, onBlockClick }) => {
    // Force items to be static when not in editable mode
    const layout = note.layout.map(item => ({
        ...item,
        static: !isEditable
    }));

    const RGL = GridLayout as any;

    return (
        <div className="study-note-grid">
            <RGL
                className="layout"
                layout={layout}
                cols={12}
                rowHeight={30}
                width={1200} // Fixed width or container width
                isDraggable={isEditable}
                isResizable={isEditable}
                onLayoutChange={onLayoutChange}
                useCSSTransforms={true}
            >
                {layout.map(item => {
                    const block = note.blocks[item.i];
                    return (
                        <div key={item.i} style={{ height: '100%' }} onClick={() => isEditable && onBlockClick?.(item.i)}>
                            {isEditable ? (
                                <Window title={`${block?.type || 'block'}.files`} style={{ height: '100%', cursor: 'grab' }} contentStyle={{ height: 'calc(100% - 32px)', overflow: 'hidden' }}>
                                    {block ? <BlockRenderer block={block} /> : <div>Block data missing</div>}
                                </Window>
                            ) : (
                                <div style={{ height: '100%', padding: '10px' }}>
                                    {block ? <BlockRenderer block={block} /> : null}
                                </div>
                            )}
                        </div>
                    );
                })}
            </RGL>
        </div>
    );
};

export default GridRenderer;
