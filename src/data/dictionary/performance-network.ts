import type { DictionaryTerm } from '../../types/dictionary';

export const PERFORMANCE_NETWORK_TERMS: DictionaryTerm[] = [
    {
        slug: 'cors',
        term: 'CORS (Cross-Origin Resource Sharing)',
        pronunciation: '/kɔːrz/',
        category: 'Performance & Network',
        shortSummary: 'Mecanismo baseado em cabeçalhos HTTP que permite a servidores declarar quais outras origens podem acessar determinadas respostas através do navegador.',
        keywords: ['cors', 'cross-origin', 'origem', 'preflight', 'options', 'access-control-allow-origin'],
        seeAlso: ['same-origin-policy', 'preflight-request', 'window'],
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
        slug: 'bundle',
        term: 'Bundle',
        pronunciation: '/ˈbʌn.dəl/',
        category: 'Performance & Network',
        shortSummary: 'Um ou mais arquivos de saída produzidos pelo processo de build a partir do grafo de módulos da aplicação, frequentemente com transformações como minificação, code splitting e tree shaking.',
        keywords: ['bundle', 'bundler', 'vite', 'webpack', 'tree shaking', 'minificacao'],
        seeAlso: ['tree-shaking', 'code-splitting'],
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
    },
    {
        slug: 'tree-shaking',
        term: 'Tree Shaking',
        pronunciation: '/triː ˈʃeɪ.kɪŋ/',
        category: 'Performance & Network',
        shortSummary: 'Técnica de eliminação de código morto (dead code elimination) em que exportações de módulos ES nunca utilizadas são excluídas do bundle final.',
        keywords: ['tree shaking', 'dead code elimination', 'es modules', 'bundler', 'bundle size', 'vite', 'webpack'],
        seeAlso: ['bundle', 'code-splitting'],
        examples: [
            {
                title: 'Importando apenas o que é necessário para o Tree Shaking',
                language: 'javascript',
                code: `// RUIM: Importar o pacote inteiro pode impedir a remoção de código não usado
import _ from 'lodash';

// BOM: Importar funções nomeadas em bibliotecas preparadas para ES Modules
import { debounce } from 'lodash-es';
// O bundler inclui APENAS o código do debounce e descarta as outras 300 funções!`,
                description: 'A sintaxe estática de ES Modules permite ao empacotador identificar código não referenciado.'
            }
        ],
        content: `### O que é Tree Shaking?

A metáfora do **Tree Shaking** (sacudir a árvore) imagina a aplicação como uma árvore de dependências viva: os galhos que representam funções e utilitários que seu código realmente executa são mantidos com folhas verdes; os galhos de código morto e nunca importados caem ao chão e são descartados.

---

### Por que depende de ES Modules (\`import\` / \`export\`)?
O formato tradicional CommonJS (\`require()\` e \`module.exports\`) é dinâmico — você pode fazer \`require(condicao ? 'a' : 'b')\`. Por conta disso, o bundler não consegue prever com certeza matemática no tempo de build o que será usado.

Já os **ES Modules** possuem estrutura estática e imutável. As importações precisam estar no topo do arquivo, permitindo ao analisador sintático rastrear o grafo de dependências e eliminar exportações órfãs com segurança.`
    },
    {
        slug: 'code-splitting',
        term: 'Code Splitting',
        pronunciation: '/koʊd ˈsplɪt.ɪŋ/',
        category: 'Performance & Network',
        shortSummary: 'Divisão do código da aplicação em múltiplos pacotes menores carregados sob demanda, evitando que o usuário baixe o código de telas que não visitou.',
        keywords: ['code splitting', 'dynamic import', 'react lazy', 'chunks', 'bundle', 'performance'],
        seeAlso: ['bundle', 'lazy-loading', 'tree-shaking'],
        examples: [
            {
                title: 'Divisão de código baseada em rotas com import() dinâmico',
                language: 'javascript',
                code: `// Em vez de importar tudo no topo da aplicação:
// import PainelAdmin from './PainelAdmin';

// Carrega o pacote JS do painel APENAS se o usuário clicar para acessar:
const botao = document.getElementById('btn-admin');
botao.addEventListener('click', async () => {
  const { abrirPainel } = await import('./painel-admin.js');
  abrirPainel();
});`,
                description: 'Gera um arquivo .js separado baixado pela rede somente sob demanda.'
            }
        ],
        content: `### O que é Code Splitting?

Conforme uma aplicação cresce em complexidade, seu bundle JavaScript final pode atingir vários megabytes. Forçar o usuário a baixar o código de um painel financeiro ou de edição apenas para ler a página inicial é ineficiente.

O **Code Splitting** instrui o bundler a segmentar o código em múltiplos pacotes (*chunks*):
- O navegador só faz o download inicial do pacote essencial para renderizar a rota atual.
- Novos pedaços são requisitados em paralelo à medida que o usuário navega entre rotas ou interage com modais pesados.
- Em frameworks modernos como React, é implementado através de \`React.lazy()\` ou roteadores baseados em arquivos (Next.js, Vite com dynamic imports).`
    },
    {
        slug: 'lazy-loading',
        term: 'Lazy Loading',
        pronunciation: '/ˈleɪ.zi ˈloʊ.dɪŋ/',
        category: 'Performance & Network',
        shortSummary: 'Padrão de projeto que retarda o carregamento de recursos não críticos (imagens, vídeos, scripts) até o exato momento em que eles se tornam necessários.',
        aliases: ['Carregamento Preguiçoso', 'Carregamento Sob Demanda'],
        keywords: ['lazy loading', 'imagens', 'loading lazy', 'intersection observer', 'performance web'],
        seeAlso: ['intersection-observer', 'code-splitting'],
        examples: [
            {
                title: 'Lazy loading nativo de imagens em HTML',
                language: 'html',
                code: `<!-- O navegador cuida automaticamente de baixar a imagem só quando ela se aproxima da viewport! -->
<img src="foto-alta-resolucao.webp" alt="Foto" loading="lazy" width="800" height="600" />`,
                description: 'O atributo nativo loading="lazy" possui suporte universal em navegadores modernos.'
            }
        ],
        content: `### O que é Lazy Loading?

O **Lazy Loading** (Carregamento Preguiçoso ou Sob Demanda) é o inverso do carregamento ansioso (*Eager Loading*): em vez de carregar todos os ativos da página no carregamento inicial, recursos pesados são postergados até o momento em que entram no campo de visão do usuário.

---

### Onde aplicar Lazy Loading no Frontend?
1. **Imagens e Vídeos fora da primeira dobra (*below the fold*):** Através do atributo nativo \`loading="lazy"\` ou com \`IntersectionObserver\`.
2. **Componentes e Módulos JavaScript:** Carregados via Code Splitting quando uma aba ou modal é aberto.
3. **Iframes e Widgets de Terceiros:** Comentários, mapas do Google Maps ou players do YouTube carregados apenas quando o usuário rolar a página até a seção correspondente.`
    },
    {
        slug: 'lcp',
        term: 'LCP (Largest Contentful Paint)',
        pronunciation: '/ɛl siː piː/',
        category: 'Performance & Network',
        shortSummary: 'Métrica Core Web Vital que mede o tempo necessário para renderizar o maior elemento visual de conteúdo visível na viewport do usuário.',
        keywords: ['lcp', 'largest contentful paint', 'core web vitals', 'performance', 'fcp'],
        seeAlso: ['inp', 'cls', 'fcp', 'critical-rendering-path'],
        examples: [
            {
                title: 'Classificação oficial do Google para LCP',
                language: 'text',
                code: `🟢 Bom (Good):               <= 2.5 segundos
🟡 Precisa Melhorar:        2.5s a 4.0 segundos
🔴 Ruim (Poor):              > 4.0 segundos`,
                description: 'Meta recomendada pelo Google para garantir uma boa experiência de carregamento percebido.'
            }
        ],
        content: `### O que é o LCP?

O **Largest Contentful Paint (LCP)** é uma das três métricas oficiais do programa **Core Web Vitals** do Google. Ele mede o momento em que o conteúdo principal da página provavelmente foi concluído na tela do usuário.

Elementos comumente avaliados como o candidato a LCP:
- Um elemento de imagem (\`<img>\` ou imagem dentro de um elemento \`<svg>\`).
- A imagem de pôster de uma tag \`<video>\`.
- Um elemento com imagem de fundo carregada via CSS (\`url(...)\`).
- Grandes blocos de texto ou parágrafos de destaque.

---

### Como otimizar o LCP?
- Armazenar em cache e servir imagens através de CDNs rápidas em formatos modernos (WebP ou AVIF).
- Pré-carregar a imagem heroica do topo com \`<link rel="preload" as="image" href="..." fetchpriority="high">\`.
- Eliminar CSS ou JavaScript bloqueadores de renderização que atrasam a exibição do HTML.`
    },
    {
        slug: 'inp',
        term: 'INP (Interaction to Next Paint)',
        pronunciation: '/aɪ ɛn piː/',
        category: 'Performance & Network',
        shortSummary: 'Métrica Core Web Vital que mede a responsividade geral da página avaliando a latência de todas as interações do usuário durante toda a sessão.',
        keywords: ['inp', 'interaction to next paint', 'core web vitals', 'fid', 'responsividade', 'long tasks'],
        seeAlso: ['lcp', 'cls', 'event-loop'],
        examples: [
            {
                title: 'Classificação oficial do Google para INP',
                language: 'text',
                code: `🟢 Bom (Good):               <= 200 milissegundos
🟡 Precisa Melhorar:        200ms a 500 milissegundos
🔴 Ruim (Poor):              > 500 milissegundos`,
                description: 'Avalia o tempo desde o clique ou toque até o próximo frame desenhado na tela.'
            }
        ],
        content: `### O que é o INP?

Em março de 2024, o **Interaction to Next Paint (INP)** substituiu oficialmente o antigo *First Input Delay (FID)* como métrica do Core Web Vitals.

Enquanto o FID media apenas o atraso da primeira interação do usuário na página, o **INP avalia a página inteira**: ele monitora cliques, toques e teclas pressionadas durante toda a sessão e relata o tempo que levou para o navegador produzir a resposta visual na tela.

---

### As 3 fases medidas pelo INP
1. **Input Delay:** Tempo de espera até a thread principal desocupar para começar a rodar o listener do evento.
2. **Processing Time:** Tempo gasto executando o código JavaScript do callback do evento.
3. **Presentation Delay:** Tempo necessário para o navegador calcular o novo layout e pintar o próximo frame na tela.`
    },
    {
        slug: 'cls',
        term: 'CLS (Cumulative Layout Shift)',
        pronunciation: '/siː ɛl ɛs/',
        category: 'Performance & Network',
        shortSummary: 'Métrica Core Web Vital que quantifica a estabilidade visual da página medindo movimentos e saltos inesperados de elementos visíveis.',
        keywords: ['cls', 'cumulative layout shift', 'estabilidade visual', 'core web vitals', 'layout shift'],
        seeAlso: ['lcp', 'inp', 'reflow'],
        examples: [
            {
                title: 'Prevenindo Layout Shifts reservando espaço de imagens',
                language: 'html',
                code: `<!-- RUIM: Sem dimensões, o texto abaixo é empurrado bruscamente quando a imagem carrega -->
<img src="banner.jpg" />

<!-- BOM: O navegador reserva a proporção exata da caixa antes mesmo do download começar! -->
<img src="banner.jpg" width="800" height="400" style="aspect-ratio: 16/9; width: 100%; height: auto;" />`,
                description: 'Atributos width e height permitem ao navegador reservar o espaço correto no layout inicial.'
            }
        ],
        content: `### O que é o CLS?

Você certamente já tentou clicar em um botão ou link em um site e, de repente, uma imagem ou anúncio carregou acima, empurrando a página para baixo e fazendo você clicar acidentalmente no lugar errado.

O **Cumulative Layout Shift (CLS)** é a métrica dos Core Web Vitals que mede essa instabilidade visual irritante:
- Ela calcula a pontuação somando o impacto de todos os movimentos inesperados de elementos que mudam de posição inicial entre dois frames.
- Uma pontuação de **CLS $\le 0.1$** é considerada excelente.

---

### Principais Causas de Layout Shifts
- Imagens e vídeos incorporados sem dimensões explícitas (\`width\`, \`height\` ou CSS \`aspect-ratio\`).
- Fontes personalizadas da web que provocam trocas bruscas de tamanho de texto (FOUT / FOIT).
- Banners promocionais ou anúncios inseridos dinamicamente no topo da página sem reservar um container fixo prévio.`
    },
    {
        slug: 'fcp',
        term: 'FCP (First Contentful Paint)',
        pronunciation: '/ɛf siː piː/',
        category: 'Performance & Network',
        shortSummary: 'Métrica que marca o instante em que o navegador renderiza o primeiro elemento de conteúdo do DOM na tela, confirmando ao usuário que o carregamento iniciou.',
        keywords: ['fcp', 'first contentful paint', 'performance', 'crp', 'ttfb'],
        seeAlso: ['lcp', 'critical-rendering-path'],
        examples: [
            {
                title: 'Classificação de mercado para FCP',
                language: 'text',
                code: `🟢 Bom (Good):               <= 1.8 segundos
🟡 Precisa Melhorar:        1.8s a 3.0 segundos
🔴 Ruim (Poor):              > 3.0 segundos`,
                description: 'Mede o primeiro feedback visual dado ao visitante.'
            }
        ],
        content: `### O que é o FCP?

O **First Contentful Paint (FCP)** mede o tempo decorrido desde o momento em que a navegação é iniciada até o instante em que qualquer parte do conteúdo da página é pintada na tela:
- Pode ser um texto, um título, uma imagem, um ícone SVG ou um elemento \`<canvas>\`.
- Conteúdos de iframes ou planos de fundo vazios não contam para o FCP.

---

### Importância do FCP
O FCP é o primeiro sinal psicológico de vida da aplicação: ele indica ao usuário que a requisição não falhou e que o servidor está entregando os dados.

Ele depende diretamente do tempo de resposta inicial do servidor (**TTFB - Time to First Byte**) e da eliminação de arquivos CSS/JS bloqueadores no \`<head>\`.`
    },
    {
        slug: 'preflight-request',
        term: 'Preflight Request',
        pronunciation: '/ˈpriː.flaɪt rɪˈkwɛst/',
        category: 'Performance & Network',
        shortSummary: 'Requisição preliminar automática enviada pelo navegador com o método HTTP OPTIONS para verificar permissões CORS antes de despachar a requisição real.',
        keywords: ['preflight', 'cors', 'options', 'access-control-allow-methods', 'http preflight'],
        seeAlso: ['cors', 'same-origin-policy'],
        examples: [
            {
                title: 'O diálogo de uma requisição Preflight',
                language: 'http',
                code: `// 1. O navegador pergunta previamente:
OPTIONS /api/dados HTTP/1.1
Origin: https://meusite.com
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: Authorization

// 2. O servidor autoriza:
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://meusite.com
Access-Control-Allow-Methods: GET, POST, DELETE
Access-Control-Allow-Headers: Authorization
Access-Control-Max-Age: 86400  // Salva no cache do browser por 24 horas!`,
                description: 'Se o preflight for aprovado, o navegador dispara automaticamente a requisição real com DELETE.'
            }
        ],
        content: `### O que é um Preflight Request?

No contexto de requisições cross-origin com **CORS**, os navegadores dividem as chamadas em duas categorias:
1. **Requisições Simples (*Simple Requests*):** Métodos como \`GET\` e \`HEAD\` sem cabeçalhos customizados, que não alteram dados de forma destrutiva por padrão.
2. **Requisições Pré-Verificadas (*Preflighted Requests*):** Requisições que usam métodos como \`PUT\`, \`DELETE\`, \`PATCH\` ou cabeçalhos complexos como \`Authorization\` ou \`Content-Type: application/json\`.

Antes de enviar uma requisição que pode provocar efeitos colaterais no servidor, o navegador despacha automaticamente uma sondagem usando o método **\`OPTIONS\`**.

Se o servidor responder com os cabeçalhos de autorização corretos (\`Access-Control-Allow-Methods\`), o navegador executa a chamada real. Caso contrário, a chamada real é abortada.`
    },
    {
        slug: 'cache-control',
        term: 'Cache-Control',
        pronunciation: '/kæʃ kənˈtroʊl/',
        category: 'Performance & Network',
        shortSummary: 'Cabeçalho HTTP fundamental que define políticas e diretivas de retenção e revalidação de arquivos em caches de navegadores e proxies de borda (CDNs).',
        keywords: ['cache-control', 'cache', 'max-age', 'no-cache', 'no-store', 'immutable', 'cdn'],
        seeAlso: ['service-worker', 'bundle'],
        examples: [
            {
                title: 'Diretivas comuns de Cache-Control em produção',
                language: 'http',
                code: `// Para arquivos com hash no nome (ex: index-B8a7f1.js no Vite):
Cache-Control: public, max-age=31536000, immutable

// Para o arquivo HTML principal (index.html), que nunca deve ficar defasado:
Cache-Control: no-cache`,
                description: 'Arquivos imutáveis podem ser guardados por 1 ano; o HTML sempre revalida com o servidor.'
            }
        ],
        content: `### O que é o Cache-Control?

O cabeçalho HTTP **\`Cache-Control\`** é a principal ferramenta para controlar como recursos da web (HTML, scripts, imagens, fontes) são armazenados localmente no cliente e em proxies intermediários (CDNs).

---

### Principais Diretivas Desmistificadas:
- **\`max-age=<segundos>\`:** Tempo máximo que o recurso pode ser reutilizado a partir do cache sem consultar o servidor.
- **\`no-cache\` (MUITO MAL INTERPRETADO):** **Não significa** "não guarde em cache". Significa que o recurso pode ser armazenado em cache, mas **deve ser revalidado** com o servidor (usando ETag ou Last-Modified) antes de cada reutilização.
- **\`no-store\`:** O recurso nunca deve ser gravado em nenhum tipo de cache físico (essencial para dados bancários ou confidenciais).
- **\`immutable\`:** Informa ao navegador que o conteúdo do arquivo jamais mudará enquanto estiver no cache, eliminando requisições de revalidação até mesmo ao dar refresh na página.`
    },
    {
        slug: 'service-worker',
        term: 'Service Worker',
        pronunciation: '/ˈsɝː.vɪs ˈwɜːr.kɚ/',
        category: 'Performance & Network',
        shortSummary: 'Script que roda em segundo plano e opera como um proxy de rede programável, interceptando requisições HTTP para viabilizar suporte offline e cache granular.',
        keywords: ['service worker', 'pwa', 'offline', 'cache api', 'fetch interceptor', 'progressive web app'],
        seeAlso: ['web-worker', 'cache-control', 'indexeddb'],
        examples: [
            {
                title: 'Interceptando requisições para responder a partir do cache (Estratégia Cache First)',
                language: 'javascript',
                code: `self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((respostaEmCache) => {
      // Retorna do cache local se existir, senão busca na rede:
      return respostaEmCache || fetch(event.request);
    })
  );
});`,
                description: 'Permite que o aplicativo web funcione perfeitamente sem conexão com a internet.'
            }
        ],
        content: `### O que é um Service Worker?

Um **Service Worker** é um tipo especializado de Web Worker que atua como um intermediário (*proxy de rede programável*) entre o navegador do usuário e a internet.

Diferente de scripts normais da página, o Service Worker possui um ciclo de vida independente e continua registrado e em execução mesmo quando a página web que o registrou não está aberta.

---

### Capacidades Chave em PWAs (Progressive Web Apps):
1. **Experiência Offline Completa:** Intercepta eventos \`fetch\` e entrega páginas e recursos diretamente da **Cache Storage API**.
2. **Push Notifications:** Recebe mensagens do servidor via Web Push API e exibe notificações nativas no sistema operacional.
3. **Sincronização em Segundo Plano (*Background Sync*):** Envia formulários ou mensagens que o usuário tentou despachar enquanto estava sem sinal assim que a conexão for restaurada.`
    }
];
