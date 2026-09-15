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
  assert.match(page, /Your AI provider processes the information you send it/i);
  assert.match(page, /Tu proveedor de IA procesa la informaci[oó]n que le env[ií]as/i);
});

test('personal campaign avoids unavailable Teams, catalog and cloud-feature promises', async () => {
  const page = await readCampaignPage();
  for (const routeUrl of [campaignRoute, englishCampaignRoute]) {
    const route = await readFile(routeUrl, 'utf8');
    assert.match(route, /navigation="campaign"/);
    assert.match(route, /href: '#instalar'/);
  }
  const layout = await readFile(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');
  assert.match(layout, /navigation = 'full'/);
  assert.match(layout, /navigation === 'full' &&/);
  assert.doesNotMatch(page, /forger-catalog|Explore apps inside Forger|cat[aá]logo local|account, backup, or sharing|cuenta, respaldo o compartir/);
});

test('campaign only presents genuine Forger screenshots from the checked-in screenshots directory', async () => {
  const page = await readCampaignPage();
  const screenshots = [
    'forger-new-experience.png',
    'forger-my-apps.png',
  ];

  for (const screenshot of screenshots) {
    assert.match(page, new RegExp(`/assets/screenshots/${screenshot.replace('.', '\\.')}`));
    await access(new URL(`../public/assets/screenshots/${screenshot}`, import.meta.url));
  }

  assert.doesNotMatch(page, /(?:imagegen|mockup|unsplash|pexels|https?:\/\/[^"']+\.(?:png|jpe?g|webp|gif))/i);
});

test('handoff uses shared device and safe-link behavior without exposing campaign internals', async () => {
  const page = await readCampaignPage();

  assert.match(page, /buildCampaignUrl/);
  assert.match(page, /isMobileDevice/);
  assert.match(page, /copyHandoffLink/);
  assert.match(page, /shareHandoffLink/);
  assert.match(page, /data-campaign-cta-label/);
  assert.match(page, /sessionStorage\.setItem\('forger-campaign-download-intent'/);
  assert.match(page, /new CustomEvent\('forger:download-intent'/);
  assert.match(page, /data-campaign-download/);
  assert.doesNotMatch(page, /keep the campaign attribution|conservar[aá] la campa[nñ]a/i);
  assert.doesNotMatch(page, /facebook\.net|fbevents|gtag\(|google-analytics|plausible|posthog|segment/i);
});
