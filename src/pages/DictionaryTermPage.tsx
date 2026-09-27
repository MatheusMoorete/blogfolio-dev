import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Window from '../components/Window';
import { supabase } from '../lib/supabase';
import { MOCK_NOTES } from '../data/mock-notes';
import { getDictionaryTermBySlug, DICTIONARY_TERMS } from '../data/dictionary';
import type { StudyNote } from '../types/study-notes';
import { BookOpen, Tag, ArrowLeft, ArrowUpRight, Code, FileText, CheckCircle2 } from 'lucide-react';
import './DictionaryTermPage.css';

interface DatabasePost {
    id: string;
    slug: string;
    title: string;
    subtitle?: string;
    description?: string;
    category?: string;
    tags?: string[];
    pin_position: number | null;
    created_at: string;
    updated_at: string;
    image_url?: string;
    content: { html?: string; image_url?: string } | string;
}

const DictionaryTermPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [allPosts, setAllPosts] = useState<StudyNote[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    const term = useMemo(() => {
        if (!slug) return undefined;
        return getDictionaryTermBySlug(slug);
    }, [slug]);

    useEffect(() => {
        if (term) {
            document.title = `${term.term} | Dicionário Frontend | Blogfólio`;
        } else {
            document.title = 'Termo não encontrado | Dicionário Frontend';
        }
    }, [term]);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoadingPosts(true);
            try {
                const { data, error } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('status', 'published')
                    .order('created_at', { ascending: false });

                if (!error && data && data.length > 0) {
                    const mapped: StudyNote[] = data.map((post: DatabasePost) => ({
                        id: post.id,
                        slug: post.slug,
                        title: post.title,
                        subtitle: post.subtitle || '',
                        description: post.description || '',
                        imageUrl: post.image_url || (typeof post.content === 'object' && post.content !== null ? post.content?.image_url : '') || '',
                        category: post.category || 'geral',
                        tags: post.tags || [],
                        pinPosition: post.pin_position,
                        createdAt: post.created_at,
                        updatedAt: post.updated_at,
                        content: typeof post.content === 'string' ? post.content : (post.content?.html || ''),
                    }));
                    setAllPosts(mapped);
                } else {
                    // Fallback para mock notes se houver
                    setAllPosts(MOCK_NOTES);
                }
            } catch (err) {
                console.error('Erro ao buscar posts para o dicionário:', err);
                setAllPosts(MOCK_NOTES);
            } finally {
                setLoadingPosts(false);
            }
        };

        fetchPosts();
    }, []);

    // Filtra os posts do blog que usam o termo ou suas palavras-chave
    const relatedPosts = useMemo(() => {
        if (!term || allPosts.length === 0) return [];

        const searchKeywords = [
            term.slug.toLowerCase(),
            term.term.toLowerCase(),
            ...term.keywords.map((k) => k.toLowerCase()),
        ];

        return allPosts.filter((post) => {
            const contentText = (post.content || '').toLowerCase();
            const titleText = (post.title || '').toLowerCase();
            const descText = (post.description || '').toLowerCase();
            const postTags = (post.tags || []).map((t) => t.toLowerCase());

            // 1. Checa se o post possui link explícito para o termo
            if (contentText.includes(`/dicionario/${term.slug.toLowerCase()}`)) {
                return true;
            }

            // 2. Checa se alguma tag corresponde
            if (postTags.some((tag) => searchKeywords.some((kw) => tag === kw || tag.includes(kw)))) {
                return true;
            }

            // 3. Checa ocorrência no título ou na descrição
            if (searchKeywords.some((kw) => titleText.includes(kw) || descText.includes(kw))) {
                return true;
            }

            // 4. Checa ocorrência da palavra no conteúdo (usando boundary regex para evitar falsos positivos)
            return searchKeywords.some((kw) => {
                // Escapa caracteres especiais de regex
                const escaped = kw.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
                const regex = new RegExp(`\\b${escaped}\\b`, 'i');
                return regex.test(contentText);
            });
        });
    }, [term, allPosts]);

    if (!term) {
        return (
            <div className="dictionary-term-page-container">
                <div className="dictionary-term-nav-links">
                    <Link to="/dicionario" className="retro-link-back">
                        <ArrowLeft size={14} />
                        Voltar para o Dicionário
                    </Link>
                </div>
                <Window title="404_TERM_NOT_FOUND.exe">
                    <div style={{ padding: '2.5rem', textAlign: 'center' }}>
                        <h2 style={{ fontFamily: 'var(--font-mono)', marginBottom: '1rem' }}>
                            [ TERMO NÃO CATALOGADO ]
                        </h2>
                        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                            O termo "<strong>{slug}</strong>" ainda não foi adicionado ao dicionário de frontend.
                        </p>
                        <Link to="/dicionario" className="retro-button">
                            Ver todos os termos disponíveis
                        </Link>
                    </div>
                </Window>
            </div>
        );
    }

    return (
        <div className="dictionary-term-page-container">
            <div className="dictionary-term-nav-links">
                <Link to="/dicionario" className="retro-link-back">
                    <ArrowLeft size={14} />
                    <span>Voltar ao Dicionário</span>
                </Link>
                <span className="nav-separator">/</span>
                <span className="current-nav-term">{term.term}</span>
            </div>

            <Window title={`dicionario://${term.slug}.exe`}>
                <article className="dictionary-term-article">
                    {/* Header do Termo */}
                    <header className="dictionary-term-header">
                        <div className="dictionary-term-title-row">
                            <h1 className="dictionary-term-heading">{term.term}</h1>
                            {term.pronunciation && (
                                <span className="dictionary-term-pronunciation">
                                    {term.pronunciation}
                                </span>
                            )}
                        </div>

                        <div className="dictionary-term-meta">
                            <span className="term-category-badge">
                                <Tag size={12} />
                                {term.category}
                            </span>
                            <span className="term-context-badge">
                                Contexto: Frontend Web Engineering
                            </span>
                        </div>

                        {/* Caixa de Resumo em Destaque */}
                        <div className="term-summary-box">
                            <div className="summary-box-title">
                                <BookOpen size={16} />
                                <span>Definição Rápida</span>
                            </div>
                            <p className="summary-box-text">{term.shortSummary}</p>
                        </div>
                    </header>

                    {/* Conteúdo Explicativo / Artigo */}
                    <div className="dictionary-term-body">
                        <div
                            className="term-content-formatted"
                            dangerouslySetInnerHTML={{
                                __html: term.content
                                    .split('\n\n')
                                    .map((block) => {
                                        if (block.startsWith('### ')) {
                                            return `<h3>${block.replace('### ', '')}</h3>`;
                                        }
                                        if (block.startsWith('---')) {
                                            return '<hr class="term-hr" />';
                                        }
                                        if (block.startsWith('```')) {
                                            const codeContent = block
                                                .replace(/^```[a-z]*\n/, '')
                                                .replace(/\n```$/, '');
                                            return `<pre class="retro-code-block"><code>${codeContent}</code></pre>`;
                                        }
                                        if (block.startsWith('- ')) {
                                            const items = block
                                                .split('\n')
                                                .map((item) => `<li>${item.replace(/^- /, '')}</li>`)
                                                .join('');
                                            return `<ul class="term-list">${items}</ul>`;
                                        }
                                        if (/^\d+\. /.test(block)) {
                                            const items = block
                                                .split('\n')
                                                .map((item) => `<li>${item.replace(/^\d+\. /, '')}</li>`)
                                                .join('');
                                            return `<ol class="term-ordered-list">${items}</ol>`;
                                        }
                                        return `<p>${block}</p>`;
                                    })
                                    .join('')
                                    .replace(/`([^`]+)`/g, '<code class="inline-term-code">$1</code>')
                                    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                                    .replace(/\*([^*]+)\*/g, '<em>$1</em>'),
                            }}
                        />

                        {/* Exemplos Práticos de Código */}
                        {term.examples && term.examples.length > 0 && (
                            <section className="term-examples-section">
                                <h3 className="section-title">
                                    <Code size={18} />
                                    <span>Exemplos Práticos no Frontend</span>
                                </h3>
                                <div className="term-examples-list">
                                    {term.examples.map((ex, idx) => (
                                        <div key={idx} className="term-example-card">
                                            <div className="example-header">
                                                <span className="example-title">{ex.title}</span>
                                                <span className="example-lang">{ex.language}</span>
                                            </div>
                                            <pre className="example-code">
                                                <code>{ex.code}</code>
                                            </pre>
                                            {ex.description && (
                                                <p className="example-desc">{ex.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Termos Relacionados */}
                        {term.seeAlso && term.seeAlso.length > 0 && (
                            <section className="term-see-also-section">
                                <span className="see-also-title">Veja também no dicionário:</span>
                                <div className="see-also-chips">
                                    {term.seeAlso.map((slugRel) => {
                                        const rel = DICTIONARY_TERMS.find((t) => t.slug === slugRel);
                                        if (!rel) return null;
                                        return (
                                            <Link
                                                key={slugRel}
                                                to={`/dicionario/${rel.slug}`}
                                                className="see-also-chip"
                                            >
                                                <span>{rel.term}</span>
                                                <ArrowUpRight size={12} />
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* SEÇÃO PRINCIPAL DE POSTS RELACIONADOS DO BLOG */}
                    <section className="dictionary-term-related-posts-section">
                        <div className="related-posts-header">
                            <FileText size={20} className="related-posts-icon" />
                            <div>
                                <h2 className="related-posts-title">
                                    Posts do Blog que abordam este termo
                                </h2>
                                <p className="related-posts-subtitle">
                                    Artigos práticos publicados no Blogfólio que utilizam ou explicam o conceito de <strong>"{term.term}"</strong>.
                                </p>
                            </div>
                        </div>

                        {loadingPosts ? (
                            <div className="related-posts-loading">
                                <span>Verificando base de artigos do blog...</span>
                            </div>
                        ) : relatedPosts.length > 0 ? (
                            <div className="related-posts-grid">
                                {relatedPosts.map((post) => (
                                    <div key={post.id} className="related-post-card">
                                        <div className="related-post-card-header">
                                            <span className="related-post-date">
                                                {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                                            </span>
                                            <span className="related-post-category">
                                                #{post.category}
                                            </span>
                                        </div>

                                        <h3
                                            className="related-post-card-title"
                                            onClick={() => navigate(`/blog/${post.slug}`)}
                                        >
                                            {post.title}
                                        </h3>

                                        {post.subtitle && (
                                            <p className="related-post-card-subtitle">{post.subtitle}</p>
                                        )}

                                        <p className="related-post-card-desc">
                                            {post.description}
                                        </p>

                                        <div className="related-post-card-tags">
                                            {post.tags.map((tag) => (
                                                <span key={tag} className="related-tag-item">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="related-post-card-footer">
                                            <button
                                                className="retro-button-secondary"
                                                onClick={() => navigate(`/blog/${post.slug}`)}
                                            >
                                                <span>Ler post completo</span>
                                                <ArrowUpRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="related-posts-empty">
                                <div className="empty-message-box">
                                    <CheckCircle2 size={24} color="#555" />
                                    <p className="empty-title">
                                        Nenhum post aborda diretamente este termo no momento
                                    </p>
                                    <p className="empty-desc">
                                        Este termo já está documentado no nosso dicionário de Frontend! Em breve publicaremos novos artigos práticos no blog aprofundando o uso de <strong>{term.term}</strong>.
                                    </p>
                                    <Link to="/blog" className="retro-button" style={{ marginTop: '0.8rem', display: 'inline-block' }}>
                                        Explorar todos os posts do Blog
                                    </Link>
                                </div>
                            </div>
                        )}
                    </section>
                </article>
            </Window>
        </div>
    );
};

export default DictionaryTermPage;
