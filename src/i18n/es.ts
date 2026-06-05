export default {
  nav: {
    what: 'Qué es',
    apps: 'Apps',
    privacy: 'Privacidad',
    cloud: 'Cloud',
    blog: 'Blog',
    docs: 'Docs',
    download: 'Descargar',
  },
  footer: {
    rights: 'Todos los derechos reservados.',
    privacy: 'Privacidad de datos',
    terms: 'Términos',
    github: 'Ver en GitHub',
    contact: '¿Tienes una duda o algún comentario? Escríbenos:',
  },
  home: {
    hero: {
      title1: 'Crea apps inteligentes',
      title2: 'para tu vida y tu trabajo.',
      subtitle:
        'Forger te permite crear apps propias que entienden tus datos, guardan tareas frecuentes y pueden trabajar contigo mediante un agente inteligente.',
      badges: ['Apps inteligentes', 'Tareas con agente', 'Espacio privado', 'Compartibles'],
      ctaPrimary: 'Descargar Forger',
      ctaSecondary: 'Ver ejemplos',
      betaNote:
        'Forger Desktop está en beta. Hoy puedes crear y adaptar apps locales, probar Finance OS como app curada y explorar ejemplos de lo que podrías construir.',
      windows: 'Descargar para Windows',
      blog: 'Leer el blog',
    },

    what: {
      eyebrow: 'Qué es Forger',
      title: 'Apps que hacen más que guardar información',
      body:
        'En Forger, una app puede organizar datos, mostrar pantallas útiles y ejecutar tareas guardadas con ayuda de un agente inteligente. Puedes crear una app para una necesidad concreta, pedirle cambios y compartirla con personas de confianza.',
      points: [
        {
          title: 'Apps propias',
          body: 'Crea herramientas para tus procesos, datos o ideas, sin partir desde una app genérica.',
        },
        {
          title: 'Tareas inteligentes',
          body: 'Guarda acciones frecuentes para que el agente pueda repetirlas cuando las necesites.',
        },
        {
          title: 'Adaptables',
          body: 'Pide ajustes en lenguaje normal y la app puede evolucionar contigo.',
        },
      ],
    },

    chat: {
      eyebrow: 'Adaptación de apps',
      title: 'Pídele cambios como hablarías con una persona',
      body:
        'Puedes pedirle a Forger que agregue una vista, cambie un flujo, revise datos o prepare una tarea nueva dentro de una app. El agente trabaja sobre la app, no en un chat aislado.',
      privacyNote:
        'Tus apps viven en tu espacio local. Forger trabaja con los datos que decides cargar o compartir con cada app.',
    },

    how: {
      eyebrow: 'Cómo funciona',
      title: 'Crea una app, guarda tareas y úsala con un agente',
      body:
        'Forger combina una app local con un agente que entiende qué puede hacer esa app. Así puedes usar pantallas normales cuando quieres control visual y pedir tareas inteligentes cuando quieres avanzar más rápido.',
      steps: [
        {
          title: 'Descarga Forger',
          body: 'Instala Forger Desktop para crear y ejecutar apps en tu espacio privado.',
        },
        {
          title: 'Crea o abre una app',
          body: 'Parte desde una idea propia, desde un ejemplo o desde una app curada como Finance OS.',
        },
        {
          title: 'Pide tareas inteligentes',
          body: 'Guarda tareas frecuentes para que el agente pueda ejecutarlas dentro de la app cuando las necesites.',
        },
      ],
    },

    examples: {
      eyebrow: 'Ejemplos',
      title: 'Ejemplos de apps inteligentes',
      body:
        'Forger sirve para crear apps pequeñas y útiles alrededor de tareas reales. Por ejemplo: una app de entrenamiento de ajedrez, una app de resumen diario de correos, o una app de recetas y macros.',
    },

    apps: {
      eyebrow: 'App curada disponible',
      title: 'Empieza con Finance OS',
      body:
        'Finance OS es la app curada disponible hoy: una herramienta local para ordenar finanzas personales con revisión asistida, dashboards y presupuestos por periodo.',
      available: 'Beta',
      cardCta: 'Ver Finance OS',
    },

    trust: {
      cards: [
        {
          title: 'Tus apps en tu espacio privado',
          body:
            'Las apps instaladas viven en tu computador y trabajan con los datos que decides cargar.',
        },
        {
          title: 'El agente actúa dentro de cada app',
          body:
            'Las tareas inteligentes usan el contexto y las capacidades de la app, no instrucciones sueltas sin estructura.',
        },
        {
          title: 'Crea, adapta y comparte',
          body:
            'Cuando una app te sirve, puedes ajustarla para tu forma de trabajar y compartirla con personas cercanas.',
        },
      ],
    },

    cloud: {
      eyebrow: 'Forger Cloud',
      title: 'Cloud para compartir y continuar, no para reemplazar tu espacio local',
      body:
        'Forger Cloud complementa la experiencia local con cuenta, sincronización, compartir apps y acceso desde más lugares cuando tenga sentido. El punto de partida sigue siendo una app propia en tu espacio privado.',
      items: [
        {
          title: 'Compartir apps',
          body: 'Para enviar una app útil a amigos o personas de confianza.',
        },
        {
          title: 'Sincronización',
          body: 'Para mantener continuidad entre dispositivos cuando lo necesites.',
        },
        {
          title: 'Backups',
          body: 'Para proteger tu espacio de apps.',
        },
        {
          title: 'Acceso remoto',
          body: 'Para usar tus apps desde más lugares cuando esté disponible.',
        },
      ],
    },

    beta: {
      tag: 'Beta abierta',
      title: 'Forger Desktop está en beta y el foco es crear apps inteligentes.',
      body:
        'Hoy Forger permite crear, ejecutar y adaptar apps locales. Finance OS está disponible como app curada, y los ejemplos muestran el tipo de apps inteligentes que puedes construir.',
      items: [
        'Crea apps propias',
        'Guarda tareas para el agente',
        'Usa Finance OS como app curada',
        'Comparte apps con personas de confianza',
      ],
    },

    finalCta: {
      title: 'Descarga Forger y crea tu primera app inteligente',
      body:
        'Parte con una idea concreta, convierte tareas repetidas en acciones guardadas y usa un agente para trabajar dentro de tu app.',
      primary: 'Descargar Forger',
      secondary: 'Ver ejemplos',
    },

    fromBlog: 'Del blog',
  },
  blog: {
    title: 'Blog',
    subtitle: 'Novedades del equipo de Forger.',
    empty: 'Todavía no hay posts. Vuelve pronto.',
    back: '← Todos los posts',
  },
} as const;
