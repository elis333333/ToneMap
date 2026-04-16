export type ShowcaseCard = {
  title: string;
  href: string;
  image: string;
};

export type ExperimentCard = {
  title: string;
  href: string;
  image: string;
  audio: string;
};

export const ABOUT_CONTENT = {
  backgroundImage: "/images/showcase/guitarra.png",
  label: "Sobre Nosotros",
  quote: "“Deja de Memorizar Acordes. Empieza a Sentirlos”",
  intro:
    "La música no es una ciencia, es un arte para transmitir sensación y si no entendemos esto no vamos a poder crear ni interpretar la música.",
  emotionLines: [
    { text: "Es tensión.", color: "purple" },
    { text: "Es descanso.", color: "green" },
    { text: "Es color.", color: "yellow" },
  ],
  conceptCards: [
    {
      title: "Música como\nlenguaje",
      body: "No se trata de memorizar escalas, sino de entender qué estás diciendo al tocar.",
    },
    {
      title: "Música como\nEmoción",
      body: "Cada acorde tiene un color. Cada progresión cuenta una historia.",
    },
    {
      title: "Música como\nSistema",
      body: "La teoría no es una regla. Es un mapa para explorar.",
    },
  ],
  footerQuote:
    "“ToneMap convierte la música en algo que puedes ver, entender y sentir”.",
};

export const MUSIC_INTRO = {
  label: "Mi Música",
  videoHref: "https://www.youtube.com/",
  videoSrc: "/videos/showcase/tu-video-presentacion.mp4",
  poster: "/images/showcase/preview-video.jpg",
  text:
    '“Este es mi laboratorio musical.\nAquí experimento, interpreto y construyo música\ndesde una perspectiva distinta:\nentender lo que suena, no solo tocarlo.\nCada pieza es parte de ese proceso,\ninspirándome en distintas canciones y\nusando herramientas muy útiles para facilitar\nel proceso”.',
};

export const COVERS: ShowcaseCard[] = [
  {
    title: "On the Way - by AiNA THE END",
    href: "https://www.youtube.com/",
    image: "/images/showcase/thumb-cover-1.jpg",
  },
  {
    title: "That Band - by kosuko band",
    href: "https://www.youtube.com/",
    image: "/images/showcase/thumb-cover-2.jpg",
  },
  {
    title: "Aizo - King Gnu",
    href: "https://www.youtube.com/",
    image: "/images/showcase/thumb-cover-3.jpg",
  },
  {
    title: "Hyper ventilation -",
    href: "https://www.youtube.com/",
    image: "/images/showcase/thumb-cover-4.jpg",
  },
];

export const COMPOSITIONS: ShowcaseCard[] = [
  {
    title: "Rain of Broken Hearts",
    href: "https://www.youtube.com/",
    image: "/images/showcase/thumb-compo-1.jpg",
  },
  {
    title: "La casa de mis recuerdos",
    href: "https://www.youtube.com/",
    image: "/images/showcase/thumb-compo-2.jpg",
  },
  {
    title: "Estamos hechos de los mismos átomos",
    href: "https://www.youtube.com/",
    image: "/images/showcase/thumb-compo-3.jpg",
  },
  {
    title: "hate tec...",
    href: "https://www.youtube.com/",
    image: "/images/showcase/thumb-compo-4.jpg",
  },
];

export const EXPERIMENTS: ExperimentCard[] = [
  {
    title: "Experimento 1",
    href: "https://www.youtube.com/",
    image: "/images/showcase/thumb-exp-1.jpg",
    audio: "/audio/experiments/audio-exp-1.mp3",
  },
  {
    title: "Experimento 2",
    href: "https://www.youtube.com/",
    image: "/images/showcase/thumb-exp-2.jpg",
    audio: "/audio/experiments/audio-exp-2.mp3",
  },
  {
    title: "Experimento 3",
    href: "https://www.youtube.com/",
    image: "/images/showcase/thumb-exp-3.jpg",
    audio: "/audio/experiments/audio-exp-3.mp3",
  },
  {
    title: "Experimento 4",
    href: "https://www.youtube.com/",
    image: "/images/showcase/thumb-exp-4.jpg",
    audio: "/audio/experiments/audio-exp-4.mp3",
  },
];

export const MUSIC_CATEGORY_ICONS = {
  covers: "/images/showcase/icons/cover.png",
  compositions: "/images/showcase/icons/compocision.png",
  experiments: "/images/showcase/icons/experimentos.png",
};

export const FOOTER_CONTENT = {
  brandText:
    "Entender la música como un lenguaje visual y emocional. Una experiencia para explorar acordes, canciones e ideas desde lo que transmiten, no solo desde lo que dicen en teoría.",
  navigation: [
    { label: "Home", href: "#home" },
    { label: "Sobre Nosotros", href: "#about-us" },
    { label: "Mi Música", href: "#my-music" },
    { label: "Course", href: "#course" },
  ],
  social: [
    { label: "YouTube", href: "https://www.youtube.com/" },
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "TikTok", href: "https://www.tiktok.com/" },
    { label: "Contacto", href: "mailto:tuemail@correo.com" },
  ],
};