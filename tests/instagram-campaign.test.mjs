import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const campaignRoute = new URL('../src/pages/es/instagram.astro', import.meta.url);
const englishCampaignRoute = new URL('../src/pages/instagram.astro', import.meta.url);
const campaignPage = new URL('../src/components/InstagramCampaignPage.astro', import.meta.url);

async function readCampaignPage() {
  return readFile(campaignPage, 'utf8');
}

test('Instagram campaign has a standalone Spanish entry point with an acquisition-focused title', async () => {
  const route = await readFile(campaignRoute, 'utf8');

  assert.match(route, /InstagramCampaignPage/);
  assert.match(route, /Forger gratis para personas/);
  assert.match(route, /Crea apps locales con la IA que ya usas/);
});

test('Instagram campaign has a standalone English entry point that uses the shared bilingual component', async () => {
  const route = await readFile(englishCampaignRoute, 'utf8');
  const spanishRoute = await readFile(campaignRoute, 'utf8');

  assert.match(route, /InstagramCampaignPage/);
  assert.match(route, /Forger is free for people/);
  assert.match(route, /Create local apps with the AI you already use/);
  assert.match(route, /lang="en"/);
  assert.match(spanishRoute, /lang="es"/);
});

test('campaign clearly states the free, no-additional-subscription, provider-terms, and local-control promises', async () => {
  const page = await readCampaignPage();

  assert.match(page, /Gratis para personas/);
  assert.match(page, /no cobra una suscripci[oó]n adicional/i);
  assert.match(page, /ChatGPT/);
  assert.match(page, /Claude/);
  assert.match(page, /Antigravity/);
  assert.match(page, /l[ií]mites, condiciones y posibles costos/i);
  assert.match(page, /workspace local/i);
  assert.match(page, /t[uú] decides qu[eé] compartir/i);
  assert.match(page, /Forger is free for people/);
  assert.match(page, /does not charge an additional subscription/i);
  assert.match(page, /Cloud services are used only when you choose features that need them/i);
});

test('campaign only presents genuine Forger screenshots from the checked-in screenshots directory', async () => {
  const page = await readCampaignPage();
  const screenshots = [
    'forger-new-experience.png',
    'forger-catalog.png',
    'forger-my-apps.png',
  ];

  for (const screenshot of screenshots) {
    assert.match(page, new RegExp(`/assets/screenshots/${screenshot.replace('.', '\\.')}`));
    await access(new URL(`../public/assets/screenshots/${screenshot}`, import.meta.url));
  }

  assert.doesNotMatch(page, /(?:imagegen|mockup|unsplash|pexels|https?:\/\/[^"']+\.(?:png|jpe?g|webp|gif))/i);
});

test('mobile-to-computer handoff preserves UTMs and records download intent without third-party tracking', async () => {
  const page = await readCampaignPage();

  assert.match(page, /new URL\(window\.location\.href\)/);
  assert.match(page, /key\.startsWith\('utm_'\)/);
  assert.match(page, /navigator\.share/);
  assert.match(page, /navigator\.clipboard/);
  assert.match(page, /sessionStorage\.setItem\('forger-campaign-download-intent'/);
  assert.match(page, /new CustomEvent\('forger:download-intent'/);
  assert.match(page, /data-campaign-download/);
  assert.doesNotMatch(page, /facebook\.net|fbevents|gtag\(|google-analytics|plausible|posthog|segment/i);
});
