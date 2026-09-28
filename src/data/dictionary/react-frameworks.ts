import type { DictionaryTerm } from '../../types/dictionary';

export const REACT_FRAMEWORKS_TERMS: DictionaryTerm[] = [
    {
        slug: 'virtual-dom',
        term: 'Virtual DOM (VDOM)',
        pronunciation: '/ˈvɜːr.tʃu.əl dɒm/',
        category: 'React & Frameworks',
        shortSummary: 'Representação em memória utilizada por bibliotecas como React para descrever a interface e comparar versões dessa representação durante o processo de reconciliação.',
        keywords: ['virtual dom', 'vdom', 'react', 'diffing', 'reconciliacao', 'reconciliation'],
        seeAlso: ['dom', 'hydration', 'usememo', 'react-fiber', 'reconciliation'],
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
        seeAlso: ['virtual-dom', 'window', 'server-components'],
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
        slug: 'reconciliation',
        term: 'Reconciliation (Reconciliação)',
        pronunciation: '/ˌrɛk.ənˌsɪl.iˈeɪ.ʃən/',
        category: 'React & Frameworks',
        shortSummary: 'Algoritmo heurístico pelo qual o React compara duas árvores de elementos para deduzir o conjunto mínimo de mutações a serem enviadas ao renderizador.',
        aliases: ['Diffing Algorithm'],
        keywords: ['reconciliation', 'reconciliacao', 'diffing', 'keys', 'react fiber', 'tree comparison'],
        seeAlso: ['virtual-dom', 'react-fiber'],
        examples: [
            {
                title: 'A importância de chaves (keys) estáveis na reconciliação',
                language: 'jsx',
                code: `// RUIM: Usar índice do array como key em listas mutáveis confunde o diffing
items.map((item, index) => <Item key={index} dado={item} />)

// CORRETO: Usar IDs únicos e estáveis permite ao React rastrear nós movidos
items.map(item => <Item key={item.id} dado={item} />)`,
                description: 'Keys estáveis evitam reconstrução indevida de instâncias de componentes.'
            }
        ],
        content: `### O que é Reconciliação no React?

Comparar duas árvores genéricas de elementos possui complexidade matemática $O(n^3)$ — para 1.000 nós, exigiriam-se bilhões de comparações.

Para tornar a interface instantânea, a equipe do React implementou um algoritmo heurístico de reconciliação de ordem **$O(n)$**, apoiado em duas premissas centrais:

1. **Elementos de tipos diferentes produzem árvores diferentes:** Se um nó \`<article>\` é substituído por uma \`<div>\`, o React desmonta toda a árvore anterior sem tentar reaproveitar seus filhos.
2. **Propriedade \`key\` para listas:** Em listas de elementos irmãos, chaves únicas e estáveis identificam quais itens foram apenas reordenados, adicionados ou deletados, evitando a destruição e recriação desnecessária de elementos DOM subjacentes.`
    },
    {
        slug: 'react-fiber',
        term: 'React Fiber',
        pronunciation: '/riˈækt ˈfaɪ.bɚ/',
        category: 'React & Frameworks',
        shortSummary: 'Arquitetura interna e reconciliador do React que representa componentes como unidades de trabalho encadeadas, viabilizando renderização assíncrona e priorizável.',
        keywords: ['fiber', 'react fiber', 'concurrent mode', 'work in progress', 'scheduler'],
        seeAlso: ['reconciliation', 'suspense', 'virtual-dom'],
        examples: [
            {
                title: 'Estrutura simplificada de um nó Fiber',
                language: 'javascript',
                code: `// Cada componente no React v16+ possui um Fiber Node correspondente:
const fiberNode = {
  type: MeuComponente,
  key: null,
  stateNode: instanciaDOM, // Nó real do DOM
  child: primeiroFilhoFiber,
  sibling: proximoIrmaoFiber,
  return: paiFiber,
  memoizedState: estadoAtual, // Armazena a lista encadeada de Hooks!
};`,
                description: 'A lista encadeada permite ao React pausar a árvore e retornar a qualquer momento.'
            }
        ],
        content: `### O que é o React Fiber?

Até o React 15, a reconciliação (conhecida como *Stack Reconciler*) percorria a árvore recursivamente de forma síncrona. Em árvores gigantescas, esse processo ocupava a thread principal por dezenas de milissegundos sem interrupção, causando engasgos na digitação e animações.

O **React Fiber** é a reescrita completa do núcleo do React lançada na versão 16:
- Converteu a recursão da Call Stack em uma **lista encadeada virtual** de nós de trabalho (*Fiber nodes*).
- Permite ao **Scheduler** do React fatiar a renderização (*time-slicing*), pausando o cálculo se um clique ou entrada de teclado de alta prioridade chegar, e retomando depois.
- É a espinha dorsal técnica que viabiliza o **Concurrent Mode**, as **Transitions** (\`useTransition\`) e o **Suspense**.`
    },
    {
        slug: 'react-memo',
        term: 'React.memo',
        pronunciation: '/riˈækt ˈmɛm.oʊ/',
        category: 'React & Frameworks',
        shortSummary: 'Componente de ordem superior (HOC) que memoriza o resultado da renderização de um componente funcional, pulando renders futuros se suas props não mudaram.',
        keywords: ['react.memo', 'memo', 'memoization', 'pure component', 'shallow comparison'],
        seeAlso: ['usecallback', 'usememo'],
        examples: [
            {
                title: 'Evitando re-renders com React.memo',
                language: 'jsx',
                code: `import React from 'react';

// Se o pai re-renderizar, mas a prop 'nome' continuar idêntica,
// o CardUsuario NÃO executa sua função de render novamente!
export const CardUsuario = React.memo(function CardUsuario({ nome }) {
  console.log('Renderizou CardUsuario');
  return <div className="card">{nome}</div>;
});`,
                description: 'A comparação padrão faz checagem rasa (shallow comparison) em cada prop.'
            }
        ],
        content: `### O que é o React.memo?

Por padrão no React, quando um componente pai é re-renderizado, **todos os seus componentes filhos são re-renderizados automaticamente**, mesmo que nenhuma de suas propriedades (\`props\`) tenha mudado.

O **\`React.memo\`** é uma ferramenta de otimização que encapsula componentes funcionais:
- Antes de renderizar, ele faz uma comparação rasa (*shallow comparison*) entre as props anteriores (\`prevProps\`) e as novas props (\`nextProps\`).
- Se nada mudou, o React reutiliza o último resultado renderizado do cache, economizando tempo de CPU.

---

### A Pegadinha de Objetos e Callbacks
Como o \`React.memo\` utiliza comparação rasa (\`Object.is\`), passar funções anônimas inline (\`() => {}\`) ou novos objetos literais (\`{ id: 1 }\`) como props faz o componente re-renderizar sempre, anulando o benefício. Nesses casos, combina-se o \`React.memo\` com \`useCallback\` e \`useMemo\`.`
    },
    {
        slug: 'syntheticevent',
        term: 'SyntheticEvent',
        pronunciation: '/sɪnˈθɛt.ɪk ɪˈvent/',
        category: 'React & Frameworks',
        shortSummary: 'Invólucro cross-browser do React em torno dos eventos nativos do navegador, garantindo comportamento e propriedades idênticos em todas as plataformas.',
        keywords: ['syntheticevent', 'eventos react', 'cross-browser', 'nativeevent', 'event delegation react'],
        seeAlso: ['event-bubbling', 'event-delegation'],
        examples: [
            {
                title: 'Acessando o evento sintético e o evento nativo',
                language: 'jsx',
                code: `function Formulario() {
  function handleSubmit(event) {
    event.preventDefault(); // Método do SyntheticEvent com suporte universal!
    
    console.log('Tipo sintético:', event.type);
    console.log('Evento nativo real do browser:', event.nativeEvent);
  }

  return <form onSubmit={handleSubmit}><button>Enviar</button></form>;
}`,
                description: 'A mesma interface da especificação W3C é assegurada em qualquer navegador.'
            }
        ],
        content: `### O que é o SyntheticEvent?

Diferentes navegadores historicamente possuíam pequenas discrepâncias na implementação de eventos (nomes de teclas, propriedades de scroll, formas de prevenir comportamentos padrão).

O React resolve isso encapsulando o evento nativo em uma instância de **\`SyntheticEvent\`**:
- Padroniza métodos como \`preventDefault()\` e \`stopPropagation()\`.
- Expõe a propriedade \`event.nativeEvent\` para casos em que o acesso ao objeto original do navegador seja necessário.

---

### Delegação de Eventos no React
Em vez de anexar listeners diretamente nos nós individuais do DOM real para cada \`onClick\` declarado em JSX, o React utiliza **Event Delegation**:
- Até o React 16, todos os eventos eram delegados no nó raiz \`document\`.
- A partir do **React 17**, os listeners de eventos são delegados no **container raiz do React** (\`root\` do \`createRoot\`), permitindo que múltiplas versões do React coexistam na mesma página sem conflitos de propagação.`
    },
    {
        slug: 'server-components',
        term: 'Server Components (RSC)',
        pronunciation: '/ˈsɝː.vɚ kəmˈpoʊ.nənts/',
        category: 'React & Frameworks',
        shortSummary: 'Paradigma arquitetural do React onde componentes executam exclusivamente no servidor, gerando uma árvore serializada que não envia JavaScript para o cliente.',
        aliases: ['RSC', 'React Server Components'],
        keywords: ['rsc', 'server components', 'client components', 'nextjs', 'app router', 'zero bundle'],
        seeAlso: ['hydration', 'suspense'],
        examples: [
            {
                title: 'Componente Server executando consulta a banco sem client bundle',
                language: 'jsx',
                code: `// Executa 100% no servidor - zero KB no bundle JS do navegador!
import db from '@/lib/db';

export default async function ListaArtigos() {
  // Acesso direto e seguro ao banco de dados:
  const artigos = await db.artigos.findMany();

  return (
    <ul>
      {artigos.map(a => <li key={a.id}>{a.titulo}</li>)}
    </ul>
  );
}`,
                description: 'Sem necessidade de criar rotas de API intermediárias ou useEffect no cliente.'
            }
        ],
        content: `### O que são React Server Components (RSC)?

Tradicionalmente no React, todo o código dos componentes era incluído no bundle JavaScript transferido para o navegador do usuário, onde o cliente realizava o parsing, compilação e hidratação.

Os **React Server Components (RSC)** dividem a aplicação em duas naturezas de componentes:
- **Server Components (Padrão):** Executam exclusivamente no servidor durante a requisição ou no build. Eles nunca são adicionados ao bundle final do cliente, permitindo dependências pesadas (parsers de Markdown, bibliotecas de criptografia) sem custo em kilobytes para o usuário.
- **Client Components (com \`'use client'\`):** Componentes que precisam de interatividade no navegador (como \`useState\`, \`useEffect\`, listeners de clique).

---

### Comunicação via Stream
O servidor não envia HTML estático comum para os RSCs: ele transmite um formato de stream serializado especial contendo a árvore de nós e dados, que o React no cliente intercala com os componentes de cliente sem perder estado.`
    },
    {
        slug: 'suspense',
        term: 'Suspense',
        pronunciation: '/səˈspɛns/',
        category: 'React & Frameworks',
        shortSummary: 'Componente nativo do React que permite coordenar declarativamente estados de carregamento enquanto partes da árvore aguardam operações assíncronas.',
        keywords: ['suspense', 'react suspense', 'fallback', 'loading', 'lazy', 'code splitting'],
        seeAlso: ['server-components', 'react-fiber'],
        examples: [
            {
                title: 'Coordenando carregamento com Fallback',
                language: 'jsx',
                code: `import React, { Suspense, lazy } from 'react';

// O bundle deste componente só será baixado quando ele for renderizado:
const GraficoPesado = lazy(() => import('./GraficoPesado'));

function Painel() {
  return (
    <Suspense fallback={<div className="esqueleto">Carregando gráfico...</div>}>
      <GraficoPesado />
    </Suspense>
  );
}`,
                description: 'Enquanto o módulo é baixado, o fallback substituto é mantido na tela.'
            }
        ],
        content: `### O que é o Suspense?

Antes do Suspense, cada componente precisava gerenciar manualmente seu estado de espera: \`const [loading, setLoading] = useState(true)\`, preenchendo a interface com condições ternárias espalhadas.

O **Suspense** permite que componentes suspendam (*throw a promise*) a renderização quando aguardam:
- Módulos de código divididos via \`React.lazy()\`.
- Dados assíncronos no servidor com React Server Components.
- Bibliotecas de busca de dados com suporte nativo a Suspense.

O React captura essa suspensão e exibe a propriedade \`fallback\` configurada, revelando o conteúdo real de forma atômica e coordenada assim que todos os dados estiverem prontos.`
    },
    {
        slug: 'prop-drilling',
        term: 'Prop Drilling',
        pronunciation: '/prɑːp ˈdrɪl.ɪŋ/',
        category: 'React & Frameworks',
        shortSummary: 'Antipadrão em que dados precisam ser repassados por múltiplos componentes intermediários que não precisam deles, apenas para alcançar um filho profundo.',
        keywords: ['prop drilling', 'state management', 'context api', 'zustand', 'component composition'],
        seeAlso: ['custom-hook'],
        examples: [
            {
                title: 'O problema do Prop Drilling vs. Composição',
                language: 'jsx',
                code: `// COM PROP DRILLING: 'tema' passa por intermediários que não o usam:
<App tema={tema}>
  <Layout tema={tema}>
    <Sidebar tema={tema}>
      <Botao tema={tema} />
    </Sidebar>
  </Layout>
</App>

// RESOLVENDO COM COMPOSIÇÃO: Passando o elemento já configurado como children:
<Layout sidebar={<Botao tema={tema} />} />`,
                description: 'Composição de componentes ou Context API eliminam repasses desnecessários.'
            }
        ],
        content: `### O que é Prop Drilling?

O termo **Prop Drilling** descreve o processo de injetar propriedades em uma cadeia longa de componentes aninhados onde os componentes do meio da árvore atuam como meros mensageiros sem qualquer interesse naquele dado.

---

### Problemas Causados
- **Acoplamento rígido:** Mudar a estrutura dos dados obriga a refatorar todos os componentes da cadeia intermediária.
- **Dificuldade de manutenção:** Fica complexo rastrear de onde o dado partiu e onde ele está sendo efetivamente consumido.

---

### Como resolver?
1. **Composição de Componentes:** Mudar a arquitetura para passar componentes prontos como \`children\` ou slots de props.
2. **Context API:** Para estados globais ou contextuais (ex: tema, idioma, usuário logado).
3. **Gerenciadores de Estado Leves:** Bibliotecas como **Zustand** ou **Jotai**, que permitem a qualquer componente assinar seletores de estado direto da memória.`
    },
    {
        slug: 'controlled-component',
        term: 'Controlled Component',
        pronunciation: '/kənˈtroʊld kəmˈpoʊ.nənt/',
        category: 'React & Frameworks',
        shortSummary: 'Padrão de formulário no React onde o estado interno do elemento de input é gerido e determinado exclusivamente pelo estado do React.',
        aliases: ['Componente Controlado'],
        keywords: ['controlled component', 'componente controlado', 'forms', 'usestate', 'input value'],
        seeAlso: ['uncontrolled-component'],
        examples: [
            {
                title: 'Input totalmente controlado por estado do React',
                language: 'jsx',
                code: `function CampoBusca() {
  const [termo, setTermo] = useState('');

  return (
    <input
      type="text"
      value={termo} // O React é a única fonte da verdade!
      onChange={(e) => setTermo(e.target.value.toUpperCase())} // Modificação em tempo real
    />
  );
}`,
                description: 'O valor exibido reflete rigorosamente o estado atual do React.'
            }
        ],
        content: `### O que é um Controlled Component?

Em formulários HTML padrão, elementos como \`<input>\`, \`<textarea>\` e \`<select>\` mantêm seu próprio estado interno conforme o usuário digita.

Em um **Controlled Component** (Componente Controlado):
- O valor do input é vinculado a um estado do React através da prop \`value\`.
- Cada caractere digitado dispara o evento \`onChange\`, que atualiza o estado via \`setState\`.
- O React atualiza a interface com o novo valor.

Esse padrão transforma o React na **única fonte da verdade** (*single source of truth*), permitindo validações imediatas a cada tecla, formatação de máscaras (CPF, telefone) e desativação dinâmica de botões de envio.`
    },
    {
        slug: 'uncontrolled-component',
        term: 'Uncontrolled Component',
        pronunciation: '/ˌʌn.kənˈtroʊld kəmˈpoʊ.nənt/',
        category: 'React & Frameworks',
        shortSummary: 'Padrão de formulário onde os dados de entrada continuam sob controle do DOM nativo, sendo lidos pelo React sob demanda através de referências.',
        aliases: ['Componente Não-Controlado'],
        keywords: ['uncontrolled component', 'componente nao controlado', 'useref', 'formdata', 'forms'],
        seeAlso: ['controlled-component'],
        examples: [
            {
                title: 'Lendo valor com useRef e FormData',
                language: 'jsx',
                code: `function FormLogin() {
  const emailRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    // Lê o valor diretamente do DOM nativo sem causar re-render na digitação:
    console.log('Email enviado:', emailRef.current.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" ref={emailRef} defaultValue="teste@email.com" />
      <button type="submit">Entrar</button>
    </form>
  );
}`,
                description: 'Não exige handlers de onChange e não re-renderiza o componente ao digitar.'
            }
        ],
        content: `### O que é um Uncontrolled Component?

Um **Uncontrolled Component** (Componente Não-Controlado) mantém a abordagem tradicional da Web:
- Os dados do formulário continuam sendo gerenciados e armazenados internamente pelos nós do próprio DOM.
- O componente React não re-renderiza a cada tecla digitada pelo usuário.
- Quando os dados são necessários (geralmente no evento de \`submit\`), o React acessa os nós diretamente usando um **\`useRef\`** ou extrai os campos com a API nativa **\`new FormData(event.currentTarget)\`**.

---

### Quando utilizar?
- Formulários muito simples onde não há validações dinâmicas a cada tecla.
- Campos de upload de arquivos (\`<input type="file" />\`), que por motivos de segurança do navegador são inerentemente não-controlados.
- Integração de bibliotecas legadas de interface que manipulam nós do DOM diretamente.`
    },
    {
        slug: 'custom-hook',
        term: 'Custom Hook',
        pronunciation: '/ˈkʌs.təm hʊk/',
        category: 'React & Frameworks',
        shortSummary: 'Função JavaScript com prefixo "use" que encapsula e reutiliza lógica de estado e efeitos invocando outros Hooks nativos do React.',
        keywords: ['custom hook', 'hook customizado', 'reutilizacao', 'usestate', 'useeffect'],
        seeAlso: ['usememo', 'usecallback'],
        examples: [
            {
                title: 'Hook customizado de monitoramento de status de conexão',
                language: 'javascript',
                code: `import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return online;
}`,
                description: 'Qualquer componente pode agora checar a conexão consumindo: const online = useOnlineStatus();'
            }
        ],
        content: `### O que é um Custom Hook?

Um **Custom Hook** (Hook Customizado) é uma convenção arquitetural do React onde uma função JavaScript comum é prefixada com a palavra **\`use\`** e internamente invoca outros Hooks (como \`useState\`, \`useEffect\`, \`useRef\`).

Antes dos Hooks, compartilhar lógica com estado exigia padrões complexos como *Higher-Order Components (HOCs)* ou *Render Props*, que poluíam a árvore de nós com dezenas de componentes empacotadores (*wrapper hell*).

---

### Regras dos Custom Hooks
1. **Obrigatório começar com \`use\`:** Permite que o linter do React aplique as Regras dos Hooks (impedir chamadas dentro de loops ou condicionais).
2. **Estado isolado:** Dois componentes que consomem o mesmo Custom Hook **não compartilham o mesmo estado**, cada invocação possui suas próprias variáveis locais de estado na memória.`
    },
    {
        slug: 'usememo',
        term: 'useMemo',
        pronunciation: '/juːz ˈmɛm.oʊ/',
        category: 'React & Frameworks',
        shortSummary: 'Hook do React que permite reutilizar um valor calculado entre renderizações enquanto suas dependências não mudarem.',
        keywords: ['usememo', 'memoization', 'performance', 'react hook', 'cache'],
        seeAlso: ['usecallback', 'virtual-dom', 'react-memo'],
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
        seeAlso: ['usememo', 'closure', 'react-memo'],
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
    }
];
