import React from 'react';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  style?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
}

const Window: React.FC<WindowProps> = ({ title, children, className = '', headerClassName = '', style = {}, contentStyle = {} }) => {
  return (
    <div className={`retro-window ${className}`} style={style}>
      <div className={`retro-window-header ${headerClassName}`}>
        <div className="retro-window-controls">
          <div className="retro-control"></div>
          <div className="retro-control"></div>
        </div>
        <span className="retro-window-title">{title}</span>
        <div className="retro-window-controls" style={{ opacity: 0 }}>
          <div className="retro-control"></div>
          <div className="retro-control"></div>
        </div>
      </div>
      <div className="retro-window-content" style={contentStyle}>
        {children}
      </div>
    </div>
  );
};

export default Window;
