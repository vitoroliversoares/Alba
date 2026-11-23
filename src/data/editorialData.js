export const CATALOG_FAVORITES_KEY = 'revista-campus:prototype:favorites:v1';
export const SAVED_TOPICS_KEY = 'revista-campus:prototype:paths:v1';
export const MOMENTS_STORAGE_KEY = 'revista-campus:prototype:moments:v1';

export const TOPICS = [
  {
    id: 'estudo',
    indexLabel: '01',
    name: 'Estudo',
    icon: 'open-book',
    tone: 'ochre',
    title: 'Um mundo para aprender.',
    description: 'Cursos, idiomas e ferramentas para levar suas ideias mais longe.',
    editorialNote: 'Do primeiro semestre ao TCC, caminhos curados sem ruído.',
    highlights: ['Cursos e trilhas técnicas', 'Prática de idiomas', 'Bibliotecas e pesquisa'],
    image: 'campus.png',
    alt: 'Um campus universitário cercado por árvores e caminhos.',
    criteriaSummary: [
      { icon: 'arrow-up-right', label: 'Fonte', value: 'Página oficial do programa educacional' },
      { icon: 'calendar', label: 'Conferência', value: 'Data da última revisão editorial visível' },
      { icon: 'shield-check', label: 'Elegibilidade', value: 'Requisitos informados com clareza, sem envio de matrícula ao Hub' },
    ],
  },
  {
    id: 'criatividade',
    indexLabel: '02',
    name: 'Criatividade',
    icon: 'palette',
    tone: 'peach',
    title: 'Espaço para o que você cria.',
    description: 'Novas possibilidades para desenhar, editar e colocar projetos no mundo.',
    editorialNote: 'Ferramentas de estúdio para portfólio, design e produção autoral.',
    highlights: ['Design e ilustração', 'Edição de foto e vídeo', 'Prototipagem de projetos'],
    image: 'category-creative.png',
    alt: 'Mesa de um ateliê com caderno de desenhos, laptop e materiais criativos.',
    criteriaSummary: [
      { icon: 'arrow-up-right', label: 'Fonte', value: 'Endereço oficial dos planos estudantis do fornecedor' },
      { icon: 'calendar', label: 'Conferência', value: 'Registro claro de quando as condições foram lidas' },
      { icon: 'shield-check', label: 'Condições', value: 'Diferença entre gratuidade, desconto estudantil e renovação' },
    ],
  },
  {
    id: 'bem-estar',
    indexLabel: '03',
    name: 'Bem-estar',
    icon: 'coffee-cup',
    tone: 'sage',
    title: 'A rotina também pede respiro.',
    description: 'Pequenos aliados para se organizar, encontrar o foco e cuidar de você.',
    editorialNote: 'Ritmo sustentável entre provas, entregas e momentos de pausa.',
    highlights: ['Foco sem distrações', 'Organização do semestre', 'Pausas e saúde mental'],
    image: 'category-wellbeing-v2.png',
    alt: 'Poltrona verde e mesa com caderno junto a uma janela voltada para o campus.',
    criteriaSummary: [
      { icon: 'arrow-up-right', label: 'Fonte', value: 'Destino direto no site oficial do serviço' },
      { icon: 'calendar', label: 'Conferência', value: 'Data de verificação e aviso honesto quando precisar de revisão' },
      { icon: 'shield-check', label: 'Privacidade', value: 'Catálogo aberto; escolhas guardadas na sua conta' },
    ],
  },
];

export const STEPS = [
  {
    id: 'descubra',
    number: '01',
    label: 'Descubra',
    icon: 'compass',
    progress: 0.08,
    title: 'Encontre o que você precisa.',
    text: 'Explore as editorias ou busque pelo nome de um serviço no catálogo. Filtre por categoria e tipo de benefício.',
    detail: 'Caminhos claros por editoria, busca e modalidade.',
  },
  {
    id: 'entenda',
    number: '02',
    label: 'Entenda',
    icon: 'shield-check',
    progress: 0.5,
    title: 'As condições, sem letras miúdas.',
    text: 'Saiba para quem é o benefício, quais são os requisitos e onde conferir a informação. A fonte e a data da última verificação fazem parte da descoberta.',
    detail: 'Elegibilidade, condições e data da conferência sempre à vista.',
  },
  {
    id: 'guarde',
    number: '03',
    label: 'Guarde',
    icon: 'bookmark',
    progress: 0.94,
    title: 'Guarde para quando precisar.',
    text: 'Crie sua conta gratuita para guardar benefícios e reencontrá-los quando precisar. Para ativar uma oferta, siga para o site oficial do fornecedor.',
    detail: 'Suas descobertas guardadas na sua conta.',
  },
];

export const DOSSIER_PAGES = [
  {
    id: 'entra',
    page: 'Pág. 01',
    icon: 'sparks',
    title: 'O que entra na edição',
    summary: 'Apenas benefícios digitais realmente voltados para estudantes: gratuidades, licenças e planos com elegibilidade comprovada.',
    bullets: [
      'Ferramentas de estudo, criação, código e rotina',
      'Sem promoções genéricas disfarçadas de benefício estudantil',
      'Disponibilidade no Brasil conferida antes de afirmar elegibilidade',
    ],
  },
  {
    id: 'conferimos',
    page: 'Pág. 02',
    icon: 'calendar',
    title: 'Como conferimos cada ficha',
    summary: 'Cada oferta publicada carrega rastro editorial explícito para que você decida com segurança antes de clicar.',
    bullets: [
      'Link direto para a página oficial do fornecedor',
      'Data da última verificação editorial visível na ficha',
      'Preços e condições só aparecem quando confirmados na fonte',
    ],
  },
  {
    id: 'privacidade',
    page: 'Pág. 03',
    icon: 'shield-check',
    title: 'O que nunca pedimos',
    summary: 'Explorar, filtrar e guardar descobertas é livre. A Alba organiza o caminho sem coletar documentos acadêmicos.',
    bullets: [
      'Nenhum comprovante de matrícula ou documento pessoal',
      'Navegação e marcadores locais sem login obrigatório',
      'Ativação sempre feita diretamente no ambiente do fornecedor',
    ],
  },
];

export const ROUTINE_MOMENTS = [
  {
    id: 'provas-tcc',
    label: 'Estudando para provas ou TCC',
    hint: 'Pesquisa, cursos e leitura concentrada',
    icon: 'open-book',
    topics: ['estudo', 'bem-estar'],
  },
  {
    id: 'portfolio',
    label: 'Tirando um projeto criativo do papel',
    hint: 'Design, edição e apresentação visual',
    icon: 'palette',
    topics: ['criatividade'],
  },
  {
    id: 'idiomas-codigo',
    label: 'Aprendendo idioma ou programação',
    hint: 'Trilhas contínuas além da sala de aula',
    icon: 'graduation-cap',
    topics: ['estudo', 'criatividade'],
  },
  {
    id: 'ritmo-foco',
    label: 'Organizando rotina e pausas',
    hint: 'Menos sobrecarga, mais clareza no dia',
    icon: 'coffee-cup',
    topics: ['bem-estar'],
  },
];

export const ANATOMY_HOTSPOTS = [
  {
    id: 'source',
    label: 'Fonte oficial',
    icon: 'arrow-up-right',
    badge: 'Destino direto',
    title: 'Sempre para a página do fornecedor',
    text: 'A Alba não vende assinaturas nem intermedia ativações. Cada ficha publicada aponta para o endereço oficial onde o fornecedor detalha o benefício.',
  },
  {
    id: 'date',
    label: 'Data de conferência',
    icon: 'calendar',
    badge: 'Verificação visível',
    title: 'Rastro editorial sempre à mostra',
    text: 'Você vê quando e em qual fonte a oferta foi conferida pela última vez. Quando uma revisão ficar pendente, o aviso aparece com transparência — sem presumir expiração.',
  },
  {
    id: 'eligibility',
    label: 'Elegibilidade clara',
    icon: 'shield-check',
    badge: 'Sem letras miúdas',
    title: 'Requisitos descritos antes do clique',
    text: 'Explicamos o que o fornecedor costuma exigir e se há confirmação de disponibilidade no Brasil. A Alba nunca solicita comprovante de matrícula ou documentos.',
  },
  {
    id: 'bookmark',
    label: 'Suas descobertas',
    icon: 'bookmark',
    badge: 'Favoritos na conta',
    title: 'Explore e salve no seu ritmo',
    text: 'Explore, pesquise e filtre sem cadastro. Para guardar favoritos e editorias, crie sua conta gratuita e leve suas escolhas para outros aparelhos.',
  },
];

export const MARQUEE_ITEMS = [
  { icon: 'open-book', label: 'Cursos e idiomas' },
  { icon: 'palette', label: 'Ferramentas de criação' },
  { icon: 'headphones', label: 'Aliados de foco' },
  { icon: 'shield-check', label: 'Fonte oficial em cada ficha' },
  { icon: 'calendar', label: 'Data de conferência visível' },
  { icon: 'bookmark', label: 'Exploração livre sem cadastro' },
  { icon: 'graduation-cap', label: 'Pensado para estudantes no Brasil' },
];

export const FAQ_ITEMS = [
  {
    question: 'Preciso criar uma conta?',
    answer: 'Para explorar, buscar e consultar as ofertas, não. Para guardar favoritos e editorias, crie uma conta gratuita ou entre na sua conta.',
  },
  {
    question: 'Como sei se posso usar um benefício?',
    answer: 'Abra o item no catálogo para conferir requisitos, preço, duração e a fonte oficial, com a data da consulta. A aprovação é feita pelo fornecedor. Confira também a renovação: um teste grátis pode gerar cobrança depois.',
  },
  {
    question: 'A Alba pede documentos?',
    answer: 'Não. A Alba não solicita nem guarda documentos ou comprovantes de matrícula. Se o benefício exigir comprovação, você faz isso diretamente no site oficial do fornecedor.',
  },
  {
    question: 'Meus favoritos aparecem em outro aparelho?',
    answer: 'Sim. Suas escolhas ficam vinculadas à sua conta. Entre com o mesmo e-mail em outro aparelho para reencontrar os favoritos e as editorias que você guardou.',
  },
  {
    question: 'Como encontro um benefício?',
    answer: 'Abra “Explorar benefícios”, busque pelo nome do serviço e use “Filtrar” para escolher o tipo de oferta. Abra o item que interessar para conferir os detalhes e o link oficial.',
    keyboardTip: 'No computador, Ctrl + K ou ⌘ + K também abre a navegação rápida da apresentação.',
  },
];

export const LANDING_SECTIONS = [
  { id: 'a-revista', number: '01', label: 'A Alba', hint: 'Conheça a proposta' },
  { id: 'possibilidades', number: '02', label: 'Possibilidades', hint: 'Estudo, criatividade e bem-estar' },
  { id: 'rotina', number: '03', label: 'Sua rotina', hint: 'Recorte sugerido de caminhos' },
  { id: 'como-funciona', number: '04', label: 'Como funciona', hint: 'Jornada com o café 3D' },
  { id: 'transparencia', number: '05', label: 'Transparência', hint: 'Condições, custos e fontes das ofertas' },
  { id: 'duvidas', number: '06', label: 'Dúvidas', hint: 'Perguntas frequentes' },
];
