import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Window from '../components/Window';
import { DICTIONARY_TERMS } from '../data/dictionary';
import { Search, BookMarked, ArrowUpRight, Filter } from 'lucide-react';
import './DictionaryPage.css';

const CATEGORIES = [
    'Todas',
    'Browser APIs',
    'JavaScript Core',
    'DOM & Web APIs',
    'React & Frameworks',
    'Performance & Network',
    'Web Architecture',
] as const;

const DictionaryPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

    useEffect(() => {
        document.title = 'Dicionário Frontend | Blogfólio';
    }, []);

    const filteredTerms = useMemo(() => {
        return DICTIONARY_TERMS.filter((term) => {
            const matchesCategory =
                selectedCategory === 'Todas' || term.category === selectedCategory;

            if (!matchesCategory) return false;

            if (!searchQuery.trim()) return true;

            const q = searchQuery.toLowerCase().trim();
            return (
                term.term.toLowerCase().includes(q) ||
                term.slug.toLowerCase().includes(q) ||
                term.shortSummary.toLowerCase().includes(q) ||
                term.keywords.some((k) => k.toLowerCase().includes(q))
            );
        }).sort((a, b) => a.term.localeCompare(b.term));
    }, [searchQuery, selectedCategory]);

    return (
        <div className="dictionary-page-container">
            {/* Header da Página */}
            <div className="dictionary-page-header">
                <div className="dictionary-title-wrapper">
                    <BookMarked size={28} className="dictionary-header-icon" />
                    <div>
                        <h1 className="dictionary-page-title">Dicionário Frontend</h1>
                        <p className="dictionary-page-subtitle">
                            Glossário técnico com os principais conceitos, APIs e fundamentos da engenharia web explicados no contexto de Frontend.
                        </p>
                    </div>
                </div>

                <div className="dictionary-stats-badge">
                    <span>{DICTIONARY_TERMS.length} termos catalogados</span>
                </div>
            </div>

            {/* Janela de Busca e Filtros */}
            <Window title="C:\WINDOWS\system32\busca_termos.exe" className="dictionary-search-window">
                <div className="dictionary-controls-bar">
                    <div className="dictionary-search-box">
                        <Search size={16} className="search-input-icon" />
                        <input
                            type="text"
                            placeholder="Buscar termo (ex: window, dom, closure, hydration)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="dictionary-search-input"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="search-clear-btn"
                                aria-label="Limpar busca"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    <div className="dictionary-category-filters">
                        <div className="category-filter-label">
                            <Filter size={14} />
                            <span>Categorias:</span>
                        </div>
                        <div className="category-buttons-group">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`category-filter-btn ${
                                        selectedCategory === cat ? 'active' : ''
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Window>

            {/* Listagem de Termos */}
            <div className="dictionary-grid-section">
                {filteredTerms.length === 0 ? (
                    <Window title="SEM_RESULTADOS.txt">
                        <div className="dictionary-empty-state">
                            <p className="empty-state-title">Nenhum termo encontrado</p>
                            <p className="empty-state-desc">
                                Não encontramos nenhum termo para "<strong>{searchQuery}</strong>" na categoria selecionada.
                            </p>
                            <button
                                className="retro-button"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('Todas');
                                }}
                            >
                                Limpar filtros
                            </button>
                        </div>
                    </Window>
                ) : (
                    <div className="dictionary-terms-grid">
                        {filteredTerms.map((term) => (
                            <Window
                                key={term.slug}
                                title={`${term.slug}.term`}
                                className="dictionary-term-card-window"
                            >
                                <div className="dictionary-term-card">
                                    <div className="card-top-row">
                                        <h2
                                            className="card-term-title"
                                            onClick={() => navigate(`/dicionario/${term.slug}`)}
                                        >
                                            {term.term}
                                        </h2>
                                        <span className="card-category-tag">{term.category}</span>
                                    </div>

                                    <p className="card-term-summary">{term.shortSummary}</p>

                                    <div className="card-footer">
                                        <div className="card-keywords-preview">
                                            {term.keywords.slice(0, 3).map((kw) => (
                                                <span key={kw} className="card-kw-chip">
                                                    #{kw}
                                                </span>
                                            ))}
                                        </div>

                                        <button
                                            className="retro-button-card"
                                            onClick={() => navigate(`/dicionario/${term.slug}`)}
                                        >
                                            <span>Ver artigo</span>
                                            <ArrowUpRight size={13} />
                                        </button>
                                    </div>
                                </div>
                            </Window>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DictionaryPage;
