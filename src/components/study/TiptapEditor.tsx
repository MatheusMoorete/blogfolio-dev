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
import { common, createLowlight } from 'lowlight';
import { Callout, type CalloutType } from './extensions/Callout';
import { InlineQuote } from './extensions/InlineQuote';
import { renderMermaidDiagrams } from '../../lib/renderMermaid';
import { markdownToHtml, htmlToMarkdown } from '../../lib/markdown';
import { DICTIONARY_TERMS } from '../../data/dictionary';

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
    BookOpen,
    Search,
    Sparkles,
    CheckCircle2,
    Columns,
    Rows,
    Trash2,
    X,
    Check
} from 'lucide-react';

import './TiptapEditor.css';

const lowlight = createLowlight(common);

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

interface DetectedTerm {
    term: (typeof DICTIONARY_TERMS)[number];
    count: number;
    alreadyLinked: boolean;
}

interface DictionaryModalState {
    isOpen: boolean;
    selectedSlug: string;
    displayText: string;
    search: string;
    detectedTerms: DetectedTerm[];
    feedbackMessage: string;
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
    const [dictionaryModal, setDictionaryModal] = useState<DictionaryModalState>({
        isOpen: false,
        selectedSlug: '',
        displayText: '',
        search: '',
        detectedTerms: [],
        feedbackMessage: '',
    });
    const [calloutMenuOpen, setCalloutMenuOpen] = useState(false);
    const [tableMenuOpen, setTableMenuOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const calloutRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);

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
            Callout,
            InlineQuote,
        ],
        content,
        editable,
        editorProps: {
            handlePaste: (_view, event) => {
                const text = event.clipboardData?.getData('text/plain');
                if (!text) return false;

                // Check if plain text contains Markdown patterns
                const hasMarkdown =
                    /^(#{1,6}\s|\s*[-*+]\s|\s*[0-9]+\.\s|>\s|```|\||\[\s*[x ]\s*\])/m.test(text) ||
                    /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\[[^\]]+\]\([^)]+\)|~~[^~]+~~)/.test(text);

                if (hasMarkdown) {
                    try {
                        const parsedHtml = markdownToHtml(text);
                        if (parsedHtml && editor && !editor.isDestroyed) {
                            editor.commands.insertContent(parsedHtml);
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
            if (editor && !editor.isDestroyed) {
                const html = editor.getHTML();
                onChange(html);
            }
        },
    });

    // Synchronize content if modified externally (e.g. async Supabase fetch)
    useEffect(() => {
        if (editor && !editor.isDestroyed && content !== undefined) {
            const currentHTML = editor.getHTML();
            if (content !== currentHTML && !editor.isFocused) {
                editor.commands.setContent(content || '', { emitUpdate: false });
            }
        }
    }, [content, editor]);

    // Update markdownText state when switching tabs
    const handleSwitchTab = (tab: 'write' | 'markdown' | 'preview') => {
        if (tab === 'markdown' && editor && !editor.isDestroyed) {
            // Convert current editor HTML to clean Markdown with turndown
            const md = htmlToMarkdown(editor.getHTML());
            setMarkdownText(md);
        } else if (activeTab === 'markdown' && tab !== 'markdown' && editor && !editor.isDestroyed) {
            // When leaving markdown tab, sync back to editor
            try {
                const parsedHtml = markdownToHtml(markdownText);
                editor.commands.setContent(parsedHtml || '<p></p>', { emitUpdate: true });
            } catch (err) {
                console.error('Erro ao sincronizar markdown:', err);
            }
        }
        setActiveTab(tab);
    };

    // Render Mermaid diagrams in preview tab
    useEffect(() => {
        if (activeTab === 'preview' && previewRef.current) {
            renderMermaidDiagrams(previewRef.current);
        }
    }, [activeTab, content, editor]);

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

    if (!editor || editor.isDestroyed) {
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
            if (
                !validUrl.startsWith('http://') &&
                !validUrl.startsWith('https://') &&
                !validUrl.startsWith('mailto:') &&
                !validUrl.startsWith('/') &&
                !validUrl.startsWith('#')
            ) {
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

    // Analisa o texto do artigo procurando por termos cadastrados no dicionário
    const scanArticleForTerms = (html: string): DetectedTerm[] => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                const parent = node.parentElement;
                if (!parent || parent.closest('a, pre, code')) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        });

        let fullUnlinkedText = '';
        let node: Node | null;
        while ((node = walker.nextNode())) {
            fullUnlinkedText += ' ' + (node.textContent || '');
        }

        const existingLinks = Array.from(doc.querySelectorAll('a[href*="/dicionario/"], [data-dictionary]'));
        const linkedSlugs = new Set(
            existingLinks.map(el => {
                const match = (el.getAttribute('href') || '').match(/\/dicionario\/([a-zA-Z0-9_-]+)/);
                return el.getAttribute('data-dictionary') || (match ? match[1] : '');
            }).filter(Boolean)
        );

        const detected: DetectedTerm[] = [];

        for (const term of DICTIONARY_TERMS) {
            const patternWords = [term.term, term.slug, ...term.keywords.slice(0, 2)];
            const regexParts = patternWords.map(w => w.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'));
            const regex = new RegExp(`\\b(${regexParts.join('|')})\\b`, 'gi');

            const matches = fullUnlinkedText.match(regex);
            const count = matches ? matches.length : 0;
            const isLinked = linkedSlugs.has(term.slug);

            if (count > 0 || isLinked) {
                detected.push({
                    term,
                    count,
                    alreadyLinked: isLinked
                });
            }
        }

        return detected;
    };

    // Substitui termos em nós de texto por links formatados do Dicionário
    const autoLinkTermsInHtml = (
        html: string,
        targetSlugs?: string[],
        firstOccurrenceOnly: boolean = false
    ): { newHtml: string; count: number } => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const termsToLink = targetSlugs && targetSlugs.length > 0
            ? DICTIONARY_TERMS.filter(t => targetSlugs.includes(t.slug))
            : DICTIONARY_TERMS;

        let totalCount = 0;

        // Se firstOccurrenceOnly = true, rastreia links já existentes no artigo para não repetir
        const existingLinks = Array.from(doc.querySelectorAll('a[href*="/dicionario/"], [data-dictionary]'));
        const alreadyLinkedSlugs = new Set(
            existingLinks.map(el => {
                const match = (el.getAttribute('href') || '').match(/\/dicionario\/([a-zA-Z0-9_-]+)/);
                return el.getAttribute('data-dictionary') || (match ? match[1] : '');
            }).filter(Boolean)
        );

        const fulfilledTerms = new Set<string>(firstOccurrenceOnly ? alreadyLinkedSlugs : []);

        const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                const parent = node.parentElement;
                if (!parent || parent.closest('a, pre, code')) {
                    return NodeFilter.FILTER_REJECT;
                }
                if (!node.textContent || !node.textContent.trim()) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        });

        const textNodes: Text[] = [];
        let currentNode: Node | null;
        while ((currentNode = walker.nextNode())) {
            textNodes.push(currentNode as Text);
        }

        const sortedTerms = [...termsToLink].sort((a, b) => b.term.length - a.term.length);

        const replaceInTextNode = (textNode: Text): void => {
            const currentText = textNode.textContent || '';
            if (!currentText.trim()) return;

            const activeTerms = sortedTerms.filter(t => !firstOccurrenceOnly || !fulfilledTerms.has(t.slug));
            if (activeTerms.length === 0) return;

            // Encontra a ocorrência mais precoce neste nó de texto
            let earliestMatch: {
                term: typeof sortedTerms[0];
                index: number;
                length: number;
                matchedWord: string;
            } | null = null;

            for (const term of activeTerms) {
                const patternWords = [term.term, term.slug];
                const regexParts = patternWords.map(w => w.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'));
                const regex = new RegExp(`\\b(${regexParts.join('|')})\\b`, 'i');

                const m = currentText.match(regex);
                if (m && m.index !== undefined) {
                    if (earliestMatch === null || m.index < earliestMatch.index || (m.index === earliestMatch.index && m[0].length > earliestMatch.length)) {
                        earliestMatch = {
                            term,
                            index: m.index,
                            length: m[0].length,
                            matchedWord: m[0]
                        };
                    }
                }
            }

            if (!earliestMatch) return;

            const { term, index, length, matchedWord } = earliestMatch;
            const before = currentText.substring(0, index);
            const after = currentText.substring(index + length);

            const linkEl = doc.createElement('a');
            linkEl.href = `/dicionario/${term.slug}`;
            linkEl.className = 'dictionary-term-linked';
            linkEl.setAttribute('data-dictionary', term.slug);
            linkEl.setAttribute('target', '_blank');
            linkEl.setAttribute('rel', 'noopener noreferrer');
            linkEl.textContent = matchedWord;

            const fragment = doc.createDocumentFragment();
            if (before) fragment.appendChild(doc.createTextNode(before));
            fragment.appendChild(linkEl);

            let afterTextNode: Text | null = null;
            if (after) {
                afterTextNode = doc.createTextNode(after);
                fragment.appendChild(afterTextNode);
            }

            if (textNode.parentNode) {
                textNode.parentNode.replaceChild(fragment, textNode);
            }
            totalCount++;

            if (firstOccurrenceOnly) {
                fulfilledTerms.add(term.slug);
            }

            // Continua recursivamente substituindo no restante do texto caso haja outros termos ou ocorrências
            if (afterTextNode) {
                replaceInTextNode(afterTextNode);
            }
        };

        for (const textNode of textNodes) {
            replaceInTextNode(textNode);
        }

        return { newHtml: doc.body.innerHTML, count: totalCount };
    };

    const openDictionaryModal = () => {
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to, ' ') || '';
        const cleanText = selectedText.trim();

        const currentHtml = editor.getHTML();
        const detected = scanArticleForTerms(currentHtml);

        // Tenta achar termo pelo texto selecionado
        const matched = DICTIONARY_TERMS.find(t =>
            t.slug.toLowerCase() === cleanText.toLowerCase() ||
            t.term.toLowerCase() === cleanText.toLowerCase() ||
            t.keywords.some(k => k.toLowerCase() === cleanText.toLowerCase())
        );

        setDictionaryModal({
            isOpen: true,
            selectedSlug: matched ? matched.slug : (cleanText ? '' : (detected[0]?.term.slug || DICTIONARY_TERMS[0]?.slug || '')),
            displayText: cleanText,
            search: '',
            detectedTerms: detected,
            feedbackMessage: '',
        });
    };

    const handleAutoLinkTerm = (slug: string, firstOccurrenceOnly: boolean = false) => {
        const currentHtml = editor.getHTML();
        const { newHtml, count } = autoLinkTermsInHtml(currentHtml, [slug], firstOccurrenceOnly);
        if (count > 0) {
            editor.commands.setContent(newHtml, { emitUpdate: true });
            const updated = scanArticleForTerms(newHtml);
            setDictionaryModal(prev => ({
                ...prev,
                detectedTerms: updated,
                feedbackMessage: `✨ Termo "${slug}" vinculado (${count} ${count === 1 ? 'ocorrência' : 'ocorrências'}${firstOccurrenceOnly ? ' - 1ª aparição' : ''})!`
            }));
        } else {
            setDictionaryModal(prev => ({
                ...prev,
                feedbackMessage: firstOccurrenceOnly
                    ? `O termo "${slug}" já possui uma aparição vinculada no artigo.`
                    : `Nenhuma ocorrência não-vinculada encontrada para "${slug}".`
            }));
        }
    };

    const handleAutoLinkAll = (firstOccurrenceOnly: boolean = false) => {
        const currentHtml = editor.getHTML();
        const unlinkedSlugs = dictionaryModal.detectedTerms
            .filter(d => firstOccurrenceOnly ? !d.alreadyLinked : (!d.alreadyLinked || d.count > 0))
            .map(d => d.term.slug);

        const { newHtml, count } = autoLinkTermsInHtml(
            currentHtml,
            unlinkedSlugs.length > 0 ? unlinkedSlugs : undefined,
            firstOccurrenceOnly
        );
        if (count > 0) {
            editor.commands.setContent(newHtml, { emitUpdate: true });
            const updated = scanArticleForTerms(newHtml);
            setDictionaryModal(prev => ({
                ...prev,
                detectedTerms: updated,
                feedbackMessage: `🎉 Sucesso! ${count} ocorrência(s) vinculadas ao Dicionário (${firstOccurrenceOnly ? 'apenas 1ª aparição' : 'todas as ocorrências'})!`
            }));
        } else {
            setDictionaryModal(prev => ({
                ...prev,
                feedbackMessage: firstOccurrenceOnly
                    ? 'Todos os termos detectados já possuem ao menos uma ocorrência vinculada no artigo.'
                    : 'Todos os termos encontrados no artigo já estão vinculados!'
            }));
        }
    };

    const handleInsertDictionaryTerm = () => {
        if (!dictionaryModal.selectedSlug) return;
        const term = DICTIONARY_TERMS.find(t => t.slug === dictionaryModal.selectedSlug);
        if (!term) return;

        const textToDisplay = dictionaryModal.displayText.trim() || term.term;
        const termUrl = `/dicionario/${term.slug}`;

        if (editor.state.selection.empty && !dictionaryModal.displayText.trim()) {
            editor.chain().focus().insertContent(`<a href="${termUrl}" class="dictionary-term-linked" data-dictionary="${term.slug}">${textToDisplay}</a>`).run();
        } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href: termUrl }).run();
        }

        setDictionaryModal({ isOpen: false, selectedSlug: '', displayText: '', search: '', detectedTerms: [], feedbackMessage: '' });
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
                    const parsedHtml = markdownToHtml(fileContent);
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
        const md = activeTab === 'markdown' ? markdownText : (editor && !editor.isDestroyed ? htmlToMarkdown(editor.getHTML()) : '');
        const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'post.md';
        link.click();
        URL.revokeObjectURL(url);
    };

    // Calculate word & character metrics
    const textContent = activeTab === 'markdown' ? markdownText : (editor && !editor.isDestroyed ? editor.getText() : '');
    const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
    const charCount = textContent.length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const isTableActive = Boolean(editor && !editor.isDestroyed && editor.isActive('table'));

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
                                    onClick={openDictionaryModal}
                                    title="Vincular Termo do Dicionário Frontend (com Hover Preview)"
                                >
                                    <BookOpen size={15} />
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
                        <button
                            type="button"
                            onClick={openDictionaryModal}
                            title="Vincular ao Dicionário Frontend (com Hover Preview)"
                        >
                            <BookOpen size={13} />
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
                            const val = e.target.value;
                            setMarkdownText(val);
                            try {
                                const parsed = markdownToHtml(val);
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
                        ref={previewRef}
                        className="tiptap"
                        dangerouslySetInnerHTML={{ __html: editor && !editor.isDestroyed ? editor.getHTML() : '' }}
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
                                    placeholder="https://exemplo.com ou /dicionario/window"
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

                            <div className="tiptap-modal-field" style={{ marginTop: '0.8rem', borderTop: '1px dashed #d5d5d5', paddingTop: '0.8rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#444' }}>
                                    <BookOpen size={13} />
                                    <span>Ou selecione um termo do Dicionário Frontend:</span>
                                </label>
                                <select
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            const term = DICTIONARY_TERMS.find(t => t.slug === e.target.value);
                                            if (term) {
                                                setLinkModal(prev => ({
                                                    ...prev,
                                                    url: `/dicionario/${term.slug}`,
                                                    text: prev.text || term.term
                                                }));
                                            }
                                        }
                                    }}
                                    defaultValue=""
                                    style={{
                                        padding: '7px 10px',
                                        fontSize: '0.82rem',
                                        width: '100%',
                                        border: '1px solid #1a1a1a',
                                        borderRadius: '2px',
                                        background: '#fafafa',
                                        fontFamily: 'var(--font-mono, monospace)'
                                    }}
                                >
                                    <option value="">-- Escolher termo catalogado --</option>
                                    {DICTIONARY_TERMS.map(t => (
                                        <option key={t.slug} value={t.slug}>
                                            {t.term} ({t.category})
                                        </option>
                                    ))}
                                </select>
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

            {/* Modal de Vinculação com o Dicionário Frontend */}
            {dictionaryModal.isOpen && (
                <div
                    className="tiptap-modal-overlay"
                    onClick={() => setDictionaryModal(prev => ({ ...prev, isOpen: false }))}
                >
                    <div
                        className="tiptap-modal"
                        style={{ maxWidth: '480px', width: '92%' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="tiptap-modal-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <BookOpen size={16} />
                                <h3>Vincular Termo do Dicionário</h3>
                            </div>
                            <button
                                type="button"
                                className="tiptap-modal-close"
                                onClick={() => setDictionaryModal(prev => ({ ...prev, isOpen: false }))}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="tiptap-modal-body">
                            {/* Feedback de sucesso de vinculação automática */}
                            {dictionaryModal.feedbackMessage && (
                                <div style={{
                                    marginBottom: '12px',
                                    padding: '8px 12px',
                                    background: '#e6fffa',
                                    border: '1px solid #38b2ac',
                                    borderRadius: '2px',
                                    fontSize: '0.8rem',
                                    fontFamily: 'var(--font-mono, monospace)',
                                    color: '#234e52',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    <CheckCircle2 size={15} color="#319795" />
                                    <span>{dictionaryModal.feedbackMessage}</span>
                                </div>
                            )}

                            {/* SEÇÃO INTELIGENTE: Termos detectados automaticamente no artigo */}
                            <div style={{
                                marginBottom: '16px',
                                padding: '10px 12px',
                                background: '#f4f4f5',
                                border: '1px solid #d4d4d8',
                                borderRadius: '2px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                                    <label style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 'bold' }}>
                                        <Sparkles size={14} color="#d97706" />
                                        <span>Termos Detectados no Artigo ({dictionaryModal.detectedTerms.length}):</span>
                                    </label>
                                    {dictionaryModal.detectedTerms.some(d => !d.alreadyLinked || d.count > 0) && (
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button
                                                type="button"
                                                onClick={() => handleAutoLinkAll(true)}
                                                style={{
                                                    background: '#fff',
                                                    color: '#1a1a1a',
                                                    border: '1px solid #1a1a1a',
                                                    boxShadow: '1px 1px 0 #1a1a1a',
                                                    fontSize: '0.7rem',
                                                    fontFamily: 'var(--font-mono, monospace)',
                                                    fontWeight: 'bold',
                                                    padding: '3px 7px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    borderRadius: '2px'
                                                }}
                                                title="Vincula apenas a 1ª aparição de cada termo encontrado no artigo"
                                            >
                                                <span>1ª aparição</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleAutoLinkAll(false)}
                                                style={{
                                                    background: '#1a1a1a',
                                                    color: '#fff',
                                                    border: '1px solid #000',
                                                    boxShadow: '1px 1px 0 #000',
                                                    fontSize: '0.7rem',
                                                    fontFamily: 'var(--font-mono, monospace)',
                                                    fontWeight: 'bold',
                                                    padding: '3px 8px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    borderRadius: '2px'
                                                }}
                                                title="Vincula todas as aparições de cada termo encontrado no artigo"
                                            >
                                                <Sparkles size={11} />
                                                <span>Vincular em todos</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {dictionaryModal.detectedTerms.length === 0 ? (
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#71717a', fontStyle: 'italic' }}>
                                        Nenhum termo do catálogo foi detectado no texto até o momento.
                                    </p>
                                ) : (
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                        {dictionaryModal.detectedTerms.map(({ term, count, alreadyLinked }) => (
                                            <div
                                                key={term.slug}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    background: '#ffffff',
                                                    border: '1px solid #a1a1aa',
                                                    padding: '3px 7px',
                                                    fontSize: '0.74rem',
                                                    fontFamily: 'var(--font-mono, monospace)',
                                                    borderRadius: '2px'
                                                }}
                                            >
                                                <strong>{term.term}</strong>
                                                {count > 0 && (
                                                    <span style={{ color: '#2563eb', fontWeight: 'bold' }}>
                                                        ({count}x)
                                                    </span>
                                                )}
                                                {alreadyLinked && count === 0 && (
                                                    <span style={{ color: '#16a34a', fontSize: '0.68rem' }}>
                                                        ✓ já vinculado
                                                    </span>
                                                )}
                                                {count === 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAutoLinkTerm(term.slug, true)}
                                                        style={{
                                                            background: '#f0fdf4',
                                                            border: '1px solid #16a34a',
                                                            color: '#15803d',
                                                            fontSize: '0.68rem',
                                                            fontWeight: 'bold',
                                                            padding: '1px 5px',
                                                            cursor: 'pointer',
                                                            borderRadius: '2px'
                                                        }}
                                                        title={`Vincular ocorrência de ${term.term}`}
                                                    >
                                                        + Vincular
                                                    </button>
                                                )}
                                                {count > 1 && (
                                                    <div style={{ display: 'inline-flex', gap: '3px' }}>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAutoLinkTerm(term.slug, true)}
                                                            style={{
                                                                background: '#ffffff',
                                                                border: '1px solid #71717a',
                                                                color: '#18181b',
                                                                fontSize: '0.65rem',
                                                                fontWeight: 'bold',
                                                                padding: '1px 4px',
                                                                cursor: 'pointer',
                                                                borderRadius: '2px'
                                                            }}
                                                            title={`Vincular apenas a 1ª aparição de ${term.term}`}
                                                        >
                                                            1ª vez
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAutoLinkTerm(term.slug, false)}
                                                            style={{
                                                                background: '#f0fdf4',
                                                                border: '1px solid #16a34a',
                                                                color: '#15803d',
                                                                fontSize: '0.65rem',
                                                                fontWeight: 'bold',
                                                                padding: '1px 4px',
                                                                cursor: 'pointer',
                                                                borderRadius: '2px'
                                                            }}
                                                            title={`Vincular todas as ${count} ocorrências de ${term.term}`}
                                                        >
                                                            Todos
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div style={{
                                textAlign: 'center',
                                borderTop: '1px dashed #d4d4d8',
                                margin: '10px 0',
                                position: 'relative'
                            }}>
                                <span style={{
                                    position: 'relative',
                                    top: '-9px',
                                    background: '#fff',
                                    padding: '0 8px',
                                    fontSize: '0.68rem',
                                    color: '#888',
                                    fontFamily: 'var(--font-mono, monospace)'
                                }}>
                                    OU VINCULAR SELEÇÃO MANUALMENTE
                                </span>
                            </div>

                            <div className="tiptap-modal-field">
                                <label>Texto selecionado no post:</label>
                                <input
                                    type="text"
                                    placeholder="Ex: window, DOM, Closures..."
                                    value={dictionaryModal.displayText}
                                    onChange={e => setDictionaryModal(prev => ({ ...prev, displayText: e.target.value }))}
                                />
                            </div>

                            <div className="tiptap-modal-field">
                                <label>Pesquisar termo no glossário:</label>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <Search size={14} style={{ position: 'absolute', left: '10px', color: '#888' }} />
                                    <input
                                        type="text"
                                        placeholder="Buscar (ex: window, dom, loop, hook)..."
                                        value={dictionaryModal.search}
                                        onChange={e => setDictionaryModal(prev => ({ ...prev, search: e.target.value }))}
                                        style={{ paddingLeft: '32px' }}
                                    />
                                </div>
                            </div>

                            <div className="tiptap-modal-field">
                                <label>Termo do Dicionário a associar:</label>
                                <div style={{
                                    maxHeight: '160px',
                                    overflowY: 'auto',
                                    border: '1px solid #1a1a1a',
                                    background: '#fafafa',
                                    padding: '4px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px'
                                }}>
                                    {DICTIONARY_TERMS
                                        .filter(t => {
                                            if (!dictionaryModal.search.trim()) return true;
                                            const s = dictionaryModal.search.toLowerCase();
                                            return t.term.toLowerCase().includes(s) || t.slug.includes(s) || t.keywords.some(k => k.includes(s));
                                        })
                                        .map(term => {
                                            const isSelected = dictionaryModal.selectedSlug === term.slug;
                                            return (
                                                <div
                                                    key={term.slug}
                                                    onClick={() => {
                                                        setDictionaryModal(prev => ({
                                                            ...prev,
                                                            selectedSlug: term.slug,
                                                            displayText: prev.displayText || term.term
                                                        }));
                                                    }}
                                                    style={{
                                                        padding: '6px 8px',
                                                        cursor: 'pointer',
                                                        background: isSelected ? '#1a1a1a' : '#fff',
                                                        color: isSelected ? '#fff' : '#000',
                                                        border: '1px solid',
                                                        borderColor: isSelected ? '#1a1a1a' : '#ddd',
                                                        borderRadius: '2px',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        fontFamily: 'var(--font-mono, monospace)',
                                                        fontSize: '0.8rem'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <strong>{term.term}</strong>
                                                        <span style={{
                                                            fontSize: '0.65rem',
                                                            opacity: 0.8,
                                                            background: isSelected ? '#333' : '#eee',
                                                            padding: '1px 5px',
                                                            borderRadius: '2px'
                                                        }}>
                                                            {term.category}
                                                        </span>
                                                    </div>
                                                    {isSelected && <Check size={14} />}
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>

                        <div className="tiptap-modal-actions">
                            <button
                                type="button"
                                className="tiptap-btn tiptap-btn-secondary"
                                onClick={() => setDictionaryModal(prev => ({ ...prev, isOpen: false }))}
                            >
                                Fechar
                            </button>
                            <button
                                type="button"
                                className="tiptap-btn tiptap-btn-primary"
                                onClick={handleInsertDictionaryTerm}
                                disabled={!dictionaryModal.selectedSlug}
                            >
                                <Check size={14} /> Vincular Palavra Selecionada
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TiptapEditor;
