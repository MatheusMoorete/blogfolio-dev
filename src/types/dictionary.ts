export interface DictionaryExample {
    title: string;
    language: string;
    code: string;
    description?: string;
}

export interface DictionaryTerm {
    slug: string;
    term: string;
    pronunciation?: string;
    category: 'Browser APIs' | 'JavaScript Core' | 'DOM & Web APIs' | 'React & Frameworks' | 'Performance & Network' | 'Web Architecture' | string;
    shortSummary: string;
    aliases?: string[];
    keywords: string[];
    prerequisites?: string[];
    seeAlso?: string[]; // slugs
    examples?: DictionaryExample[];
    content: string; // Markdown / Explicação formatada
}
