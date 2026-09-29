

const translations = {
    heroGreeting: "Olá,",
    heroIntro: "eu sou o ",
    heroName: "Matheus.",
    heroSub: "Desenvolvedor de Software",
    heroCatchphrase: "Busco a engenharia por trás do pixel e a lógica por trás da solução.",
    viewProjects: "Ver Projetos",
    aboutTitle: "Sobre Mim",
    aboutText: `Desenvolvedor de software focado em TypeScript, arquitetura frontend e nos internals da plataforma Web. Priorizo fundamentos sólidos em vez de modismos. Entender como o navegador realmente se comporta, como gerenciar estado e ciclo de vida de uma aplicação, e como observar o que acontece em produção é o que sustenta um sistema fácil de manter, mais do que qualquer framework do momento.

Encaro desenvolvimento como engenharia contínua: investigo a causa raiz dos problemas em vez de tratar sintomas, estudo as especificações abertas por trás das APIs que uso todo dia, e documento publicamente tudo o que aprendo nesse processo.`,
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
