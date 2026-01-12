import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_NOTES } from '../../data/mock-notes';
import type { StudyNote } from '../../types/study-notes';
import GridRenderer from './GridRenderer';
import { useTranslation } from '../../hooks/useTranslation';

const StudyNoteViewer: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [note, setNote] = useState<StudyNote | null>(null);

    useEffect(() => {
        if (id) {
            const foundNote = MOCK_NOTES.find(n => n.id === id);
            setNote(foundNote || null);
        }
    }, [id]);

    if (!note) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading or Note Not Found...</div>;
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/blog" style={{ textDecoration: 'none', color: '#666' }}>← Voltar para o Blog</Link>
                <div>
                    <button className="retro-button" onClick={() => navigate(`/blog/editor/${note.id}`)}>
                        Editar
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: '3rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{note.title}</h1>
                <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '1rem' }}>{note.description}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {note.tags.map(tag => (
                        <span key={tag} style={{ background: '#eee', padding: '4px 10px', borderRadius: '15px', fontSize: '0.9rem' }}>#{tag}</span>
                    ))}
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#888' }}>
                    {new Date(note.createdAt).toLocaleDateString()}
                </div>
            </div>

            <GridRenderer note={note} isEditable={false} />
        </div>
    );
};

export default StudyNoteViewer;
