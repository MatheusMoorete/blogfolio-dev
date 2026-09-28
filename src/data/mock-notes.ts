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
            
            <p>Em componentes que registram event listeners ou passam callbacks para componentes memoizados, entender identidade e estabilidade referencial ajuda a controlar dependências, subscriptions e renderizações desnecessárias.</p>

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
            <p>Toda aplicação web que executa JavaScript no contexto principal de uma página possui acesso ao objeto global <a href="/dicionario/window">window</a>. Ele representa o contexto da janela ou aba e expõe diversas APIs do navegador, além de propriedades como <a href="/dicionario/document">document</a>, <code>location</code> e <code>history</code>.</p>

            <h2>Hierarquia e Segurança</h2>
            <p>Quando escrevemos <code>document.querySelector()</code>, estamos utilizando o objeto <a href="/dicionario/document">document</a>, que também está disponível como <code>window.document</code>. Entender a relação entre <a href="/dicionario/window">window</a>, <a href="/dicionario/document">document</a> e o <a href="/dicionario/dom">DOM</a> ajuda a separar melhor as APIs fornecidas pelo navegador das estruturas da própria linguagem JavaScript.</p>

            <pre><code>// Verificação comum para ambientes com SSR e Hydration
if (typeof window !== 'undefined') {
  console.log('Executando no cliente! Viewport:', window.innerWidth);
}</code></pre>

            <p>Ao construir arquiteturas modernas como <a href="/dicionario/spa">SPAs</a> ou aplicações com <a href="/dicionario/hydration">Hidratação (Hydration)</a>, manter a clareza sobre o momento exato em que o <code>window</code> está disponível é essencial para prevenir falhas de renderização.</p>
        `
    }
];
