const iconMap = {
  overview: (className) => `
    <svg class="${className}" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 3.25C4.25736 3.25 3.25 4.25736 3.25 5.5V8.99998C3.25 10.2426 4.25736 11.25 5.5 11.25H9C10.2426 11.25 11.25 10.2426 11.25 8.99998V5.5C11.25 4.25736 10.2426 3.25 9 3.25H5.5ZM4.75 5.5C4.75 5.08579 5.08579 4.75 5.5 4.75H9C9.41421 4.75 9.75 5.08579 9.75 5.5V8.99998C9.75 9.41419 9.41421 9.74998 9 9.74998H5.5C5.08579 9.74998 4.75 9.41419 4.75 8.99998V5.5ZM5.5 12.75C4.25736 12.75 3.25 13.7574 3.25 15V18.5C3.25 19.7426 4.25736 20.75 5.5 20.75H9C10.2426 20.75 11.25 19.7427 11.25 18.5V15C11.25 13.7574 10.2426 12.75 9 12.75H5.5ZM4.75 15C4.75 14.5858 5.08579 14.25 5.5 14.25H9C9.41421 14.25 9.75 14.5858 9.75 15V18.5C9.75 18.9142 9.41421 19.25 9 19.25H5.5C5.08579 19.25 4.75 18.9142 4.75 18.5V15ZM12.75 5.5C12.75 4.25736 13.7574 3.25 15 3.25H18.5C19.7426 3.25 20.75 4.25736 20.75 5.5V8.99998C20.75 10.2426 19.7426 11.25 18.5 11.25H15C13.7574 11.25 12.75 10.2426 12.75 8.99998V5.5ZM15 4.75C14.5858 4.75 14.25 5.08579 14.25 5.5V8.99998C14.25 9.41419 14.5858 9.74998 15 9.74998H18.5C18.9142 9.74998 19.25 9.41419 19.25 8.99998V5.5C19.25 5.08579 18.9142 4.75 18.5 4.75H15ZM15 12.75C13.7574 12.75 12.75 13.7574 12.75 15V18.5C12.75 19.7426 13.7574 20.75 15 20.75H18.5C19.7426 20.75 20.75 19.7427 20.75 18.5V15C20.75 13.7574 19.7426 12.75 18.5 12.75H15ZM14.25 15C14.25 14.5858 14.5858 14.25 15 14.25H18.5C18.9142 14.25 19.25 14.5858 19.25 15V18.5C19.25 18.9142 18.9142 19.25 18.5 19.25H15C14.5858 19.25 14.25 18.9142 14.25 18.5V15Z" fill="currentColor"/>
    </svg>
  `,
  finance: (className) => `
    <svg class="${className}" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2.75C7.44365 2.75 3.75 6.44365 3.75 11C3.75 15.5563 7.44365 19.25 12 19.25C16.5563 19.25 20.25 15.5563 20.25 11C20.25 6.44365 16.5563 2.75 12 2.75ZM2.25 11C2.25 5.61522 6.61522 1.25 12 1.25C17.3848 1.25 21.75 5.61522 21.75 11C21.75 16.3848 17.3848 20.75 12 20.75C6.61522 20.75 2.25 16.3848 2.25 11ZM12 5.25C12.4142 5.25 12.75 5.58579 12.75 6V6.80505C14.1388 7.12093 15.125 8.16743 15.125 9.4375C15.125 9.85171 14.7892 10.1875 14.375 10.1875C13.9608 10.1875 13.625 9.85171 13.625 9.4375C13.625 8.8902 12.9596 8.375 12 8.375C11.0404 8.375 10.375 8.8902 10.375 9.4375C10.375 9.9848 11.0404 10.5 12 10.5C13.7455 10.5 15.125 11.6442 15.125 13.1875C15.125 14.4576 14.1388 15.5041 12.75 15.8199V16.625C12.75 17.0392 12.4142 17.375 12 17.375C11.5858 17.375 11.25 17.0392 11.25 16.625V15.8199C9.8612 15.5041 8.875 14.4576 8.875 13.1875C8.875 12.7733 9.21079 12.4375 9.625 12.4375C10.0392 12.4375 10.375 12.7733 10.375 13.1875C10.375 13.7348 11.0404 14.25 12 14.25C12.9596 14.25 13.625 13.7348 13.625 13.1875C13.625 12.6402 12.9596 12.125 12 12.125C10.2545 12.125 8.875 10.9808 8.875 9.4375C8.875 8.16743 9.8612 7.12093 11.25 6.80505V6C11.25 5.58579 11.5858 5.25 12 5.25Z" fill="currentColor"/>
    </svg>
  `,
  sales: (className) => `
    <svg class="${className}" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M3.25 19C3.25 18.5858 3.58579 18.25 4 18.25H20C20.4142 18.25 20.75 18.5858 20.75 19C20.75 19.4142 20.4142 19.75 20 19.75H4C3.58579 19.75 3.25 19.4142 3.25 19ZM6 14.25C6.41421 14.25 6.75 14.5858 6.75 15V19C6.75 19.4142 6.41421 19.75 6 19.75C5.58579 19.75 5.25 19.4142 5.25 19V15C5.25 14.5858 5.58579 14.25 6 14.25ZM12 10.25C12.4142 10.25 12.75 10.5858 12.75 11V19C12.75 19.4142 12.4142 19.75 12 19.75C11.5858 19.75 11.25 19.4142 11.25 19V11C11.25 10.5858 11.5858 10.25 12 10.25ZM18 6.25C18.4142 6.25 18.75 6.58579 18.75 7V19C18.75 19.4142 18.4142 19.75 18 19.75C17.5858 19.75 17.25 19.4142 17.25 19V7C17.25 6.58579 17.5858 6.25 18 6.25ZM14.5303 4.96967C14.8232 5.26256 14.8232 5.73744 14.5303 6.03033L12.5303 8.03033C12.2374 8.32322 11.7626 8.32322 11.4697 8.03033L9.75 6.31066L7.53033 8.53033C7.23744 8.82322 6.76256 8.82322 6.46967 8.53033C6.17678 8.23744 6.17678 7.76256 6.46967 7.46967L9.21967 4.71967C9.51256 4.42678 9.98744 4.42678 10.2803 4.71967L12 6.43934L13.4697 4.96967C13.7626 4.67678 14.2374 4.67678 14.5303 4.96967Z" fill="currentColor"/>
    </svg>
  `,
  operations: (className) => `
    <svg class="${className}" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9893 2.45733C11.4077 1.89655 12.2476 1.89656 12.6661 2.45733L14.8399 5.36938L18.3373 5.89091C19.0107 5.99133 19.2701 6.82185 18.7982 7.28694L16.2743 9.77467L16.8855 13.2906C17.0044 13.9747 16.3249 14.504 15.7207 14.183L12.0001 12.2065L8.27952 14.183C7.67538 14.504 6.99584 13.9747 7.11476 13.2906L7.72595 9.77467L5.20209 7.28694C4.73012 6.82185 4.98958 5.99133 5.66293 5.89091L9.16038 5.36938L10.9893 2.45733ZM12.0001 4.12303L10.7398 5.81056C10.6268 5.96186 10.456 6.05983 10.2687 6.08775L8.24137 6.39007L9.72477 7.85194C9.85881 7.984 9.9199 8.17231 9.88779 8.35703L9.53658 10.3778L11.6742 9.24197C11.8714 9.13706 12.1287 9.13706 12.3259 9.24197L14.4636 10.3778L14.1124 8.35703C14.0803 8.17231 14.1414 7.984 14.2754 7.85194L15.7588 6.39007L13.7315 6.08775C13.5442 6.05983 13.3734 5.96186 13.2604 5.81056L12.0001 4.12303ZM5.25 18C5.25 16.4812 6.48122 15.25 8 15.25H16C17.5188 15.25 18.75 16.4812 18.75 18V18.5C18.75 18.9142 18.4142 19.25 18 19.25C17.5858 19.25 17.25 18.9142 17.25 18.5V18C17.25 17.3096 16.6904 16.75 16 16.75H8C7.30964 16.75 6.75 17.3096 6.75 18V18.5C6.75 18.9142 6.41421 19.25 6 19.25C5.58579 19.25 5.25 18.9142 5.25 18.5V18Z" fill="currentColor"/>
    </svg>
  `,
  logistics: (className) => `
    <svg class="${className}" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M3.25 6C3.25 4.48122 4.48122 3.25 6 3.25H13C14.5188 3.25 15.75 4.48122 15.75 6V6.25H16.5406C17.1893 6.25 17.7958 6.56556 18.1661 7.095L20.8755 10.9656C21.1533 11.3625 21.3022 11.8352 21.3022 12.3197V15C21.3022 15.4142 20.9664 15.75 20.5522 15.75H19.591C19.2525 17.0433 18.0773 18 16.6781 18C15.2789 18 14.1037 17.0433 13.7652 15.75H10.2369C9.89839 17.0433 8.72317 18 7.32397 18C5.92476 18 4.74955 17.0433 4.41102 15.75H3.75C3.33579 15.75 3 15.4142 3 15V6.25L3.25 6ZM15.75 7.75V12.75H19.7706V12.3197C19.7706 12.1478 19.7178 11.9801 19.6192 11.8392L16.9098 7.96856C16.8185 7.83805 16.6689 7.75 16.5092 7.75H15.75ZM14.25 14.25H13.7652C13.8545 13.9087 14.0022 13.5914 14.1972 13.31C14.1393 13.2341 14.0799 13.1593 14.0192 13.0856C13.889 12.9277 13.7997 12.7403 13.7588 12.5398C13.7337 12.4168 13.7249 12.2916 13.7325 12.167V6C13.7325 5.30964 13.1728 4.75 12.4825 4.75H6C5.30964 4.75 4.75 5.30964 4.75 6V14.25H4.41102C4.74955 12.9567 5.92476 12 7.32397 12C8.72317 12 9.89839 12.9567 10.2369 14.25H14.25ZM7.32397 13.5C6.49854 13.5 5.8293 14.1693 5.8293 14.9947C5.8293 15.8201 6.49854 16.4893 7.32397 16.4893C8.14939 16.4893 8.81863 15.8201 8.81863 14.9947C8.81863 14.1693 8.14939 13.5 7.32397 13.5ZM16.6781 13.5C15.8527 13.5 15.1834 14.1693 15.1834 14.9947C15.1834 15.8201 15.8527 16.4893 16.6781 16.4893C17.5035 16.4893 18.1728 15.8201 18.1728 14.9947C18.1728 14.1693 17.5035 13.5 16.6781 13.5Z" fill="currentColor"/>
    </svg>
  `,
  customers: (className) => `
    <svg class="${className}" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C8.68629 2 6 4.68629 6 8C6 11.3137 8.68629 14 12 14C15.3137 14 18 11.3137 18 8C18 4.68629 15.3137 2 12 2ZM7.5 8C7.5 5.51472 9.51472 3.5 12 3.5C14.4853 3.5 16.5 5.51472 16.5 8C16.5 10.4853 14.4853 12.5 12 12.5C9.51472 12.5 7.5 10.4853 7.5 8ZM4.62939 21C4.33158 19.3879 5.09355 17.8106 6.4529 16.945C8.08316 15.9069 10.0076 15.5 12 15.5C13.9924 15.5 15.9168 15.9069 17.5471 16.945C18.9065 17.8106 19.6684 19.3879 19.3706 21H20.893C21.229 18.8923 20.1706 16.8209 18.3512 15.662C16.4862 14.4746 14.2818 14 12 14C9.71822 14 7.51382 14.4746 5.64878 15.662C3.82944 16.8209 2.77098 18.8923 3.10703 21H4.62939Z" fill="currentColor"/>
    </svg>
  `
};

export const navigationGroups = [
  {
    key: "estrategico",
    label: "Estratégico",
    icon: "overview",
    href: "estrategico.html",
  },
  {
    key: "operacional",
    label: "Operacional",
    icon: "operations",
    href: "operacional.html",
  },
  {
    key: "financeiro",
    label: "Financeiro",
    icon: "finance",
    href: "financeiro.html",
  },
  {
    key: "comercial",
    label: "Comercial",
    icon: "sales",
    href: "comercial.html",
  },
  {
    key: "clientes",
    label: "Clientes",
    icon: "customers",
    href: "clientes.html",
  },
  {
    key: "estoque",
    label: "Estoque",
    icon: "logistics",
    href: "estoque.html",
  },
];

export const dashboardLevels = [
  {
    key: "estrategico",
    label: "Estrategico",
    description:
      "Sintetiza saude, risco e tendencia para decisoes da diretoria e liderancas executivas.",
    audience: "Diretoria e gerencias executivas",
    cadence: "Semanal e mensal",
    anchor: "#nivel-estrategico",
    badgeClass:
      "bg-blue-light-50 text-blue-light-700 dark:bg-blue-light-500/15 dark:text-blue-light-300",
    borderClass: "border-blue-light-200 dark:border-blue-light-800/40",
  },
  {
    key: "tatico",
    label: "Tatico",
    description:
      "Organiza metas, prioridades e desvios por area para coordenacao das equipes.",
    audience: "Gerencias e coordenacoes",
    cadence: "Diario e semanal",
    anchor: "#nivel-tatico",
    badgeClass:
      "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
    borderClass: "border-brand-200 dark:border-brand-800/40",
  },
  {
    key: "operacional",
    label: "Operacional",
    description:
      "Mostra fila, excecao e ritmo de execucao para acao imediata nas operacoes.",
    audience: "Supervisao e operacao",
    cadence: "Intradia e diario",
    anchor: "#nivel-operacional",
    badgeClass:
      "bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300",
    borderClass: "border-warning-200 dark:border-warning-800/40",
  },
];

export const pageCatalog = {
  overview: {
    href: "index.html",
    title: "Panorama corporativo",
    navLabel: "Panorama",
    domainLabel: "Central",
    description:
      "Acompanhe a saude da empresa em uma unica visao, com acesso rapido aos dashboards por area.",
    focus: "Leitura executiva",
    levelKey: "estrategico",
    levelLabel: "Estrategico",
    levelDescription:
      "Resume o que precisa de decisao executiva, com prioridade para risco, tendencia e impacto empresarial.",
    audience: "Diretoria e liderancas executivas",
    cadence: "Semanal e mensal",
    badgeClass:
      "bg-blue-light-50 text-blue-light-700 dark:bg-blue-light-500/15 dark:text-blue-light-300",
  },
  "financeiro-dashboard": {
    href: "financeiro-dashboard.html",
    groupKey: "financeiro",
    groupLabel: "Financeiro",
    title: "Dashboard financeiro",
    navLabel: "Visao geral",
    domainLabel: "Financeiro",
    description:
      "Receita, margem, liquidez e riscos concentrados em um painel para decisao rapida.",
    focus: "Fluxo e rentabilidade",
    levelKey: "estrategico",
    levelLabel: "Estrategico",
    levelDescription:
      "Consolida liquidez, margem e exposicao financeira para orientar decisoes de priorizacao e risco.",
    audience: "Diretoria financeira e controladoria",
    cadence: "Semanal e mensal",
    badgeClass:
      "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-300",
  },
  "financeiro-fluxo-caixa": {
    href: "financeiro-fluxo-caixa.html",
    groupKey: "financeiro",
    groupLabel: "Financeiro",
    title: "Fluxo de caixa",
    navLabel: "Fluxo de caixa",
    domainLabel: "Financeiro",
    description:
      "Organize entradas, saidas e saldo projetado para os proximos ciclos operacionais.",
    focus: "Curto prazo e previsao",
    levelKey: "tatico",
    levelLabel: "Tatico",
    levelDescription:
      "Desdobra a disponibilidade de caixa para planejamento de curto prazo e reprogramacao de pagamentos.",
    audience: "Tesouraria e controladoria",
    cadence: "Diario e semanal",
    badgeClass:
      "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-300",
  },
  "comercial-dashboard": {
    href: "comercial-dashboard.html",
    groupKey: "comercial",
    groupLabel: "Comercial",
    title: "Dashboard comercial",
    navLabel: "Visao de vendas",
    domainLabel: "Comercial",
    description:
      "Consolide receita fechada, pipeline, conversao e performance dos vendedores.",
    focus: "Receita e conversao",
    levelKey: "tatico",
    levelLabel: "Tatico",
    levelDescription:
      "Orienta a gerencia comercial na distribuicao de carteira, cobertura de meta e qualidade do pipeline.",
    audience: "Gerencia comercial e lideres de canal",
    cadence: "Diario e semanal",
    badgeClass:
      "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
  },
  "comercial-pipeline": {
    href: "comercial-pipeline.html",
    groupKey: "comercial",
    groupLabel: "Comercial",
    title: "Pipeline comercial",
    navLabel: "Pipeline",
    domainLabel: "Comercial",
    description:
      "Enxergue volume, valor e bloqueios por etapa para priorizar as oportunidades certas.",
    focus: "Oportunidades e gargalos",
    levelKey: "operacional",
    levelLabel: "Operacional",
    levelDescription:
      "Acompanha fila de oportunidades e proximos passos para destravar execucao comercial no ciclo corrente.",
    audience: "Executivos de conta e coordenacao de vendas",
    cadence: "Intradia e diario",
    badgeClass:
      "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
  },
  "operacoes-dashboard": {
    href: "operacoes-dashboard.html",
    groupKey: "operacoes",
    groupLabel: "Operacoes",
    title: "Dashboard operacional",
    navLabel: "Visao operacional",
    domainLabel: "Operacoes",
    description:
      "Produtividade, eficiencia, qualidade e carga das linhas em uma visao unica.",
    focus: "Capacidade e execucao",
    levelKey: "tatico",
    levelLabel: "Tatico",
    levelDescription:
      "Conecta desempenho consolidado, gargalos e capacidade para coordenar a operacao no curto prazo.",
    audience: "Gerencia industrial e coordenacoes fabris",
    cadence: "Diario e semanal",
    badgeClass:
      "bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300",
  },
  "operacoes-produtividade": {
    href: "operacoes-produtividade.html",
    groupKey: "operacoes",
    groupLabel: "Operacoes",
    title: "Produtividade e capacidade",
    navLabel: "Produtividade",
    domainLabel: "Operacoes",
    description:
      "Compare desempenho por linha, turno e celula para agir onde a perda e maior.",
    focus: "Ritmo e balanceamento",
    levelKey: "operacional",
    levelLabel: "Operacional",
    levelDescription:
      "Explica onde a execucao esta falhando agora, com foco em perda, fila e prioridade de acao no chao de fabrica.",
    audience: "Supervisao, lideres de turno e PCP",
    cadence: "Intradia e diario",
    badgeClass:
      "bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300",
  },
  "logistica-dashboard": {
    href: "logistica-dashboard.html",
    groupKey: "logistica",
    groupLabel: "Logistica",
    title: "Dashboard logistico",
    navLabel: "Visao logistica",
    domainLabel: "Logistica",
    description:
      "Controle expedicao, entregas e cobertura de estoque sem perder o nivel de servico.",
    focus: "SLA e disponibilidade",
    levelKey: "tatico",
    levelLabel: "Tatico",
    levelDescription:
      "Ajuda a coordenar reposicao, expedicao e SLA com leitura consolidada por rota e cobertura.",
    audience: "Gerencia logistica e planejamento",
    cadence: "Diario e semanal",
    badgeClass:
      "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  },
  "logistica-estoque": {
    href: "logistica-estoque.html",
    groupKey: "logistica",
    groupLabel: "Logistica",
    title: "Estoque e cobertura",
    navLabel: "Estoque",
    domainLabel: "Logistica",
    description:
      "Priorize itens criticos, giro e ruptura antes que a operacao sinta o impacto.",
    focus: "Giro e disponibilidade",
    levelKey: "operacional",
    levelLabel: "Operacional",
    levelDescription:
      "Mostra risco imediato de ruptura, reposicao e movimentacao para acao do time logistico.",
    audience: "Planejamento logistico e supervisao de estoque",
    cadence: "Intradia e diario",
    badgeClass:
      "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  },
};

export const getIconMarkup = (iconKey, className = "") => {
  const renderer = iconMap[iconKey] || iconMap.overview;

  return renderer(className);
};
