export default {
  nav: {
    what: 'What it is',
    apps: 'Apps',
    privacy: 'Privacy',
    cloud: 'Cloud',
    blog: 'Blog',
    docs: 'Docs',
    download: 'Download',
  },
  footer: {
    rights: 'All rights reserved.',
    privacy: 'Data privacy',
    terms: 'Terms',
    github: 'View it on GitHub',
    contact: 'Questions or comments? Write to us:',
  },
  home: {
    hero: {
      title1: 'Create intelligent apps',
      title2: 'for life and work.',
      subtitle:
        'Forger lets you create your own apps that understand your data, save repeated tasks, and work with you through an intelligent agent.',
      badges: ['Intelligent apps', 'Agent tasks', 'Private workspace', 'Shareable'],
      ctaPrimary: 'Download Forger',
      ctaSecondary: 'View examples',
      experimentalNote:
        'Forger Desktop is an experimental release. Today you can create and adapt local apps, try Finance OS as a curated app, and explore examples of what you could build.',
      windows: 'Download for Windows',
      blog: 'Read the blog',
    },

    what: {
      eyebrow: 'What is Forger',
      title: 'Apps that do more than store information',
      body:
        'In Forger, an app can organize data, show useful screens, and run saved tasks with help from an intelligent agent. You can create an app for a specific need, ask for changes, and share it with people you trust.',
      points: [
        {
          title: 'Your own apps',
          body: 'Create tools for your processes, data, or ideas instead of starting from a generic app.',
        },
        {
          title: 'Intelligent tasks',
          body: 'Save frequent actions so the agent can repeat them when you need them.',
        },
        {
          title: 'Adaptable',
          body: 'Ask for changes in normal language and let the app evolve with you.',
        },
      ],
    },

    chat: {
      eyebrow: 'App adaptation',
      title: 'Ask for changes like you would ask a person',
      body:
        'You can ask Forger to add a view, change a flow, review data, or prepare a new task inside an app. The agent works on the app, not in an isolated chat.',
      privacyNote:
        'Your apps live in your local space. Forger works with the data you choose to load or share with each app.',
    },

    how: {
      eyebrow: 'How it works',
      title: 'Create an app, save tasks, and use it with an agent',
      body:
        'Forger combines a local app with an agent that understands what the app can do. Use normal screens when you want visual control, and ask for intelligent tasks when you want to move faster.',
      steps: [
        {
          title: 'Download Forger',
          body: 'Install Forger Desktop to create and run apps in your private space.',
        },
        {
          title: 'Create or open an app',
          body: 'Start from your own idea, from an example, or from a curated app like Finance OS.',
        },
        {
          title: 'Ask for intelligent tasks',
          body: 'Save frequent tasks so the agent can run them inside the app when you need them.',
        },
      ],
    },

    examples: {
      eyebrow: 'Examples',
      title: 'Examples of intelligent apps',
      body:
        'Forger is for creating small, useful apps around real tasks. For example: a chess training app, a daily email summary app, or a recipes and macros app.',
    },

    apps: {
      eyebrow: 'Curated app available',
      title: 'Start with Finance OS',
      body:
        'Finance OS is the curated app available today: a local tool for organizing personal finances with assisted review, dashboards, and budgets by period.',
      available: 'Experimental release',
      cardCta: 'View Finance OS',
    },

    trust: {
      cards: [
        {
          title: 'Your apps in your private space',
          body:
            'Installed apps live on your computer and work with the data you choose to load.',
        },
        {
          title: 'The agent acts inside each app',
          body:
            'Intelligent tasks use the app context and capabilities, not loose instructions without structure.',
        },
        {
          title: 'Create, adapt, and share',
          body:
            'When an app helps you, you can adjust it to the way you work and share it with people close to you.',
        },
      ],
    },

    cloud: {
      eyebrow: 'Forger Cloud',
      title: 'Cloud to share and continue, not to replace your local space',
      body:
        'Forger Cloud complements the local experience with accounts, sync, app sharing, and access from more places when it makes sense. The starting point is still your own app in your private space.',
      items: [
        {
          title: 'App sharing',
          body: 'To send a useful app to friends or people you trust.',
        },
        {
          title: 'Sync',
          body: 'To keep continuity across devices when you need it.',
        },
        {
          title: 'Backups',
          body: 'To protect your app space.',
        },
        {
          title: 'Remote access',
          body: 'To use your apps from more places when available.',
        },
      ],
    },

    experimental: {
      tag: 'Experimental release',
      title: 'Forger Desktop is an experimental release focused on creating intelligent apps.',
      body:
        'Today Forger lets you create, run, and adapt local apps. Finance OS is available as a curated app, and the examples show the kind of intelligent apps you can build.',
      items: [
        'Create your own apps',
        'Save tasks for the agent',
        'Use Finance OS as a curated app',
        'Share apps with people you trust',
      ],
    },

    finalCta: {
      title: 'Download Forger and create your first intelligent app',
      body:
        'Start with a concrete idea, turn repeated work into saved actions, and use an agent to work inside your app.',
      primary: 'Download Forger',
      secondary: 'View examples',
    },

    fromBlog: 'From the blog',
  },
  blog: {
    title: 'Blog',
    subtitle: 'Updates from the Forger team.',
    empty: 'No posts yet. Check back soon.',
    back: '← All posts',
  },
} as const;
