import type { StudyNote } from '../types/study-notes';

export const MOCK_NOTES: StudyNote[] = [
    {
        id: 'note-1',
        slug: 'react-hooks-avancados',
        title: 'React Hooks Avançados',
        description: 'Um mergulho profundo em useCallback e useMemo com exemplos práticos.',
        category: 'react',
        tags: ['hooks', 'performance', 'frontend'],
        pinPosition: null,
        createdAt: '2026-01-10T10:00:00Z',
        updatedAt: '2026-01-11T14:30:00Z',
        content: `
            <h1>Entendendo Referências</h1>
            <p>Quando trabalhamos com React, entender como o Javascript lida com referências de objetos e funções é crucial para otimizar a performance.</p>
            
            <pre><code>const MemoizedComponent = React.memo(({ handler }) => {
  console.log("Renderizou!");
  return <button onClick={handler}>Click me</button>;
});

const Parent = () => {
  // Sem useCallback, essa função é recriada em todo render
  const handleClick = () => console.log("Clicked");
  
  return <MemoizedComponent handler={handleClick} />;
};</code></pre>

            <h2>O Problema</h2>
            <p>Mesmo usando <code>React.memo</code>, o componente filho renderiza novamente. Por quê?</p>
            <p>Porque <code>handleClick</code> é uma <strong>nova função</strong> a cada renderização do Pai. O Javascript compara por referência, e <code>funcA !== funcB</code> mesmo se o código for igual.</p>
            
            <p>Visualização do fluxo de renderização (React Profiler).</p>
        `
    }
];
