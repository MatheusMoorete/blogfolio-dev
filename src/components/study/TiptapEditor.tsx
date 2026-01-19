import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Image from '@tiptap/extension-image';
import { Markdown } from 'tiptap-markdown';
import { common, createLowlight } from 'lowlight';
import { Bold, Italic, Heading1, Heading2, Code, Image as ImageIcon, List, ListOrdered, Quote, Undo, Redo, Eye, Edit3 } from 'lucide-react';
import './TiptapEditor.css';

const lowlight = createLowlight(common);

interface TiptapEditorProps {
    content: string;
    onChange: (html: string) => void;
    editable?: boolean;
}

const MenuBar = ({ editor }: { editor: ReturnType<typeof useEditor> }) => {
    if (!editor) return null;

    const addImage = () => {
        const url = window.prompt('URL da imagem:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="tiptap-toolbar">
            <div className="toolbar-group">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'is-active' : ''}
                    title="Negrito (Ctrl+B ou **texto**)"
                >
                    <Bold size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'is-active' : ''}
                    title="Itálico (Ctrl+I ou *texto*)"
                >
                    <Italic size={16} />
                </button>
            </div>

            <div className="toolbar-group">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
                    title="Título 1 (# no início da linha)"
                >
                    <Heading1 size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                    title="Título 2 (## no início da linha)"
                >
                    <Heading2 size={16} />
                </button>
            </div>

            <div className="toolbar-group">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'is-active' : ''}
                    title="Lista (- ou * no início da linha)"
                >
                    <List size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'is-active' : ''}
                    title="Lista Ordenada (1. no início da linha)"
                >
                    <ListOrdered size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive('blockquote') ? 'is-active' : ''}
                    title="Citação (> no início da linha)"
                >
                    <Quote size={16} />
                </button>
            </div>

            <div className="toolbar-group">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive('codeBlock') ? 'is-active' : ''}
                    title="Bloco de Código (``` no início da linha)"
                >
                    <Code size={16} />
                </button>
                <button
                    type="button"
                    onClick={addImage}
                    title="Inserir Imagem"
                >
                    <ImageIcon size={16} />
                </button>
            </div>

            <div className="toolbar-group">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Desfazer (Ctrl+Z)"
                >
                    <Undo size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Refazer (Ctrl+Y)"
                >
                    <Redo size={16} />
                </button>
            </div>
        </div>
    );
};

const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onChange, editable = true }) => {
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false, // Using CodeBlockLowlight instead
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'tiptap-image',
                },
            }),
            Markdown.configure({
                html: true,
                transformPastedText: true,
                transformCopiedText: true,
            }),
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    const currentContent = editor?.getHTML() || content;

    return (
        <div className="tiptap-container">
            {editable && (
                <>
                    {/* GitHub-style tabs */}
                    <div className="tiptap-tabs">
                        <button
                            type="button"
                            className={`tiptap-tab ${activeTab === 'write' ? 'active' : ''}`}
                            onClick={() => setActiveTab('write')}
                        >
                            <Edit3 size={14} />
                            Escrever
                        </button>
                        <button
                            type="button"
                            className={`tiptap-tab ${activeTab === 'preview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('preview')}
                        >
                            <Eye size={14} />
                            Preview
                        </button>
                        <span className="tiptap-hint">
                            💡 Use atalhos: # título, **negrito**, *itálico*, ``` código
                        </span>
                    </div>

                    {/* Toolbar only visible in write mode */}
                    {activeTab === 'write' && <MenuBar editor={editor} />}
                </>
            )}

            {/* Editor or Preview content */}
            {activeTab === 'write' ? (
                <EditorContent editor={editor} className="tiptap-content" />
            ) : (
                <div className="tiptap-preview">
                    <div
                        className="tiptap"
                        dangerouslySetInnerHTML={{ __html: currentContent }}
                    />
                </div>
            )}
        </div>
    );
};

export default TiptapEditor;
