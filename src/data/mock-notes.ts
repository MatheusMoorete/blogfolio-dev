import type { StudyNote } from '../types/study-notes';

export const MOCK_NOTES: StudyNote[] = [
    {
        id: 'note-1',
        slug: 'react-hooks-avancados',
        title: 'React Hooks Avançados',
        subtitle: 'Dominando estabilidade referencial e renderização no React',
        description: 'Um mergulho profundo em useCallback e useMemo com exemplos práticos.',
        category: 'react',
        tags: ['hooks', 'performance', 'frontend', 'usecallback', 'usememo'],
        pinPosition: 1,
        createdAt: '2026-01-10T10:00:00Z',
        updatedAt: '2026-01-11T14:30:00Z',
        content: `
            <h1>Entendendo Referências e Renderização</h1>
            <p>Quando trabalhamos com React e manipulamos o <a href="/dicionario/virtual-dom">Virtual DOM</a>, entender como o motor JavaScript lida com referências de objetos e <a href="/dicionario/closure">closures</a> é crucial para otimizar a performance da interface.</p>
            
            <p>Em componentes complexos que interagem com a janela global <a href="/dicionario/window">window</a> através de event listeners, garantir a estabilidade referencial evita renderizações em cascata e vazamentos de memória.</p>

            <pre><code>const MemoizedComponent = React.memo(({ handler }) => {
  console.log("Renderizou!");
  return <button onClick={handler}>Click me</button>;
});

const Parent = () => {
  // Sem useCallback, essa função é recriada em todo render
  const handleClick = () => console.log("Clicked");
  
  return <MemoizedComponent handler={handleClick} />;
};</code></pre>

            <h2>O Problema da Igualdade Referencial</h2>
            <p>Mesmo usando <code>React.memo</code>, o componente filho renderiza novamente. Por quê?</p>
            <p>Porque <code>handleClick</code> é uma <strong>nova função</strong> a cada renderização do componente Pai. O JavaScript compara por referência, e <code>funcA !== funcB</code> mesmo se o corpo do código for idêntico.</p>
            
            <p>Para solucionar isso, usamos o hook <a href="/dicionario/usecallback">useCallback</a> para fixar a referência da função, e quando necessário computações pesadas, aplicamos o <a href="/dicionario/usememo">useMemo</a> para armazenar o valor em cache.</p>
        `
    },
    {
        id: 'note-2',
        slug: 'engenharia-do-browser-window-e-dom',
        title: 'Engenharia do Browser: Do Window ao DOM',
        subtitle: 'Como o navegador processa o JavaScript e organiza os nós da página',
        description: 'Desvendando o papel do objeto window, a árvore do DOM e os segredos da renderização no frontend.',
        category: 'frontend',
        tags: ['browser', 'window', 'dom', 'javascript', 'engenharia'],
        pinPosition: 2,
        createdAt: '2026-01-15T14:00:00Z',
        updatedAt: '2026-01-16T18:00:00Z',
        content: `
            <h1>A Raiz de Tudo no Navegador</h1>
            <p>Toda aplicação web moderna que roda no cliente opera sob o escopo de um objeto global: o <a href="/dicionario/window">window</a>. Ele não é apenas um repositório de variáveis globais; é a própria interface que o navegador expõe para que nosso código interaja com a aba, com a máquina do usuário e com o <a href="/dicionario/dom">DOM</a>.</p>

            <h2>Hierarquia e Segurança</h2>
            <p>Quando escrevemos <code>document.querySelector()</code>, na realidade estamos acessando uma propriedade do <a href="/dicionario/window">window</a> (<a href="/dicionario/document">document</a>). Entender essa separação é o primeiro passo para arquitetar aplicações seguras, lidar com <a href="/dicionario/cors">CORS</a> em requisições assíncronas e evitar gargalos no <a href="/dicionario/event-loop">Event Loop</a>.</p>

            <pre><code>// Verificação comum para ambientes com SSR e Hydration
if (typeof window !== 'undefined') {
  console.log('Executando no cliente! Viewport:', window.innerWidth);
}</code></pre>

            <p>Ao construir arquiteturas modernas como <a href="/dicionario/spa">SPAs</a> ou aplicações com <a href="/dicionario/hydration">Hidratação (Hydration)</a>, manter a clareza sobre o momento exato em que o <code>window</code> está disponível é essencial para prevenir falhas de renderização.</p>
        `
    }
];
