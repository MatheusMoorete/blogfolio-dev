import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import BlogPage from './pages/BlogPage';
import NoteEditor from './components/study/NoteEditor';
import StudyNoteViewer from './components/study/StudyNoteViewer';

const App: React.FC = () => {
  return (
    <BrowserRouter>
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
