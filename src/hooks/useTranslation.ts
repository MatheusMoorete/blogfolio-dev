

const translations = {
    heroGreeting: "Olá,",
    heroIntro: "eu sou o ",
    heroName: "Matheus.",
    heroSub: "Desenvolvedor de Software",
    heroCatchphrase: "Busco a engenharia por trás do pixel e a lógica por trás da solução.",
    viewProjects: "Ver Projetos",
    aboutTitle: "Sobre Mim",
    aboutText: "Estou cursando Engenharia de Software, mas já coloco a mão na massa profissionalmente há dois anos. Apesar de gostar de diversos ecossistemas, até o momento, minhas experiências foram com JavaScript, principalmente TypeScript utilizando React e ferramentas como Zustand, React Query, Axios, entre outros. Gosto dessa área pois existem problemas infinitos a serem resolvidos. Um dos meus maiores orgulhos foi solucionar um bug em produção que impedia o login dos usuários devido a dependências cíclicas em uma parte legada e mal estruturada do sistema, onde nenhuma IA conseguiu me auxiliar. Acredito que ser um bom engenheiro vai muito além de decorar frameworks; é entender como a arquitetura sustenta o projeto no longo prazo. Por isso, priorizo sempre os fundamentos da engenharia e os conceitos base da programação, pois o papel do desenvolvedor vai muito além do código — afinal, se fosse só codar, uma IA poderia fazer isso por mim. Fora do trabalho, a programação continua sendo meu hobby principal: se não estou desenvolvendo algo, provavelmente estou em casa criando um projeto pessoal ou estudando algo novo que me chamou a atenção no dia.",
    quickLinks: "Links rápidos",
    projects: "Projetos",
    about: "Sobre Mim",
    blog: "Blog",
    contact: "Contatos",
    fromBlog: "Do blog",
    viewAll: "Ver todos os posts",
    backToBlog: "← Voltar para o blog",
    readEntry: "Ler entrada",
    viewDetails: "Ver Detalhes",
    footer: "© {year} Retro Portfolio - Criado para treinar e armazenar conhecimentos",
    blogTitle: "Blog de Engenharia da Computação",
    endEntry: "Fim da entrada"
};

export const useTranslation = () => {
    const t = (key: keyof typeof translations) => {
        return translations[key] || key;
    };

    return { t, lang: 'pt' };
};
