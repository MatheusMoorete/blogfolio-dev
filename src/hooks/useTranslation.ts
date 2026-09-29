

const translations = {
    heroGreeting: "Olá,",
    heroIntro: "eu sou o ",
    heroName: "Matheus.",
    heroSub: "Desenvolvedor de Software",
    heroCatchphrase: "Busco a engenharia por trás do pixel e a lógica por trás da solução.",
    viewProjects: "Ver Projetos",
    aboutTitle: "Sobre Mim",
    aboutText: `Desenvolvedor de software focado em TypeScript, arquitetura frontend e os internals da plataforma Web.

Minha abordagem prioriza fundamentos sólidos em vez de modismos: entendo o comportamento de navegadores, gerenciamento de estado, ciclo de vida de aplicações e observabilidade para construir sistemas escaláveis e fáceis de manter.

Encaro o desenvolvimento como uma disciplina contínua de engenharia, investigando a causa raiz de problemas em produção, estudando especificações abertas e documentando publicamente tudo o que aprendo.`,
    quickLinks: "Links rápidos",
    projects: "Projetos",
    about: "Sobre Mim",
    blog: "Blog",
    contact: "Contatos",
    dictionary: "Dicionário",
    fromBlog: "Do blog",
    viewAll: "Ver todos os posts",
    backToBlog: "← Voltar para o blog",
    readEntry: "Ler entrada",
    viewDetails: "Ver Detalhes",
    footer: "© {year} Retro Portfolio - Criado para treinar e armazenar conhecimentos",
    blogTitle: "Blog",
    blogSubtitle: "Aqui eu compartilho o que estou lendo e estudando no momento para ajudar na fixação e documentar minha evolução na engenharia.",
    endEntry: "Fim da entrada"
};

export const useTranslation = () => {
    const t = (key: keyof typeof translations) => {
        return translations[key] || key;
    };

    return { t, lang: 'pt' };
};
