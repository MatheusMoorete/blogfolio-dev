import React, { useEffect, useState, useRef } from 'react';
import Window from './Window';
import './QuickNavigation.css';

interface Heading {
    id: string;
    text: string;
    level: number;
}

interface QuickNavigationProps {
    contentRef: React.RefObject<HTMLDivElement | null>;
}

const QuickNavigation: React.FC<QuickNavigationProps> = ({ contentRef }) => {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const isManualScrolling = useRef(false);
    const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const extractHeadings = () => {
            if (!contentRef.current) {
                return;
            }

            const headingElements = contentRef.current.querySelectorAll('h2');

            const extractedHeadings: Heading[] = [];

            headingElements.forEach((heading, index) => {
                const id = heading.id || `heading-${index}`;

                extractedHeadings.push({
                    id,
                    text: heading.textContent || '',
                    level: parseInt(heading.tagName.charAt(1)),
                });
            });

            requestAnimationFrame(() => {
                setHeadings(extractedHeadings);
            });
        };

        extractHeadings();

        const timeoutId = setTimeout(extractHeadings, 100);

        return () => clearTimeout(timeoutId);
    }, [contentRef]);

    useEffect(() => {
        if (headings.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '-10px 0px -80% 0px',
            threshold: [0, 1],
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {

            if (isManualScrolling.current) return;

            const intersecting = entries.filter(entry => entry.isIntersecting);

            if (intersecting.length > 0) {
                const topmost = intersecting.reduce((prev, curr) => {
                    return curr.boundingClientRect.top < prev.boundingClientRect.top ? curr : prev;
                });
                setActiveId(topmost.target.id);
            }
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [headings]);

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {            isManualScrolling.current = true;
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

            const yOffset = -50;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });

            setActiveId(id);

            scrollTimeout.current = setTimeout(() => {
                isManualScrolling.current = false;
            }, 800);
        }
    };

    if (headings.length === 0) {
        return null;
    }

    return (
        <div className="quick-nav-container">
            <Window title="navegacao-rapida.txt">
                <div className="quick-nav-content">
                    <h3 className="quick-nav-header">NAVEGAÇÃO RÁPIDA</h3>
                    <div className="quick-nav-divider"></div>
                    <ul className="quick-nav-list">
                        {headings.map((heading) => (
                            <li
                                key={heading.id}
                                className={`quick-nav-item quick-nav-level-${heading.level} ${activeId === heading.id ? 'active' : ''}`}
                                onClick={() => scrollToHeading(heading.id)}
                            >
                                <span className="quick-nav-title">{heading.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </Window>
        </div>
    );
};

export default QuickNavigation;
