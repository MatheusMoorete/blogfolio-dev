import type { DictionaryTerm } from '../../types/dictionary';

export const ARCHITECTURE_SECURITY_TERMS: DictionaryTerm[] = [
    {
        slug: 'same-origin-policy',
        term: 'Same-Origin Policy (SOP)',
        pronunciation: '/seɪm ˈɔːr.ə.dʒɪn ˈpɑː.lə.si/',
        category: 'Web Architecture',
        shortSummary: 'Mecanismo de segurança basilar do navegador que isola documentos e scripts de origens diferentes para impedir acessos não autorizados a dados.',
        aliases: ['SOP', 'Política de Mesma Origem'],
        keywords: ['same origin policy', 'sop', 'origem', 'seguranca web', 'cors', 'protocolo hostname porta'],
        seeAlso: ['cors', 'xss', 'csrf'],
        examples: [
            {
                title: 'Comparando origens para a URL https://exemplo.com:443/inicio',
                language: 'text',
                code: `https://exemplo.com/sobre       --> MESMA ORIGEM (mesmo protocolo, host e porta)
http://exemplo.com/inicio      --> ORIGEM DIFERENTE (protocolo HTTP != HTTPS)
https://api.exemplo.com/inicio  --> ORIGEM DIFERENTE (subdomínio api. != exemplo.)
https://exemplo.com:8080/inicio --> ORIGEM DIFERENTE (porta 8080 != 443)`,
                description: 'A tripla (protocolo, domínio, porta) precisa ser rigorosamente idêntica.'
            }
        ],
        content: `### O que é a Same-Origin Policy (SOP)?

A **Same-Origin Policy (SOP)** é a pedra fundamental do modelo de segurança de qualquer navegador moderno.

Sem a SOP, uma aba contendo um site malicioso que você abriu poderia simplesmente executar um script JavaScript para ler o DOM ou os cookies de sessão de outra aba aberta no seu internet banking.

---

### A Definição de Origem
Duas URLs pertencem à **mesma origem** se, e somente se, compartilharem:
1. **O mesmo protocolo** (\`http:\`, \`https:\`).
2. **O mesmo hostname** (\`meusite.com\`).
3. **A mesma porta** (\`80\`, \`443\`, \`3000\`).

Se qualquer um desses três componentes diferir, os documentos são considerados de origens distintas e o navegador bloqueia o acesso mútuo ao DOM, ao armazenamento local e às respostas de rede (a menos que explicitamente flexibilizado via CORS).`
    },
    {
        slug: 'csp',
        term: 'CSP (Content Security Policy)',
        pronunciation: '/siː ɛs piː/',
        category: 'Web Architecture',
        shortSummary: 'Camada de segurança declarada via cabeçalho HTTP que restringe as fontes autorizadas para carregar scripts, estilos, mídias e conexões de rede.',
        aliases: ['Content Security Policy'],
        keywords: ['csp', 'content security policy', 'xss mitigation', 'http header', 'seguranca frontend'],
        seeAlso: ['xss', 'same-origin-policy'],
        examples: [
            {
                title: 'Exemplo de cabeçalho CSP restritivo',
                language: 'http',
                code: `Content-Security-Policy: default-src 'self'; script-src 'self' https://apis.confiaveis.com; object-src 'none'; img-src 'self' data:;`,
                description: 'Permite carregar scripts apenas da mesma origem e de um domínio confiável especificado.'
            }
        ],
        content: `### O que é CSP (Content Security Policy)?

O **CSP** é um padrão HTTP que atua como uma barreira de contenção poderosa contra ataques de injeção de dados, especialmente **Cross-Site Scripting (XSS)** e *clickjacking*.

Através do cabeçalho de resposta \`Content-Security-Policy\`, o servidor envia uma lista de regras (*diretivas*) que instruem o navegador sobre o que é ou não permitido executar:

- **\`script-src\`:** Impede que scripts embutidos inline (\`<script>alert(1)</script>\`) rodem sem um nonce/hash seguro, e barra scripts vindos de domínios maliciosos desconhecidos.
- **\`connect-src\`:** Restringe para quais URLs o JavaScript pode fazer requisições via \`fetch()\` ou \`WebSocket\`.
- **\`frame-ancestors\`:** Define quem tem permissão de embutir sua aplicação dentro de um \`<iframe>\`, mitigando ataques de sequestro de clique (*clickjacking*).`
    },
    {
        slug: 'xss',
        term: 'XSS (Cross-Site Scripting)',
        pronunciation: '/ɛks ɛs ɛs/',
        category: 'Web Architecture',
        shortSummary: 'Vulnerabilidade de segurança em que código malicioso client-side é injetado e executado no contexto do navegador de outros usuários legítimos.',
        aliases: ['Cross-Site Scripting'],
        keywords: ['xss', 'cross site scripting', 'stored xss', 'reflected xss', 'dom xss', 'sanitizacao', 'seguranca'],
        seeAlso: ['csp', 'cookies', 'csrf'],
        examples: [
            {
                title: 'O perigo de injetar HTML bruto sem sanitização',
                language: 'jsx',
                code: `// PERIGOSO: Se 'comentario' contiver código malicioso, ele executará no navegador!
<div dangerouslySetInnerHTML={{ __html: comentarioDoUsuario }} />

// SEGURO: A renderização padrão em JSX converte texto em strings seguras automaticamente:
<div>{comentarioDoUsuario}</div>`,
                description: 'Frameworks modernos escapam texto por padrão para proteger contra XSS.'
            }
        ],
        content: `### O que é Cross-Site Scripting (XSS)?

O **XSS** ocorre quando uma aplicação web recebe dados não confiáveis de entrada e os renderiza na página sem a devida validação, escape ou sanitização.

Uma vez injetado, o script do atacante é executado com as mesmas permissões que o usuário legítimo possui na página, podendo:
- Roubar tokens de sessão e credenciais armazenadas em \`localStorage\` ou cookies não protegidos.
- Despachar ações em nome do usuário (enviar mensagens, alterar senhas).
- Capturar dados digitados através de keyloggers em JavaScript.

---

### As 3 Variantes de XSS:
1. **Stored XSS (Persistente):** O payload malicioso é gravado no banco de dados da aplicação (ex: na caixa de comentários) e atinge qualquer pessoa que abrir aquele post.
2. **Reflected XSS (Refletido):** O script malicioso é enviado como parâmetro na URL (\`?busca=<script>...\`) e refletido de volta na resposta do servidor.
3. **DOM-based XSS:** A falha ocorre 100% no cliente, quando o JavaScript lê um dado inseguro (como \`location.hash\`) e o escreve direto em \`element.innerHTML\` sem sanitizar.`
    },
    {
        slug: 'csrf',
        term: 'CSRF (Cross-Site Request Forgery)',
        pronunciation: '/siː ɛs ɑːr ɛf/',
        category: 'Web Architecture',
        shortSummary: 'Vulnerabilidade em que um site externo malicioso induz o navegador do usuário a enviar requisições não autorizadas para uma aplicação autenticada.',
        aliases: ['Falsificação de Requisição Entre Sites', 'CSRF'],
        keywords: ['csrf', 'cross site request forgery', 'samesite', 'anti csrf token', 'seguranca cookies'],
        seeAlso: ['cookies', 'same-origin-policy', 'xss'],
        examples: [
            {
                title: 'Protegendo cookies contra requisições entre sites',
                language: 'http',
                code: `// Resposta do servidor configurando o cookie de sessão com SameSite:
Set-Cookie: sessionId=abc123xyz; Secure; HttpOnly; SameSite=Lax`,
                description: 'O atributo SameSite=Lax impede o envio automático do cookie em requisições de sites terceiros.'
            }
        ],
        content: `### O que é CSRF?

O **Cross-Site Request Forgery (CSRF)** explora a confiança que uma aplicação web deposita no navegador do usuário.

Historicamente, navegadores anexavam automaticamente os cookies de sessão de um domínio a **todas as requisições HTTP** disparadas para aquele domínio, mesmo que a requisição tivesse partido de um site terceiro totalmente diferente.

---

### Como um ataque CSRF funciona:
1. O usuário faz login no seu internet banking (\`banco.com\`) e recebe um cookie de autenticação.
2. Sem deslogar, o usuário abre outra aba e visita um site malicioso (\`site-malicioso.com\`).
3. O site malicioso possui uma tag oculta: \`<img src="https://banco.com/transferir?para=hacker&valor=1000" />\`.
4. O navegador automaticamente anexa o cookie de autenticação do usuário na requisição, e a transferência é executada!

---

### Mitigações Modernas:
- **Atributo \`SameSite\` nos Cookies:** \`SameSite=Lax\` ou \`Strict\` impede que o cookie seja despachado em requisições disparadas por outros domínios.
- **Tokens Anti-CSRF:** Envio de um token único e aleatório no corpo da requisição que sites terceiros não conseguem adivinhar.`
    },
    {
        slug: 'ssg',
        term: 'SSG (Static Site Generation)',
        pronunciation: '/ɛs ɛs dʒiː/',
        category: 'Web Architecture',
        shortSummary: 'Método de renderização onde as páginas HTML são pré-compiladas estaticamente no momento do build, permitindo distribuição global ultra-rápida por CDNs.',
        aliases: ['Geração Estática de Sites', 'SSG'],
        keywords: ['ssg', 'static site generation', 'jamstack', 'build time', 'cdn', 'seo'],
        seeAlso: ['isr', 'spa', 'hydration'],
        examples: [
            {
                title: 'Geração estática no momento do build',
                language: 'text',
                code: `Código Fonte (Markdown/React) + Dados (CMS/API)
           ↓ (npm run build)
HTML + CSS + JS Estáticos gerados em disco
           ↓ (Deploy)
Distribuídos instantaneamente em servidores de borda (CDNs globais)`,
                description: 'O servidor não processa nada em tempo de execução; os arquivos já estão prontos.'
            }
        ],
        content: `### O que é Static Site Generation (SSG)?

O **SSG** é o modelo central da arquitetura moderna da Web para conteúdo que não varia a cada segundo.

Em vez de um servidor Node.js ou PHP processar cada requisição que chega de um visitante (*Server-Side Rendering*), todo o processo de consulta a banco de dados e compilação de HTML ocorre **apenas uma vez, na etapa de build**:

- **Velocidade Imbatível:** Como as páginas são arquivos estáticos puros, o Time to First Byte (TTFB) é medido em poucos milissegundos.
- **Custos Reduzidos e Escalabilidade:** Arquivos estáticos podem ser cacheados e replicados em centenas de servidores de borda (CDNs da Cloudflare, Vercel, AWS CloudFront) sem sobrecarregar bancos de dados.
- **Segurança Máxima:** Não há servidor de banco de dados diretamente exposto para a internet durante as visitas normais.`
    },
    {
        slug: 'isr',
        term: 'ISR (Incremental Static Regeneration)',
        pronunciation: '/aɪ ɛs ɑːr/',
        category: 'Web Architecture',
        shortSummary: 'Padrão híbrido que permite atualizar ou criar páginas estáticas em segundo plano sob demanda, sem precisar reconstruir o site inteiro.',
        keywords: ['isr', 'incremental static regeneration', 'nextjs', 'stale while revalidate', 'revalidacao'],
        seeAlso: ['ssg', 'cache-control'],
        examples: [
            {
                title: 'Configurando revalidação periódica com ISR no Next.js',
                language: 'javascript',
                code: `// Em rotas estáticas geradas com ISR:
export const revalidate = 60; // Revalida a cada 60 segundos sob demanda

export default async function PaginaProduto() {
  const produto = await buscarProduto();
  return <div>{produto.nome} - R$ {produto.preco}</div>;
}`,
                description: 'Usuários recebem o HTML do cache instantaneamente enquanto a página é atualizada em background.'
            }
        ],
        content: `### O que é Incremental Static Regeneration (ISR)?

O SSG tradicional tem uma limitação evidente: em sites com 100.000 páginas de catálogo de e-commerce, rodar um build completo a cada pequena alteração de preço levaria horas.

O **ISR** (popularizado pelo ecossistema Next.js) une o melhor do mundo estático com o dinamismo do servidor através do padrão **Stale-While-Revalidate**:

1. A página inicial é servida a partir do cache estático da CDN de forma imediata (*stale*).
2. Se o intervalo de revalidação (\`revalidate: 60\`) expirou e uma nova visita chega, o servidor inicia a renderização de uma nova versão da página em segundo plano.
3. Assim que o novo HTML é gerado com sucesso, o cache da CDN é atualizado atomicamente para os visitantes subsequentes.`
    },
    {
        slug: 'cookies',
        term: 'Cookies (HttpOnly / SameSite)',
        pronunciation: '/ˈkʊk.iz/',
        category: 'Web Architecture',
        shortSummary: 'Pequenos fragmentos de dados armazenados pelo navegador enviados automaticamente em cabeçalhos HTTP, fundamentais para persistência de sessões e autenticação.',
        keywords: ['cookies', 'httponly', 'samesite', 'secure cookie', 'sessao', 'autenticacao'],
        seeAlso: ['csrf', 'xss', 'localstorage'],
        examples: [
            {
                title: 'Definindo um cookie seguro via cabeçalho HTTP Set-Cookie',
                language: 'http',
                code: `Set-Cookie: token_autenticacao=jwt_secreto_aqui; 
            Path=/; 
            Secure; 
            HttpOnly; 
            SameSite=Strict; 
            Max-Age=604800;`,
                description: 'Combinação ideal de atributos de segurança para proteger a sessão do usuário.'
            }
        ],
        content: `### O que são Cookies na Web?

Diferente do \`localStorage\` e do \`sessionStorage\` (que são estritamente acessíveis apenas via código JavaScript na página), os **Cookies** foram criados para trafegar automaticamente entre cliente e servidor em cada requisição HTTP correspondente.

---

### Os 3 Atributos Críticos de Segurança:
1. **\`HttpOnly\`:** Bloqueia qualquer leitura ou modificação do cookie via JavaScript no cliente (\`document.cookie\`). Se sua aplicação sofrer um ataque XSS, o hacker **não conseguirá ler o token de sessão**.
2. **\`Secure\`:** Garante que o cookie só seja transmitido através de conexões criptografadas HTTPS, impedindo interceptações em redes abertas (*Man-in-the-Middle*).
3. **\`SameSite\`:** Controla se o cookie é enviado em requisições disparadas por outros domínios:
   - \`SameSite=Strict\`: O cookie nunca é enviado em requisições vindas de fora (máxima proteção anti-CSRF).
   - \`SameSite=Lax\`: Enviado apenas em navegações de links de alto nível (\`<a href="...">\`).
   - \`SameSite=None\`: Enviado em qualquer contexto (exige obrigatoriamente a flag \`Secure\`).`
    },
    {
        slug: 'micro-frontends',
        term: 'Micro-frontends',
        pronunciation: '/ˈmaɪ.kroʊ ˈfrʌnt.ɛndz/',
        category: 'Web Architecture',
        shortSummary: 'Estilo arquitetural que decompõe uma aplicação frontend monolítica em múltiplos módulos independentes desenvolvidos e implantados por times distintos.',
        keywords: ['micro-frontends', 'microfrontends', 'module federation', 'arquitetura', 'webpack module federation'],
        seeAlso: ['spa', 'code-splitting'],
        examples: [
            {
                title: 'Módulo de checkout sendo consumido remotamente via Module Federation',
                language: 'javascript',
                code: `// No aplicativo Shell (Host):
import('checkoutApp/Pagamento').then(({ default: Pagamento }) => {
  // Renderiza o módulo mantido independentemente pela equipe de checkout!
});`,
                description: 'O time de pagamentos pode fazer deploy sem precisar recompilar a casca principal.'
            }
        ],
        content: `### O que são Micro-frontends?

Assim como a arquitetura de microsserviços dividiu os backends monolíticos em serviços autônomos, o conceito de **Micro-frontends** estende essa autonomia para a camada de interface do usuário.

Em grandes corporações com dezenas de desenvolvedores, uma base de código única (*monólito frontend*) torna os deploys lentos, os testes demorados e as migrações tecnológicas arriscadas.

---

### Formas Comuns de Integração:
- **Module Federation (Vite / Webpack):** Módulos carregam dinamicamente partes da interface em tempo de execução via JavaScript, compartilhando dependências comuns (como React) em memória.
- **Web Components:** Componentes agnósticos de framework empacotados com Shadow DOM.
- **Roteamento por URL na borda (Edge / CDN):** A CDN redireciona \`/loja\` para uma aplicação e \`/conta\` para outra aplicação totalmente separada.`
    },
    {
        slug: 'spa',
        term: 'SPA (Single Page Application)',
        pronunciation: '/ɛs piː eɪ/',
        category: 'Web Architecture',
        shortSummary: 'Aplicação web que carrega um único documento HTML no carregamento inicial e atualiza partes da interface dinamicamente via JavaScript sem recarregar a página inteira a cada transição de rota.',
        keywords: ['spa', 'single page application', 'roteamento', 'react router', 'client side routing'],
        seeAlso: ['window', 'dom', 'hydration', 'ssg'],
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
        slug: 'browsing-context',
        term: 'Browsing Context (Contexto de Navegação)',
        pronunciation: '/ˈbraʊ.zɪŋ ˈkɑːn.tɛkst/',
        category: 'Web Architecture',
        shortSummary: 'Ambiente no navegador em que documentos Document são apresentados ao usuário (como abas, janelas ou iframes), mantendo seu próprio histórico e ciclo de vida de armazenamento.',
        aliases: ['Contexto de Navegação', 'Top-level Browsing Context', 'Navegação de Aba'],
        keywords: ['browsing context', 'contexto de navegacao', 'aba', 'top level browsing context', 'iframe', 'sessionstorage', 'ciclo de vida'],
        seeAlso: ['sessionstorage', 'window', 'history-api', 'window-opener', 'spa'],
        examples: [
            {
                title: 'O ciclo de vida do Browsing Context e a persistência do sessionStorage',
                language: 'javascript',
                code: `// Dentro da mesma aba (Browsing Context persistente):
sessionStorage.setItem('tabId', crypto.randomUUID());

// 1. Dar reload (F5): O browsing context é mantido!
console.log(sessionStorage.getItem('tabId')); // Retorna o mesmo ID intacto.

// 2. Abrir uma nova aba manualmente (Ctrl + T ou link com target="_blank"):
// Cria um NOVO Browsing Context independente!
// Na nova aba: sessionStorage.getItem('tabId') será null.`,
                description: 'O sessionStorage pertence ao ciclo de vida do contexto de navegação daquela aba específica.'
            }
        ],
        content: `### O que é um Browsing Context?

Na especificação oficial do **WHATWG HTML**, o navegador não enxerga abas ou janelas apenas como caixas visuais na tela, mas sim como **Contextos de Navegação** (*Browsing Contexts*).

Um **Browsing Context** é o ambiente no qual um ou mais objetos \`Document\` são apresentados ao usuário. Ele é responsável por gerenciar a **pilha de histórico de sessão** (*session history*) e isolar o armazenamento de sessão daquela aba.

---

### Tipos de Browsing Contexts

1. **Top-Level Browsing Context:**
   - É a janela ou aba principal do navegador (aquele que não possui nenhum contexto pai).
   - Não está aninhado dentro de nenhum elemento da página.

2. **Nested Browsing Context (Contexto Aninhado):**
   - Contextos incorporados dentro de outro documento, como tags \`<iframe>\`.
   - Um iframe possui seu próprio objeto \`window\` e \`document\`, mas está subordinado ao ciclo de vida e às políticas de segurança (como permissões e sandbox) do contexto pai.

---

### Browsing Context e o Ciclo de Vida do sessionStorage

Existe uma confusão recorrente entre o ciclo de vida do documento em memória e o ciclo de vida da aba:

- **Recarregar a página (F5) NÃO destrói o contexto de navegação:** Embora todo o JavaScript da memória seja resetado e os nós da árvore DOM sejam destruídos e recriados, o *browsing context* permanece o mesmo. Por essa razão, dados gravados em \`sessionStorage\` e a pilha de \`history\` continuam intactos após um refresh.
- **Fechar a aba destrói o contexto:** No instante em que o usuário fecha a aba ou a janela, o contexto de navegação atinge o fim do seu ciclo de vida, e os dados daquele \`sessionStorage\` específico são permanentemente apagados da memória do navegador.

---

### Importância em SPAs e Telemetria

Quando um usuário abre três abas simultâneas da mesma aplicação web:
- O \`localStorage\` e os \`cookies\` são **compartilhados** entre todas as abas (pois pertencem à mesma origem).
- Cada aba possui seu próprio **Browsing Context isolado**, com sua própria pilha de histórico e seu próprio \`sessionStorage\`.

Sistemas avançados de telemetria e observabilidade frontend utilizam o contexto de navegação para atribuir um identificador único por aba (\`tabId\`), permitindo correlacionar logs e navegações sem misturar as ações de abas diferentes do mesmo usuário.`
    },
    {
        slug: 'client-side-routing',
        term: 'Client-side Routing (Roteamento no Cliente)',
        pronunciation: '/ˈklaɪ.ənt saɪd ˈruː.tɪŋ/',
        category: 'Web Architecture',
        shortSummary: 'Mecanismo em que a navegação entre telas e a sincronização da URL acontecem inteiramente no navegador via JavaScript, sem requisições de documentos HTML ao servidor.',
        aliases: ['Roteamento no Cliente', 'Client-side Router', 'SPA Routing'],
        keywords: ['client side routing', 'roteamento no cliente', 'roteador', 'react router', 'pushstate', 'popstate', 'spa', 'fallback 404'],
        seeAlso: ['history-api', 'popstate', 'spa', 'monkey-patching'],
        examples: [
            {
                title: 'Configuração essencial de Fallback no Nginx para suportar Client-side Routing',
                language: 'nginx',
                code: `server {
    listen 80;
    server_name meusite.com;
    root /var/www/meusite/dist;
    index index.html;

    location / {
        # Tenta servir o arquivo estático real; se não existir, entrega o index.html:
        try_files $uri $uri/ /index.html;
    }
}`,
                description: 'Sem esta diretiva de reescrita, recarregar rotas profundas (como /perfil/pedidos) resulta em HTTP 404.'
            }
        ],
        content: `### O que é Client-side Routing?

No modelo tradicional da web (**Multi-Page Applications - MPAs**), cada clique em um link solicitava uma nova página HTML completa do servidor. O navegador descartava todo o DOM atual, exibia uma tela em branco durante o carregamento de rede e montava a nova página do zero.

Com o advento das **SPAs** e a introdução da **History API**, surgiu o **Client-side Routing** (Roteamento no Cliente). 

Nesse padrão, a casca inicial da aplicação é baixada apenas uma vez. Quando o usuário clica em um link de navegação:
1. O JavaScript intercepta o clique via \`event.preventDefault()\`.
2. A URL na barra de endereços é atualizada silenciosamente usando \`history.pushState()\`.
3. O roteador (como React Router, TanStack Router ou Vue Router) detecta a mudança e renderiza o novo componente correspondente na tela de forma quase instantânea, sem recarregar o documento.

---

### O Fluxo Sob o Capô: Mutações vs. Travessias

Um roteador client-side lida com duas categorias de navegação:

- **Navegações Diretas (Mutações):** Iniciadas por cliques em links (\`<Link to="/sobre">\`) ou comandos imperativos (\`navigate('/sobre')\`). Disparam internamente \`history.pushState()\` ou \`history.replaceState()\`.
- **Navegações no Histórico (Travessias):** Iniciadas quando o usuário clica nos botões **Voltar** ou **Avançar** do navegador. O navegador dispara o evento nativo \`popstate\` no \`window\`, e o roteador lê a nova rota para sincronizar a interface.

---

### O Desafio do Fallback no Servidor (O Famoso 404 no F5)

Como as rotas virtuais de uma SPA (ex: \`/dashboard/relatorios\`) não correspondem a pastas ou arquivos físicos reais no servidor web:
- Se o usuário navegar de \`/\` para \`/dashboard/relatorios\` clicando em botões da tela, o roteamento no cliente funciona perfeitamente.
- Porém, se o usuário der um **refresh (F5)** ou colar essa URL diretamente em uma nova aba, o navegador faz uma requisição HTTP real ao servidor buscando o arquivo \`/dashboard/relatorios\`.

Se o servidor web (Nginx, Apache, CDN ou S3) não estiver configurado para reescrever todas as rotas de volta para o \`index.html\` principal, ele retornará um erro **404 Not Found**. A solução é a diretiva de fallback para SPA (\`try_files $uri /index.html\`).`
    },
    {
        slug: 'window-opener',
        term: 'window.opener (rel="noopener")',
        pronunciation: '/ˈwɪn.doʊ ˈoʊ.pən.ɚ/',
        category: 'Web Architecture',
        shortSummary: 'Propriedade que referencia o contexto de navegação de origem que abriu a janela ou aba atual, apresentando implicações críticas de segurança e isolamento de armazenamento.',
        aliases: ['window.opener', 'noopener', 'noreferrer', 'Reverse Tabnabbing'],
        keywords: ['window opener', 'noopener', 'reverse tabnabbing', 'target blank', 'seguranca', 'sessionstorage clone'],
        seeAlso: ['browsing-context', 'sessionstorage', 'same-origin-policy'],
        examples: [
            {
                title: 'Protegendo links externos contra Reverse Tabnabbing',
                language: 'html',
                code: `<!-- Link externo seguro que desassocia o contexto da janela pai: -->
<a href="https://site-externo.com" target="_blank" rel="noopener noreferrer">
  Visitar Site Externo
</a>

<!-- Ao abrir via JavaScript, passe o recurso noopener: -->
<script>
  window.open('https://site-externo.com', '_blank', 'noopener');
</script>`,
                description: 'Impede que a nova página tenha acesso a window.opener e altere a URL da aba original.'
            }
        ],
        content: `### O que é o window.opener?

Quando uma página web abre uma nova aba ou janela através de um link com \`target="_blank"\` ou via comando JavaScript \`window.open()\`, o navegador define na nova página aberta a propriedade **\`window.opener\`**.

Essa propriedade contém uma referência direta ao objeto \`window\` da página de origem que a disparou.

---

### O Perigo do Reverse Tabnabbing

Historicamente, se você incluísse um link para um site de terceiros com \`target="_blank"\` simples sem proteção, o site externo poderia executar o seguinte código JavaScript:

\`\`\`javascript
if (window.opener) {
  // Redireciona a sua aba original para uma página falsa de phishing!
  window.opener.location = 'https://site-malicioso-phishing.com/login-falso';
}
\`\`\`

Enquanto o usuário lia o artigo na nova aba, sua aba original era silenciosamente trocada de URL. Ao retornar para a aba inicial, ele acreditava que sua sessão havia expirado e digitava sua senha na página clonada do atacante.

- **Mitigação:** Adicionar \`rel="noopener"\` limpa a referência e define \`window.opener = null\` na nova aba.
- **Navegadores Modernos:** Navegadores atuais (Chrome 88+, Firefox 79+, Safari 12.1+) definem \`rel="noopener"\` implicitamente por padrão em links com \`target="_blank"\`, mas chamadas programáticas com \`window.open()\` ainda exigem atenção explícita.

---

### O Efeito Colateral no sessionStorage: A Clonagem Inicial

Existe um detalhe pouco conhecido sobre o comportamento do \`sessionStorage\` ao abrir novas abas:

1. Se você abrir uma nova aba vazia manualmente (\`Ctrl + T\`) ou via um link com \`rel="noopener"\`, o navegador cria um contexto de navegação completamente novo com um **\`sessionStorage\` 100% limpo**.
2. No entanto, se uma nova aba for aberta para a mesma origem mantendo o vínculo de opener (sem \`noopener\`), a especificação do HTML determina que o navegador **copie um snapshot de todos os dados do \`sessionStorage\` da aba pai para a nova aba**.

Após essa clonagem inicial, os dois armazenamentos tornam-se completamente independentes (alterações na nova aba não refletem na original). Contudo, essa herança de dados pode surpreender sistemas de telemetria ou autenticação que assumiam que cada nova aba sempre começava com estado vazio.`
    }
];
