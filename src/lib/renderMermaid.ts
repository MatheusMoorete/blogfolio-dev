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
    suppressErrorRendering: false,
});

let idCounter = 0;

export async function renderMermaidDiagrams(container: HTMLElement | null) {
    if (!container) return;

    // Target ONLY <pre> elements to avoid duplicate matches with <pre> and <code>
    const preElements = Array.from(container.querySelectorAll('pre'));

    for (const preElement of preElements) {
        if (preElement.getAttribute('data-mermaid-processed') === 'true') continue;

        const codeElement = preElement.querySelector('code') || preElement;
        const rawText = codeElement.textContent?.trim() || '';
        if (!rawText) continue;

        const isMermaidClass =
            preElement.classList.contains('language-mermaid') ||
            codeElement.classList.contains('language-mermaid');

        const isMermaidSyntax =
            /^(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph|mindmap|timeline)\b/m.test(
                rawText
            );

        if (isMermaidClass || isMermaidSyntax) {
            preElement.setAttribute('data-mermaid-processed', 'true');
            const id = `mermaid_${Date.now()}_${++idCounter}`;

            try {
                const { svg } = await mermaid.render(id, rawText);
                const wrapper = document.createElement('div');
                wrapper.className = 'mermaid-diagram-wrapper';
                wrapper.innerHTML = svg;
                preElement.replaceWith(wrapper);
            } catch (err) {
                console.error('Erro ao renderizar diagrama Mermaid:', err, '\nCódigo:', rawText);
                // Keep the preElement if render fails
            }
        }
    }
}
