export default {
  nav: {
    how: 'How it works',
    agents: 'Agents',
    social: 'Social',
    privacy: 'Privacy',
    teams: 'Teams',
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
        'Forger installs AI tools like Codex, Claude Code, and Antigravity on your computer to turn everyday ideas into local, private apps that are ready to use.',
      badges: ['Local apps', 'Built-in agents', 'Use your accounts', 'Share with friends'],
      ctaPrimary: 'Download Forger',
      windows: 'Download for Windows',
    },

    how: {
      eyebrow: 'How it works',
      title: 'From an idea to an app that works with you',
      body:
        'Forger connects a real app on your computer with agents that can create it, change it, and run tasks inside its own workflows.',
      steps: [
        {
          title: 'Connect your AI',
          body: 'Use Codex, Claude Code, or Antigravity with accounts you already have, and switch providers whenever you need to.',
        },
        {
          title: 'Describe the app',
          body: 'Ask for a tool for recipes, spending, routines, clients, or any process you want to organize.',
        },
        {
          title: 'Use agent flows',
          body: 'Your apps can have buttons that call an agent, like discovering new recipes and saving them to your library.',
        },
      ],
    },

    agents: {
      eyebrow: 'Your agents',
      title: 'Forger operates the tools developers already use',
      body:
        'You do not need to learn commands or set up a project. Forger downloads, configures, and uses these tools for you inside an experience built for personal apps.',
      providers: [
        {
          title: 'Codex',
          body:
            'Works with your ChatGPT account. The free plan can be enough to try it, though limits run out faster.',
        },
        {
          title: 'Claude Code',
          body:
            'Works with your Claude account and is best suited for people with an active paid subscription.',
        },
        {
          title: 'Antigravity',
          body:
            'Works with your Google Gemini account and is usually the option with the most generous free layer.',
        },
      ],
      note:
        'Choose the provider you prefer, switch whenever you want, and Forger will keep adding options when they help create better apps.',
    },

    social: {
      eyebrow: 'Forger Social',
      title: 'Share the apps that help you',
      body:
        'Creating an account lets you upload your apps, store them in Forger Cloud, and share them with friends who use Forger while keeping the local computer experience at the center.',
      items: [
        {
          title: 'Apps for friends',
          body: 'Publish your own app or send it through Social so trusted people can install it.',
        },
        {
          title: '3 GB free in Cloud',
          body: 'Using Forger on your computer is free, and an account includes starting space to store apps in the cloud.',
        },
      ],
    },

    privacy: {
      eyebrow: 'Local first',
      title: 'Your apps live on your computer',
      body:
        'Forger uses the cloud for accounts, storage, and sharing when you choose it. The center of the experience is still a local app that works with the data you decide to use.',
      cards: [
        {
          title: 'Private space',
          body:
            'Installed apps run in your local workspace and should not read external files unless you share them.',
        },
        {
          title: 'Agents inside the app',
          body:
            'Smart buttons and tasks use each app context, not a generic chat disconnected from your workflow.',
        },
        {
          title: 'Provider control',
          body:
            'When you connect an AI tool, you choose which account to use and can change it from Forger.',
        },
      ],
    },

    teams: {
      eyebrow: 'Forger Teams',
      title: 'Build work software with your team, live',
      body:
        'In a demo, we build a backend and an app with you, connected to your team data, files, and permissions.',
      points: [
        'Local apps for each member with a shared cloud layer.',
        'Your company chooses and connects the AI provider.',
        'Backend, database, files, and audit managed from Forger.',
      ],
      fields: {
        name: 'Name',
        email: 'Work email',
        phone: 'Contact phone',
        useCase: 'What process or report do you want to build?',
      },
      consent: 'We use this information only to respond to your Forger Teams request.',
      privacy: 'Read our privacy policy.',
      submit: 'Request a demo',
    },

    finalCta: {
      title: 'Download Forger and create your first intelligent app',
      body:
        'Start with a concrete need, turn it into a local app, and add agents where they actually save you work.',
      primary: 'Download Forger',
    },
  },
  blog: {
    title: 'Blog',
    subtitle: 'Updates from the Forger team.',
    empty: 'No posts yet. Check back soon.',
    back: '← All posts',
  },
} as const;
