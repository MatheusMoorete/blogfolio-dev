import React from 'react';
import './PostLoading.css';

interface PostLoadingProps {
  filename?: string;
  title?: string;
  subtitle?: string;
}

const PostLoading: React.FC<PostLoadingProps> = ({
  filename = 'post.md',
  title = 'Carregando post',
  subtitle = 'Sincronizando blocos de texto e diagramas do banco de dados...',
}) => {
  return (
    <div className="post-loading-wrapper">
      <main className="retro-loading-window" role="status" aria-live="polite">
        <header className="retro-loading-titlebar">
          <div className="retro-loading-controls" aria-hidden="true">
            <span className="retro-loading-dot" />
            <span className="retro-loading-dot" />
          </div>
          <div className="retro-loading-filename">{filename}</div>
        </header>

        <section className="retro-loading-content">
          <h1 className="retro-loading-title">{title}</h1>
          <p className="retro-loading-subtitle">{subtitle}</p>

          <div className="retro-loading-progress-track" aria-hidden="true">
            <div className="retro-loading-progress-fill" />
          </div>

          <div className="retro-loading-status">
            <span>status: buffering</span>
            <span>I/O stream</span>
          </div>

          <div className="retro-loading-console" aria-label="Console de carregamento">
            <span className="retro-loading-line">&gt; fetch(post)... ok</span>
            <span className="retro-loading-line">&gt; parse(markdown)... ok</span>
            <span className="retro-loading-line">
              &gt; render()
              <span className="retro-loading-cursor-wrapper">
                <span className="retro-loading-cursor" aria-hidden="true" />
              </span>
            </span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PostLoading;
