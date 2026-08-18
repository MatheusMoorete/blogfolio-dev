import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
        fontFamily: 'var(--font-mono), Courier New, monospace, sans-serif',
        primaryColor: '#ffffff',
        primaryTextColor: '#000000',
        primaryBorderColor: '#000000',
        lineColor: '#000000',
        secondaryColor: '#f4f4f5',
        tertiaryColor: '#ffffff',
        nodeBorder: '#000000',
        clusterBkg: '#f8f9fa',
        clusterBorder: '#000000',
        defaultLinkColor: '#000000',
        titleColor: '#000000',
        edgeLabelBackground: '#ffffff',
        mainBkg: '#ffffff',
        nodeTextColor: '#000000',
    },
    securityLevel: 'loose',
});

let idCounter = 0;

export async function renderMermaidDiagrams(container: HTMLElement | null) {
    if (!container) return;

    // Find code elements that might contain Mermaid definitions
    const codeBlocks = container.querySelectorAll('pre code, pre');

    for (const block of Array.from(codeBlocks)) {
        const text = block.textContent?.trim() || '';
        if (!text) continue;

        const isMermaidClass =
            block.classList.contains('language-mermaid') ||
            (block.parentElement && block.parentElement.tagName === 'PRE' && block.parentElement.classList.contains('language-mermaid'));

        const isMermaidSyntax =
            /^(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph|mindmap|timeline)\b/m.test(text);

        if (isMermaidClass || isMermaidSyntax) {
            const preElement = block.tagName === 'PRE' ? (block as HTMLElement) : (block.closest('pre') as HTMLElement);
            if (!preElement || preElement.getAttribute('data-mermaid-processed') === 'true') continue;

            const id = `mermaid-svg-${Date.now()}-${++idCounter}`;
            try {
                // Ensure temporary render elements are cleaned up
                const { svg } = await mermaid.render(id, text);
                const wrapper = document.createElement('div');
                wrapper.className = 'mermaid-diagram-wrapper';
                wrapper.innerHTML = svg;
                wrapper.setAttribute('data-mermaid-processed', 'true');
                preElement.replaceWith(wrapper);
            } catch (err) {
                console.error('Erro ao renderizar diagrama Mermaid:', err);
                preElement.setAttribute('data-mermaid-processed', 'true');
            }
        }
    }
}
