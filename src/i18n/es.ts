export default {
  nav: {
    what: 'Qué es',
    apps: 'Apps',
    privacy: 'Privacidad',
    cloud: 'Cloud',
    blog: 'Blog',
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
      title1: 'La app store',
      title2: 'del futuro.',
      subtitle:
        'Apps abiertas, privadas y potenciadas por IA. Instala herramientas locales, conversa con sus datos y adáptalas a tu forma de trabajar.',
      badges: ['Open-source', 'Local-first', 'AI-powered', 'Cloud-ready'],
      ctaPrimary: 'Descargar Forger',
      ctaSecondary: 'Ver apps',
      windows: 'Descargar para Windows',
      blog: 'Leer el blog',
    },

    what: {
      eyebrow: 'Qué es Forger',
      title: 'Apps reales, corriendo en tu computador',
      body:
        'Forger no es otro dashboard en la nube. Es una forma de instalar y usar aplicaciones abiertas en tu propio espacio local, con una capa de IA que entiende cada app y sus datos.',
      points: [
        {
          title: 'Apps abiertas',
          body: 'El core local, el contrato de apps y las primeras apps base parten desde código abierto y verificable.',
        },
        {
          title: 'Local-first',
          body: 'Las apps se instalan en un workspace privado y trabajan con los datos que decides cargar en cada una.',
        },
        {
          title: 'IA contextual',
          body: 'La IA no reemplaza la app: ayuda a consultarla, entenderla y adaptarla con cambios concretos.',
        },
      ],
    },

    chat: {
      eyebrow: 'Adaptación de apps',
      title: 'Personaliza apps como tú quieras',
      body:
        'Pídele a Forger un cambio concreto y el asistente trabaja dentro de la app local, en vez de reemplazarla por un chat genérico.',
      privacyNote:
        'Para usar funciones de IA, Forger usa la cuenta o suscripción que tú conectas. Los datos de tus apps se manejan localmente en tu workspace, y Forger no tiene acceso a tus datos financieros.',
    },

    how: {
      eyebrow: 'Cómo funciona',
      title: 'Una capa de IA para potenciar múltiples apps',
      body:
        'Forger Desktop instala apps locales, prepara su entorno y conecta cada app con la suscripción de ChatGPT que tú decidas usar.',
      steps: [
        {
          title: 'Instala y conecta',
          body: 'Instala Forger y conecta tu suscripción de ChatGPT para que las apps usen una capa de IA bajo tu control.',
        },
        {
          title: 'Descarga apps',
          body: 'Elige aplicaciones personales desde el catálogo y ejecútalas localmente en tu workspace privado.',
        },
        {
          title: 'Conversa y adapta',
          body: 'Pregunta, revisa información o pide ajustes concretos sobre la app.',
        },
      ],
    },

    apps: {
      eyebrow: 'Apps disponibles',
      title: 'Empieza con Finance OS',
      body:
        'Finance OS es la primera app fuerte del ecosistema: una herramienta local para ordenar finanzas personales con revisión asistida, dashboards y presupuestos por periodo.',
      available: 'Disponible',
      cardCta: 'Ver landing de Finance OS',
      nextLabel: 'Ecosistema',
      nextTitle: 'Más apps personales sobre el mismo stack',
      nextBody:
        'Forger está diseñado para que una misma capa local pueda instalar, operar y adaptar distintas apps abiertas, cada una con sus propios datos.',
      future: ['Recetas locales', 'CRM personal', 'Inventario del hogar'],
    },

    trust: {
      cards: [
        {
          title: 'Tus apps. Tus datos. Tu computador.',
          body:
            'Las apps instaladas viven en un workspace privado. El acceso a archivos externos ocurre cuando tú los compartes con una app para una tarea concreta.',
        },
        {
          title: 'Seguridad como base del desktop',
          body:
            'Forger Desktop está diseñado alrededor de límites locales, permisos explícitos y una separación clara entre la interfaz, el runtime y las apps instaladas.',
        },
        {
          title: 'Un core abierto para apps personales',
          body:
            'Forger Desktop, el runtime local, el contrato de apps y las primeras apps base forman el núcleo abierto del ecosistema.',
        },
      ],
    },

    cloud: {
      eyebrow: 'Forger Cloud',
      title: 'Cloud cuando tenga sentido, no por defecto',
      body:
        'Forger Cloud será la capa opcional para sincronización, hosting administrado, acceso móvil, backups y ejecución remota. El punto de partida sigue siendo local: Forger Desktop y apps abiertas en tu máquina.',
      items: [
        {
          title: 'Sincronización',
          body: 'Para llevar tus apps personales a más dispositivos cuando lo necesites.',
        },
        {
          title: 'Hosting administrado',
          body: 'Para usar apps sin administrar infraestructura local.',
        },
        {
          title: 'Acceso móvil',
          body: 'Para consultar o operar apps desde el teléfono.',
        },
        {
          title: 'Backups',
          body: 'Para proteger el workspace sin cambiar el modelo local-first.',
        },
      ],
    },

    beta: {
      tag: 'Beta abierta',
      title: 'Forger Desktop está en beta temprana y empieza con apps open-source.',
      body:
        'Hoy el foco está en el core local, la instalación de apps y las primeras experiencias como Finance OS. Para usar capacidades de IA puedes conectar una cuenta compatible cuando la app lo solicite.',
      items: [
        'Apps corriendo localmente',
        'Workspace privado para apps instaladas',
        'Primeras apps base open-source',
        'Forger Cloud se presenta como capa futura opcional',
      ],
    },

    finalCta: {
      title: 'Construye tu propio espacio de apps personales',
      body:
        'Descarga Forger Desktop, instala las primeras apps open-source y empieza por una experiencia local, privada y adaptable.',
      primary: 'Descargar Forger',
      secondary: 'Ver apps',
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
