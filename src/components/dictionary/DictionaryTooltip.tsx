import React from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';
import type { DictionaryTerm } from '../../types/dictionary';
import './DictionaryTooltip.css';

interface DictionaryTooltipProps {
    term: DictionaryTerm | null;
    position: { top: number; left: number } | null;
    visible: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

export const DictionaryTooltip: React.FC<DictionaryTooltipProps> = ({
    term,
    position,
    visible,
    onMouseEnter,
    onMouseLeave,
}) => {
    if (!visible || !term || !position) return null;

    const termUrl = `/dicionario/${term.slug}`;

    return (
        <div
            className="retro-dictionary-tooltip"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            role="tooltip"
        >
            <div className="tooltip-header">
                <div className="tooltip-title-area">
                    <BookOpen size={14} className="tooltip-icon" />
                    <span className="tooltip-term-title">{term.term}</span>
                </div>
                <span className="tooltip-category-badge">{term.category}</span>
            </div>

            <div className="tooltip-body">
                <p className="tooltip-summary">{term.shortSummary}</p>
            </div>

            <div className="tooltip-footer">
                <a
                    href={termUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tooltip-open-button"
                >
                    <span>Abrir artigo completo</span>
                    <ExternalLink size={12} />
                </a>
            </div>
        </div>
    );
};

export default DictionaryTooltip;
