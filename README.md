# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Teams route migration

The public Teams site lives at `https://teams.forger.cloud/` (English) and
`https://teams.forger.cloud/es/` (Spanish). The legacy `/teams/` and
`/es/teams/` routes remain as minimal cross-domain migration pages so old links
still reach the correct locale.

This is a temporary client-side redirect using canonical and hreflang metadata,
meta refresh, JavaScript, and visible fallback links. `forger.cloud` is served
directly by GitHub Pages rather than through Cloudflare, so an edge HTTP 301 is
not currently available. Replace these migration pages with permanent edge 301
redirects if the domain moves behind an edge that supports them.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
