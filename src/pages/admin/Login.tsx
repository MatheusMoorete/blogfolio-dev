import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Window from '../../components/Window';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/admin/dashboard');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto' }}>
            <Window title="C:\WINDOWS\system32\login.exe">
                <form onSubmit={handleLogin} style={{ padding: '1rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>E-mail:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', border: '2px solid #000', outline: 'none' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Senha:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', border: '2px solid #000', outline: 'none' }}
                            required
                        />
                    </div>
                    {error && (
                        <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem', border: '1px dashed red', padding: '0.5rem' }}>
                            Erro: {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: '#c0c0c0',
                            border: '2px solid',
                            borderTopColor: '#fff',
                            borderLeftColor: '#fff',
                            borderBottomColor: '#808080',
                            borderRightColor: '#808080',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        {loading ? 'Entrando...' : 'LOGIN'}
                    </button>
                    <p style={{ marginTop: '1rem', fontSize: '0.8rem', textAlign: 'center', color: '#666' }}>
                        Acesso restrito ao administrador.
                    </p>
                </form>
            </Window>
        </div>
    );
};

export default Login;
