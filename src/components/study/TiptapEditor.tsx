import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import Image from '@tiptap/extension-image';
import { Markdown } from 'tiptap-markdown';
import { common, createLowlight } from 'lowlight';
import { marked } from 'marked';
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';

import { Callout, type CalloutType } from './extensions/Callout';
import { InlineQuote } from './extensions/InlineQuote';

import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    FileCode,
    Highlighter,
    Quote,
    Heading1,
    Heading2,
    Heading3,
    Pilcrow,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    ListTodo,
    Minus,
    Table as TableIcon,
    Link as LinkIcon,
    Unlink,
    Image as ImageIcon,
    Undo,
    Redo,
    Eye,
    Edit3,
    FileText,
    Upload,
    Download,
    Lightbulb,
    AlertTriangle,
    Info,
    Bookmark,
    Columns,
    Rows,
    Trash2,
    X,
    Check
} from 'lucide-react';

import './TiptapEditor.css';

const lowlight = createLowlight(common);

// Configure marked options
marked.setOptions({
    gfm: true,
    breaks: true,
});

interface TiptapEditorProps {
    content: string;
    onChange: (html: string) => void;
    editable?: boolean;
    placeholder?: string;
}

interface LinkModalState {
    isOpen: boolean;
    url: string;
    text: string;
}

interface ImageModalState {
    isOpen: boolean;
    url: string;
    alt: string;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
    content,
    onChange,
    editable = true,
    placeholder = 'Comece a escrever seu post aqui...'
}) => {
    const [activeTab, setActiveTab] = useState<'write' | 'markdown' | 'preview'>('write');
    const [markdownText, setMarkdownText] = useState<string>('');
    const [linkModal, setLinkModal] = useState<LinkModalState>({ isOpen: false, url: '', text: '' });
    const [imageModal, setImageModal] = useState<ImageModalState>({ isOpen: false, url: '', alt: '' });
    const [calloutMenuOpen, setCalloutMenuOpen] = useState(false);
    const [tableMenuOpen, setTableMenuOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const calloutRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLDivElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
                HTMLAttributes: {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    class: 'tiptap-link',
                },
            }),
            Highlight.configure({
                multicolor: false,
                HTMLAttributes: {
                    class: 'tiptap-highlight',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                placeholder,
            }),
            TaskList.configure({
                HTMLAttributes: {
                    class: 'tiptap-task-list',
                },
            }),
            TaskItem.configure({
                nested: true,
                HTMLAttributes: {
                    class: 'tiptap-task-item',
                },
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'tiptap-table',
                },
            }),
            TableRow,
            TableHeader,
            TableCell,
            Image.configure({
                HTMLAttributes: {
                    class: 'tiptap-image',
                },
                allowBase64: true,
            }),
            Markdown.configure({
                html: true,
                transformPastedText: true,
                transformCopiedText: true,
            }),
            Callout,
            InlineQuote,
        ],
        content,
        editable,
        editorProps: {
            handlePaste: (view, event) => {
                const text = event.clipboardData?.getData('text/plain');
                if (!text) return false;

                // Check if plain text contains Markdown patterns
                const hasMarkdown =
                    /^(#{1,6}\s|\s*[-*+]\s|\s*[0-9]+\.\s|>\s|```|\||\[\s*[x ]\s*\])/m.test(text) ||
                    /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\[[^\]]+\]\([^)]+\)|~~[^~]+~~)/.test(text);

                if (hasMarkdown) {
                    try {
                        const parsedHtml = marked.parse(text) as string;
                        if (parsedHtml) {
                            const domParser = new window.DOMParser();
                            const doc = domParser.parseFromString(parsedHtml, 'text/html');
                            const slice = ProseMirrorDOMParser.fromSchema(view.state.schema).parseSlice(doc.body);
                            view.dispatch(view.state.tr.replaceSelection(slice));
                            return true;
                        }
                    } catch (err) {
                        console.error('Erro ao converter markdown colado:', err);
                    }
                }
                return false;
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
    });

    // Synchronize content if modified externally (e.g. async Supabase fetch)
    useEffect(() => {
        if (editor && content !== undefined) {
            const currentHTML = editor.getHTML();
            if (content !== currentHTML && !editor.isFocused) {
                editor.commands.setContent(content || '', { emitUpdate: false });
            }
        }
    }, [content, editor]);

    // Update markdownText state when switching tabs
    const handleSwitchTab = (tab: 'write' | 'markdown' | 'preview') => {
        if (tab === 'markdown' && editor) {
            // Get serialized markdown from tiptap-markdown storage
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const md = (editor.storage as any).markdown?.getMarkdown();
                setMarkdownText(md || editor.getHTML());
            } catch {
                setMarkdownText(editor.getHTML());
            }
        } else if (activeTab === 'markdown' && tab !== 'markdown' && editor) {
            // When leaving markdown tab, sync back to editor
            try {
                const parsedHtml = marked.parse(markdownText) as string;
                editor.commands.setContent(parsedHtml || '<p></p>', { emitUpdate: true });
            } catch (err) {
                console.error('Erro ao sincronizar markdown:', err);
            }
        }
        setActiveTab(tab);
    };

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calloutRef.current && !calloutRef.current.contains(event.target as Node)) {
                setCalloutMenuOpen(false);
            }
            if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
                setTableMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!editor) {
        return <div className="tiptap-loading">Carregando editor...</div>;
    }

    // Modal handlers
    const openLinkModal = () => {
        const previousUrl = editor.getAttributes('link').href || '';
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to, ' ') || '';

        setLinkModal({
            isOpen: true,
            url: previousUrl,
            text: selectedText,
        });
    };

    const handleSaveLink = () => {
        if (!linkModal.url.trim()) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            let validUrl = linkModal.url.trim();
            if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://') && !validUrl.startsWith('mailto:')) {
                validUrl = `https://${validUrl}`;
            }

            if (linkModal.text && editor.state.selection.empty) {
                editor.chain().focus().insertContent(`<a href="${validUrl}">${linkModal.text}</a>`).run();
            } else {
                editor.chain().focus().extendMarkRange('link').setLink({ href: validUrl }).run();
            }
        }
        setLinkModal({ isOpen: false, url: '', text: '' });
    };

    const handleRemoveLink = () => {
        editor.chain().focus().unsetLink().run();
        setLinkModal({ isOpen: false, url: '', text: '' });
    };

    const handleInsertImage = () => {
        if (imageModal.url.trim()) {
            editor.chain().focus().setImage({
                src: imageModal.url.trim(),
                alt: imageModal.alt.trim() || 'imagem do post',
            }).run();
        }
        setImageModal({ isOpen: false, url: '', alt: '' });
    };

    const toggleCallout = (type: CalloutType) => {
        editor.chain().focus().toggleCallout({ type }).run();
        setCalloutMenuOpen(false);
    };

    // Import .md file
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const fileContent = e.target?.result as string;
            if (fileContent) {
                try {
                    const parsedHtml = marked.parse(fileContent) as string;
                    editor.commands.setContent(parsedHtml, { emitUpdate: true });
                    setMarkdownText(fileContent);
                } catch (err) {
                    console.error('Erro ao ler arquivo markdown:', err);
                }
            }
        };
        reader.readAsText(file);
        // Reset input value
        event.target.value = '';
    };

    // Export .md file
    const handleExportMarkdown = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const md = (editor.storage as any).markdown?.getMarkdown() || markdownText || editor.getText();
        const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'post.md';
        link.click();
        URL.revokeObjectURL(url);
    };

    // Calculate word & character metrics
    const textContent = activeTab === 'markdown' ? markdownText : editor.getText();
    const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
    const charCount = textContent.length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const isTableActive = editor.isActive('table');

    return (
        <div className="tiptap-container">
            {editable && (
                <>
                    {/* Hidden file input for .md upload */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept=".md,.markdown,.txt"
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                    />

                    {/* GitHub-style tabs with Markdown Code Mode */}
                    <div className="tiptap-tabs">
                        <button
                            type="button"
                            className={`tiptap-tab ${activeTab === 'write' ? 'active' : ''}`}
                            onClick={() => handleSwitchTab('write')}
                        >
                            <Edit3 size={14} />
                            Visual
                        </button>
                        <button
                            type="button"
                            className={`tiptap-tab ${activeTab === 'markdown' ? 'active' : ''}`}
                            onClick={() => handleSwitchTab('markdown')}
                        >
                            <FileText size={14} />
                            Markdown
                        </button>
                        <button
                            type="button"
                            className={`tiptap-tab ${activeTab === 'preview' ? 'active' : ''}`}
                            onClick={() => handleSwitchTab('preview')}
                        >
                            <Eye size={14} />
                            Preview
                        </button>

                        <div className="tiptap-tab-actions">
                            <button
                                type="button"
                                className="tiptap-action-btn"
                                onClick={() => fileInputRef.current?.click()}
                                title="Importar arquivo .md"
                            >
                                <Upload size={13} /> Importar .md
                            </button>
                            <button
                                type="button"
                                className="tiptap-action-btn"
                                onClick={handleExportMarkdown}
                                title="Baixar como arquivo .md"
                            >
                                <Download size={13} /> Baixar .md
                            </button>
                        </div>

                        <div className="tiptap-stats">
                            <span>{wordCount} palavras</span>
                            <span>•</span>
                            <span>{charCount} caracteres</span>
                            <span>•</span>
                            <span>~{readingTime} min de leitura</span>
                        </div>
                    </div>

                    {/* Toolbar Principal (Write Mode) */}
                    {activeTab === 'write' && (
                        <div className="tiptap-toolbar">
                            {/* Histórico */}
                            <div className="toolbar-group" title="Histórico">
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().undo().run()}
                                    disabled={!editor.can().undo()}
                                    title="Desfazer (Ctrl+Z)"
                                >
                                    <Undo size={15} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().redo().run()}
                                    disabled={!editor.can().redo()}
                                    title="Refazer (Ctrl+Y)"
                                >
                                    <Redo size={15} />
                                </button>
                            </div>

                            {/* Hierarquia & Títulos */}
                            <div className="toolbar-group" title="Estrutura de Texto">
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().setParagraph().run()}
                                    className={editor.isActive('paragraph') ? 'is-active' : ''}
                                    title="Parágrafo Normal"
                                >
                                    <Pilcrow size={15} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                    className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
                                    title="Título 1 (# no início)"
                                >
                                    <Heading1 size={15} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                    className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                                    title="Título 2 (## no início)"
                                >
                                    <Heading2 size={15} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                    className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                                    title="Título 3 (### no início)"
                                >
                                    <Heading3 size={15} />
                                </button>
                            </div>

                            {/* Formatação Inline */}
                            <div className="toolbar-group" title="Estilos de Texto (Inline)">
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleBold().run()}
                                    className={editor.isActive('bold') ? 'is-active' : ''}
                                    title="Negrito (Ctrl+B)"
                                >
                                    <Bold size={15} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleItalic().run()}
                                    className={editor.isActive('italic') ? 'is-active' : ''}
                                    title="Itálico (Ctrl+I)"
                                >
                                    <Italic size={15} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                                    className={editor.isActive('underline') ? 'is-active' : ''}
                                    title="Sublinhado (Ctrl+U)"
                                >
                                    <UnderlineIcon size={15} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleStrike().run()}
                                    className={editor.isActive('strike') ? 'is-active' : ''}
                                    title="Tachado / Riscado"
                                >
                                    <Strikethrough size={15} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleCode().run()}
                                    className={editor.isActive('code') ? 'is-active' : ''}
                                    title="Código Inline (`código`)"
                                >
                                    <Code size={15} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                                    className={editor.isActive('highlight') ? 'is-active' : ''}
                                    title="Marca-texto / Destaque"
                                >
                                    <Highlighter size={15} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleInlineQuote().run()}
                                    className={editor.isActive('inlineQuote') ? 'is-active' : ''}
                                    title='Citação Inline ("trecho selecionado")'
                                >
                                    <span style={{ fontSize: '13px', fontWeight: 'bold', fontFamily: 'serif' }}>“ ”</span>
                                </button>
                            </div>

                            {/* Alinhamento */}
                            <div className="toolbar-group" title="Alinhamento">
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                                    className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
                                    title="Alinhar à Esquerda"
                                >
                                    <AlignLeft size={15} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                                    className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
                                    title="Centralizar"
                                >
                                    <AlignCenter size={15} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                                    className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
                                    title="Alinhar à Direita"
                                >
                                    <AlignRight size={15} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                                    className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}
                                    title="Justificar"
                                >
                                    <AlignJustify size={15} />
                                </button>
                            </div>

                            {/* Listas */}
                            <div className="toolbar-group" title="Listas">
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                                    className={editor.isActive('bulletList') ? 'is-active' : ''}
                                    title="Lista com Marcadores (- no início)"
                                >
                                    <List size={15} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                    className={editor.isActive('orderedList') ? 'is-active' : ''}
                                    title="Lista Numerada (1. no início)"
                                >
                                    <ListOrdered size={15} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                                    className={editor.isActive('taskList') ? 'is-active' : ''}
                                    title="Lista de Tarefas ([ ] no início)"
                                >
                                    <ListTodo size={15} />
                                </button>
                            </div>

                            {/* Blocos Especiais */}
                            <div className="toolbar-group" title="Blocos">
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                                    className={editor.isActive('blockquote') ? 'is-active' : ''}
                                    title="Citação em Bloco (> no início)"
                                >
                                    <Quote size={15} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                                    className={editor.isActive('codeBlock') ? 'is-active' : ''}
                                    title="Bloco de Código (``` no início)"
                                >
                                    <FileCode size={15} />
                                </button>

                                {/* Dropdown de Callouts / Avisos */}
                                <div className="dropdown-wrapper" ref={calloutRef}>
                                    <button
                                        type="button"
                                        onClick={() => setCalloutMenuOpen(prev => !prev)}
                                        className={editor.isActive('callout') ? 'is-active' : ''}
                                        title="Caixa de Destaque / Callout"
                                    >
                                        <Lightbulb size={15} />
                                    </button>

                                    {calloutMenuOpen && (
                                        <div className="tiptap-dropdown-menu">
                                            <button type="button" onClick={() => toggleCallout('tip')}>
                                                <Lightbulb size={14} color="#eab308" /> Dica (Tip)
                                            </button>
                                            <button type="button" onClick={() => toggleCallout('info')}>
                                                <Info size={14} color="#3b82f6" /> Informação (Info)
                                            </button>
                                            <button type="button" onClick={() => toggleCallout('warning')}>
                                                <AlertTriangle size={14} color="#ef4444" /> Aviso (Warning)
                                            </button>
                                            <button type="button" onClick={() => toggleCallout('quote')}>
                                                <Bookmark size={14} color="#8b5cf6" /> Destaque (Quote)
                                            </button>
                                            {editor.isActive('callout') && (
                                                <button type="button" onClick={() => { editor.chain().focus().unsetCallout().run(); setCalloutMenuOpen(false); }}>
                                                    <X size={14} /> Remover Caixa
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                                    title="Divisor Horizontal (---)"
                                >
                                    <Minus size={15} />
                                </button>
                            </div>

                            {/* Inserções: Links, Imagens e Tabelas */}
                            <div className="toolbar-group" title="Inserir">
                                <button
                                    type="button"
                                    onClick={openLinkModal}
                                    className={editor.isActive('link') ? 'is-active' : ''}
                                    title="Inserir/Editar Link"
                                >
                                    <LinkIcon size={15} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setImageModal({ isOpen: true, url: '', alt: '' })}
                                    title="Inserir Imagem"
                                >
                                    <ImageIcon size={15} />
                                </button>

                                {/* Dropdown de Tabelas */}
                                <div className="dropdown-wrapper" ref={tableRef}>
                                    <button
                                        type="button"
                                        onClick={() => setTableMenuOpen(prev => !prev)}
                                        className={isTableActive ? 'is-active' : ''}
                                        title="Tabela"
                                    >
                                        <TableIcon size={15} />
                                    </button>

                                    {tableMenuOpen && (
                                        <div className="tiptap-dropdown-menu">
                                            {!isTableActive ? (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                                                        setTableMenuOpen(false);
                                                    }}
                                                >
                                                    <TableIcon size={14} /> Inserir Tabela 3x3
                                                </button>
                                            ) : (
                                                <>
                                                    <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()}>
                                                        <Rows size={14} /> Adicionar Linha Abaixo
                                                    </button>
                                                    <button type="button" onClick={() => editor.chain().focus().deleteRow().run()}>
                                                        <Rows size={14} /> Excluir Linha
                                                    </button>
                                                    <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()}>
                                                        <Columns size={14} /> Adicionar Coluna à Direita
                                                    </button>
                                                    <button type="button" onClick={() => editor.chain().focus().deleteColumn().run()}>
                                                        <Columns size={14} /> Excluir Coluna
                                                    </button>
                                                    <button type="button" onClick={() => editor.chain().focus().toggleHeaderRow().run()}>
                                                        Alternar Linha de Cabeçalho
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            editor.chain().focus().deleteTable().run();
                                                            setTableMenuOpen(false);
                                                        }}
                                                        style={{ color: '#ef4444' }}
                                                    >
                                                        <Trash2 size={14} /> Excluir Tabela Inteira
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bubble Menu Flutuante (Notion / Medium Style ao selecionar texto) */}
                    <BubbleMenu
                        editor={editor}
                        className="tiptap-bubble-menu"
                    >
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={editor.isActive('bold') ? 'is-active' : ''}
                            title="Negrito"
                        >
                            <Bold size={13} />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={editor.isActive('italic') ? 'is-active' : ''}
                            title="Itálico"
                        >
                            <Italic size={13} />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            className={editor.isActive('underline') ? 'is-active' : ''}
                            title="Sublinhado"
                        >
                            <UnderlineIcon size={13} />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            className={editor.isActive('strike') ? 'is-active' : ''}
                            title="Tachado"
                        >
                            <Strikethrough size={13} />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleCode().run()}
                            className={editor.isActive('code') ? 'is-active' : ''}
                            title="Código Inline"
                        >
                            <Code size={13} />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleHighlight().run()}
                            className={editor.isActive('highlight') ? 'is-active' : ''}
                            title="Marca-texto"
                        >
                            <Highlighter size={13} />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleInlineQuote().run()}
                            className={editor.isActive('inlineQuote') ? 'is-active' : ''}
                            title='Citação Inline ("trecho")'
                        >
                            <span style={{ fontSize: '11px', fontWeight: 'bold', fontFamily: 'serif' }}>“ ”</span>
                        </button>
                        <button
                            type="button"
                            onClick={openLinkModal}
                            className={editor.isActive('link') ? 'is-active' : ''}
                            title="Link"
                        >
                            <LinkIcon size={13} />
                        </button>
                    </BubbleMenu>
                </>
            )}

            {/* Conteúdo: Visual, Markdown ou Preview */}
            {activeTab === 'write' ? (
                <EditorContent editor={editor} className="tiptap-content" />
            ) : activeTab === 'markdown' ? (
                <div className="tiptap-markdown-container">
                    <textarea
                        className="tiptap-markdown-editor"
                        value={markdownText}
                        onChange={(e) => {
                            setMarkdownText(e.target.value);
                            try {
                                const parsed = marked.parse(e.target.value) as string;
                                onChange(parsed);
                            } catch {
                                // Ignore typing errors
                            }
                        }}
                        placeholder="# Escreva ou cole seu código Markdown aqui..."
                        spellCheck={false}
                    />
                </div>
            ) : (
                <div className="tiptap-preview">
                    <div
                        className="tiptap"
                        dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                    />
                </div>
            )}

            {/* Modal de Inserção / Edição de Link */}
            {linkModal.isOpen && (
                <div className="tiptap-modal-overlay" onClick={() => setLinkModal({ isOpen: false, url: '', text: '' })}>
                    <div className="tiptap-modal" onClick={e => e.stopPropagation()}>
                        <div className="tiptap-modal-header">
                            <h3>Inserir Link</h3>
                            <button
                                type="button"
                                className="tiptap-modal-close"
                                onClick={() => setLinkModal({ isOpen: false, url: '', text: '' })}
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="tiptap-modal-body">
                            {linkModal.text && (
                                <div className="tiptap-modal-field">
                                    <label>Texto Selecionado:</label>
                                    <input
                                        type="text"
                                        value={linkModal.text}
                                        onChange={e => setLinkModal(prev => ({ ...prev, text: e.target.value }))}
                                        disabled={!editor.state.selection.empty}
                                    />
                                </div>
                            )}
                            <div className="tiptap-modal-field">
                                <label>URL do Link:</label>
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="https://exemplo.com"
                                    value={linkModal.url}
                                    onChange={e => setLinkModal(prev => ({ ...prev, url: e.target.value }))}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleSaveLink();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="tiptap-modal-actions">
                            {editor.isActive('link') && (
                                <button
                                    type="button"
                                    className="tiptap-btn tiptap-btn-danger"
                                    onClick={handleRemoveLink}
                                >
                                    <Unlink size={14} /> Remover Link
                                </button>
                            )}
                            <button
                                type="button"
                                className="tiptap-btn tiptap-btn-secondary"
                                onClick={() => setLinkModal({ isOpen: false, url: '', text: '' })}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="tiptap-btn tiptap-btn-primary"
                                onClick={handleSaveLink}
                            >
                                <Check size={14} /> Salvar Link
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Inserção de Imagem */}
            {imageModal.isOpen && (
                <div className="tiptap-modal-overlay" onClick={() => setImageModal({ isOpen: false, url: '', alt: '' })}>
                    <div className="tiptap-modal" onClick={e => e.stopPropagation()}>
                        <div className="tiptap-modal-header">
                            <h3>Inserir Imagem</h3>
                            <button
                                type="button"
                                className="tiptap-modal-close"
                                onClick={() => setImageModal({ isOpen: false, url: '', alt: '' })}
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="tiptap-modal-body">
                            <div className="tiptap-modal-field">
                                <label>URL da Imagem:</label>
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="https://exemplo.com/imagem.png"
                                    value={imageModal.url}
                                    onChange={e => setImageModal(prev => ({ ...prev, url: e.target.value }))}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleInsertImage();
                                        }
                                    }}
                                />
                            </div>
                            <div className="tiptap-modal-field">
                                <label>Descrição / Texto Alternativo (Alt):</label>
                                <input
                                    type="text"
                                    placeholder="Descrição da imagem"
                                    value={imageModal.alt}
                                    onChange={e => setImageModal(prev => ({ ...prev, alt: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="tiptap-modal-actions">
                            <button
                                type="button"
                                className="tiptap-btn tiptap-btn-secondary"
                                onClick={() => setImageModal({ isOpen: false, url: '', alt: '' })}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="tiptap-btn tiptap-btn-primary"
                                onClick={handleInsertImage}
                                disabled={!imageModal.url.trim()}
                            >
                                <Check size={14} /> Inserir Imagem
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TiptapEditor;
