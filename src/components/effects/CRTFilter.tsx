import React from 'react';
import './CRTFilter.css';

interface CRTFilterProps {
    enabled?: boolean;
}

const CRTFilter: React.FC<CRTFilterProps> = ({ enabled = true }) => {
    if (!enabled) return null;

    return (
        <div className="crt-overlay">
            <div className="crt-rgb" />
            <div className="crt-scanlines" />
            <div className="crt-vignette" />
            <div className="crt-flicker-layer" />
            <div className="crt-screen-distortion" />
            <div className="crt-refresh-line" />
        </div>
    );
};

export default CRTFilter;
