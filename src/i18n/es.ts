export default {
  nav: {
    what: 'Qué es',
    features: 'Funciones',
    beta: 'Beta',
    blog: 'Blog',
    download: 'Descargar',
  },
  footer: {
    rights: 'Todos los derechos reservados.',
    privacy: 'Privacidad de datos',
    terms: 'Términos',
  },
  home: {
    badge: 'Beta abierta',
    heroTitle1: 'La app store',
    heroTitle2: 'del futuro.',
    heroSubtitle:
      'Descarga apps y habla con ellas. Haz preguntas, manipula tus datos, cambia la interfaz o cómo se comportan — todo en lenguaje natural. Sin nube. Sin suscripción. Solo tu máquina.',
    ctaDownload: 'Descargar para macOS',
    ctaDownloadWindows: 'Descargar para Windows',
    ctaBlog: 'Leer el blog →',

    what: {
      title: '¿Qué es Forger?',
      body: 'Es una plataforma de apps local donde cada app te entiende. Piénsalo como una app store donde en vez de solo hacer clic en botones, puedes tener una conversación con la app misma. Las apps viven en tu máquina y solo en tu máquina.',
    },

    features: [
      {
        icon: 'MessageSquare',
        title: 'Habla con tus apps',
        body: 'Cada app tiene un asistente de IA integrado. Pregunta sobre tus datos, pide cambios o simplemente explora — en lenguaje natural.',
      },
      {
        icon: 'Sliders',
        title: 'Modifica comportamiento y apariencia',
        body: '¿No te gusta cómo funciona algo? Díselo a la app. Cambia layouts, ajusta lógica, renombra cosas — el agente lo hace realidad.',
      },
      {
        icon: 'HardDrive',
        title: '100% en tu máquina',
        body: 'Las apps se instalan localmente. Tus datos nunca tocan un servidor. Nadie — ni nosotros ni nadie — puede ver lo que haces dentro de Forger.',
      },
      {
        icon: 'ShieldCheck',
        title: 'Entorno controlado',
        body: 'El agente de IA está instruido estrictamente para tocar solo las apps instaladas desde Forger. Nada más de tu sistema es accesible.',
      },
    ],

    beta: {
      tag: 'Aviso de beta',
      title: 'Esta es una beta temprana — solo necesitas una cuenta de ChatGPT.',
      body: 'Forger es completamente gratis, para siempre. Para activar la IA, conectas tu cuenta de ChatGPT existente vía OAuth — sin API keys, sin copiar tokens. Solo inicias sesión y listo.',
      items: [
        'Forger es gratis. Siempre.',
        'Conecta tu cuenta de ChatGPT en un clic (OAuth)',
        'Sin API keys ni configuración manual',
        'El uso de IA lo cobra OpenAI a tu cuenta de ChatGPT',
      ],
    },

    fromBlog: 'Del blog',
    allPosts: 'Ver todos →',
  },
  blog: {
    title: 'Blog',
    subtitle: 'Novedades del equipo de Forger.',
    empty: 'Todavía no hay posts. Vuelve pronto.',
    back: '← Todos los posts',
  },
} as const;
