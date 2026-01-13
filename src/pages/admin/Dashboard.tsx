import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Window from '../../components/Window';
import { Plus, Edit2, Trash2, Globe } from 'lucide-react';

interface Post {
    id: string;
    title: string;
    slug: string;
    status: string;
    created_at: string;
}

const AdminDashboard: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('posts')
            .select('id, title, slug, status, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching posts:', error);
        } else {
            setPosts(data || []);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin');
    };

    const deletePost = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este post?')) {
            const { error } = await supabase.from('posts').delete().eq('id', id);
            if (error) {
                alert('Erro ao excluir post: ' + error.message);
            } else {
                fetchPosts();
            }
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-sans)' }}>Dashboard do Blog</h1>
                <button
                    onClick={handleLogout}
                    style={{ padding: '0.5rem 1rem', border: '1px solid #666', background: 'none', cursor: 'pointer' }}
                >
                    Sair
                </button>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <Link to="/blog/editor">
                    <button style={{
                        padding: '1rem 2rem',
                        backgroundColor: '#000',
                        color: '#fff',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}>
                        <Plus size={20} /> NOVO POST
                    </button>
                </Link>
            </div>

            <Window title="C:\WINDOWS\system32\posts.exe">
                <div style={{ padding: '1rem' }}>
                    {loading ? (
                        <p>Carregando posts...</p>
                    ) : posts.length === 0 ? (
                        <p>Nenhum post encontrado. Comece a escrever!</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid #ccc' }}>
                                    <th style={{ padding: '0.5rem' }}>Título</th>
                                    <th style={{ padding: '0.5rem' }}>Status</th>
                                    <th style={{ padding: '0.5rem' }}>Data</th>
                                    <th style={{ padding: '0.5rem' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map(post => (
                                    <tr key={post.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '0.8rem 0.5rem' }}>
                                            <div style={{ fontWeight: 'bold' }}>{post.title}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#666' }}>/{post.slug}</div>
                                        </td>
                                        <td style={{ padding: '0.5rem' }}>
                                            <span style={{
                                                padding: '2px 8px',
                                                fontSize: '0.7rem',
                                                backgroundColor: post.status === 'published' ? '#e6fffa' : '#f7fafc',
                                                color: post.status === 'published' ? '#2c7a7b' : '#4a5568',
                                                border: '1px solid'
                                            }}>
                                                {post.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.5rem', fontSize: '0.9rem' }}>
                                            {new Date(post.created_at).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td style={{ padding: '0.5rem' }}>
                                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                                                <Link to={`/blog/editor/${post.id}`} title="Editar">
                                                    <Edit2 size={18} />
                                                </Link>
                                                <Link to={`/blog/${post.slug}`} target="_blank" title="Ver no Blog">
                                                    <Globe size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => deletePost(post.id)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red', padding: 0 }}
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </Window>
        </div>
    );
};

export default AdminDashboard;
