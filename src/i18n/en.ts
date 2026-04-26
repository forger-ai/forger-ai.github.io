export default {
  nav: {
    what: 'What is it',
    features: 'Features',
    beta: 'Beta',
    blog: 'Blog',
    download: 'Download',
  },
  footer: {
    rights: 'All rights reserved.',
  },
  home: {
    badge: 'Open beta',
    heroTitle1: 'The app store,',
    heroTitle2: 'from the future.',
    heroSubtitle:
      'Download apps and talk to them. Ask questions, manipulate your data, tweak the UI, or change how they behave — all through plain language. No cloud. No subscription. Just your machine.',
    ctaDownload: 'Download for macOS',
    ctaBlog: 'Read the blog →',

    what: {
      title: 'What is Forger?',
      body: "It's a local app platform where every app understands you. Think of it as an app store where instead of just clicking buttons, you can have a conversation with the app itself. Installed apps live on your machine and only on your machine.",
    },

    features: [
      {
        icon: 'MessageSquare',
        title: 'Chat with your apps',
        body: 'Every app comes with a built-in AI assistant. Ask questions about your data, request changes, or just explore — in plain language.',
      },
      {
        icon: 'Sliders',
        title: 'Modify behavior & looks',
        body: "Don't like how something works? Tell the app. Change layouts, tweak logic, rename things — the agent makes it happen.",
      },
      {
        icon: 'HardDrive',
        title: '100% on your machine',
        body: 'Apps install locally. Your data never touches a server. Nobody — not us, not anyone — can see what you do inside Forger.',
      },
      {
        icon: 'ShieldCheck',
        title: 'Controlled environment',
        body: 'The AI agent is strictly instructed to only touch apps installed through Forger. Nothing else on your system is accessible.',
      },
    ],

    beta: {
      tag: 'Beta notice',
      title: 'This is an early beta — you just need a ChatGPT account.',
      body: "Forger is completely free, forever. To power the AI, you connect your existing ChatGPT account via OAuth — no API keys, no copy-pasting tokens. Just log in and go.",
      items: [
        'Forger is free. Always.',
        'Connect your ChatGPT account in one click (OAuth)',
        'No API keys or manual setup',
        'AI usage is billed by OpenAI to your ChatGPT account',
      ],
    },

    fromBlog: 'From the blog',
    allPosts: 'All posts →',
  },
  blog: {
    title: 'Blog',
    subtitle: 'Updates from the Forger team.',
    empty: 'No posts yet. Check back soon.',
    back: '← All posts',
  },
} as const;
