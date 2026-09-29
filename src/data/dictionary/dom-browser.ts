import type { DictionaryTerm } from '../../types/dictionary';

export const DOM_BROWSER_TERMS: DictionaryTerm[] = [
    {
        slug: 'window',
        term: 'window',
        pronunciation: '/ˈwɪn.doʊ/',
        category: 'Browser APIs',
        shortSummary: 'Objeto global do JavaScript no navegador. Representa o contexto da janela ou aba e expõe propriedades e APIs como document, location, history, timers e outras Web APIs.',
        keywords: ['window', 'globalThis', 'window object', 'navegador', 'browser window', 'objeto global'],
        seeAlso: ['dom', 'document', 'localstorage', 'web-worker'],
        examples: [
            {
                title: 'Acessando dimensões da viewport',
                language: 'javascript',
                code: `// Largura e altura da área visível do navegador
const largura = window.innerWidth;
const altura = window.innerHeight;

console.log(\`Viewport: \${largura}x\${altura}\`);`,
                description: 'Propriedades diretas de window úteis para cálculos responsivos.'
            },
            {
                title: 'Tratando SSR em React / Next / Vite',
                language: 'typescript',
                code: `// No servidor (Node.js/Bun), 'window' não existe!
// Forma segura de checar a existência antes de usar:
if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    console.log('Janela redimensionada');
  });
}`,
                description: 'Verificação essencial para evitar o temido ReferenceError: window is not defined.'
            }
        ],
        content: `### O que é o \`window\` no Frontend?

No ecossistema de desenvolvimento Web, o objeto **\`window\`** é o **objeto global padrão** quando o JavaScript é executado em um navegador. Ele representa a janela ou aba onde o documento atual está sendo exibido.

Em scripts clássicos executados no navegador, declarações globais feitas com \`var\` e algumas declarações de função podem criar propriedades em \`window\`.

Isso não acontece da mesma forma com \`let\`, \`const\` ou código executado como ES Module (\`<script type="module">\`).

---

### A Hierarquia no Navegador

\`\`\`
window (Objeto Global / Janela do Navegador)
├── document (A árvore DOM da página atual)
├── location (URL, redirecionamentos, protocolo, porta)
├── history (Histórico de navegação, pushState, back)
├── navigator (Informações do cliente, SO, permissões)
├── localStorage / sessionStorage (Armazenamento persistente)
└── APIs Web (fetch, setTimeout, requestAnimationFrame, alert)
\`\`\`

Muitas propriedades de \`window\` também ficam disponíveis como nomes globais no ambiente do navegador. Por isso, normalmente escrevemos:
- \`window.fetch()\` como \`fetch()\`.
- \`window.setTimeout()\` como \`setTimeout()\`.
- \`window.document\` como \`document\`.

---

### Principais Casos de Uso no Dia a Dia

1. **Manipulação e escuta de eventos globais:**
Detectar redimensionamento da janela (\`resize\`), rolagem de página (\`scroll\`), atalhos de teclado globais (\`keydown\`) ou perda de conexão (\`online\` / \`offline\`).

2. **Comunicação entre janelas/abas e iframes:**
Uso do método \`window.postMessage()\` para enviar dados com segurança entre origens diferentes ou iframes embutidos.

3. **Gerenciamento de Navegação:**
Leitura de \`window.location.pathname\`, recarregamento com \`window.location.reload()\` e controle do histórico via \`window.history\`.

4. **Agendamento de quadros de animação:**
Uso de \`window.requestAnimationFrame()\` para criar animações fluidas a 60fps/120fps sem sobrecarregar a thread principal.

---

### Pegadinhas e Cuidados Importantes

- **\`window\` em ambientes SSR:** durante renderização no servidor, \`window\` não existe. Quando o código realmente depende de uma API do navegador, ele deve ser executado apenas no cliente, por exemplo dentro de um efeito apropriado ou após verificar \`typeof window !== 'undefined'\`.
- **Vazamentos de Memória (Memory Leaks):** Ao registrar listeners em \`window.addEventListener()\`, lembre-se sempre de limpá-los (\`removeEventListener\`) na função de cleanup de componentes React, caso contrário eles continuarão rodando em segundo plano.
- **Poluição do Escopo Global:** Evite atribuir valores diretamente em \`window.minhaVariavel\`, pois isso quebra encapsulamento e pode causar colisões inesperadas entre bibliotecas de terceiros.`
    },
    {
        slug: 'dom',
        term: 'DOM (Document Object Model)',
        pronunciation: '/dɒm/',
        category: 'DOM & Web APIs',
        shortSummary: 'Representação estruturada de um documento HTML ou XML como uma árvore de objetos que pode ser consultada e modificada por APIs do navegador.',
        keywords: ['dom', 'document object model', 'arvore dom', 'dom tree', 'nós', 'elementos'],
        seeAlso: ['document', 'virtual-dom', 'window', 'reflow', 'repaint'],
        examples: [
            {
                title: 'Selecionando e alterando elemento no DOM',
                language: 'javascript',
                code: `// Busca elemento pelo seletor CSS
const titulo = document.querySelector('h1');

// Altera conteúdo e classe
titulo.textContent = 'Olá do JavaScript!';
titulo.classList.add('destaque');`,
                description: 'Acesso e manipulação direta de nós na árvore DOM.'
            }
        ],
        content: `### O que é o DOM?

O **DOM** (*Document Object Model*) é uma representação estruturada do documento carregado pelo navegador.

Quando o HTML é processado, o navegador constrói uma árvore de objetos que representa elementos, textos e outras partes do documento.

O JavaScript pode interagir com essa estrutura através das APIs do DOM.

Graças ao DOM, uma linguagem de script como JavaScript ganha recursos para:
- Ler e alterar textos ou atributos de qualquer tag HTML.
- Adicionar ou remover elementos da página em tempo real.
- Reagir a cliques, digitação e interações do usuário através de eventos.
- Modificar estilos e classes CSS dinamicamente.

---

### Diferença entre HTML e DOM

O HTML é apenas o **código-fonte textual** original entregue pelo servidor. O DOM é a **representação viva do documento mantida pelo navegador** em memória após o parser, o qual muda dinamicamente à medida que você interage com a página.`
    },
    {
        slug: 'document',
        term: 'document',
        pronunciation: '/ˈdɑː.kjə.mənt/',
        category: 'DOM & Web APIs',
        shortSummary: 'Propriedade de window que atua como o ponto de entrada principal para a árvore DOM da página web, expondo métodos de busca como querySelector e de criação como createElement.',
        keywords: ['document', 'window.document', 'documento', 'querySelector', 'createElement'],
        seeAlso: ['window', 'dom'],
        examples: [
            {
                title: 'Criando elementos dinamicamente',
                language: 'javascript',
                code: `const novoCard = document.createElement('div');
novoCard.className = 'card';
novoCard.innerHTML = '<h3>Card Criado</h3><p>Gerado via script.</p>';

document.body.appendChild(novoCard);`,
                description: 'Criação e inserção de nó filho no corpo da página.'
            }
        ],
        content: `### O que é o \`document\`?

O objeto **\`document\`** representa a página web carregada no navegador e serve como o principal ponto de entrada para consultar e modificar o documento através das APIs do DOM. Ele é uma propriedade do objeto \`window\` (\`window.document\`), mas pode ser acessado diretamente como uma variável global.

---

### Principais APIs do \`document\`

- **Seleção:** \`document.getElementById()\`, \`document.querySelector()\`, \`document.querySelectorAll()\`.
- **Criação:** \`document.createElement()\`, \`document.createTextNode()\`.
- **Informações da página:** \`document.title\`, \`document.cookie\`, \`document.readyState\`.
- **Fragmentos:** \`document.createDocumentFragment()\` permite montar uma árvore temporária de nós antes de inseri-la no documento.`
    },
    {
        slug: 'reflow',
        term: 'Reflow (Layout)',
        pronunciation: '/ˈriː.floʊ/',
        category: 'DOM & Web APIs',
        shortSummary: 'Processo no qual o navegador calcula a geometria, posições e dimensões exatas de cada nó visível na árvore de renderização.',
        aliases: ['Layout Thrashing', 'Recalculate Layout'],
        keywords: ['reflow', 'layout', 'layout thrashing', 'render tree', 'performance', 'forced synchronous layout'],
        seeAlso: ['repaint', 'critical-rendering-path', 'dom'],
        examples: [
            {
                title: 'Evitando Layout Thrashing',
                language: 'javascript',
                code: `// RUIM: Leitura e escrita intercaladas forçam múltiplos reflows síncronos
for (let i = 0; i < cards.length; i++) {
  const altura = cards[i].offsetHeight; // Leitura (força cálculo de layout)
  cards[i].style.height = (altura + 10) + 'px'; // Escrita (invalida layout)
}

// BOM: Leia tudo primeiro, depois escreva tudo de uma vez
const alturas = cards.map(c => c.offsetHeight);
cards.forEach((c, i) => {
  c.style.height = (alturas[i] + 10) + 'px';
});`,
                description: 'Separar leituras de escritas no DOM evita o temido Layout Thrashing.'
            }
        ],
        content: `### O que é Reflow (Layout)?

O **Reflow** (também chamado na especificação e nos devtools de **Layout**) é o passo do pipeline de renderização em que o navegador calcula as dimensões e a localização espacial exatas de todos os nós presentes na Render Tree.

Qualquer alteração na árvore que afete a geometria do documento dispara um Reflow:
- Adicionar ou remover elementos do DOM.
- Modificar dimensões (\`width\`, \`height\`, \`padding\`, \`margin\`, \`border\`).
- Alterar fontes ou tamanho de texto.
- Redimensionar a janela do navegador.

---

### O perigo do Layout Thrashing

Quando o JavaScript lê uma propriedade geométrica (\`offsetHeight\`, \`clientWidth\`, \`getBoundingClientRect()\`) logo após ter modificado o estilo de um elemento, o navegador não pode adiar o cálculo para o fim do frame: ele é forçado a parar tudo e recalcular a geometria síncrona imediatamente (*Forced Synchronous Layout*).

Repetir isso em loops congela a interface e derruba a taxa de quadros (FPS).`
    },
    {
        slug: 'repaint',
        term: 'Repaint',
        pronunciation: '/ˌriːˈpeɪnt/',
        category: 'DOM & Web APIs',
        shortSummary: 'Etapa em que o navegador redesenha os pixels na tela para elementos cuja aparência visual mudou sem alterar sua geometria ou posição.',
        aliases: ['Repintura'],
        keywords: ['repaint', 'repintura', 'paint', 'compositing', 'gpu', 'performance'],
        seeAlso: ['reflow', 'critical-rendering-path'],
        examples: [
            {
                title: 'Propriedades que disparam Repaint sem Reflow',
                language: 'javascript',
                code: `const card = document.getElementById('card');

// Dispara Repaint (não altera tamanho nem posição):
card.style.backgroundColor = '#1a1a1a';
card.style.color = '#ffffff';
card.style.visibility = 'hidden';

// DICA DE OURO: Usar transform e opacity evita tanto Reflow quanto Repaint,
// delegando a animação direto para a GPU na fase de Composição (Composite)!
card.style.transform = 'translateY(10px)';`,
                description: 'Propriedades puramente visuais apenas repintam pixels sem recalcular geometria.'
            }
        ],
        content: `### O que é Repaint?

O **Repaint** (ou Pintura) ocorre quando elementos visíveis na página sofrem alterações cosméticas que não afetam seu posicionamento geométrico ou tamanho na tela.

Exemplos de mudanças que disparam Repaint sem disparar Reflow:
- Alteração de \`color\`, \`background-color\`.
- Mudança em \`box-shadow\` ou \`text-shadow\`.
- \`visibility: hidden\` ou \`outline\`.

---

### A Regra de Ouro da Performance
- **Todo Reflow causa um Repaint subsequente**, pois qualquer alteração na posição ou formato do elemento exige que seus pixels sejam redesenhados.
- **Nem todo Repaint exige um Reflow**, tornando operações puramente visuais mais baratas computacionalmente.
- Alterações em propriedades como \`transform\` e \`opacity\` são tratadas na fase de **Composição (Composite)** diretamente pela GPU, sem passar por Reflow ou Repaint, sendo a escolha ideal para animações fluidas a 60fps.`
    },
    {
        slug: 'shadow-dom',
        term: 'Shadow DOM',
        pronunciation: '/ˈʃæd.oʊ dɒm/',
        category: 'DOM & Web APIs',
        shortSummary: 'Padrão das Web Components que provê encapsulamento estrito de árvore de elementos e estilos CSS isolados do restante do documento principal.',
        keywords: ['shadow dom', 'web components', 'custom elements', 'shadow root', 'encapsulamento', 'css scoping'],
        seeAlso: ['dom', 'document'],
        examples: [
            {
                title: 'Criando um elemento com Shadow Root fechado para estilos globais',
                language: 'javascript',
                code: `class MeuBotao extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    
    // O CSS abaixo NUNCA vaza para fora e estilos externos não o quebram!
    shadow.innerHTML = \`
      <style>
        button { background: #2563eb; color: #fff; border-radius: 4px; padding: 8px; }
      </style>
      <button><slot></slot></button>
    \`;
  }
}

customElements.define('meu-botao', MeuBotao);`,
                description: 'Estilos definidos dentro da Shadow Root são totalmente isolados do DOM global.'
            }
        ],
        content: `### O que é o Shadow DOM?

O **Shadow DOM** é um dos quatro pilares que compõem o padrão de **Web Components** (junto com Custom Elements, HTML Templates e ES Modules).

Em aplicações tradicionais, o CSS é global por padrão: qualquer regra escrita pode acidentalmente sobrescrever ou colidir com classes de componentes de terceiros.

O Shadow DOM resolve isso oferecendo uma árvore DOM encapsulada anexada a um elemento pai (chamado *shadow host*), através de uma **Shadow Root**:
- **Estilos isolados:** CSS declarado dentro da shadow root não vaza para fora nem é afetado por seletores globais da página (com exceção de variáveis CSS herdáveis).
- **DOM oculto:** \`document.querySelector()\` padrão não encontra nós dentro da shadow root se o modo for \`closed\`.`
    },
    {
        slug: 'event-bubbling',
        term: 'Event Bubbling',
        pronunciation: '/ɪˈvent ˈbʌb.lɪŋ/',
        category: 'DOM & Web APIs',
        shortSummary: 'Fase de propagação de eventos no DOM em que o evento sobe a partir do elemento alvo até o topo da árvore hierárquica (window).',
        aliases: ['Borbulhamento de Eventos'],
        keywords: ['event bubbling', 'bubbling', 'propagacao', 'stoppropagation', 'event target'],
        seeAlso: ['event-capturing', 'event-delegation'],
        examples: [
            {
                title: 'Interrompendo o borbulhamento com stopPropagation',
                language: 'javascript',
                code: `const pai = document.getElementById('pai');
const filho = document.getElementById('filho');

pai.addEventListener('click', () => {
  console.log('Clique captado no Pai!');
});

filho.addEventListener('click', (e) => {
  console.log('Clique no Filho!');
  // Impede que o clique suba para o elemento pai:
  e.stopPropagation();
});`,
                description: 'Sem stopPropagation, o listener do pai também seria disparado ao clicar no filho.'
            }
        ],
        content: `### O que é Event Bubbling?

O **Event Bubbling** (Borbulhamento de Eventos) é a terceira fase do ciclo de vida de um evento no DOM.

Quando uma interação ocorre (por exemplo, o usuário clica em um botão \`<button>\` que está dentro de uma \`<div>\` que está dentro de \`<main>\`):
1. O evento atinge o elemento disparador original (\`event.target\`).
2. Em seguida, ele "borbulha" para cima, disparando os listeners dos nós ancestrais na ordem: \`<button>\` $\to$ \`<div>\` $\to$ \`<main>\` $\to$ \`<body>\` $\to$ \`<html>\` $\to$ \`document\` $\to$ \`window\`.

---

### Nem todo evento borbulha!
A propriedade booleana \`event.bubbles\` indica se o evento propaga ou não. A maioria dos eventos de ponteiro (\`click\`, \`keydown\`) borbulha, mas eventos como \`focus\`, \`blur\`, \`mouseenter\` e \`mouseleave\` **não borbulham**.`
    },
    {
        slug: 'event-capturing',
        term: 'Event Capturing',
        pronunciation: '/ɪˈvent ˈkæp.tʃɚ.ɪŋ/',
        category: 'DOM & Web APIs',
        shortSummary: 'Primeira fase de propagação de eventos no DOM onde o evento desce do window pela árvore de nós até alcançar o elemento de destino.',
        aliases: ['Trickling', 'Fase de Captura'],
        keywords: ['event capturing', 'captura', 'propagacao', 'usecapture', 'addeventlistener'],
        seeAlso: ['event-bubbling', 'event-delegation'],
        examples: [
            {
                title: 'Registrando listener na fase de captura',
                language: 'javascript',
                code: `const container = document.getElementById('container');
const botao = document.getElementById('btn');

// Passando { capture: true } ou 'true' no 3º argumento:
container.addEventListener('click', () => {
  console.log('1. Container (Fase de Captura)');
}, true);

botao.addEventListener('click', () => {
  console.log('2. Botão (Target)');
});`,
                description: 'O listener em modo capture roda antes de o evento atingir o botão alvo.'
            }
        ],
        content: `### O que é Event Capturing?

O ciclo completo de propagação de eventos do modelo W3C é composto por 3 fases:
1. **Fase de Captura (Capture Phase):** O evento sai de \`window\` e desce pela hierarquia de nós do DOM até chegar ao pai do elemento alvo.
2. **Fase de Alvo (Target Phase):** O evento atinge o nó onde a interação ocorreu (\`event.target\`).
3. **Fase de Borbulhamento (Bubbling Phase):** O evento sobe de volta pela hierarquia até \`window\`.

Por padrão, chamadas de \`addEventListener('click', callback)\` registram o ouvinte para a **fase de borbulhamento**. Para escutar na descida (captura), é necessário passar a opção \`{ capture: true }\`.`
    },
    {
        slug: 'event-delegation',
        term: 'Event Delegation',
        pronunciation: '/ɪˈvent ˌdɛl.əˈɡeɪ.ʃən/',
        category: 'DOM & Web APIs',
        shortSummary: 'Padrão que aproveita o borbulhamento de eventos para anexar um único ouvinte em um nó ancestral em vez de ouvintes individuais em múltiplos filhos.',
        aliases: ['Delegação de Eventos'],
        keywords: ['event delegation', 'delegacao de eventos', 'bubbling', 'closest', 'performance dom'],
        seeAlso: ['event-bubbling', 'dom'],
        examples: [
            {
                title: 'Gerenciando cliques em lista dinâmica com um só listener',
                language: 'javascript',
                code: `const lista = document.getElementById('minha-lista');

lista.addEventListener('click', (event) => {
  // Procura se o clique ocorreu dentro de um item <li>
  const item = event.target.closest('li');
  if (!item || !lista.contains(item)) return;

  console.log('Item clicado:', item.dataset.id);
});`,
                description: 'Funciona perfeitamente mesmo para novos itens adicionados dinamicamente depois!'
            }
        ],
        content: `### O que é Event Delegation?

A **Delegação de Eventos** é uma técnica fundamental de performance e arquitetura no DOM.

Em vez de adicionar centenas de ouvintes de clique em cada \`<li>\` de uma lista de itens ou em cada botão de uma tabela:
1. Você registra **um único listener no elemento pai** container.
2. Quando um filho é clicado, o evento borbulha até o pai.
3. O listener analisa \`event.target\` (usando \`.closest('seletor')\`) para identificar exatamente qual elemento descendente foi acionado.

---

### Vantagens Principais
- **Economia maciça de memória:** Evita criar dezenas ou milhares de funções de callback no heap.
- **Suporte a nós dinâmicos:** Novos itens adicionados dinamicamente via AJAX ou estado são imediatamente cobertos sem necessidade de registrar novos listeners.`
    },
    {
        slug: 'critical-rendering-path',
        term: 'Critical Rendering Path (CRP)',
        pronunciation: '/ˈkrɪt.ɪ.kəl ˈrɛn.dər.ɪŋ pæθ/',
        category: 'DOM & Web APIs',
        shortSummary: 'Sequência de etapas obrigatórias que o navegador executa desde a chegada dos primeiros bytes de HTML até a pintura inicial dos pixels na tela.',
        aliases: ['Caminho Crítico de Renderização', 'CRP'],
        keywords: ['crp', 'critical rendering path', 'dom', 'cssom', 'render tree', 'fcp', 'performance'],
        seeAlso: ['dom', 'reflow', 'repaint'],
        examples: [
            {
                title: 'O fluxo do Critical Rendering Path',
                language: 'text',
                code: `1. Bytes HTML ──> DOM Tree (Árvore de Nós)
2. Bytes CSS  ──> CSSOM Tree (Árvore de Estilos)
3. DOM + CSSOM  ──> Render Tree (Apenas nós visíveis com estilos)
4. Layout (Reflow) ──> Geometria e coordenadas (largura, altura, x, y)
5. Paint (Repaint) ──> Rasterização dos pixels na tela
6. Composite       ──> Combinação de camadas na GPU`,
                description: 'As 6 etapas cruciais que determinam o tempo até o primeiro pixel visível.'
            }
        ],
        content: `### O que é o Critical Rendering Path?

O **Critical Rendering Path (CRP)** é o pipeline que o motor de renderização do navegador (como Blink no Chrome, WebKit no Safari ou Gecko no Firefox) percorre para converter documentos HTML, CSS e JavaScript em pixels funcionais na tela.

---

### Recursos Bloqueantes (*Render-Blocking Resources*)

Para construir a **Render Tree**, o navegador precisa tanto do DOM completo quanto do CSSOM:
- **O CSS é considerado render-blocking:** Enquanto todas as folhas de estilo externas vinculadas no \`<head>\` não terminarem o download e o parsing, a tela fica em branco.
- **O JavaScript clássico é parser-blocking:** Ao encontrar uma tag \`<script>\` normal, o navegador pausa o parsing do HTML para baixar e executar o script.

Otimizar o CRP envolve minificar CSS/JS, carregar scripts com \`defer\` ou \`async\` e incorporar o CSS Crítico (*Critical CSS*) diretamente inline.`
    },
    {
        slug: 'web-worker',
        term: 'Web Worker',
        pronunciation: '/wɛb ˈwɜːr.kɚ/',
        category: 'Browser APIs',
        shortSummary: 'Mecanismo que permite executar código JavaScript em threads de background separadas da thread principal da interface, sem bloquear o render ou cliques.',
        keywords: ['web worker', 'worker', 'multithreading', 'postmessage', 'background thread'],
        seeAlso: ['event-loop', 'window'],
        examples: [
            {
                title: 'Enviando trabalho pesado para uma thread paralela',
                language: 'javascript',
                code: `// Na thread principal:
const worker = new Worker('calculo-pesado.js');

worker.postMessage({ dados: [1, 2, 3, 4] });

worker.onmessage = function(evento) {
  console.log('Resultado processado sem travar a UI:', evento.data);
};

// Dentro de calculo-pesado.js:
self.onmessage = function(e) {
  const resultado = e.data.dados.map(x => x * 10);
  self.postMessage(resultado);
};`,
                description: 'A interface do usuário permanece 100% responsiva enquanto o cálculo corre em segundo plano.'
            }
        ],
        content: `### O que são Web Workers?

Em um ambiente de navegador padrão, todo o JavaScript, o cálculo de estilos, o layout e os eventos de interação do usuário disputam tempo de CPU na **mesma thread principal** (*main thread*).

Os **Web Workers** permitem a execução de scripts em threads em segundo plano reais do sistema operacional (*true background threads*), liberando a thread principal de gargalos de processamento.

---

### Limitações Importantes
Por questões de segurança e prevenção de condições de corrida de memória (*race conditions*):
- Workers **não têm acesso direto ao DOM**, ao objeto \`window\` ou a variáveis da thread principal.
- Eles se comunicam exclusivamente via mensagens assíncronas (\`postMessage\`), utilizando o algoritmo de Clonagem Estruturada (*Structured Clone Algorithm*) ou transferência de memória (\`ArrayBuffer\` / Transferables).`
    },
    {
        slug: 'intersection-observer',
        term: 'Intersection Observer',
        pronunciation: '/ˌɪn.tɚˈsɛk.ʃən əbˈzɝː.vɚ/',
        category: 'DOM & Web APIs',
        shortSummary: 'API nativa assíncrona que monitora quando um elemento do DOM entra ou sai do campo de visão da viewport ou de um elemento pai.',
        keywords: ['intersection observer', 'lazy loading', 'scroll', 'viewport', 'performance dom'],
        seeAlso: ['mutation-observer', 'dom'],
        examples: [
            {
                title: 'Lazy loading de imagens com IntersectionObserver',
                language: 'javascript',
                code: `const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src; // Carrega imagem só quando visível!
      obs.unobserve(img); // Para de observar após carregar
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));`,
                description: 'Substitui listeners manuais de scroll com alto ganho de performance.'
            }
        ],
        content: `### O que é o Intersection Observer?

Historicamente, detectar se um elemento estava visível na tela exigia registrar listeners de \`scroll\` e \`resize\` que invocavam métodos síncronos caros como \`Element.getBoundingClientRect()\`, provocando Reflow contínuo e engasgos na rolagem.

A **Intersection Observer API** resolve esse problema delegando a detecção diretamente para o motor do navegador de forma assíncrona.

O navegador só avisa o seu código através de um callback quando o elemento cruza um limiar de visibilidade pré-configurado (*threshold*).

---

### Casos Típicos de Aplicação
- **Carregamento sob demanda (Lazy Loading)** de imagens e vídeos.
- **Scroll Infinito:** Detectar quando o elemento de rodapé está prestes a aparecer para solicitar mais dados da API.
- **Métricas de Visualização:** Saber se anúncios ou banners promocionais foram realmente visualizados pelo usuário.`
    },
    {
        slug: 'mutation-observer',
        term: 'Mutation Observer',
        pronunciation: '/mjuːˈteɪ.ʃən əbˈzɝː.vɚ/',
        category: 'DOM & Web APIs',
        shortSummary: 'API que monitora alterações na estrutura, atributos ou nós filhos de elementos do DOM, notificando alterações em lote via microtasks.',
        keywords: ['mutation observer', 'dom mutations', 'dom watcher', 'microtask'],
        seeAlso: ['intersection-observer', 'dom', 'microtask'],
        examples: [
            {
                title: 'Observando mutações de classes e atributos',
                language: 'javascript',
                code: `const elementoAlvo = document.getElementById('meu-card');

const observer = new MutationObserver((mutationsList) => {
  for (const mutacao of mutationsList) {
    if (mutacao.type === 'attributes') {
      console.log(\`Atributo modificado: \${mutacao.attributeName}\`);
    }
  }
});

observer.observe(elementoAlvo, {
  attributes: true,
  childList: true,
  subtree: true
});`,
                description: 'Notifica modificações de atributos ou nós filhos sem travar a interface.'
            }
        ],
        content: `### O que é o Mutation Observer?

A **MutationObserver API** foi desenhada para substituir os obsoletos e performaticamente problemáticos *Mutation Events* (como \`DOMSubtreeModified\` e \`DOMNodeInserted\`).

Ela permite observar alterações específicas na árvore do DOM:
- Inserção ou remoção de nós filhos (\`childList\`).
- Alterações em atributos HTML (\`attributes\`).
- Modificações no texto interno dos nós (\`characterData\`).

---

### Execução via Microtasks
Diferente dos antigos eventos que disparavam de forma síncrona a cada pequena mudança, o \`MutationObserver\` agrega múltiplas alterações ocorridas em um mesmo tick e executa o callback em lote como uma **microtask**, garantindo estabilidade e excelente performance.`
    },
    {
        slug: 'localstorage',
        term: 'localStorage',
        pronunciation: '/ˈloʊ.kəl ˈstɔːr.ɪdʒ/',
        category: 'Browser APIs',
        shortSummary: 'API síncrona de armazenamento do navegador que persiste pares chave-valor como strings dentro da origem da aplicação.',
        keywords: ['localstorage', 'sessionstorage', 'storage', 'web storage', 'persistência'],
        seeAlso: ['window', 'sessionstorage', 'indexeddb'],
        examples: [
            {
                title: 'Salvando e recuperando objetos com JSON',
                language: 'javascript',
                code: `const usuario = { nome: 'Matheus', tema: 'retro-dark' };

// Salvar (sempre converta para string JSON)
localStorage.setItem('preferencias', JSON.stringify(usuario));

// Recuperar e converter de volta
const salvo = localStorage.getItem('preferencias');
if (salvo) {
  const dados = JSON.parse(salvo);
  console.log(dados.tema); // 'retro-dark'
}`,
                description: 'Trabalhando com objetos estruturados no localStorage.'
            }
        ],
        content: `### O que é o \`localStorage\`?

O **\`localStorage\`** faz parte da especificação Web Storage API e fornece um banco de dados simples baseado em chave-valor integrado em todos os navegadores modernos.

Os dados gravados no \`localStorage\` não possuem uma expiração automática definida pela API. Em condições normais permanecem armazenados até serem removidos pela aplicação, pelo usuário ou por políticas do navegador.

---

### Limitações e Boas Práticas

- **Valores são armazenados como strings:** estruturas como objetos e arrays geralmente são serializadas com \`JSON.stringify()\` e reconstruídas com \`JSON.parse()\`.
- **Operação Síncrona:** Leituras e escritas bloqueiam a thread principal do navegador. Não utilize para grandes volumes de dados (nesse caso prefira IndexedDB).
- **Inseguro para dados sensíveis:** Qualquer script na página (incluindo dependências npm ou ataques XSS) tem acesso irrestrito ao \`localStorage\`. Nunca armazene senhas, tokens de autenticação críticos ou dados confidenciais nele.`
    },
    {
        slug: 'sessionstorage',
        term: 'sessionStorage',
        pronunciation: '/ˈsɛʃ.ən ˈstɔːr.ɪdʒ/',
        category: 'Browser APIs',
        shortSummary: 'Mecanismo síncrono de armazenamento em chave-valor do navegador cujo ciclo de vida e escopo estão estritamente atrelados à aba da sessão ativa.',
        keywords: ['sessionstorage', 'localstorage', 'web storage', 'sessao'],
        seeAlso: ['localstorage', 'indexeddb', 'window'],
        examples: [
            {
                title: 'Armazenando dados de etapa de formulário na sessão',
                language: 'javascript',
                code: `// Salva o passo atual do checkout:
sessionStorage.setItem('etapaCheckout', '2');

// Lê o valor:
const etapa = sessionStorage.getItem('etapaCheckout');

// Ao fechar a aba, esses dados são automaticamente descartados pelo browser!`,
                description: 'Os dados persistem após recarregar a página (F5), mas são destruídos ao fechar a aba.'
            }
        ],
        content: `### O que é o sessionStorage?

O **sessionStorage** compartilha da mesma interface da Web Storage API que o \`localStorage\` (\`setItem\`, \`getItem\`, \`removeItem\`, \`clear\`), mas possui duas regras de isolamento fundamentais:

1. **Ciclo de vida por aba:** Os dados persistem durante recarregamentos de página (*page reload*), mas são **completamente apagados** no instante em que o usuário fecha a aba ou janela.
2. **Isolamento entre abas:** Duas abas abertas simultaneamente na mesmíssima URL **não compartilham** o mesmo \`sessionStorage\`. Cada contexto de navegação possui sua própria cópia privada.

---

### Quando preferir sessionStorage sobre localStorage?
- Dados temporários de formulários multi-etapas.
- Filtros ou estado de paginação que devem ser isolados se o usuário abrir múltiplos produtos em abas diferentes.`
    },
    {
        slug: 'indexeddb',
        term: 'IndexedDB',
        pronunciation: '/ˈɪn.dɛkst diː biː/',
        category: 'Browser APIs',
        shortSummary: 'Banco de dados NoSQL assíncrono, transacional e orientado a objetos embutido no navegador para armazenar grandes volumes de dados estruturados.',
        keywords: ['indexeddb', 'banco de dados', 'offline', 'storage', 'nosql', 'transactions'],
        seeAlso: ['localstorage', 'service-worker', 'window'],
        examples: [
            {
                title: 'Abrindo conexão com banco IndexedDB',
                language: 'javascript',
                code: `const requisicao = indexedDB.open('MeuAppDB', 1);

requisicao.onupgradeneeded = function(e) {
  const db = e.target.result;
  // Cria uma "tabela" (Object Store) com chave primária 'id':
  db.createObjectStore('artigos', { keyPath: 'id' });
};

requisicao.onsuccess = function(e) {
  console.log('Conexão aberta com sucesso!');
};`,
                description: 'Suporta armazenamento de objetos JavaScript complexos, blobs e arquivos de mídia.'
            }
        ],
        content: `### O que é o IndexedDB?

Enquanto o \`localStorage\` é limitado a aproximadamente 5MB por origem e opera de forma estritamente síncrona bloqueando a thread principal, o **IndexedDB** é um sistema de banco de dados robusto no cliente:

- **Assíncrono:** Todas as operações ocorrem via callbacks ou Promises, sem travar a interface do usuário.
- **Orientado a Objetos (NoSQL):** Armazena diretamente objetos JavaScript, arrays, arquivos binários (\`Blob\`, \`File\`) e \`ArrayBuffer\`.
- **Transacional:** Toda operação de leitura ou escrita ocorre dentro de uma transação com garantias ACID.
- **Suporte a Índices:** Permite criar índices sobre propriedades de objetos para buscas rápidas.
- **Alta Capacidade:** Capaz de armazenar gigabytes de dados, condicionado ao espaço em disco livre da máquina do usuário.`
    },
    {
        slug: 'handler',
        term: 'Handler (Event Handler)',
        pronunciation: '/ˈhænd.lɚ/',
        category: 'DOM & Web APIs',
        shortSummary: 'Função de callback registrada para responder e processar um evento específico disparado pelo usuário, pelo navegador ou pelo sistema.',
        aliases: ['Event Handler', 'Manipulador de Eventos', 'Callback de Evento', 'Event Listener'],
        keywords: ['handler', 'event handler', 'event listener', 'addeventlistener', 'callback', 'onclick', 'event'],
        seeAlso: ['event-bubbling', 'syntheticevent', 'closure', 'usecallback'],
        examples: [
            {
                title: 'Manipulador de eventos no DOM nativo e no React',
                language: 'javascript',
                code: `// No DOM Nativo:
function handleClick(event) {
  console.log('Elemento clicado:', event.target);
}
const botao = document.querySelector('button');
botao.addEventListener('click', handleClick);

// No React (com prop de evento em JSX):
function Formulario() {
  const handleSubmit = (event) => {
    event.preventDefault(); // Impede recarregamento da página
    console.log('Dados processados com sucesso!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Enviar</button>
    </form>
  );
}`,
                description: 'O handler recebe o objeto de evento e define a lógica a ser executada.'
            }
        ],
        content: `### O que é um Handler?

No desenvolvimento de software orientado a eventos (*Event-Driven Architecture*), um **Handler** (ou **Event Handler** / Manipulador de Eventos) é uma função de callback encarregada de interceptar e responder a uma notificação de evento.

No ambiente do navegador, interações humanas e rotinas do sistema geram eventos continuamente:
- Cliques do mouse (\`click\`, \`dblclick\`).
- Entradas de teclado (\`keydown\`, \`keyup\`).
- Movimentações de rolagem e redimensionamento (\`scroll\`, \`resize\`).
- Alterações de formulário (\`input\`, \`change\`, \`submit\`).
- Ciclo de vida da rede e mídia (\`load\`, \`error\`, \`play\`).

O handler é o código que traduz essas interações físicas ou mensagens do sistema em transformações de estado na aplicação.

---

### Anatomia do Objeto Event

Ao ser acionado pelo motor do navegador, o handler recebe automaticamente como primeiro parâmetro uma instância de **\`Event\`** (ou **\`SyntheticEvent\`** no caso do React), expondo métodos e propriedades vitais:

- **\`event.target\`:** O elemento exato que originou o evento (onde o usuário clicou).
- **\`event.currentTarget\`:** O elemento ao qual o handler está atualmente vinculado (relevante ao usar *Event Delegation*).
- **\`event.preventDefault()\`:** Cancela o comportamento nativo padrão que o navegador executaria (por exemplo, submeter um formulário com reload ou abrir um link).
- **\`event.stopPropagation()\`:** Interrompe a propagação do evento nas fases de *bubbling* ou *capturing*.

---

### Formas de Associação

1. **\`addEventListener()\` (Padrão Recomendado):** Permite associar múltiplos handlers independentes ao mesmo evento sem sobrescrever comportamentos prévios.
2. **Propriedade DOM (\`element.onclick = handler\`):** Sobrescreve qualquer manipulador anterior atribuído àquela propriedade.
3. **Props em JSX (\`onClick={handleClick}\`):** Padrão declarativo do React, que internamente gerencia a delegação dos listeners no container raiz.

---

### Cuidados de Engenharia e Boas Práticas

- **Limpeza de Listeners (Memory Leaks):** Handlers registrados manualmente em \`window\` ou elementos globais devem ser explicitamente removidos com \`removeEventListener()\` na desmontagem de componentes (função de retorno de \`useEffect\`). Caso contrário, referências retidas nas closures do handler impedem o Garbage Collector de liberar a memória.
- **Identidade Referencial:** No React, passar handlers anônimos inline (\`onClick={() => ...}\`) para componentes filhos memoizados com \`React.memo\` causa re-renderizações contínuas. A estabilização de referência é alcançada encapsulando a função com o hook \`useCallback\`.`
    },
    {
        slug: 'history-api',
        term: 'History API',
        pronunciation: '/ˈhɪs.tɚ.i eɪ.piː.aɪ/',
        category: 'Browser APIs',
        shortSummary: 'Interface do navegador que permite interagir com a pilha de histórico da sessão da aba, adicionando, modificando ou percorrendo entradas sem recarregar o documento.',
        aliases: ['window.history', 'Session History API', 'History Interface'],
        keywords: ['history api', 'history', 'pushstate', 'replacestate', 'back', 'forward', 'spa', 'session history'],
        seeAlso: ['popstate', 'spa', 'browsing-context', 'client-side-routing'],
        examples: [
            {
                title: 'Manipulando entradas de histórico com pushState e replaceState',
                language: 'javascript',
                code: `// Adiciona uma nova entrada à pilha (o botão Voltar fica ativo):
history.pushState({ productId: 42 }, '', '/produtos/42');

// Substitui a entrada atual (ótimo para filtros sem poluir o histórico):
history.replaceState({ sort: 'preco-asc' }, '', '/produtos/42?sort=preco-asc');

// Navega programaticamente pela pilha existente:
history.back();    // Equivalente a clicar no botão Voltar
history.forward(); // Equivalente a clicar no botão Avançar
history.go(-2);    // Volta 2 páginas de uma só vez`,
                description: 'Nenhuma dessas operações dispara recarregamento de página nem faz requisição HTTP de documento.'
            }
        ],
        content: `### O que é a History API?

A **History API** é a interface do objeto \`window.history\` que permite a um script interagir com a pilha de histórico de navegação da sessão (*session history stack*) associada ao contexto de navegação (a aba atual).

Em aplicações tradicionais (Multi-Page Applications), cada entrada no histórico correspondia a um documento HTML totalmente novo baixado do servidor. Em SPAs modernas, a History API é o pilar que viabiliza o **Roteamento no Cliente** (*Client-side Routing*).

---

### Os Dois Grupos de Operações

É essencial separar as operações da History API em duas naturezas distintas:

1. **Alterar o histórico (Mutações):**
   - \`history.pushState(state, unused, url?)\`: Insere uma nova entrada no topo da pilha do histórico e atualiza a barra de endereço da URL.
   - \`history.replaceState(state, unused, url?)\`: Atualiza os dados de estado e/ou a URL da entrada atual sem criar um novo degrau na pilha.
   - **Atenção:** Nenhuma das duas dispara o evento \`popstate\`!

2. **Percorrer o histórico (Travessias / Traversal):**
   - \`history.back()\`, \`history.forward()\`, \`history.go(delta)\`.
   - Navega entre entradas preexistentes na pilha da aba. Essas travessias disparam o evento \`popstate\` no \`window\`.

---

### O Objeto de Estado (\`state\`) e a Mesma Origem

- **Armazenamento Serializado:** O primeiro parâmetro (\`state\`) aceita qualquer estrutura de dados compatível com o algoritmo de Clonagem Estruturada (*Structured Clone*). Ele fica armazenado pelo navegador junto àquela entrada específica do histórico, mesmo após F5.
- **Restrição de Mesma Origem:** O parâmetro \`url\` deve obrigatoriamente pertencer à mesma origem (protocolo, domínio e porta) da página atual. Tentar passar uma URL de outro domínio lança uma exceção de segurança imediata: \`SecurityError\` (DOMException).`
    },
    {
        slug: 'popstate',
        term: 'popstate (PopStateEvent)',
        pronunciation: '/pɑːp steɪt/',
        category: 'Browser APIs',
        shortSummary: 'Evento disparado no window quando o histórico ativo da sessão é percorrido para outra entrada existente (como ao clicar em Voltar ou Avançar no navegador).',
        aliases: ['PopStateEvent', 'Evento popstate', 'window.onpopstate'],
        keywords: ['popstate', 'popstateevent', 'history traversal', 'voltar avancar', 'history api', 'navegacao spa'],
        seeAlso: ['history-api', 'client-side-routing', 'window'],
        examples: [
            {
                title: 'Ouvindo travessias de histórico com popstate',
                language: 'javascript',
                code: `window.addEventListener('popstate', (event) => {
  console.log('Nova URL atual:', location.pathname);
  console.log('Estado recuperado da entrada:', event.state);
  
  // Roteadores utilizam esse evento para renderizar a tela anterior!
});`,
                description: 'Disparado quando o usuário clica nos botões de navegação do browser.'
            }
        ],
        content: `### O que é o evento popstate?

O evento **\`popstate\`** é disparado na janela global (\`window\`) exclusivamente quando a entrada ativa do histórico de navegação da sessão muda em decorrência de uma **travessia de histórico** (*history traversal*).

Exemplos de ações que disparam \`popstate\`:
- O usuário clica no botão **Voltar** ou **Avançar** do navegador.
- O código JavaScript executa \`history.back()\`, \`history.forward()\` ou \`history.go(n)\`.
- Ocorre alteração de âncora de fragmento hash na URL (em certos cenários onde não há \`hashchange\` dedicado).

---

### O Grande Mito: popstate NÃO significa "a URL mudou"

Um dos equívocos conceituais mais comuns no frontend é tratar \`popstate\` como um evento genérico de mudança de rota.

> [!IMPORTANT]
> Chamadas programáticas a \`history.pushState()\` e \`history.replaceState()\` **NÃO disparam o evento \`popstate\`**.

Se um sistema de telemetria ou analytics tentar monitorar as mudanças de rota de uma SPA ouvindo apenas \`window.addEventListener('popstate')\`, ele perderá praticamente todas as navegações iniciadas por cliques em links de roteadores como React Router ou Vue Router.

Para observar todas as transições de forma agnóstica de framework, é necessário combinar a escuta de \`popstate\` com a interceptação (*monkey-patching*) de \`pushState\` e \`replaceState\`.`
    },
    {
        slug: 'crypto-randomuuid',
        term: 'crypto.randomUUID()',
        pronunciation: '/ˈkrɪp.toʊ ˈræn.dəm juː.juː.aɪˈdiː/',
        category: 'Browser APIs',
        shortSummary: 'Método nativo da Web Crypto API que gera identificadores universais únicos v4 (UUIDs) utilizando o gerador de números pseudoaleatórios criptograficamente seguro do sistema.',
        aliases: ['crypto.randomUUID', 'Web Crypto API', 'UUID v4'],
        keywords: ['crypto', 'randomuuid', 'uuid', 'uuid v4', 'web crypto api', 'identificador unico', 'tabid'],
        seeAlso: ['sessionstorage', 'window'],
        examples: [
            {
                title: 'Gerando identificador único de sessão ou aba',
                language: 'javascript',
                code: `// Gera um UUID v4 padrão RFC 4122 nativamente:
const idAba = crypto.randomUUID();
console.log(idAba); 
// Exemplo de saída: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"`,
                description: 'Nativo do navegador, sem precisar instalar pacotes como "uuid" do npm.'
            }
        ],
        content: `### O que é o crypto.randomUUID()?

Historicamente, gerar um UUID (Universally Unique Identifier) no frontend exigia instalar pacotes de terceiros no \`node_modules\` (como a popular biblioteca \`uuid\`, que aumentava o tamanho do bundle) ou usar funções rudimentares baseadas em \`Math.random()\`.

O método nativo **\`crypto.randomUUID()\`**, padronizado na **Web Crypto API**, gera diretamente uma string de 36 caracteres contendo um **UUID versão 4** em conformidade rigorosa com a RFC 4122.

---

### Por que NÃO usar Math.random()?
- **\`Math.random()\`** é um PRNG pseudo-aleatório simples e previsível. Ele não foi desenhado para segurança, sofrendo de colisões frequentes e suscetibilidade à previsão matemática reversa.
- **\`crypto.randomUUID()\`** utiliza o CSPRNG (*Cryptographically Secure Pseudo-Random Number Generator*) fornecido pelo próprio sistema operacional subjacente, garantindo entropia máxima para identificadores de sessão (\`tabId\`), correlação de rastros de observabilidade e chaves únicas no cliente.`
    }
];
