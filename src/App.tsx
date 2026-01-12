import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import BlogPage from './pages/BlogPage';
import NoteEditor from './components/study/NoteEditor';
import StudyNoteViewer from './components/study/StudyNoteViewer';
import BSOD from './components/easter-eggs/BSOD';
import Clippy from './components/easter-eggs/Clippy';

const App: React.FC = () => {
  const [showBSOD, setShowBSOD] = useState(false);

  useEffect(() => {
    const handleBSOD = () => setShowBSOD(true);
    window.addEventListener('trigger-bsod', handleBSOD);
    return () => window.removeEventListener('trigger-bsod', handleBSOD);
  }, []);

  const handleRestart = () => {
    setShowBSOD(false);
    window.location.href = '/';
  };

  return (
    <BrowserRouter>
      {showBSOD && <BSOD onComplete={handleRestart} />}
      {!showBSOD && <Clippy />}
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<StudyNoteViewer />} />
          <Route path="/blog/editor" element={<NoteEditor />} />
          <Route path="/blog/editor/:id" element={<NoteEditor />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
