    import type { DictionaryTerm } from '../types/dictionary';

    export const DICTIONARY_TERMS: DictionaryTerm[] = [
        {
            slug: 'window',
            term: 'window',
            pronunciation: '/ˈwɪn.doʊ/',
            category: 'Browser APIs',
            shortSummary: 'O objeto global no ambiente do navegador que representa a janela ou aba aberta. É a raiz de onde partem o DOM (document), APIs Web como fetch, timers, history e o armazenamento local.',
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

    Em JavaScript client-side, qualquer variável declarada com \`var\` no escopo global ou qualquer função global passa a ser, por padrão, uma propriedade de \`window\`.

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

    Como \`window\` é o escopo global, você não precisa prefixar suas chamadas:
    - \`window.fetch()\` pode ser chamado apenas como \`fetch()\`.
    - \`window.setTimeout()\` pode ser chamado apenas como \`setTimeout()\`.
    - \`window.document\` pode ser chamado apenas como \`document\`.

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

    - **ReferenceError em SSR (Server-Side Rendering):** Frameworks como Next.js, Remix ou SSR no Vite executam código no Node.js durante o build/renderização. Como o Node não possui interface gráfica de navegador, chamar \`window\` causa erro. Sempre use \`useEffect\` no React ou \`typeof window !== 'undefined'\`.
    - **Vazamentos de Memória (Memory Leaks):** Ao registrar listeners em \`window.addEventListener()\`, lembre-se sempre de limpá-los (\`removeEventListener\`) na função de cleanup de componentes React, caso contrário eles continuarão rodando em segundo plano.
    - **Poluição do Escopo Global:** Evite atribuir valores diretamente em \`window.minhaVariavel\`, pois isso quebra encapsulamento e pode causar colisões inesperadas entre bibliotecas de terceiros.`
        },
        {
            slug: 'dom',
            term: 'DOM (Document Object Model)',
            pronunciation: '/dɒm/',
            category: 'DOM & Web APIs',
            shortSummary: 'Interface de programação orientada a objetos que representa documentos HTML ou XML como uma árvore hierárquica de nós, permitindo ao JavaScript alterar estrutura, estilo e conteúdo.',
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

    O **DOM** (*Document Object Model*) é a ponte entre o seu código HTML bruto e o JavaScript que roda no navegador. Quando o navegador baixa o arquivo HTML, o motor de renderização analisa cada tag e constrói uma árvore na memória formada por objetos chamados **Nós** (*Nodes*).

    Graças ao DOM, uma linguagem de script como JavaScript ganha superpoderes para:
    - Ler e alterar textos ou atributos de qualquer tag HTML.
    - Adicionar ou remover elementos da página em tempo real.
    - Reagir a cliques, digitação e interações do usuário através de eventos.
    - Modificar estilos e classes CSS dinamicamente.

    ---

    ### Diferença entre HTML e DOM

    O HTML é apenas o **código-fonte textual** original entregue pelo servidor. O DOM é o **modelo vivo e reativo** que o navegador mantém em memória após o parser, o qual muda dinamicamente à medida que você interage com a página.`
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

    O objeto **\`document\`** representa a página web carregada no navegador e serve como a porta de entrada para qualquer manipulação no DOM. Ele é uma propriedade do objeto \`window\` (\`window.document\`), mas pode ser acessado diretamente como uma variável global.

    ---

    ### Principais APIs do \`document\`

    - **Seleção:** \`document.getElementById()\`, \`document.querySelector()\`, \`document.querySelectorAll()\`.
    - **Criação:** \`document.createElement()\`, \`document.createTextNode()\`.
    - **Informações da página:** \`document.title\`, \`document.cookie\`, \`document.readyState\`.
    - **Fragmentos de performance:** \`document.createDocumentFragment()\` para inserção de múltiplos elementos em lote sem causar múltiplos reflows.`
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

    No frontend moderno, closures são a base do funcionamento de **Hooks no React** (como \`useState\` e \`useEffect\`), de *currying*, de fábricas de funções (*factories*) e de módulos com dados privados.`
        },
        {
            slug: 'event-loop',
            term: 'Event Loop',
            pronunciation: '/ɪˈvent luːp/',
            category: 'JavaScript Core',
            shortSummary: 'O mecanismo que permite ao JavaScript executar tarefas assíncronas e não-bloqueantes usando uma única thread, coordenando a Call Stack, a Microtask Queue (Promises) e a Macrotask Queue (Timers/Eventos).',
            keywords: ['event loop', 'call stack', 'microtask', 'macrotask', 'assincrono', 'promisse'],
            seeAlso: ['closure', 'window'],
            examples: [
                {
                    title: 'Ordem de execução no Event Loop',
                    language: 'javascript',
                    code: `console.log('1 - Síncrono');

    setTimeout(() => {
    console.log('2 - Macrotask (setTimeout)');
    }, 0);

    Promise.resolve().then(() => {
    console.log('3 - Microtask (Promise)');
    });

    console.log('4 - Síncrono');

    // Saída final:
    // 1 - Síncrono
    // 4 - Síncrono
    // 3 - Microtask (Promise)
    // 2 - Macrotask (setTimeout)`,
                    description: 'Microtasks (Promises) têm prioridade absoluta sobre macrotasks (Timers).'
                }
            ],
            content: `### O que é o Event Loop?

    O JavaScript é uma linguagem de **thread única** (*single-threaded*), o que significa que ele só pode executar uma instrução por vez na sua pilha de execução (*Call Stack*).

    O **Event Loop** é o orquestrador que monitora continuamente se a Call Stack está vazia. Assim que ela esvazia, ele primeiro drena todas as tarefas da fila de **Microtasks** (como callbacks de \`Promise\`, \`queueMicrotask\`) e, em seguida, busca a próxima tarefa da fila de **Macrotasks** (como \`setTimeout\`, eventos de clique e requisições I/O).`
        },
        {
            slug: 'virtual-dom',
            term: 'Virtual DOM (VDOM)',
            pronunciation: '/ˈvɜːr.tʃu.əl dɒm/',
            category: 'React & Frameworks',
            shortSummary: 'Representação em memória do DOM real como uma árvore de objetos JavaScript. Permite ao framework comparar versões anteriores e atuais (diffing) para aplicar apenas as mutações estritamente necessárias no navegador.',
            keywords: ['virtual dom', 'vdom', 'react', 'diffing', 'reconciliacao', 'reconciliation'],
            seeAlso: ['dom', 'hydration', 'usememo'],
            examples: [
                {
                    title: 'Como o React enxerga um elemento JSX',
                    language: 'javascript',
                    code: `// JSX escrito pelo desenvolvedor:
    const elemento = <button className="btn">Enviar</button>;

    // Objeto Virtual DOM resultante (aproximado):
    const vdomNode = {
    type: 'button',
    props: {
        className: 'btn',
        children: 'Enviar'
    }
    };`,
                    description: 'Um elemento Virtual DOM é apenas um objeto JavaScript leve.'
                }
            ],
            content: `### O que é o Virtual DOM?

    Manipular o DOM real do navegador diretamente é uma operação custosa computacionalmente, pois cada alteração pode forçar o navegador a recalcular estilos (*recalculate styles*), recalcular posições (*reflow/layout*) e redesenhar pixels na tela (*repaint*).

    Para contornar esse gargalo, bibliotecas como o **React** criaram o conceito de **Virtual DOM**:
    1. Quando o estado da aplicação muda, uma nova árvore virtual de objetos JavaScript é criada.
    2. O algoritmo de reconciliação compara a nova árvore com a anterior (**Diffing**).
    3. Somente as partes que realmente mudaram são enviadas em lote para serem atualizadas no DOM real do navegador (**Patch/Commit**).`
        },
        {
            slug: 'hydration',
            term: 'Hydration (Hidratação)',
            pronunciation: '/haɪˈdreɪ.ʃən/',
            category: 'React & Frameworks',
            shortSummary: 'O processo em que o JavaScript client-side assume o controle do HTML estático gerado previamente pelo servidor (SSR) ou gerador de sites (SSG), anexando listeners de evento e inicializando o estado reativo.',
            keywords: ['hydration', 'hidratacao', 'ssr', 'server side rendering', 'nextjs', 'react'],
            seeAlso: ['virtual-dom', 'window'],
            examples: [
                {
                    title: 'O ciclo de vida da Hidratação',
                    language: 'text',
                    code: `[1] Servidor gera HTML estático com texto e botões
    [2] Navegador baixa e exibe o HTML (FCP rápido, mas sem interatividade)
    [3] Navegador baixa o bundle JavaScript
    [4] React executa o processo de "Hydration"
    [5] Listeners (onClick, onSubmit) são conectados
    [6] A página agora é totalmente reativa (TTI alcançado)`,
                    description: 'Passo a passo da hidratação em aplicações modernas.'
                }
            ],
            content: `### O que é Hidratação no Frontend?

    Em aplicações com **Server-Side Rendering (SSR)** ou **Static Site Generation (SSG)**, o servidor envia ao navegador uma página HTML completa já pré-renderizada. Isso garante excelente indexação no Google (SEO) e exibição visual instantânea.

    Entretanto, esse HTML inicial é estático ("seco"): clicar em um botão não faz nada porque nenhum manipulador de evento JavaScript foi registrado nele ainda.

    A **Hidratação** é o momento em que o código React do cliente percorre essa árvore HTML existente no navegador, conecta o Virtual DOM e "liga os fios" dos eventos e estados, tornando a página viva e interativa sem precisar recriar o HTML do zero.`
        },
        {
            slug: 'localstorage',
            term: 'localStorage',
            pronunciation: '/ˈloʊ.kəl ˈstɔːr.ɪdʒ/',
            category: 'Browser APIs',
            shortSummary: 'Mecanismo de armazenamento síncrono no navegador que guarda pares chave-valor no formato de string, com capacidade aproximada de 5MB por domínio e sem prazo de validade.',
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

    Os dados gravados no \`localStorage\` persistem indefinidamente: eles continuam salvos mesmo se o usuário fechar a aba, reiniciar o navegador ou reiniciar o computador, até que sejam limpos pelo usuário ou pelo código via \`localStorage.clear()\`.

    ---

    ### Limitações e Boas Práticas

    - **Armazena apenas Strings:** Qualquer objeto ou número deve ser serializado com \`JSON.stringify()\` ao salvar e desserializado com \`JSON.parse()\` ao ler.
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
            shortSummary: 'Mecanismo de segurança do navegador que usa cabeçalhos HTTP para autorizar ou bloquear que uma aplicação frontend faça requisições para uma API hospedada em uma origem diferente.',
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
                    description: 'Cabeçalhos HTTP que liberam o frontend para consumir a API.'
                }
            ],
            content: `### O que é CORS?

    Por padrão de segurança, navegadores implementam a **Same-Origin Policy** (Política de Mesma Origem): um script rodando em \`http://meusite.com\` só pode consumir APIs da mesma origem (mesmo protocolo, domínio e porta).

    O **CORS** (*Cross-Origin Resource Sharing*) é o padrão W3C que permite relaxar essa restrição de forma controlada. Se o backend responder com o cabeçalho \`Access-Control-Allow-Origin\`, o navegador entrega os dados da resposta para o JavaScript; caso contrário, a requisição é bloqueada pelo próprio navegador por motivos de segurança.`
        },
        {
            slug: 'usememo',
            term: 'useMemo',
            pronunciation: '/juːz ˈmɛm.oʊ/',
            category: 'React & Frameworks',
            shortSummary: 'Hook do React que memoriza o resultado do cálculo de uma função entre renderizações, evitando recomputações caras enquanto as dependências declaradas não mudarem.',
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

    No React, sempre que o estado ou as propriedades de um componente mudam, a função do componente é executada novamente por inteiro.

    O hook **\`useMemo\`** serve para aplicar **Memoização**: ele guarda em cache o resultado do retorno de uma função cara computacionalmente e só volta a recalcular se algum dos valores do array de dependências sofrer alteração.`
        },
        {
            slug: 'usecallback',
            term: 'useCallback',
            pronunciation: '/juːz ˈkɔːl.bæk/',
            category: 'React & Frameworks',
            shortSummary: 'Hook do React que memoriza a própria referência de uma função entre renderizações, garantindo estabilidade de referência para otimizar componentes filhos envolvidos com React.memo.',
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

    Em JavaScript, funções são objetos de primeira classe e comparadas por referência (\`() => {} !== () => {}\`). A cada novo render de um componente funcional, todas as funções internas normais são recriadas com novos endereços de memória.

    O **\`useCallback\`** resolve esse problema mantendo a mesma referência da função entre renders subsequentes, sendo a ferramenta indispensável ao passar callbacks para componentes otimizados com \`React.memo\`.`
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
            shortSummary: 'O arquivo empacotado e otimizado resultante do processo de build de ferramentas como Vite, Webpack ou Rollup, que unifica e minifica módulos JavaScript, estilos e dependências.',
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
    - **Minificação e ofuscação:** Encurta variáveis e remove comentários para reduzir o tamanho em kilobytes transferidos pela rede.`
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
                t.keywords.some((k) => k.toLowerCase().includes(q))
        );
    };
