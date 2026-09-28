import type { DictionaryTerm } from '../types/dictionary';
import { JAVASCRIPT_CORE_TERMS } from './dictionary/javascript-core';
import { DOM_BROWSER_TERMS } from './dictionary/dom-browser';
import { REACT_FRAMEWORKS_TERMS } from './dictionary/react-frameworks';
import { PERFORMANCE_NETWORK_TERMS } from './dictionary/performance-network';
import { ARCHITECTURE_SECURITY_TERMS } from './dictionary/architecture-security';

export const DICTIONARY_TERMS: DictionaryTerm[] = [
    ...JAVASCRIPT_CORE_TERMS,
    ...DOM_BROWSER_TERMS,
    ...REACT_FRAMEWORKS_TERMS,
    ...PERFORMANCE_NETWORK_TERMS,
    ...ARCHITECTURE_SECURITY_TERMS,
];

export const getDictionaryTerms = (): DictionaryTerm[] => {
    return DICTIONARY_TERMS;
};

export const getDictionaryTermBySlug = (slug: string): DictionaryTerm | undefined => {
    const normalized = slug.trim().toLowerCase();
    return DICTIONARY_TERMS.find(
        (t) =>
            t.slug.toLowerCase() === normalized ||
            t.term.toLowerCase() === normalized ||
            (t.aliases && t.aliases.some((a) => a.toLowerCase() === normalized)) ||
            t.keywords.some((k) => k.toLowerCase() === normalized)
    );
};

export const searchDictionaryTerms = (query: string): DictionaryTerm[] => {
    if (!query.trim()) return DICTIONARY_TERMS;
    const q = query.toLowerCase().trim();
    return DICTIONARY_TERMS.filter(
        (t) =>
            t.term.toLowerCase().includes(q) ||
            t.shortSummary.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q) ||
            (t.aliases && t.aliases.some((a) => a.toLowerCase().includes(q))) ||
            t.keywords.some((k) => k.toLowerCase().includes(q))
    );
};
