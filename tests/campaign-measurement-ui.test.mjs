import assert from 'node:assert/strict';
import test from 'node:test';
import { setupCampaignMeasurement, recordHandoffOutcome } from '../src/lib/campaign-measurement-ui.mjs';
import { copyHandoffLink, shareHandoffLink } from '../src/lib/campaign-handoff.mjs';
import { consentStorageKey } from '../src/lib/campaign-measurement.mjs';

const href = 'https://forger.cloud/instagram?utm_source=instagram&utm_medium=paid_social&utm_campaign=first_app_2026_09&utm_content=reel_01';
function pageFixture({ mobile = false, locationHref = href } = {}) {
  const handlers = new Map(); const elements = new Map(); const requests = []; const values = new Map();
  for (const name of ['status', 'choices', 'withdraw', 'allow', 'decline', 'desktop', 'code', 'desktop-open']) {
    elements.set(`[data-measurement-${name}]`, {
      hidden: true, textContent: '', href: '',
      addEventListener(event, fn) { handlers.set(`${name}:${event}`, fn); },
    });
  }
  const panel = { querySelector: (selector) => elements.get(selector), getAttribute: (name) => name };
  const localStorage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };
  const window = {
    location: { href: locationHref }, localStorage,
    crypto: { randomUUID: () => 'df07d613-0f62-4c76-abfc-ecc914dc54fb' },
    fetch: async (url, init) => { requests.push({ url, init, body: JSON.parse(init.body) }); return { ok: true }; },
    addEventListener: (event, fn) => handlers.set(`window:${event}`, fn),
  };
  const client = setupCampaignMeasurement({ document: { querySelector: () => panel }, window, mobile });
  return { client, requests, values, window, element: (name) => elements.get(`[data-measurement-${name}]`), click: (name) => handlers.get(`${name}:click`)(), storageChange: () => handlers.get('window:storage')({ key: consentStorageKey }) };
}

test('page load and refusal are silent; consent emits one landing event without backfilling', () => {
  const f = pageFixture();
  assert.equal(f.requests.length, 0); assert.equal(f.values.size, 0);
  assert.equal(f.element('choices').hidden, false);
  f.click('decline'); assert.equal(f.requests.length, 0);
  f.click('allow'); assert.equal(f.requests.length, 1);
  assert.equal(f.requests[0].body.event, 'forger_campaign_landing_view');
  f.click('allow'); assert.equal(f.requests.length, 1);
  assert.equal(f.element('choices').hidden, true); assert.equal(f.element('withdraw').hidden, false);
  f.click('withdraw'); assert.equal(f.requests.length, 1);
  assert.equal(f.element('choices').hidden, false); assert.equal(f.element('withdraw').hidden, true);
});

test('Desktop handoff is separate from consent and contains only the public code', () => {
  const f = pageFixture();
  assert.equal(f.element('desktop').hidden, false);
  assert.equal(f.element('desktop-open').href, 'forger://campaign?code=ig_202609_paid_01');
  f.click('desktop-open');
  assert.equal(f.client.status(), 'undecided'); assert.equal(f.requests.length, 0); assert.equal(f.values.size, 0);
  f.click('allow'); f.click('desktop-open');
  assert.equal(f.requests.at(-1).body.event, 'forger_campaign_desktop_handoff');
  assert.equal(pageFixture({ mobile: true }).element('desktop').hidden, true);
  assert.equal(pageFixture({ locationHref: 'https://forger.cloud/instagram' }).element('desktop').hidden, true);
});

test('localhost previews cannot send production events even if consent controls are invoked', () => {
  const f = pageFixture({ locationHref: href.replace('https://forger.cloud', 'http://localhost:4321') });
  assert.equal(f.client.status(), 'unavailable'); assert.equal(f.element('choices').hidden, true);
  f.click('allow'); f.click('desktop-open');
  assert.equal(f.requests.length, 0); assert.equal(f.values.size, 0);
});

test('another tab withdrawing consent updates the visible controls and stops capture', () => {
  const f = pageFixture(); f.click('allow');
  f.window.localStorage.setItem(consentStorageKey, JSON.stringify({ version: 1, status: 'denied' }));
  f.storageChange();
  assert.equal(f.client.status(), 'denied'); assert.equal(f.element('withdraw').hidden, true);
  f.click('desktop-open'); assert.equal(f.requests.length, 1);
});

test('failed preference writes display honest tab-only consent and withdrawal warnings', () => {
  const f = pageFixture();
  f.window.localStorage.setItem = () => { throw new Error('Blocked'); };
  f.window.localStorage.removeItem = () => { throw new Error('Blocked'); };
  f.click('allow');
  assert.equal(f.element('status').textContent, 'data-status-granted-unsaved');
  f.click('withdraw');
  assert.equal(f.element('status').textContent, 'data-status-denied-unsaved');
  f.click('desktop-open');
  assert.equal(f.requests.length, 1);
});

test('copy/share flow captures only completed operations after consent, never cancellation or manual fallback', async () => {
  const f = pageFixture();
  const input = { value: '', focus() {}, select() {}, setSelectionRange() {} };
  const copied = await copyHandoffLink({ navigator: { clipboard: { writeText: async () => {} } }, input, url: href });
  recordHandoffOutcome(f.client, copied); assert.equal(f.requests.length, 0);
  f.click('allow');
  recordHandoffOutcome(f.client, copied);
  const shared = await shareHandoffLink({ navigator: { share: async () => {} }, input, url: href });
  recordHandoffOutcome(f.client, shared);
  const cancelled = await shareHandoffLink({ navigator: { share: async () => { throw new DOMException('Cancelled', 'AbortError'); } }, input, url: href });
  recordHandoffOutcome(f.client, cancelled);
  const manual = await copyHandoffLink({ navigator: {}, input, url: href });
  recordHandoffOutcome(f.client, manual);
  assert.deepEqual(f.requests.map((request) => request.body.event), ['forger_campaign_landing_view', 'forger_campaign_handoff_copy', 'forger_campaign_handoff_share']);
});
