import { useState, useRef, useCallback, useEffect } from 'react';
import { getDictionaryTermBySlug } from '../data/dictionary';
import type { DictionaryTerm } from '../types/dictionary';

export const useDictionaryTooltip = (containerRef: React.RefObject<HTMLElement | null>) => {
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
        const container = containerRef.current;
        if (!container) return;

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;

            // Busca por <a> com href para dicionario ou elemento com atributo data-dictionary
            const linkElement = target.closest('a[href*="/dicionario/"], [data-dictionary]') as HTMLAnchorElement | HTMLElement | null;
            if (!linkElement) return;

            let slug = '';
            if (linkElement.getAttribute('data-dictionary')) {
                slug = linkElement.getAttribute('data-dictionary') || '';
            } else if (linkElement instanceof HTMLAnchorElement) {
                const href = linkElement.getAttribute('href') || '';
                const match = href.match(/\/dicionario\/([a-zA-Z0-9_-]+)/);
                if (match && match[1]) {
                    slug = match[1];
                }
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

            // Posição no documento (considerando scroll da janela)
            let left = rect.left + window.scrollX;
            let top = rect.bottom + window.scrollY + 8;

            // Evita sair para a direita da tela
            if (left + tooltipWidth > window.innerWidth - 20) {
                left = Math.max(10, window.innerWidth - tooltipWidth - 20);
            }

            // Se for estourar embaixo, coloca em cima do termo
            if (rect.bottom + tooltipHeight > window.innerHeight && rect.top > tooltipHeight) {
                top = rect.top + window.scrollY - tooltipHeight - 8;
            }

            setActiveTerm(foundTerm);
            setPosition({ top, left });
            setVisible(true);
        };

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;

            const linkElement = target.closest('a[href*="/dicionario/"], [data-dictionary]');
            if (linkElement) {
                scheduleClose();
            }
        };

        container.addEventListener('mouseover', handleMouseOver);
        container.addEventListener('mouseout', handleMouseOut);

        return () => {
            container.removeEventListener('mouseover', handleMouseOver);
            container.removeEventListener('mouseout', handleMouseOut);
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
