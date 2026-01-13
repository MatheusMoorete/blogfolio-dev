import { useEffect, useState } from 'react';

const KONAMI_CODE = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a'
];

export const useKonamiCode = (callback: () => void) => {
    const [input, setInput] = useState<string[]>([]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignora teclas fantasmas ou modificadores de sistema que não fazem parte do código
            const ignoreKeys = ['Unidentified', 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'];
            if (ignoreKeys.includes(e.key)) return;

            // Normaliza teclas de uma letra para minúsculo (evita erro com Caps Lock ou Shift)
            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            const newInput = [...input, key];

            // Keep only the last N keys where N is length of KONAMI_CODE
            if (newInput.length > KONAMI_CODE.length) {
                newInput.shift();
            }

            setInput(newInput);

            if (newInput.join(',') === KONAMI_CODE.join(',')) {
                callback();
                setInput([]); // Reset after successful trigger
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [input, callback]);
};
