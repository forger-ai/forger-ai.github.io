export default {
  nav: {
    how: 'Cómo funciona',
    agents: 'Agentes',
    social: 'Social',
    privacy: 'Privacidad',
    teams: 'Teams',
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
        'Forger instala herramientas de IA como Codex, Claude Code y Antigravity en tu computador para convertir ideas cotidianas en apps locales, privadas y listas para usar.',
      badges: ['Apps locales', 'Agentes integrados', 'Usa tus cuentas', 'Comparte con amigos'],
      ctaPrimary: 'Descargar Forger',
      windows: 'Descargar para Windows',
    },

    how: {
      eyebrow: 'Cómo funciona',
      title: 'De una idea a una app que trabaja contigo',
      body:
        'Forger une una app real en tu computador con agentes que pueden crearla, modificarla y ejecutar tareas dentro de sus propios flujos.',
      steps: [
        {
          title: 'Conecta tu IA',
          body: 'Usa Codex, Claude Code o Antigravity con las cuentas que ya tienes y cambia de proveedor cuando lo necesites.',
        },
        {
          title: 'Describe la app',
          body: 'Pide una herramienta para tus recetas, gastos, rutinas, clientes o cualquier proceso que quieras ordenar.',
        },
        {
          title: 'Usa flujos con agente',
          body: 'Tus apps pueden tener botones que llaman a un agente, como descubrir recetas nuevas y guardarlas en tu biblioteca.',
        },
      ],
    },

    agents: {
      eyebrow: 'Tus agentes',
      title: 'Forger opera las herramientas que los desarrolladores ya usan',
      body:
        'No necesitas aprender comandos ni montar un proyecto. Forger descarga, configura y usa estas herramientas por ti dentro de una experiencia pensada para crear apps personales.',
      providers: [
        {
          title: 'Codex',
          body:
            'Funciona con tu cuenta de ChatGPT. El plan gratis puede servir para probar, aunque los límites se consumen más rápido.',
        },
        {
          title: 'Claude Code',
          body:
            'Funciona con tu cuenta de Claude y está pensado para quienes tienen una suscripción pagada activa.',
        },
        {
          title: 'Antigravity',
          body:
            'Funciona con tu cuenta de Google Gemini y suele ser la opción con capa gratuita más generosa.',
        },
      ],
      note:
        'Puedes elegir el proveedor que prefieras, cambiarlo cuando quieras y Forger seguirá sumando opciones cuando sean útiles para crear mejores apps.',
    },

    social: {
      eyebrow: 'Forger Social',
      title: 'Comparte las apps que te sirven',
      body:
        'Crear una cuenta te permite subir tus apps, guardarlas en Forger Cloud y compartirlas con amigos que también usan Forger, sin abandonar la experiencia local de tu computador.',
      items: [
        {
          title: 'Apps para tus amigos',
          body: 'Publica una app propia o envíala por Social para que otras personas de confianza puedan instalarla.',
        },
        {
          title: '3 GB gratis en Cloud',
          body: 'Usar Forger en tu computador es gratis y la cuenta incluye espacio inicial para guardar apps en la nube.',
        },
      ],
    },

    privacy: {
      eyebrow: 'Local primero',
      title: 'Tus apps viven en tu computador',
      body:
        'Forger usa la nube para cuenta, almacenamiento y compartir cuando tú lo eliges. El centro de la experiencia sigue siendo una app local que trabaja con los datos que decides usar.',
      cards: [
        {
          title: 'Espacio privado',
          body:
            'Las apps instaladas corren en tu workspace local y no deben leer archivos externos salvo que tú los compartas.',
        },
        {
          title: 'Agentes dentro de la app',
          body:
            'Los botones y tareas inteligentes usan el contexto de cada app, no un chat genérico separado de tu flujo.',
        },
        {
          title: 'Control del proveedor',
          body:
            'Cuando conectas una herramienta de IA, eliges qué cuenta usar y puedes cambiarla desde Forger.',
        },
      ],
    },

    teams: {
      eyebrow: 'Forger Teams',
      title: 'Crea software de trabajo con tu equipo, en vivo',
      body:
        'En una demo construimos contigo un backend y una app conectada a los datos, archivos y permisos de tu equipo.',
      points: [
        'Apps locales para cada integrante y una capa cloud compartida.',
        'Tu empresa elige y conecta el proveedor de IA.',
        'Backend, base de datos, archivos y auditoría administrados desde Forger.',
      ],
      fields: {
        name: 'Nombre',
        email: 'Email de trabajo',
        phone: 'Teléfono de contacto',
        useCase: '¿Qué proceso o reporte quieres construir?',
      },
      consent: 'Usaremos estos datos únicamente para responder tu solicitud de Forger Teams.',
      privacy: 'Ver política de privacidad.',
      submit: 'Solicitar una demo',
    },

    finalCta: {
      title: 'Descarga Forger y crea tu primera app inteligente',
      body:
        'Parte con una necesidad concreta, conviértela en una app local y agrega agentes donde realmente te ahorran trabajo.',
      primary: 'Descargar Forger',
    },
  },
  blog: {
    title: 'Blog',
    subtitle: 'Novedades del equipo de Forger.',
    empty: 'Todavía no hay posts. Vuelve pronto.',
    back: '← Todos los posts',
  },
} as const;
