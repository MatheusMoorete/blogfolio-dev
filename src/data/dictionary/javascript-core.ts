import type { DictionaryTerm } from '../../types/dictionary';

export const JAVASCRIPT_CORE_TERMS: DictionaryTerm[] = [
    {
        slug: 'call-stack',
        term: 'Call Stack',
        pronunciation: '/kɔːl stæk/',
        category: 'JavaScript Core',
        shortSummary: 'Pilha de execução LIFO onde o motor JavaScript registra em qual função o código está no momento e para onde deve retornar ao concluir.',
        aliases: ['Pilha de Chamadas', 'Execution Stack'],
        keywords: ['call stack', 'pilha de execucao', 'lifo', 'stack overflow', 'execution context'],
        seeAlso: ['event-loop', 'microtask', 'task'],
        examples: [
            {
                title: 'Empilhamento e desempilhamento de funções (LIFO)',
                language: 'javascript',
                code: `function primeira() {
  segunda();
}

function segunda() {
  terceira();
}

function terceira() {
  console.trace('Rastro da Call Stack');
}

primeira();
// Ordem no topo da pilha:
// 1. terceira() -> executa e desempilha
// 2. segunda()  -> conclui e desempilha
// 3. primeira() -> conclui e desempilha`,
                description: 'A última função empilhada é sempre a primeira a ser concluída e removida.'
            }
        ],
        content: `### O que é a Call Stack?

A **Call Stack** (Pilha de Chamadas) é a estrutura de dados primária que o motor JavaScript (como o V8 do Chrome/Node ou o JavaScriptCore do Safari) utiliza para rastrear a execução do programa em uma única thread.

Ela funciona sob o princípio **LIFO** (*Last-In, First-Out* — o último a entrar é o primeiro a sair):

1. Quando um script invoca uma função, o motor aloca um novo **Execution Context** (Contexto de Execução) e o empilha no topo da Call Stack.
2. Variáveis locais e argumentos dessa chamada residem nesse contexto.
3. Se essa função chamar outra função, a nova chamada é colocada no topo da pilha.
4. Quando uma função chega ao fim ou executa um \`return\`, seu contexto é desempilhado e a execução é retomada exatamente no ponto de onde foi chamada.

---

### O Estouro de Pilha (*Stack Overflow*)

A memória alocada para a pilha é finita. Quando funções chamam a si mesmas sem uma condição de parada adequada (recursão infinita), a pilha atinge seu limite máximo e o motor interrompe a execução com um erro fatal:

\`\`\`javascript
function recursaoInfinita() {
  recursaoInfinita(); // Nunca desempilha!
}

recursaoInfinita(); // RangeError: Maximum call stack size exceeded
\`\`\`

---

### Relação com o Event Loop

Como a thread principal do JavaScript possui apenas **uma única Call Stack**, qualquer operação puramente síncrona que tome muito tempo (como processamento de imagem pesado ou loops matemáticos longos) bloqueia a pilha (*blocking the main thread*), impedindo o navegador de responder a cliques ou atualizar o display.`
    },
    {
        slug: 'microtask',
        term: 'Microtask',
        pronunciation: '/ˈmaɪ.kroʊ.tæsk/',
        category: 'JavaScript Core',
        shortSummary: 'Tarefa assíncrona de alta prioridade executada imediatamente após a conclusão da task atual, antes de o Event Loop ceder a vez para renderização ou para a próxima task.',
        keywords: ['microtask', 'promise', 'queuemicrotask', 'microtask checkpoint', 'event loop'],
        seeAlso: ['task', 'event-loop', 'call-stack'],
        examples: [
            {
                title: 'Enfileirando uma microtask manualmente',
                language: 'javascript',
                code: `console.log('1. Síncrono');

queueMicrotask(() => {
  console.log('2. Microtask executada');
});

console.log('3. Síncrono final');

// Saída:
// 1. Síncrono
// 3. Síncrono final
// 2. Microtask executada`,
                description: 'A microtask roda assim que o script síncrono atual termina.'
            }
        ],
        content: `### O que é uma Microtask?

Uma **Microtask** é uma instrução assíncrona agendada para ser processada em um momento especial chamado **microtask checkpoint**, que ocorre logo após o código síncrono da task atual terminar de rodar e a Call Stack esvaziar.

As principais fontes de microtasks no frontend são:
- Callbacks de Promises resolvidas ou rejeitadas (\`.then()\`, \`.catch()\`, \`.finally()\`).
- Continuações após expressões \`await\` em funções \`async\`.
- Chamadas diretas à API nativa \`queueMicrotask()\`.
- Callbacks disparados por mutações observadas via \`MutationObserver\`.

---

### O Microtask Checkpoint e Drenagem da Fila

Ao contrário das tasks comuns (onde o navegador processa uma por vez e pode intercalar renderização), a **Microtask Queue é completamente drenada**:

Enquanto houver microtasks pendentes na fila, o motor continuará processando-as sequencialmente antes de seguir em frente.

> [!WARNING]
> Se uma microtask agendar continuamente novas microtasks de forma recursiva, ela criará um ciclo infinito que impede o navegador de processar eventos do usuário ou redesenhar a tela (*microtask starvation*).`
    },
    {
        slug: 'task',
        term: 'Task (Macrotask)',
        pronunciation: '/tæsk/',
        category: 'JavaScript Core',
        shortSummary: 'Unidade discreta e autônoma de trabalho coordenada pelo Event Loop, originada de timers, eventos de interação, I/O de rede ou parsing inicial de HTML.',
        aliases: ['Macrotask', 'Macrotarefa'],
        keywords: ['task', 'macrotask', 'settimeout', 'event loop', 'timer', 'io'],
        seeAlso: ['microtask', 'event-loop'],
        examples: [
            {
                title: 'Diferença de agendamento entre Task e Microtask',
                language: 'javascript',
                code: `setTimeout(() => {
  console.log('Task: setTimeout');
}, 0);

Promise.resolve().then(() => {
  console.log('Microtask: Promise');
});

// Saída:
// Microtask: Promise
// Task: setTimeout`,
                description: 'Microtasks sempre têm prioridade no encerramento da execução síncrona atual.'
            }
        ],
        content: `### O que é uma Task?

Na especificação formal do HTML da Web, o termo padrão é simplesmente **Task** (embora na comunidade e em materiais didáticos seja comum o termo informal *Macrotask* para contrapor diretamente a *Microtask*).

Uma Task representa um bloco independente de trabalho atribuído à thread principal. Exemplos clássicos de eventos que geram tasks:
- Execução inicial de uma tag \`<script>\`.
- Disparo de eventos de interação do usuário (clique, digitação, envio de formulário).
- Callbacks agendados por temporizadores (\`setTimeout\`, \`setInterval\`).
- Finalização de requisições de rede ou eventos de I/O.

---

### O Ciclo da Task no Event Loop

1. O Event Loop seleciona a tarefa mais antiga de uma de suas filas de tasks.
2. Executa a tarefa de forma síncrona até a Call Stack esvaziar.
3. Executa o **Microtask Checkpoint**, processando todas as microtasks existentes.
4. Avalia a necessidade de atualizar a interface visual (pipeline de renderização: cálculo de estilos, layout e pintura).
5. Passa para a próxima task disponível.`
    },
    {
        slug: 'prototype-chain',
        term: 'Prototype Chain',
        pronunciation: '/ˈproʊ.tə.taɪp tʃeɪn/',
        category: 'JavaScript Core',
        shortSummary: 'Mecanismo de herança prototípica do JavaScript onde objetos compartilham propriedades e métodos encadeando referências internas a outros objetos.',
        aliases: ['Cadeia de Protótipos', 'Prototypal Inheritance'],
        keywords: ['prototype', 'prototype chain', 'heranca prototipica', 'proto', 'object prototype'],
        seeAlso: ['closure', 'scope-chain'],
        examples: [
            {
                title: 'Navegando pela cadeia de protótipos',
                language: 'javascript',
                code: `const animal = {
  som() { return 'som genérico'; }
};

const cachorro = Object.create(animal);
cachorro.latir = function() { return 'au au'; };

console.log(cachorro.latir()); // 'au au' (do próprio objeto)
console.log(cachorro.som());   // 'som genérico' (herdado do protótipo animal)
console.log(Object.getPrototypeOf(cachorro) === animal); // true`,
                description: 'Quando a propriedade não existe no objeto atual, o motor sobe a cadeia até encontrar.'
            }
        ],
        content: `### O que é a Prototype Chain?

Em JavaScript, a herança entre objetos não se baseia em classes tradicionais que clonam estruturas, mas sim em **ligações dinâmicas por referência**, chamadas de herança prototípica.

Cada objeto em JavaScript possui uma propriedade interna oculta chamada **\`[[Prototype]]\`** (acessada em código moderno através de \`Object.getPrototypeOf(obj)\` ou historicamente por \`__proto__\`).

Quando você tenta ler uma propriedade ou invocar um método em um objeto:
1. O motor procura diretamente nas propriedades do próprio objeto (*own properties*).
2. Se não encontrar, ele consulta o objeto apontado por seu \`[[Prototype]]\`.
3. Se ainda não encontrar, sobe para o protótipo do protótipo.
4. A busca continua até encontrar a propriedade ou atingir \`Object.prototype\` cujo \`[[Prototype]]\` final aponta para \`null\`. Caso chegue ao fim sem encontrar, o retorno é \`undefined\`.

---

### E as classes do ES6?

A palavra-chave \`class\` introduzida no ECMAScript 2015 é fundamentalmente **açúcar sintático** sobre a cadeia de protótipos. Métodos definidos dentro de uma classe são automaticamente alocados no \`Classe.prototype\`, economizando memória ao permitir que todas as instâncias compartilhem a mesma referência de função.`
    },
    {
        slug: 'garbage-collection',
        term: 'Garbage Collection (GC)',
        pronunciation: '/ˈɡɑːr.bɪdʒ kəˈlɛk.ʃən/',
        category: 'JavaScript Core',
        shortSummary: 'Gerenciamento automático de memória no runtime que identifica e desaloca blocos de memória previamente atribuídos que não são mais alcançáveis pelo programa.',
        aliases: ['Coletor de Lixo', 'GC'],
        keywords: ['garbage collection', 'gc', 'memoria', 'mark and sweep', 'memory leak', 'reachability'],
        seeAlso: ['call-stack', 'closure'],
        examples: [
            {
                title: 'Alcançabilidade e liberação de memória',
                language: 'javascript',
                code: `let usuario = { nome: 'Alice' }; 
// O objeto { nome: 'Alice' } está alcançável via variável 'usuario'

usuario = null; 
// Agora o objeto não possui mais nenhuma referência ativa.
// Ele se torna elegível para o Garbage Collector limpar.`,
                description: 'Objetos sem referências alcançáveis são coletados automaticamente.'
            }
        ],
        content: `### O que é Garbage Collection?

Ao contrário de linguagens como C ou Rust, onde a alocação e desalocação de memória são manuais ou definidas no tempo de compilação, o JavaScript gerencia a memória automaticamente através do **Garbage Collector**.

O princípio fundamental utilizado pelos motores modernos (como o V8) é o conceito de **Alcançabilidade** (*Reachability*):

- Um conjunto de valores é considerado intrinsecamente alcançável (as chamadas **Raízes / Roots**):
  - Variáveis e funções locais na Call Stack atual.
  - Parâmetros da cadeia de chamadas ativa.
  - Variáveis globais (\`window\` no navegador, \`globalThis\`).
  - Nós do DOM atualmente conectados ao documento.
- Qualquer outro objeto é considerado vivo se puder ser alcançado a partir dessas raízes através de referências.

---

### O Algoritmo Mark-and-Sweep

Periodicamente, o motor executa o algoritmo de marcação e varredura:
1. **Mark (Marcação):** O GC percorre todas as raízes e marca os objetos alcançados. Em seguida, percorre as referências desses objetos e marca os subsequentes.
2. **Sweep (Varredura):** Todos os objetos na memória que não foram marcados durante a travessia são desalocados, devolvendo o espaço livre para o sistema operacional.`
    },
    {
        slug: 'temporal-dead-zone',
        term: 'Temporal Dead Zone (TDZ)',
        pronunciation: '/ˈtɛm.pər.əl dɛd zoʊn/',
        category: 'JavaScript Core',
        shortSummary: 'Intervalo temporal entre a entrada em um escopo de bloco e a linha em que uma variável declarada com let ou const é formalmente inicializada.',
        aliases: ['TDZ', 'Zona Morta Temporal'],
        keywords: ['tdz', 'temporal dead zone', 'let', 'const', 'hoisting', 'referenceerror'],
        seeAlso: ['hoisting', 'scope-chain'],
        examples: [
            {
                title: 'Disparo de ReferenceError dentro da TDZ',
                language: 'javascript',
                code: `{
  // A TDZ para 'valor' começa aqui na abertura do bloco
  // console.log(valor); // ReferenceError: Cannot access 'valor' before initialization

  let valor = 42; // A TDZ termina aqui após a inicialização!
  console.log(valor); // 42
}`,
                description: 'Acessar variáveis antes de sua inicialização em let e const causa erro em tempo de execução.'
            }
        ],
        content: `### O que é a Temporal Dead Zone?

A **Temporal Dead Zone (TDZ)** é um comportamento introduzido no ECMAScript 6 para variáveis declaradas com \`let\` e \`const\` e para classes (\`class\`).

Diferente do \`var\` (que é içado e inicializado de imediato com \`undefined\`), as declarações de \`let\` e \`const\` são associadas ao escopo de bloco no momento da compilação, mas **não são inicializadas**.

Elas permanecem inacessíveis dentro dessa "zona morta" até que a linha da declaração seja fisicamente executada. Qualquer tentativa de leitura ou escrita prévia resulta em:

\`\`\`
ReferenceError: Cannot access 'variavel' before initialization
\`\`\`

---

### Por que é chamada de "Temporal"?

A palavra **temporal** é precisa porque a restrição depende da **ordem no tempo de execução**, e não puramente da posição física no código-fonte:

\`\`\`javascript
function ler() {
  console.log(msg); // Chamada quando msg já foi inicializada
}

// ler(); // Se invocada aqui, dispararia ReferenceError!

let msg = 'Olá mundo!';
ler(); // Funciona perfeitamente, pois no tempo de execução msg já existe!
\`\`\``
    },
    {
        slug: 'scope-chain',
        term: 'Scope Chain',
        pronunciation: '/skoʊp tʃeɪn/',
        category: 'JavaScript Core',
        shortSummary: 'Mecanismo hierárquico pelo qual o motor JavaScript procura o valor de variáveis em escopos pais com base na estrutura estática do código.',
        aliases: ['Cadeia de Escopos'],
        keywords: ['scope chain', 'escopo', 'lexical scope', 'escopo lexico', 'variaveis'],
        seeAlso: ['closure', 'temporal-dead-zone'],
        examples: [
            {
                title: 'Resolução hierárquica de escopo',
                language: 'javascript',
                code: `const global = 'A';

function externa() {
  const intermediario = 'B';
  
  function interna() {
    const local = 'C';
    console.log(local, intermediario, global);
  }
  
  interna();
}

externa(); // 'C B A'`,
                description: 'A função interna procura a variável localmente; se não encontrar, sobe para externa e depois para o escopo global.'
            }
        ],
        content: `### O que é a Scope Chain?

A **Scope Chain** (Cadeia de Escopos) é a hierarquia de escopos que o JavaScript utiliza para resolver identificadores de variáveis e funções.

O JavaScript adota o modelo de **Escopo Léxico** (*Lexical Scoping*): isso significa que os limites de escopo e a ordem de resolução são determinados pela **posição onde as funções foram escritas no código-fonte**, e não por onde ou como elas são chamadas durante a execução.

Quando uma variável é referenciada dentro de uma função:
1. O motor procura no escopo local do bloco ou função atual.
2. Se não encontrar, consulta o escopo léxico pai imediatamente acima.
3. Continua subindo até atingir o escopo global (\`window\` no browser).
4. Se o identificador não for encontrado nem mesmo no escopo global, um \`ReferenceError\` é lançado.`
    },
    {
        slug: 'currying',
        term: 'Currying',
        pronunciation: '/ˈkɜːr.i.ɪŋ/',
        category: 'JavaScript Core',
        shortSummary: 'Técnica de programação funcional onde uma função com múltiplos argumentos é convertida em uma sequência de funções que recebem um único argumento por vez.',
        keywords: ['currying', 'programacao funcional', 'aridade', 'higher order function', 'closure'],
        seeAlso: ['closure'],
        examples: [
            {
                title: 'Convertendo função tradicional em curried',
                language: 'javascript',
                code: `// Função padrão: soma(a, b, c)
const somaTradicional = (a, b, c) => a + b + c;

// Versão com Currying: soma(a)(b)(c)
const somaCurried = a => b => c => a + b + c;

const soma5 = somaCurried(5);
const soma5e10 = soma5(10);
console.log(soma5e10(2)); // 17`,
                description: 'Permite configurar parâmetros passo a passo gerando funções especializadas reutilizáveis.'
            }
        ],
        content: `### O que é Currying?

Nomeado em homenagem ao matemático Haskell Curry, o **Currying** é uma técnica originada do cálculo lambda onde uma função com aridade $N$ (\`f(a, b, c)\`) é transformada em uma cadeia de $N$ funções unárias (\`f(a)(b)(c)\`).

Cada função intermediária consome exatamente um argumento e retorna uma nova função aguardando o argumento seguinte, até que todos tenham sido fornecidos e o cálculo final seja realizado.

---

### Currying vs. Aplicação Parcial (*Partial Application*)

Embora muito semelhantes, há uma distinção conceitual:
- **Currying:** Sempre divide a função em chamadas que recebem rigorosamente **um argumento por vez**.
- **Aplicação Parcial:** Fixa um número qualquer de argumentos prévios e retorna uma nova função que pode aceitar os parâmetros restantes todos de uma vez (ex: \`fn.bind(null, arg1, arg2)\`).`
    },
    {
        slug: 'debounce',
        term: 'Debounce',
        pronunciation: '/diːˈbaʊns/',
        category: 'JavaScript Core',
        shortSummary: 'Estratégia de limitação de taxa que posterga a execução de uma rotina até que um período de inatividade especificado tenha passado desde a sua última invocação.',
        keywords: ['debounce', 'rate limiting', 'performance', 'input', 'search', 'timeout'],
        seeAlso: ['throttle', 'event-loop'],
        examples: [
            {
                title: 'Implementação clássica de Debounce',
                language: 'javascript',
                code: `function debounce(fn, atrasoMs) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), atrasoMs);
  };
}

const buscarNaApi = debounce((termo) => {
  console.log('Buscando dados para:', termo);
}, 300);

// Se o usuário digitar 'r', 're', 'rea', 'react' rapidamente,
// a busca só executa UMA vez, 300ms após a última letra.`,
                description: 'Cancela o temporizador anterior a cada nova chamada, disparando apenas no silêncio.'
            }
        ],
        content: `### O que é Debounce?

O termo **Debounce** vem da eletrônica (onde interruptores mecânicos criavam ruídos ao fechar contato, exigindo estabilização). No desenvolvimento web, é uma técnica essencial de otimização de performance.

O Debounce garante que uma função intensiva só seja executada quando o usuário **fizer uma pausa** nas ações disparadoras.

---

### Casos de Uso Recomendados
1. **Campos de busca com Auto-complete:** Esperar o usuário parar de digitar por 300ms antes de disparar requisições HTTP para a API.
2. **Validação de formulários em tempo real:** Não checar disponibilidade de e-mail ou força de senha a cada tecla solta, apenas após o usuário pausar.
3. **Persistência de rascunhos (*auto-save*):** Salvar alterações no editor após 1 segundo sem novas edições.`
    },
    {
        slug: 'throttle',
        term: 'Throttle',
        pronunciation: '/ˈθrɑː.təl/',
        category: 'JavaScript Core',
        shortSummary: 'Estratégia de limitação de taxa que restringe a frequência máxima com que uma rotina pode ser invocada ao longo do tempo a um intervalo fixo e constante.',
        keywords: ['throttle', 'rate limiting', 'scroll', 'resize', 'performance'],
        seeAlso: ['debounce', 'event-loop'],
        examples: [
            {
                title: 'Implementação clássica de Throttle',
                language: 'javascript',
                code: `function throttle(fn, limiteMs) {
  let aguardando = false;
  return function(...args) {
    if (!aguardando) {
      fn.apply(this, args);
      aguardando = true;
      setTimeout(() => {
        aguardando = false;
      }, limiteMs);
    }
  };
}

window.addEventListener('scroll', throttle(() => {
  console.log('Posição de scroll verificada a cada 200ms');
}, 200));`,
                description: 'Executa no máximo uma vez a cada período determinado, mesmo sob centenas de eventos contínuos.'
            }
        ],
        content: `### O que é Throttle?

O **Throttle** (do inglês "estrangulador" ou regulador de vazão) impõe um teto rígido na taxa de disparo de uma função.

Diferente do Debounce (que aguarda o usuário parar completamente), o Throttle **continua executando a função periodicamente** enquanto os eventos continuam acontecendo, espaçando as execuções em intervalos regulares pré-definidos (ex: no máximo a cada 100ms).

---

### Debounce vs. Throttle: Quando usar cada um?

- Use **Debounce** quando você só quer o resultado **depois que tudo parou** (ex: digitação de busca, redimensionamento de janela).
- Use **Throttle** quando você precisa de **feedback contínuo durante a ação**, mas em uma frequência controlada que não sobrecarregue a thread (ex: rolagem contínua para atualizar barra de leitura, arrasto de elementos em drag-and-drop).`
    },
    {
        slug: 'hoisting',
        term: 'Hoisting',
        pronunciation: '/ˈhɔɪ.stɪŋ/',
        category: 'JavaScript Core',
        shortSummary: 'Mecanismo de compilação do JavaScript no qual declarações de funções e variáveis são alocadas na memória antes da execução do código.',
        keywords: ['hoisting', 'var', 'let', 'const', 'temporal dead zone', 'tdz'],
        seeAlso: ['closure', 'event-loop', 'temporal-dead-zone'],
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
        slug: 'closure',
        term: 'Closure',
        pronunciation: '/ˈkloʊ.ʒɚ/',
        category: 'JavaScript Core',
        shortSummary: 'A capacidade de uma função lembrar e acessar seu escopo léxico original, mesmo quando está sendo executada fora desse escopo.',
        keywords: ['closure', 'closures', 'escopo lexico', 'lexical scope', 'funcao'],
        seeAlso: ['hoisting', 'event-loop', 'scope-chain'],
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
        seeAlso: ['closure', 'window', 'call-stack', 'microtask', 'task'],
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
    }
];
