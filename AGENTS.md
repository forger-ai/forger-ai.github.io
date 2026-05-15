# AGENTS

## Source of Truth

This repository is the Forger public Pages site.

The workspace root `AGENTS.md` defines cross-repo rules, release coordination, and operational safety. This file defines Pages-specific boundaries.

Use local repository files as the implementation source of truth, including `package.json`, `astro.config.mjs`, `src/`, `public/`, content collections, build scripts, and workflow files.

## Repo Role

Pages owns the public website and public metadata artifacts served from GitHub Pages.

It does not own Desktop application code, backend APIs, app source code, release ZIP generation, or notarization. Coordinate with the owning repo when public metadata reflects those artifacts.

## Operational Rules

- Work from the `pages/forger-ai.github.io/` repo, not the workspace root.
- Keep Pages changes scoped to site content, components, public assets, metadata files, build config, and deploy workflow files.
- Run checks with the repo's Node/Astro scripts.
- Do not edit generated production metadata manually when the release flow has a supported generator or deploy workflow.
- Do not publish or trigger deploy workflows without explicit user approval when the action changes public output.

## Desktop Metadata

Desktop metadata served by Pages must match the actual Desktop release artifacts.

When updating or validating Desktop metadata:

- confirm the Desktop release version;
- confirm asset URLs;
- confirm macOS and Windows checksums when available;
- confirm the metadata currently served by Pages after deployment.

## Communication

For final-user summaries, describe the visible site or metadata impact. Do not present workflow internals, scripts, paths, or build commands as the user's normal experience unless the user asks for technical detail.
