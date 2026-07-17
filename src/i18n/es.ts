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

    teamsTeaser: {
      eyebrow: 'Forger Teams',
      title: 'Convierte un proceso de tu equipo en software propio',
      body:
        'Apps locales para cada integrante, conectadas a un backend, base de datos, archivos y permisos compartidos. Conoce la beta privada de Forger Teams.',
      items: ['Apps locales', 'Cloud compartida', 'Acceso por roles'],
      cta: 'Conocer Forger Teams',
    },

    finalCta: {
      title: 'Descarga Forger y crea tu primera app inteligente',
      body:
        'Parte con una necesidad concreta, conviértela en una app local y agrega agentes donde realmente te ahorran trabajo.',
      primary: 'Descargar Forger',
    },
  },
  teams: {
    meta: {
      title: 'Forger Teams — Software de trabajo creado con tu equipo',
      description:
        'Crea apps locales conectadas a un backend, base de datos, archivos y permisos compartidos. Solicita acceso a la beta privada de Forger Teams.',
    },
    hero: {
      eyebrow: 'Forger Teams · Beta privada',
      title: 'Convierte un proceso real de tu empresa en software que el equipo puede usar',
      body:
        'Forger Teams combina apps locales para cada integrante con un backend, base de datos, archivos y permisos compartidos. En la beta diseñamos y construimos el primer flujo contigo.',
      note: 'Forger Teams mantiene separado tu espacio personal.',
      primaryCta: 'Solicita acceso a la beta',
      secondaryCta: 'Así funciona',
      badges: ['Build en vivo', 'Apps locales', 'Cloud compartida'],
      workspace: {
        eyebrow: 'El espacio que preparamos',
        title: 'Workspace del equipo',
        status: 'Beta privada',
        resources: [
          { title: 'Backend compartido', detail: 'Incluido' },
          { title: 'Base de datos', detail: 'Incluida' },
          { title: 'Archivos del team', detail: '20 GB' },
          { title: 'Roles y auditoría', detail: 'Incluidos' },
        ],
      },
    },
    promise: {
      eyebrow: 'Una base común, experiencias locales',
      title: 'El software se adapta al equipo, no al revés',
      body:
        'Cada persona trabaja desde su computador con una app real. La información que debe compartirse vive en una capa cloud del team, con acceso controlado.',
      items: [
        { title: 'Apps para cada rol', body: 'Cada integrante instala y adapta la app que necesita sin perder la versión compartida por el equipo.' },
        { title: 'Recursos comunes', body: 'Backend, base de datos y archivos forman una capa central para reportes, operaciones y flujos internos.' },
        { title: 'IA bajo control de la empresa', body: 'La organización decide qué proveedor de IA usar y cada persona conecta una cuenta autorizada.' },
      ],
    },
    how: {
      eyebrow: 'Cómo comienza',
      title: 'Partimos de un caso real y salimos con algo utilizable',
      steps: [
        { title: 'Elegimos el primer flujo', body: 'Nos cuentas qué proceso, reporte o herramienta interna hoy consume tiempo o vive entre planillas.' },
        { title: 'Lo construimos contigo', body: 'En una sesión de trabajo creamos el backend y la primera app mientras ves cómo los agentes entienden tu operación.' },
        { title: 'Tu equipo lo prueba', body: 'Publicamos una versión beta para los usuarios autorizados y seguimos iterando con feedback real.' },
      ],
    },
    capabilities: {
      eyebrow: 'La capa compartida del team',
      title: 'Todo lo necesario para que una app interna deje de ser un prototipo',
      body:
        'Forger Teams reúne el trabajo local de cada persona con los servicios que necesitan coordinación, seguridad y continuidad.',
      cards: [
        { title: 'Apps y agentes', body: 'Apps locales conectadas al contexto del team, con agentes y workflows que pueden operar sobre ellas.' },
        { title: 'Backend y base de datos', body: 'Una API y una base de datos compartidas para centralizar reglas, modelos y datos operacionales.' },
        { title: 'Archivos del team', body: 'Un espacio común para reportes, exportaciones y documentos que también pueden usar apps y workflows.' },
        { title: 'Permisos y auditoría', body: 'Roles claros y un registro de quién realizó cada acción importante dentro del workspace.' },
      ],
    },
    provider: {
      eyebrow: 'Tu proveedor, tus reglas',
      title: 'Tu empresa mantiene el control de la IA',
      body:
        'Forger no obliga a contratar un modelo incluido. El equipo utiliza el proveedor aprobado por la organización y mantiene separadas sus credenciales.',
      points: [
        'Compatible con los proveedores que Forger Desktop ya integra.',
        'Las credenciales no se comparten con las apps web del team.',
        'Los agentes reciben el contexto y los contratos del backend del equipo.',
      ],
    },
    beta: {
      eyebrow: 'Acceso acompañado',
      title: 'Solicita acceso a la beta',
      body:
        'Cuéntanos qué necesita tu equipo. Revisaremos el caso contigo y elegiremos un primer flujo concreto para construir durante la beta.',
      points: [
        'Conversación directa con el equipo fundador.',
        'Primera sesión de construcción sobre un caso real.',
        'Onboarding personalizado para los usuarios del team.',
      ],
      fields: {
        name: 'Nombre',
        email: 'Email de trabajo',
        phone: 'Teléfono de contacto',
        useCase: '¿Qué proceso, reporte o herramienta quieres construir?',
      },
      consent: 'Usaremos estos datos únicamente para responder tu solicitud de Forger Teams.',
      privacy: 'Ver política de privacidad.',
      submit: 'Solicitar acceso a la beta',
    },
  },
  blog: {
    title: 'Blog',
    subtitle: 'Novedades del equipo de Forger.',
    empty: 'Todavía no hay posts. Vuelve pronto.',
    back: '← Todos los posts',
  },
} as const;
