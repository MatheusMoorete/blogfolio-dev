import React, { useEffect } from 'react';
import './BSOD.css';

interface BSODProps {
    onComplete: () => void;
}

const BSOD: React.FC<BSODProps> = ({ onComplete }) => {
    useEffect(() => {
        // Phase 0: The actual blue screen
        const timer = setTimeout(() => {
            onComplete();
        }, 3000); // Show for 3 seconds then "restart"

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="bsod-overlay">
            <div className="bsod-content">
                <div className="bsod-header">
                    <span className="bsod-title">Windows</span>
                </div>
                <p>
                    A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) +
                    00001036. The current application will be terminated.
                </p>
                <ul className="bsod-list">
                    <li>* Press any key to terminate the current application.</li>
                    <li>* Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</li>
                </ul>
                <p className="bsod-footer">
                    Press any key to continue <span className="blink">_</span>
                </p>
            </div>
        </div>
    );
};

export default BSOD;
