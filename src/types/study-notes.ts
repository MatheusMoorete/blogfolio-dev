export type ContentType = 'text' | 'code' | 'image' | 'markdown';

export interface ContentBlock {
    id: string;
    type: ContentType;
    content: string; // Markdown text, code string, or image URL
    language?: string; // For code blocks (e.g., 'typescript', 'python')
    styles?: Record<string, any>; // Custom CSS styles
    metadata?: Record<string, any>; // Extra data (e.g., image caption)
}

// React-Grid-Layout native item structure
export interface GridLayoutItem {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    maxW?: number;
    static?: boolean;
}

export interface StudyNote {
    id: string;
    slug: string;
    title: string;
    description: string;
    category: string; // Maps to folder structure
    tags: string[];
    createdAt: string;
    updatedAt: string;
    layout: GridLayoutItem[]; // Coordinates for the grid
    blocks: Record<string, ContentBlock>; // Map block ID to content
}
