import React, { useEffect, useRef, useState } from 'react';

declare global {
    interface Window {
        createDos: any;
    }
}

const DoomGame: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadResources = () => {
            return new Promise((resolve, reject) => {
                if (window.createDos) {
                    resolve(true);
                    return;
                }

                // Load CSS
                const link = document.createElement('link');
                link.rel = "stylesheet";
                link.href = "https://v8.js-dos.com/latest/js-dos.css";
                document.head.appendChild(link);

                // Load JS
                const script = document.createElement('script');
                script.src = "https://v8.js-dos.com/latest/js-dos.js";
                script.onload = () => resolve(true);
                script.onerror = () => reject(new Error("Failed to load js-dos script"));
                document.head.appendChild(script);
            });
        };

        let ci: any = null;

        loadResources().then(() => {
            if (containerRef.current && window.createDos) {
                try {
                    // js-dos v8 use createDos
                    window.createDos(containerRef.current, {
                        style: "hidden", // We want it simple
                    }).then((instance: any) => {
                        ci = instance;
                        instance.run("https://v8.js-dos.com/bundles/doom.jsdos").then(() => {
                            setLoading(false);
                        }).catch((err: any) => {
                            console.error("Game run error:", err);
                            setError("Falha ao iniciar o jogo.");
                        });
                    }).catch((err: any) => {
                        console.error("Dos creation error:", err);
                        setError("Erro ao inicializar DOS.");
                    });
                } catch (err) {
                    console.error("Init crash:", err);
                    setError("Crash na inicialização.");
                }
            }
        }).catch((err) => {
            console.error("Resource error:", err);
            setError("Erro ao carregar assets.");
        });

        return () => {
            if (ci && ci.stop) {
                ci.stop();
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                width: '300px',
                height: '200px',
                background: '#000',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}
        >
            {loading && !error && (
                <div style={{
                    position: 'absolute',
                    color: '#00ff41',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    zIndex: 10
                }}>
                    CARREGANDO DOOM.WAD...
                </div>
            )}
            {error && (
                <div style={{ color: '#ff0000', fontFamily: 'monospace', fontSize: '0.7rem', padding: '10px' }}>
                    [SYSTEM ERROR]: {error}
                </div>
            )}
        </div>
    );
};

export default DoomGame;

