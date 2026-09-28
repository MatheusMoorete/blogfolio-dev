import type { DictionaryTerm } from '../types/dictionary';

export const DICTIONARY_TERMS: DictionaryTerm[] = [
    {
        slug: 'window',
        term: 'window',
        pronunciation: '/ˈwɪn.doʊ/',
        category: 'Browser APIs',
        shortSummary: 'Objeto global do JavaScript no navegador. Representa o contexto da janela ou aba e expõe propriedades e APIs como document, location, history, timers e outras Web APIs.',
        keywords: ['window', 'globalThis', 'window object', 'navegador', 'browser window', 'objeto global'],
        seeAlso: ['dom', 'document', 'localstorage'],
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
        seeAlso: ['document', 'virtual-dom', 'window'],
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
        slug: 'closure',
        term: 'Closure',
        pronunciation: '/ˈkloʊ.ʒɚ/',
        category: 'JavaScript Core',
        shortSummary: 'A capacidade de uma função lembrar e acessar seu escopo léxico original, mesmo quando está sendo executada fora desse escopo.',
        keywords: ['closure', 'closures', 'escopo lexico', 'lexical scope', 'funcao'],
        seeAlso: ['hoisting', 'event-loop'],
        examples: [
            {
                title: 'Criando um contador com estado privado',
                language: 'javascript',
                code: `function criarContador() {
  let contagem = 0; // Variável protegida no escopo léxico
  
  return {
    incrementar: () => ++contagem,
    valor: () => contagem
  };
}

const contador = criarContador();
contador.incrementar(); // 1
contador.incrementar(); // 2
console.log(contador.valor()); // 2
// 'contagem' não pode ser acessada diretamente por fora!`,
                description: 'Encapsulamento de dados usando closures.'
            }
        ],
        content: `### O que é uma Closure?

Uma **Closure** ocorre quando uma função interna retém acesso às variáveis da função externa que a envolveu, mesmo depois que a função externa já retornou e encerrou sua execução.

Closures aparecem constantemente no frontend moderno e são importantes para entender callbacks, event handlers, módulos, factories e comportamentos como closures capturadas por Hooks do React.`
    },
    {
        slug: 'event-loop',
        term: 'Event Loop',
        pronunciation: '/ɪˈvent luːp/',
        category: 'JavaScript Core',
        shortSummary: 'Mecanismo do ambiente de execução que coordena quando tasks, microtasks, renderização e outros trabalhos podem ser processados enquanto o JavaScript executa na thread principal.',
        keywords: [
            'event loop',
            'call stack',
            'microtask',
            'task',
            'macrotask',
            'assincrono',
            'promise'
        ],
        seeAlso: ['closure', 'window'],
        examples: [
            {
                title: 'Ordem de execução no Event Loop',
                language: 'javascript',
                code: `console.log('1 - Síncrono');

setTimeout(() => {
  console.log('2 - task');
}, 0);

Promise.resolve().then(() => {
  console.log('3 - microtask');
});

console.log('4 - Síncrono');

// Saída final:
// 1 - Síncrono
// 4 - Síncrono
// 3 - microtask
// 2 - task`,
                description: 'Quando a task atual termina, as microtasks pendentes são processadas antes de o Event Loop avançar para outra task.'
            }
        ],
        content: `### O que é o Event Loop?

Na thread principal do navegador, o JavaScript executa código de forma sequencial através da **Call Stack**.

O **Event Loop** participa da coordenação entre essa execução e outros trabalhos do ambiente, como tasks, microtasks e oportunidades de renderização.

Uma forma simplificada de visualizar o fluxo é:

\`\`\`txt
task atual
    │
    ▼
JavaScript síncrono
    │
    ▼
microtask checkpoint
    │
    ▼
possível renderização
    │
    ▼
próxima task
\`\`\`

- **Microtasks:** Callbacks de \`Promise.then()\`, continuações de \`async/await\` e \`queueMicrotask()\` são processados como microtasks.
- **Tasks:** Timers como \`setTimeout()\` agendam trabalho para uma task futura.
- O termo *macrotask* é bastante utilizado informalmente para diferenciar essas tasks das microtasks, embora a terminologia das especificações da Web utilize principalmente *task*.`
    },
    {
        slug: 'virtual-dom',
        term: 'Virtual DOM (VDOM)',
        pronunciation: '/ˈvɜːr.tʃu.əl dɒm/',
        category: 'React & Frameworks',
        shortSummary: 'Representação em memória utilizada por bibliotecas como React para descrever a interface e comparar versões dessa representação durante o processo de reconciliação.',
        keywords: ['virtual dom', 'vdom', 'react', 'diffing', 'reconciliacao', 'reconciliation'],
        seeAlso: ['dom', 'hydration', 'usememo'],
        examples: [
            {
                title: 'Como o React enxerga um elemento JSX',
                language: 'javascript',
                code: `// Representação conceitual simplificada.
// Não corresponde necessariamente à estrutura interna usada pelo React.
const elementoConceitual = {
  type: 'button',
  props: {
    className: 'btn',
    children: 'Enviar',
  },
};`,
                description: 'Um elemento Virtual DOM é apenas um objeto JavaScript leve.'
            }
        ],
        content: `### O que é o Virtual DOM?

Bibliotecas como React representam a interface através de estruturas JavaScript em memória.

Quando estado ou propriedades mudam, uma nova representação pode ser produzida e comparada com a anterior durante o processo de **reconciliação**.

A partir dessa comparação, o framework determina quais alterações precisam ser aplicadas ao ambiente de renderização.

Manipulações do DOM não são necessariamente caras por si só. O custo depende do tipo e da quantidade de alterações realizadas e de operações do navegador como cálculo de estilos, layout e pintura.`
    },
    {
        slug: 'hydration',
        term: 'Hydration (Hidratação)',
        pronunciation: '/haɪˈdreɪ.ʃən/',
        category: 'React & Frameworks',
        shortSummary: 'Processo em que o JavaScript no cliente associa comportamento e estado a um HTML previamente renderizado, permitindo que a aplicação passe a interagir com aquela interface existente.',
        keywords: ['hydration', 'hidratacao', 'ssr', 'server side rendering', 'nextjs', 'react'],
        seeAlso: ['virtual-dom', 'window'],
        examples: [
            {
                title: 'O ciclo de vida da Hidratação',
                language: 'text',
                code: `[1] Servidor gera HTML
[2] Navegador recebe e renderiza o HTML inicial
[3] JavaScript necessário é carregado
[4] React inicia a hidratação
[5] Estado, lógica e handlers são associados à interface existente
[6] A interface passa a responder às interações controladas pela aplicação`,
                description: 'Passo a passo da hidratação em aplicações modernas.'
            }
        ],
        content: `### O que é Hidratação no Frontend?

Em aplicações com **Server-Side Rendering (SSR)** ou **Static Site Generation (SSG)**, o servidor envia ao navegador uma página HTML completa já pré-renderizada. Isso garante excelente indexação no Google (SEO) e exibição visual inicial rápida.

Entretanto, esse HTML inicial é estático: clicar em um botão não executa lógica interativa até que os manipuladores de evento JavaScript sejam associados a ele.

A **Hidratação** é o processo em que o código React do cliente percorre essa árvore HTML existente no navegador, conecta o Virtual DOM e associa os manipuladores de eventos e estados, tornando a interface ativa e interativa sem precisar recriar o HTML do zero.`
    },
    {
        slug: 'localstorage',
        term: 'localStorage',
        pronunciation: '/ˈloʊ.kəl ˈstɔːr.ɪdʒ/',
        category: 'Browser APIs',
        shortSummary: 'API síncrona de armazenamento do navegador que persiste pares chave-valor como strings dentro da origem da aplicação.',
        keywords: ['localstorage', 'sessionstorage', 'storage', 'web storage', 'persistência'],
        seeAlso: ['window'],
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
        slug: 'hoisting',
        term: 'Hoisting',
        pronunciation: '/ˈhɔɪ.stɪŋ/',
        category: 'JavaScript Core',
        shortSummary: 'Mecanismo de compilação do JavaScript no qual declarações de funções e variáveis são alocadas na memória antes da execução do código.',
        keywords: ['hoisting', 'var', 'let', 'const', 'temporal dead zone', 'tdz'],
        seeAlso: ['closure', 'event-loop'],
        examples: [
            {
                title: 'Hoisting de funções vs Temporal Dead Zone',
                language: 'javascript',
                code: `// Funções declaradas podem ser chamadas antes da linha em que aparecem:
dizerOla(); // Funciona perfeitamente!
function dizerOla() {
  console.log('Olá!');
}

// Com 'let' e 'const', a variável fica na Temporal Dead Zone (TDZ):
// console.log(idade); // ReferenceError: Cannot access 'idade' before initialization
const idade = 25;`,
                description: 'Diferença crucial entre declaração de função e variáveis modernas.'
            }
        ],
        content: `### O que é Hoisting?

O termo **Hoisting** (do inglês "içar" ou "elevar") descreve o comportamento onde a fase de criação de escopo do motor JavaScript registra todas as declarações de funções e variáveis antes de iniciar a execução linha por linha.

- **Function Declarations:** São totalmente içadas com seu corpo, podendo ser invocadas antes da definição.
- **\`var\`:** É içada com o valor inicial \`undefined\`.
- **\`let\` e \`const\`:** São içadas, mas permanecem na chamada **Temporal Dead Zone (TDZ)** até que sua inicialização seja alcançada, disparando \`ReferenceError\` se acessadas previamente.`
    },
    {
        slug: 'cors',
        term: 'CORS (Cross-Origin Resource Sharing)',
        pronunciation: '/kɔːrz/',
        category: 'Performance & Network',
        shortSummary: 'Mecanismo baseado em cabeçalhos HTTP que permite a servidores declarar quais outras origens podem acessar determinadas respostas através do navegador.',
        keywords: ['cors', 'cross-origin', 'origem', 'preflight', 'options', 'access-control-allow-origin'],
        seeAlso: ['window'],
        examples: [
            {
                title: 'Cabeçalho essencial enviado pelo backend',
                language: 'http',
                code: `// Resposta do servidor autorizando a origem do frontend:
Access-Control-Allow-Origin: https://meublog.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization`,
                description: 'Cabeçalhos HTTP que declaram as origens autorizadas para acessar os recursos.'
            }
        ],
        content: `### O que é CORS?

Navegadores aplicam a **Same-Origin Policy**, que restringe como documentos e scripts de uma origem podem acessar recursos de outra origem.

Uma origem é determinada principalmente por:

\`\`\`txt
protocolo + hostname + porta
\`\`\`

O **CORS** (*Cross-Origin Resource Sharing*) utiliza cabeçalhos HTTP para permitir determinadas interações entre origens diferentes.

Um detalhe importante é que um erro de CORS não significa necessariamente que a requisição nunca chegou ao servidor. Em várias situações, a requisição é enviada e o servidor responde, mas o navegador impede que o JavaScript da página tenha acesso à resposta porque os cabeçalhos CORS necessários não foram fornecidos.

Algumas requisições também exigem previamente uma requisição *preflight*, normalmente feita com o método \`OPTIONS\`.`
    },
    {
        slug: 'usememo',
        term: 'useMemo',
        pronunciation: '/juːz ˈmɛm.oʊ/',
        category: 'React & Frameworks',
        shortSummary: 'Hook do React que permite reutilizar um valor calculado entre renderizações enquanto suas dependências não mudarem.',
        keywords: ['usememo', 'memoization', 'performance', 'react hook', 'cache'],
        seeAlso: ['usecallback', 'virtual-dom'],
        examples: [
            {
                title: 'Otimizando filtragem pesada de dados',
                language: 'typescript',
                code: `// Sem useMemo: executaria a filtragem de 10.000 itens a cada render
const itensFiltrados = useMemo(() => {
  return listaEnorme.filter(item => 
    item.nome.toLowerCase().includes(busca.toLowerCase())
  );
}, [listaEnorme, busca]); // Recalcula apenas quando a lista ou a busca mudam`,
                description: 'Evitando cálculos desnecessários ao digitar ou renderizar outros estados.'
            }
        ],
        content: `### O que é o \`useMemo\`?

O \`useMemo\` pode evitar que determinado cálculo seja repetido em renders nos quais suas dependências permaneceram iguais.

Ele é uma ferramenta de otimização e não deve ser tratado como uma garantia semântica necessária para o funcionamento normal do componente.`
    },
    {
        slug: 'usecallback',
        term: 'useCallback',
        pronunciation: '/juːz ˈkɔːl.bæk/',
        category: 'React & Frameworks',
        shortSummary: 'Hook do React que permite reutilizar a mesma referência de uma função entre renderizações enquanto suas dependências não mudarem.',
        keywords: ['usecallback', 'referencia', 'react hook', 'react memo', 'performance'],
        seeAlso: ['usememo', 'closure'],
        examples: [
            {
                title: 'Mantendo a referência da função estável',
                language: 'typescript',
                code: `// A referência da função é preservada entre renders
const handleSalvar = useCallback((id: string) => {
  enviarParaApi(id, formValues);
}, [formValues]); // Recria apenas quando formValues mudar

// Permite que o componente filho evite renders desnecessários:
return <BotaoOtimizado onSalvar={handleSalvar} />;`,
                description: 'Garantindo igualdade referencial para componentes puros.'
            }
        ],
        content: `### O que é o \`useCallback\`?

O **\`useCallback\`** permite ao React reutilizar uma referência de função entre renderizações enquanto suas dependências permanecem iguais.

Isso pode ser útil quando a identidade referencial da função importa, por exemplo:

- ao passar callbacks para componentes memoizados;
- ao utilizar a função como dependência de outro Hook;
- ao interagir com APIs que dependem da mesma referência para registrar e remover callbacks.

Não é necessário envolver toda função em \`useCallback\`. Ele deve ser utilizado quando a estabilidade referencial realmente traz algum benefício.`
    },
    {
        slug: 'spa',
        term: 'SPA (Single Page Application)',
        pronunciation: '/ɛs piː eɪ/',
        category: 'Web Architecture',
        shortSummary: 'Aplicação web que carrega um único documento HTML no carregamento inicial e atualiza partes da interface dinamicamente via JavaScript sem recarregar a página inteira a cada transição de rota.',
        keywords: ['spa', 'single page application', 'roteamento', 'react router', 'client side routing'],
        seeAlso: ['window', 'dom', 'hydration'],
        examples: [
            {
                title: 'Roteamento no cliente com History API',
                language: 'javascript',
                code: `// Transição instantânea sem reload da página
window.history.pushState({ page: 'sobre' }, 'Sobre Mim', '/sobre');

// A aplicação intercepta e renderiza a tela correta na mesma página!`,
                description: 'A base do funcionamento de bibliotecas como React Router.'
            }
        ],
        content: `### O que é uma SPA?

Diferente de websites tradicionais onde cada link clicado solicita uma nova página HTML completa do servidor, uma **Single Page Application (SPA)** carrega a casca inicial da aplicação uma única vez.

A partir desse momento, todo o roteamento de telas, busca de dados e renderização ocorrem no navegador do cliente usando JavaScript e a **HTML5 History API**, proporcionando uma experiência de uso extremamente ágil, com transições instantâneas semelhantes às de aplicativos nativos de desktop.`
    },
    {
        slug: 'bundle',
        term: 'Bundle',
        pronunciation: '/ˈbʌn.dəl/',
        category: 'Performance & Network',
        shortSummary: 'Um ou mais arquivos de saída produzidos pelo processo de build a partir do grafo de módulos da aplicação, frequentemente com transformações como minificação, code splitting e tree shaking.',
        keywords: ['bundle', 'bundler', 'vite', 'webpack', 'tree shaking', 'minificacao'],
        seeAlso: ['spa', 'performance'],
        examples: [
            {
                title: 'Processo de Bundling',
                language: 'text',
                code: `src/
├── index.tsx
├── components/Navbar.tsx
├── lib/utils.ts
└── styles.css
    ↓ (Vite / Rollup / Terser)
dist/
├── assets/index-B7a9kL.js  (Minificado e otimizado)
└── assets/index-C3x1qZ.css (CSS limpo)`,
                description: 'Transformação de centenas de arquivos-fonte em um pacote de alta performance.'
            }
        ],
        content: `### O que é um Bundle no Frontend?

Durante o desenvolvimento, dividimos o projeto em dezenas ou centenas de pequenos arquivos, módulos ES (\`import/export\`) e bibliotecas de terceiros no \`node_modules\`.

O **Bundle** é o pacote final gerado por um empacotador (*bundler*, como Vite, Webpack, esbuild ou Turbopack). Ele realiza etapas vitais de engenharia de software:
- **Resolução de dependências:** Monta o grafo de importações.
- **Tree-Shaking:** Remove código morto (*dead-code*) que nunca é utilizado.
- **Minificação:** reduz o tamanho do código removendo espaços, comentários e encurtando identificadores quando possível.`
    }
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
            t.keywords.some((k) => k.toLowerCase() === q)
    );
};
