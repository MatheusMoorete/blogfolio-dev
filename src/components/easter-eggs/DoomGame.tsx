import React, { useEffect, useRef, useState } from 'react';

declare global {
    interface Window {
        Dos: any;
    }
}

const DoomGame: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let dosInstance: any = null;

        const loadScript = (src: string): Promise<void> => {
            return new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) {
                    resolve();
                    return;
                }
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error('Failed to load script'));
                document.head.appendChild(script);
            });
        };

        const loadCSS = (href: string): void => {
            if (document.querySelector(`link[href="${href}"]`)) return;
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
        };

        const initDoom = async () => {
            try {
                loadCSS('https://v8.js-dos.com/latest/js-dos.css');
                await loadScript('https://v8.js-dos.com/latest/js-dos.js');

                if (containerRef.current && window.Dos) {
                    dosInstance = window.Dos(containerRef.current, {
                        url: 'https://cdn.dos.zone/original/2X/2/24b00b14f118580763440ecaddcc948f8cb94f14.jsdos',
                    });
                    setLoading(false);
                } else {
                    setError('Falha ao inicializar Dos.');
                }
            } catch (err) {
                console.error('Error initializing Doom:', err);
                setError('Erro ao carregar js-dos.');
            }
        };

        initDoom();

        return () => {
            if (dosInstance && dosInstance.stop) {
                dosInstance.stop();
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            id="dos"
            style={{
                width: '100%',
                height: '200px',
                background: '#000',
                position: 'relative',
            }}
        >
            {loading && !error && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#00ff41',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    zIndex: 10
                }}>
                    LOADING...
                </div>
            )}
            {error && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#ff0000',
                    fontFamily: 'monospace',
                    fontSize: '0.7rem',
                    padding: '10px',
                    textAlign: 'center'
                }}>
                    [ERROR]: {error}
                </div>
            )}
        </div>
    );
};

export default DoomGame;
