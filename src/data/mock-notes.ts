import type { StudyNote } from '../types/study-notes';

export const MOCK_NOTES: StudyNote[] = [
    {
        id: 'note-1',
        slug: 'react-hooks-avancados',
        title: 'React Hooks Avançados',
        description: 'Um mergulho profundo em useCallback e useMemo com exemplos práticos.',
        category: 'react',
        tags: ['hooks', 'performance', 'frontend'],
        createdAt: '2026-01-10T10:00:00Z',
        updatedAt: '2026-01-11T14:30:00Z',
        layout: [
            // Row 1: Intro Text (Full Width)
            { i: 'block-1', x: 0, y: 0, w: 12, h: 4 },
            // Row 2: Code Example (Left) + Explanation (Right)
            { i: 'block-2', x: 0, y: 4, w: 6, h: 8 },
            { i: 'block-3', x: 6, y: 4, w: 6, h: 8 },
            // Row 3: Image (Full Width)
            { i: 'block-4', x: 0, y: 12, w: 12, h: 6 },
        ],
        blocks: {
            'block-1': {
                id: 'block-1',
                type: 'markdown',
                content: '# Entendendo Referências\n\nQuando trabalhamos com React, entender como o Javascript lida com referências de objetos e funções é crucial para otimizar a performance.'
            },
            'block-2': {
                id: 'block-2',
                type: 'code',
                language: 'typescript',
                content: `const MemoizedComponent = React.memo(({ handler }) => {
  console.log("Renderizou!");
  return <button onClick={handler}>Click me</button>;
});

const Parent = () => {
  // Sem useCallback, essa função é recriada em todo render
  const handleClick = () => console.log("Clicked");
  
  return <MemoizedComponent handler={handleClick} />;
};`
            },
            'block-3': {
                id: 'block-3',
                type: 'markdown',
                content: '## O Problema\n\nMesmo usando `React.memo`, o componente filho renderiza novamente. Por quê?\n\nPorque `handleClick` é uma **nova função** a cada renderização do Pai. O Javascript compara por referência, e `funcA !== funcB` mesmo se o código for igual.'
            },
            'block-4': {
                id: 'block-4',
                type: 'text',
                content: 'Visualização do fluxo de renderização (React Profiler).'
            }
        }
    }
];
