import { marked } from 'marked';
import TurndownService from 'turndown';
// @ts-expect-error missing type declarations for turndown-plugin-gfm
import { gfm } from 'turndown-plugin-gfm';

marked.setOptions({
    gfm: true,
    breaks: true,
});

const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
    bulletListMarker: '-',
});

try {
    turndownService.use(gfm);
} catch (err) {
    console.error('Erro ao inicializar gfm no turndown:', err);
}

// Preserve code blocks with accurate language identifier and uncorrupted content
turndownService.addRule('fencedCodeBlockWithLang', {
    filter: (node) => {
        return (
            node.nodeName === 'PRE' &&
            !!node.firstChild &&
            node.firstChild.nodeName === 'CODE'
        );
    },
    replacement: (_content, node) => {
        const codeElement = node.firstChild as HTMLElement;
        const className = codeElement.className || '';
        const match = className.match(/language-(\S+)/);
        const language = match ? match[1] : '';
        const code = codeElement.textContent || '';
        return `\n\`\`\`${language}\n${code}\n\`\`\`\n`;
    },
});

export function markdownToHtml(md: string): string {
    if (!md) return '';
    return marked.parse(md) as string;
}

export function htmlToMarkdown(html: string): string {
    if (!html) return '';
    return turndownService.turndown(html);
}
