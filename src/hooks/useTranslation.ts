import { useState, useEffect } from 'react';

const translations = {
    en: {
        heroGreeting: "Hello,",
        heroIntro: "I'm ",
        heroName: "Matheus.",
        heroSub: "Software Developer",
        heroCatchphrase: "I seek the engineering behind the pixel and the logic behind the solution.",
        viewProjects: "View Projects",
        aboutTitle: "About Me",
        aboutText: "I'm currently studying Software Engineering, but I've already been working in the field for two years. So far, my focus has been on the JavaScript/TypeScript ecosystem, using React and tools like Zustand, React Query, and Axios. I enjoy this field because there are infinite problems to be solved. One of my proudest achievements was fixing a production bug that prevented users from logging in due to cyclic dependencies in a legacy part of the system that was so messy that no AI tool could help me. I believe being a good engineer goes far beyond mastering frameworks; it's about understanding how architecture sustains a project in the long run. That's why I prioritize fundamental programming concepts and engineering pillars, as a developer's role goes far beyond code — after all, if it were just about coding, an IA could do it for me. Outside of work, programming remains my main hobby: if I'm not developing something, I'm likely building a personal project or studying a new topic that caught my interest during the day.",
        quickLinks: "Quick links",
        projects: "Projects",
        about: "About",
        blog: "Blog",
        contact: "Contact",
        fromBlog: "From the blog",
        viewAll: "View all blog posts",
        backToBlog: "← Back to blog",
        readEntry: "Read entry",
        viewDetails: "View Details",
        footer: "© {year} Retro Portfolio - Built with React & TypeScript",
        blogTitle: "Computer Engineering Blog",
        endEntry: "End of entry"
    },
    pt: {
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
    }
};

export const useTranslation = () => {
    const [lang, setLang] = useState<'en' | 'pt'>('en');

    useEffect(() => {
        const browserLang = navigator.language.split('-')[0];
        if (browserLang === 'pt') {
            setLang('pt');
        } else {
            setLang('en');
        }
    }, []);

    const t = (key: keyof typeof translations['en']) => {
        return translations[lang][key] || key;
    };

    return { t, lang };
};
