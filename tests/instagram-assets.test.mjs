import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const generator = new URL('../scripts/generate-instagram-assets.mjs', import.meta.url);

test('Instagram assets use only checked-in Forger screenshots as visual sources', async () => {
  const source = await readFile(generator, 'utf8');
  const screenshots = [
    'forger-new-experience.png',
    'forger-catalog.png',
    'forger-my-apps.png',
  ];

  assert.match(source, /public\/assets\/screenshots/);
  for (const screenshot of screenshots) {
    assert.match(source, new RegExp(screenshot.replace('.', '\\.')));
    await access(new URL(`../public/assets/screenshots/${screenshot}`, import.meta.url));
  }

  assert.doesNotMatch(source, /(?:imagegen|mockup|unsplash|pexels)/i);
  assert.ok(
    source.indexOf('{ input: Buffer.from(screenshotFrameSvg) }') < source.indexOf('{ input: screenshot, left: 72, top: 838 }'),
    'the screenshot frame must render behind the real screenshot',
  );
});

test('Instagram asset copy retains the free, provider-terms, and local-control promises', async () => {
  const source = await readFile(generator, 'utf8');

  assert.match(source, /Forger es gratis para personas/);
  assert.match(source, /Sin suscripci[oó]n adicional de Forger/);
  assert.match(source, /Aplican los l[ií]mites y condiciones de tu proveedor de IA/);
  assert.match(source, /Tus apps viven[\s\S]*en tu computador/);
});
