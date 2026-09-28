import React from 'react';
import { useDictionaryTooltip } from '../../hooks/useDictionaryTooltip';
import DictionaryTooltip from './DictionaryTooltip';

export const GlobalDictionaryTooltip: React.FC = () => {
    const {
        activeTerm,
        position,
        visible,
        handleTooltipMouseEnter,
        handleTooltipMouseLeave,
    } = useDictionaryTooltip();

    return (
        <DictionaryTooltip
            term={activeTerm}
            position={position}
            visible={visible}
            onMouseEnter={handleTooltipMouseEnter}
            onMouseLeave={handleTooltipMouseLeave}
        />
    );
};

export default GlobalDictionaryTooltip;
