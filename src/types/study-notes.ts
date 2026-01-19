export interface StudyNote {
    id: string;
    slug: string;
    title: string;
    subtitle?: string;
    description: string;
    imageUrl?: string;
    category: string;
    tags: string[];
    pinPosition: number | null;
    createdAt: string;
    updatedAt: string;
    content: string; // HTML content from Tiptap
}
