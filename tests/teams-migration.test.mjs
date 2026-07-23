import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const ENGLISH_TEAMS_URL = 'https://teams.forger.cloud/';
const SPANISH_TEAMS_URL = 'https://teams.forger.cloud/es/';

test('legacy Teams routes render only the shared migration page with the correct locale', async () => {
  const englishRoute = await readFile(new URL('../src/pages/teams.astro', import.meta.url), 'utf8');
  const spanishRoute = await readFile(new URL('../src/pages/es/teams.astro', import.meta.url), 'utf8');

  assert.match(englishRoute, /<TeamsMigrationPage lang="en"\s*\/>/);
  assert.match(spanishRoute, /<TeamsMigrationPage lang="es"\s*\/>/);
  assert.doesNotMatch(englishRoute, /TeamsPage|TeamDemoRequestForm|BaseLayout/);
  assert.doesNotMatch(spanishRoute, /TeamsPage|TeamDemoRequestForm|BaseLayout/);
});

test('legacy site no longer carries a duplicate Teams landing or request form', async () => {
  const retiredSources = [
    '../src/components/TeamsPage.astro',
    '../src/components/TeamDemoRequestForm.astro',
    '../src/lib/team-demo-request.mjs',
  ];

  for (const source of retiredSources) {
    await assert.rejects(access(new URL(source, import.meta.url)), { code: 'ENOENT' });
  }
});

test('homepage teaser and navigation use the locale-specific external Teams URL', async () => {
  const home = await readFile(new URL('../src/components/HomePage.astro', import.meta.url), 'utf8');
  const teaser = await readFile(new URL('../src/components/TeamsTeaser.astro', import.meta.url), 'utf8');
  const layout = await readFile(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');
  const siteUrls = await readFile(new URL('../src/lib/teams-site.ts', import.meta.url), 'utf8');

  assert.doesNotMatch(home, /TeamDemoRequestForm/);
  assert.match(home, /TeamsTeaser/);
  assert.match(teaser, /teamsSiteUrl\(lang\)/);
  assert.match(layout, /teamsSiteUrl\(lang\)/);
  assert.match(siteUrls, /en: 'https:\/\/teams\.forger\.cloud\/'/);
  assert.match(siteUrls, /es: 'https:\/\/teams\.forger\.cloud\/es\/'/);
  assert.doesNotMatch(teaser, /localePath\(lang, '\/teams'\)/);
  assert.doesNotMatch(layout, /localePath\(lang, '\/teams'\)/);
});

test('migration page declares the new site as canonical and exposes complete hreflang links', async () => {
  const migrationPage = await readFile(new URL('../src/components/TeamsMigrationPage.astro', import.meta.url), 'utf8');
  const siteUrls = await readFile(new URL('../src/lib/teams-site.ts', import.meta.url), 'utf8');

  assert.match(siteUrls, new RegExp(`en: '${ENGLISH_TEAMS_URL}'`));
  assert.match(siteUrls, new RegExp(`es: '${SPANISH_TEAMS_URL}'`));
  assert.match(migrationPage, /const targetUrl = teamsSiteUrl\(lang\)/);
  assert.match(migrationPage, /rel="canonical" href=\{targetUrl\}/);
  assert.match(migrationPage, /rel="alternate" hreflang=\{lang\} href=\{targetUrl\}/);
  assert.match(migrationPage, /rel="alternate" hreflang=\{alternateLang\} href=\{alternateUrl\}/);
  assert.match(migrationPage, /rel="alternate" hreflang="x-default" href=\{englishUrl\}/);
});

test('migration page redirects quickly while retaining accessible manual fallbacks', async () => {
  const migrationPage = await readFile(new URL('../src/components/TeamsMigrationPage.astro', import.meta.url), 'utf8');

  assert.match(migrationPage, /http-equiv="refresh" content=\{`0;url=\$\{targetUrl\}`\}/);
  assert.match(migrationPage, /window\.location\.replace\(targetUrl\)/);
  assert.match(migrationPage, /role="status"/);
  assert.match(migrationPage, /href=\{targetUrl\}/);
  assert.match(migrationPage, /<noscript>/);
  assert.doesNotMatch(migrationPage, /TeamsPage|TeamDemoRequestForm/);
});
