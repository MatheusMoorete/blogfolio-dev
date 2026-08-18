import { marked } from 'marked';
import TurndownService from 'turndown';
// @ts-expect-error missing type declarations for turndown-plugin-gfm
import { gfm } from 'turndown-plugin-gfm';

marked.setOptions({
    gfm: true,
    breaks: true,
});

let turndownInstance: TurndownService | null = null;

function getTurndown(): TurndownService {
    if (!turndownInstance) {
        turndownInstance = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced',
            emDelimiter: '*',
            bulletListMarker: '-',
        });

        // Safely apply gfm plugin if available
        try {
            if (typeof gfm === 'function') {
                turndownInstance.use(gfm);
            }
        } catch (err) {
            console.warn('Could not load gfm plugin for turndown:', err);
        }

        // Custom rule for code blocks with language support
        turndownInstance.addRule('fencedCodeBlockWithLang', {
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
    }
    return turndownInstance;
}

export function markdownToHtml(md: string): string {
    if (!md) return '';
    return marked.parse(md) as string;
}

export function htmlToMarkdown(html: string): string {
    if (!html) return '';
    try {
        return getTurndown().turndown(html);
    } catch (err) {
        console.error('Erro ao converter HTML para Markdown:', err);
        return html;
    }
}
