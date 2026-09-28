import { useState, useRef, useCallback, useEffect } from 'react';
import { getDictionaryTermBySlug } from '../data/dictionary';
import type { DictionaryTerm } from '../types/dictionary';

export const useDictionaryTooltip = (containerRef?: React.RefObject<HTMLElement | null>) => {
    const [activeTerm, setActiveTerm] = useState<DictionaryTerm | null>(null);
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
    const [visible, setVisible] = useState(false);
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cancelCloseTimer = useCallback(() => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    }, []);

    const scheduleClose = useCallback(() => {
        cancelCloseTimer();
        closeTimerRef.current = setTimeout(() => {
            setVisible(false);
            setActiveTerm(null);
        }, 220);
    }, [cancelCloseTimer]);

    const handleTooltipMouseEnter = useCallback(() => {
        cancelCloseTimer();
    }, [cancelCloseTimer]);

    const handleTooltipMouseLeave = useCallback(() => {
        scheduleClose();
    }, [scheduleClose]);

    useEffect(() => {
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;

            // Se for dentro do próprio tooltip, não re-dispara
            if (target.closest('.retro-dictionary-tooltip')) {
                cancelCloseTimer();
                return;
            }

            // Se containerRef foi passado e está montado, garante que o alvo está dentro dele
            if (containerRef && containerRef.current && !containerRef.current.contains(target)) {
                return;
            }

            // Busca por <a> com href para dicionario ou elemento com atributo data-dictionary
            const linkElement = target.closest('a[href*="/dicionario/"], [data-dictionary]') as HTMLElement | null;
            if (!linkElement) return;

            let slug = linkElement.getAttribute('data-dictionary') || '';
            if (!slug && linkElement instanceof HTMLAnchorElement) {
                const href = linkElement.getAttribute('href') || '';
                const match = href.match(/\/dicionario\/([a-zA-Z0-9_-]+)/);
                if (match && match[1]) {
                    slug = match[1];
                }
            } else if (!slug) {
                const href = linkElement.getAttribute('href') || '';
                const match = href.match(/\/dicionario\/([a-zA-Z0-9_-]+)/);
                if (match && match[1]) {
                    slug = match[1];
                }
            }

            if (!slug) {
                slug = (linkElement.textContent || '').trim().toLowerCase();
            }

            if (!slug) return;

            const foundTerm = getDictionaryTermBySlug(slug);
            if (!foundTerm) return;

            // Garante que o link abra em uma nova aba sem fechar a existente
            if (linkElement instanceof HTMLAnchorElement) {
                linkElement.target = '_blank';
                linkElement.rel = 'noopener noreferrer';
                if (!linkElement.classList.contains('dictionary-term-linked')) {
                    linkElement.classList.add('dictionary-term-linked');
                }
            }

            cancelCloseTimer();

            const rect = linkElement.getBoundingClientRect();
            const tooltipWidth = 320;
            const tooltipHeight = 160;

            // Posição fixa no viewport (position: fixed)
            let left = rect.left;
            let top = rect.bottom + 8;

            // Evita sair para a direita da tela
            if (left + tooltipWidth > window.innerWidth - 16) {
                left = Math.max(16, window.innerWidth - tooltipWidth - 16);
            }

            // Se for estourar embaixo, coloca em cima do termo
            if (top + tooltipHeight > window.innerHeight - 10 && rect.top > tooltipHeight + 10) {
                top = rect.top - tooltipHeight - 8;
            }

            setActiveTerm(foundTerm);
            setPosition({ top, left });
            setVisible(true);
        };

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;

            const linkElement = target.closest('a[href*="/dicionario/"], [data-dictionary]');
            if (!linkElement) return;

            // Se for dentro do próprio tooltip, não fecha
            if (linkElement.closest('.retro-dictionary-tooltip')) {
                return;
            }

            const related = e.relatedTarget as HTMLElement | null;
            // Se o cursor se moveu para um elemento filho do link, não fecha
            if (related && linkElement.contains(related)) {
                return;
            }

            // Se o cursor se moveu para dentro do tooltip, não fecha
            if (related && related.closest && related.closest('.retro-dictionary-tooltip')) {
                return;
            }

            scheduleClose();
        };

        const handleScroll = () => {
            scheduleClose();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setVisible(false);
                setActiveTerm(null);
            }
        };

        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('keydown', handleKeyDown);
            cancelCloseTimer();
        };
    }, [containerRef, cancelCloseTimer, scheduleClose]);

    return {
        activeTerm,
        position,
        visible,
        handleTooltipMouseEnter,
        handleTooltipMouseLeave,
    };
};
