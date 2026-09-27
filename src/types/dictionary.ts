export interface DictionaryTerm {
    slug: string;
    term: string;
    pronunciation?: string;
    category: 'Browser APIs' | 'JavaScript Core' | 'DOM & Web APIs' | 'React & Frameworks' | 'Performance & Network' | 'Web Architecture';
    shortSummary: string;
    content: string; // Markdown / Explicação formatada
    examples?: Array<{
        title: string;
        language: string;
        code: string;
        description?: string;
    }>;
    keywords: string[];
    seeAlso?: string[]; // slugs
}
