export default {
  nav: {
    what: 'What it is',
    apps: 'Apps',
    privacy: 'Privacy',
    cloud: 'Cloud',
    blog: 'Blog',
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
      title1: 'The app store,',
      title2: 'from the future.',
      subtitle:
        'Open, private, AI-powered apps. Install local tools, talk to their data, and adapt them to the way you work.',
      badges: ['Open-source', 'Local-first', 'AI-powered', 'Cloud-ready'],
      ctaPrimary: 'Download Forger',
      ctaSecondary: 'View apps',
      windows: 'Download for Windows',
      blog: 'Read the blog',
    },

    what: {
      eyebrow: 'What is Forger',
      title: 'Real apps, running on your computer',
      body:
        'Forger is not another cloud dashboard. It is a way to install and use open applications in your own local space, with an AI layer that understands each app and its data.',
      points: [
        {
          title: 'Open apps',
          body: 'The local core, app contract, and first base apps start from open and reviewable code.',
        },
        {
          title: 'Local-first',
          body: 'Apps install into a private workspace and work with the data you choose to bring into each one.',
        },
        {
          title: 'Contextual AI',
          body: 'AI does not replace the app: it helps you query, understand, and adapt it through concrete changes.',
        },
      ],
    },

    chat: {
      eyebrow: 'App adaptation',
      title: 'Personalize apps however you want',
      body:
        'Ask Forger for a concrete change and the assistant works inside the local app instead of replacing it with a generic chat.',
      privacyNote:
        'For AI features, Forger uses the account or subscription you connect. Your app data is handled locally in your workspace, and Forger does not have access to your financial data.',
    },

    how: {
      eyebrow: 'How it works',
      title: 'One AI layer for multiple personal apps',
      body:
        'Forger Desktop installs local apps, prepares their environment, and connects each app with the ChatGPT subscription you choose to use.',
      steps: [
        {
          title: 'Install & connect',
          body: 'Install Forger and connect your ChatGPT subscription so apps can use an AI layer you control.',
        },
        {
          title: 'Download apps',
          body: 'Choose personal apps from the catalog and run them locally in your private workspace.',
        },
        {
          title: 'Talk and adapt',
          body: 'Ask questions, review information, or request concrete app adjustments.',
        },
      ],
    },

    apps: {
      eyebrow: 'Available apps',
      title: 'Start with Finance OS',
      body:
        'Finance OS is the first strong app in the ecosystem: a local tool for organizing personal finances with assisted review, dashboards, and budgets by period.',
      available: 'Available',
      cardCta: 'View Finance OS landing',
      nextLabel: 'Ecosystem',
      nextTitle: 'More personal apps on the same stack',
      nextBody:
        'Forger is designed so one local layer can install, operate, and adapt different open apps, each with its own data.',
      future: ['Local recipes', 'Personal CRM', 'Home inventory'],
    },

    trust: {
      cards: [
        {
          title: 'Your apps. Your data. Your computer.',
          body:
            'Installed apps live in a private workspace. Access to external files happens when you share them with an app for a concrete task.',
        },
        {
          title: 'Desktop security as a foundation',
          body:
            'Forger Desktop is designed around local boundaries, explicit permissions, and a clear split between the interface, runtime, and installed apps.',
        },
        {
          title: 'An open core for personal apps',
          body:
            'Forger Desktop, the local runtime, the app contract, and the first base apps form the open core of the ecosystem.',
        },
      ],
    },

    cloud: {
      eyebrow: 'Forger Cloud',
      title: 'Cloud when it makes sense, not by default',
      body:
        'Forger Cloud will be the optional layer for sync, managed hosting, mobile access, backups, and remote execution. The starting point remains local: Forger Desktop and open apps on your machine.',
      items: [
        {
          title: 'Sync',
          body: 'To bring your personal apps to more devices when you need that.',
        },
        {
          title: 'Managed hosting',
          body: 'To use apps without managing local infrastructure.',
        },
        {
          title: 'Mobile access',
          body: 'To view or operate apps from your phone.',
        },
        {
          title: 'Backups',
          body: 'To protect the workspace without changing the local-first model.',
        },
      ],
    },

    beta: {
      tag: 'Open beta',
      title: 'Forger Desktop is in early beta and starts with open-source apps.',
      body:
        'Today the focus is the local core, app installation, and first experiences like Finance OS. To use AI capabilities, you can connect a compatible account when an app asks for it.',
      items: [
        'Apps running locally',
        'Private workspace for installed apps',
        'First open-source base apps',
        'Forger Cloud is presented as a future optional layer',
      ],
    },

    finalCta: {
      title: 'Build your own space for personal apps',
      body:
        'Download Forger Desktop, install the first open-source apps, and start with a local, private, adaptable experience.',
      primary: 'Download Forger',
      secondary: 'View apps',
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
