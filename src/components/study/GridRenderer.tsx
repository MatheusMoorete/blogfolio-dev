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

const BlockRenderer: React.FC<{ block: ContentBlock; isEditable?: boolean }> = ({ block, isEditable }) => {
    switch (block.type) {
        case 'markdown':
        case 'text':
            return (
                <div className="markdown-content" style={{ height: isEditable ? '100%' : 'auto', overflowY: isEditable ? 'auto' : 'visible' }}>
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
                    height: isEditable ? '100%' : 'auto',
                    overflow: isEditable ? 'auto' : 'visible',
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

    // Compact layout for reading mode to remove empty space at the top
    let finalLayout = layout;
    if (!isEditable && layout.length > 0) {
        const minY = Math.min(...layout.map(i => i.y));
        if (minY > 0) {
            finalLayout = layout.map(item => ({
                ...item,
                y: item.y - minY
            }));
        }
    }

    const RGL = GridLayout as any;

    if (!isEditable) {
        // In reading mode, we use a natural flow layout so content pushes the footer down
        // We sort by y then x to maintain the intended reading order
        const sortedLayout = [...finalLayout].sort((a, b) => a.y - b.y || a.x - b.x);

        return (
            <div className="study-note-grid-view" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
                {sortedLayout.map(item => {
                    const block = note.blocks[item.i];
                    return block ? (
                        <div key={item.i} style={{ width: '100%' }}>
                            <BlockRenderer block={block} isEditable={false} />
                        </div>
                    ) : null;
                })}
            </div>
        );
    }

    return (
        <div className="study-note-grid">
            <RGL
                className="layout"
                layout={finalLayout}
                cols={12}
                rowHeight={30}
                width={850}
                isDraggable={isEditable}
                isResizable={isEditable}
                onLayoutChange={onLayoutChange}
                useCSSTransforms={true}
                margin={[0, 0]}
                containerPadding={[0, 0]}
                autoSize={true}
            >
                {finalLayout.map(item => {
                    const block = note.blocks[item.i];
                    return (
                        <div key={item.i} style={{ height: isEditable ? '100%' : 'auto' }} onClick={() => isEditable && onBlockClick?.(item.i)}>
                            {isEditable ? (
                                <Window title={`${block?.type || 'block'}.files`} style={{ height: '100%', cursor: 'grab' }} contentStyle={{ height: 'calc(100% - 32px)', overflow: 'hidden' }}>
                                    {block ? <BlockRenderer block={block} isEditable={true} /> : <div>Block data missing</div>}
                                </Window>
                            ) : (
                                <div style={{ height: 'auto', padding: '0' }}>
                                    {block ? <BlockRenderer block={block} isEditable={false} /> : null}
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
