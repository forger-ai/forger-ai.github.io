import assert from 'node:assert/strict';
import test from 'node:test';
import { buildCampaignUrl, buildCampaignLanguagePath, copyHandoffLink, shareHandoffLink } from '../src/lib/campaign-handoff.mjs';

test('phone link keeps only known, bounded campaign labels on the canonical site', () => {
  const result = new URL(buildCampaignUrl('https://preview.example/es/instagram?utm_source=instagram&utm_medium=paid_social&utm_campaign=first-app&utm_content=reel-1&utm_term=AI+builders&utm_secret=private&access_token=secret&email=person%40example.com#token=secret'));
  assert.equal(result.origin, 'https://forger.cloud');
  assert.equal(result.pathname, '/es/instagram');
  assert.equal(result.hash, '');
  assert.deepEqual(Object.fromEntries(result.searchParams), { utm_source: 'instagram', utm_medium: 'paid_social', utm_campaign: 'first-app', utm_content: 'reel-1', utm_term: 'AI builders' });
});

test('invalid and duplicate campaign values cannot carry arbitrary payloads', () => {
  const longValue = 'a'.repeat(101);
  const result = new URL(buildCampaignUrl(`https://forger.cloud/instagram/?utm_source=instagram&utm_source=secret&utm_medium=%3Cscript%3E&utm_campaign=${longValue}&utm_content=hello%0Aworld&utm_term=%20apps%20`));
  assert.equal(result.pathname, '/instagram');
  assert.deepEqual(Object.fromEntries(result.searchParams), { utm_term: 'apps' });
  assert.equal(buildCampaignUrl('https://preview.example/arbitrary/token#secret'), 'https://forger.cloud/instagram');
  assert.equal(buildCampaignUrl('invalid URL'), 'https://forger.cloud/instagram');
  assert.equal(buildCampaignUrl('https://forger.cloud/instagram'), 'https://forger.cloud/instagram');
});

for (const [sourcePath, targetLanguage, expectedPath] of [
  ['/instagram', 'es', '/es/instagram'],
  ['/instagram/', 'es', '/es/instagram'],
  ['/es/instagram', 'en', '/instagram'],
  ['/es/instagram/', 'en', '/instagram'],
]) {
  test(`language switch from ${sourcePath} to ${targetLanguage} keeps only safe campaign attribution`, () => {
    const path = buildCampaignLanguagePath(`https://preview.example${sourcePath}?utm_source=instagram&utm_medium=paid_social&utm_campaign=first_app_2026_09&utm_content=reel_01&utm_term=AI+builders&fbclid=ad-click&email=person%40example.com&token=secret#private`, targetLanguage);
    const result = new URL(path, 'https://preview.example');
    assert.equal(result.origin, 'https://preview.example');
    assert.equal(result.pathname, expectedPath);
    assert.equal(result.hash, '');
    assert.deepEqual(Object.fromEntries(result.searchParams), {
      utm_source: 'instagram', utm_medium: 'paid_social', utm_campaign: 'first_app_2026_09',
      utm_content: 'reel_01', utm_term: 'AI builders',
    });
  });
}

test('language switch reuses handoff sanitization and works without campaign labels', () => {
  const source = `https://forger.cloud/instagram?utm_source=instagram&utm_source=duplicate&utm_medium=%3Cscript%3E&utm_campaign=${'a'.repeat(101)}&utm_content=hello%0Aworld&utm_term=%20apps%20`;
  assert.equal(buildCampaignLanguagePath(source, 'es'), '/es/instagram?utm_term=apps');
  assert.equal(buildCampaignLanguagePath('https://forger.cloud/instagram', 'es'), '/es/instagram');
  assert.equal(buildCampaignLanguagePath('https://forger.cloud/es/instagram', 'en'), '/instagram');
});

test('language switch leaves unrelated routes and unsupported languages unchanged', () => {
  for (const path of ['/', '/es', '/docs', '/instagram/extra', '/es/instagram/extra']) {
    assert.equal(buildCampaignLanguagePath(`https://forger.cloud${path}?utm_source=instagram`, 'es'), null);
  }
  assert.equal(buildCampaignLanguagePath('invalid URL', 'es'), null);
  for (const language of ['fr', '//evil.example', '', undefined]) {
    assert.equal(buildCampaignLanguagePath('https://forger.cloud/instagram?utm_source=instagram', language), null);
  }
});

const url = 'https://forger.cloud/instagram?utm_source=instagram';
function inputFixture() {
  return { value: '', focused: false, selected: false, focus() { this.focused = true; }, select() { this.selected = true; }, setSelectionRange(start, end) { this.range = [start, end]; } };
}

test('copy success is reported only after Clipboard receives the safe link', async () => {
  const input = inputFixture();
  let copied;
  const outcome = await copyHandoffLink({ navigator: { clipboard: { writeText: async (value) => { copied = value; } } }, input, url });
  assert.equal(outcome, 'copied');
  assert.equal(copied, url);
  assert.equal(input.value, url);
});

for (const [name, navigator] of [
  ['Clipboard is unavailable', {}],
  ['Clipboard permission is denied', { clipboard: { writeText: async () => { throw new Error('Denied'); } } }],
]) {
  test(`${name}: fallback focuses and selects an actual full URL for manual copy`, async () => {
    const input = inputFixture();
    assert.equal(await copyHandoffLink({ navigator, input, url }), 'manualCopy');
    assert.equal(input.value, url);
    assert.equal(input.focused, true);
    assert.equal(input.selected, true);
    assert.deepEqual(input.range, [0, url.length]);
  });
}

test('a completed share sends the safe link and reports completion', async () => {
  let payload;
  const outcome = await shareHandoffLink({ navigator: { share: async (value) => { payload = value; } }, input: inputFixture(), url, title: 'Forger', text: 'Create an app' });
  assert.equal(outcome, 'shared');
  assert.deepEqual(payload, { title: 'Forger', text: 'Create an app', url });
});

test('cancelling the share dialog reports cancellation without copying or claiming success', async () => {
  let copied = false;
  const outcome = await shareHandoffLink({ navigator: { share: async () => { throw new DOMException('Cancelled', 'AbortError'); }, clipboard: { writeText: async () => { copied = true; } } }, input: inputFixture(), url });
  assert.equal(outcome, 'cancelled');
  assert.equal(copied, false);
});

test('unsupported or failed sharing leaves a usable fallback', async () => {
  const missingInput = inputFixture();
  assert.equal(await shareHandoffLink({ navigator: {}, input: missingInput, url }), 'manualCopy');
  assert.equal(missingInput.selected, true);
  const failedInput = inputFixture();
  assert.equal(await shareHandoffLink({ navigator: { share: async () => { throw new Error('Denied'); } }, input: failedInput, url }), 'manualCopy');
  assert.equal(failedInput.selected, true);
});
