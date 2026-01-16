import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import BlogPage from './pages/BlogPage';
import Login from './pages/admin/Login';
import ProtectedRoute from './components/admin/ProtectedRoute';
import CRTFilter from './components/effects/CRTFilter';

// Lazy load heavy components
const NoteEditor = lazy(() => import('./components/study/NoteEditor'));
const StudyNoteViewer = lazy(() => import('./components/study/StudyNoteViewer'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const BSOD = lazy(() => import('./components/easter-eggs/BSOD'));
const HackerMode = lazy(() => import('./components/easter-eggs/HackerMode'));

const LoadingFallback = () => (
  <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'monospace' }}>
    Carregando...
  </div>
);

const App: React.FC = () => {
  const [showBSOD, setShowBSOD] = useState(false);
  const [crtEnabled, setCrtEnabled] = useState(false);

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
      <Suspense fallback={null}>
        <HackerMode />
      </Suspense>
      <CRTFilter enabled={crtEnabled} />
      {showBSOD && (
        <Suspense fallback={<LoadingFallback />}>
          <BSOD onComplete={handleRestart} />
        </Suspense>
      )}
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<StudyNoteViewer />} />
            <Route path="/admin" element={<Login />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog/editor"
              element={
                <ProtectedRoute>
                  <NoteEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog/editor/:id"
              element={
                <ProtectedRoute>
                  <NoteEditor />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </Layout>
      <button
        onClick={() => setCrtEnabled(!crtEnabled)}
        style={{
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          zIndex: 10001,
          background: crtEnabled ? '#00ff41' : '#333',
          color: crtEnabled ? '#000' : '#fff',
          border: '1px solid #777',
          padding: '4px 8px',
          fontSize: '0.7rem',
          fontFamily: 'monospace',
          cursor: 'pointer',
          borderRadius: '2px',
          boxShadow: '2px 2px 0 #000'
        }}
      >
        CRT: {crtEnabled ? 'ON' : 'OFF'}
      </button>
    </BrowserRouter>
  );
};

export default App;

