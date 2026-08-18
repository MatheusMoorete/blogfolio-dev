import { Component, type ErrorInfo, type ReactNode } from 'react';
import Window from './Window';

interface Props {
    children: ReactNode;
    fallbackTitle?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '1rem' }}>
                    <Window title={this.props.fallbackTitle || 'C:\\SYSTEM\\error.exe'}>
                        <div style={{ padding: '1.5rem', fontFamily: 'var(--font-mono), monospace' }}>
                            <h2 style={{ color: '#dc2626', margin: '0 0 1rem 0', fontSize: '1.2rem' }}>
                                ⚠️ Erro na aplicação
                            </h2>
                            <p style={{ fontSize: '0.9rem', color: '#333', marginBottom: '1rem' }}>
                                Ocorreu um problema ao renderizar este componente:
                            </p>
                            <pre
                                style={{
                                    background: '#18181b',
                                    color: '#f87171',
                                    padding: '1rem',
                                    borderRadius: '2px',
                                    fontSize: '0.8rem',
                                    overflowX: 'auto',
                                    whiteSpace: 'pre-wrap',
                                }}
                            >
                                {this.state.error?.toString() || 'Erro desconhecido'}
                            </pre>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                                <button
                                    onClick={() => (window.location.href = '/admin/dashboard')}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: '#000',
                                        color: '#fff',
                                        border: '2px solid #000',
                                        fontFamily: 'inherit',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Ir para o Dashboard
                                </button>
                                <button
                                    onClick={() => window.location.reload()}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: '#f0f0f0',
                                        color: '#000',
                                        border: '2px solid #000',
                                        fontFamily: 'inherit',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Recarregar Página
                                </button>
                            </div>
                        </div>
                    </Window>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
