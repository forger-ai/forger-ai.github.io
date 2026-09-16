import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { campaignRegistry, campaignCodeForUrl, desktopCampaignUrl } from '../src/lib/campaign-registry.mjs';
import { createCampaignMeasurement, consentStorageKey, measurementEvents } from '../src/lib/campaign-measurement.mjs';

const id = '2a5d8210-4ac7-4dc0-8bc5-f24732f77a42';
const locationHref = 'https://forger.cloud/instagram?utm_source=instagram&utm_medium=paid_social&utm_campaign=first_app_2026_09&utm_content=reel_01&email=private%40example.com&fbclid=private';
const config = { enabled: true, projectToken: 'phc_test_only', endpoint: 'https://us.i.posthog.com/i/v0/e/', environment: 'test' };

function fixture(options = {}) {
  const values = new Map(options.initial ? [[consentStorageKey, JSON.stringify(options.initial)]] : []);
  const writes = []; const requests = []; let ids = 0;
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => { writes.push([key, value]); values.set(key, value); },
    removeItem: (key) => { writes.push([key, null]); values.delete(key); },
  };
  const client = createCampaignMeasurement({
    locationHref, config, storage,
    randomUUID: () => { ids += 1; return id; },
    fetch: async (url, init) => { requests.push({ url, init, body: JSON.parse(init.body) }); return { ok: true }; },
    ...options,
  });
  return { client, values, writes, requests, storage, get ids() { return ids; } };
}

test('known campaign tuples keep ten Desktop codes and two web-only LATAM codes distinct', () => {
  assert.equal(campaignRegistry.length, 12);
  assert.equal(campaignRegistry.filter(({ desktopEligible }) => desktopEligible === true).length, 10);
  assert.equal(campaignRegistry.filter(({ desktopEligible }) => desktopEligible === false).length, 2);
  for (const campaign of campaignRegistry) {
    const url = new URL('https://forger.cloud/es/instagram');
    for (const [key, value] of Object.entries(campaign.utm)) url.searchParams.set(key, value);
    assert.equal(campaignCodeForUrl(url.href), campaign.code);
    assert.equal(desktopCampaignUrl(campaign.code), campaign.desktopEligible ? `forger://campaign?code=${campaign.code}` : null);
  }
});

for (const number of ['01', '02']) {
  test(`LATAM reel ${number} has consent-only web attribution without reusing a US or Desktop code`, async () => {
    const url = `https://forger.cloud/es/instagram?utm_source=instagram&utm_medium=paid_social&utm_campaign=first_app_latam_2026_09&utm_content=reel_${number}`;
    const code = `ig_202609_latam_paid_${number}`;
    assert.equal(campaignCodeForUrl(url), code);
    assert.equal(campaignCodeForUrl(url.replace('first_app_latam_2026_09', 'first_app_2026_09')), `ig_202609_paid_${number}`);
    assert.equal(desktopCampaignUrl(code), null);
    const f = fixture({ locationHref: url });
    const events = measurementEvents.filter((event) => event !== 'forger_campaign_desktop_handoff');
    for (const event of events) assert.equal(await f.client.capture(event), false);
    assert.equal(f.ids, 0); assert.equal(f.requests.length, 0); assert.equal(f.writes.length, 0);
    f.client.decline();
    for (const event of events) assert.equal(await f.client.capture(event), false);
    assert.equal(f.ids, 0); assert.equal(f.requests.length, 0);
    f.client.allow();
    for (const event of events) assert.equal(await f.client.capture(event), true);
    assert.equal(f.ids, 1);
    assert.deepEqual(f.requests.map(({ body }) => body.event), events);
    for (const { body } of f.requests) {
      assert.deepEqual(body.properties, { campaign_code: code, surface: 'web', schema_version: 1, environment: 'test', $process_person_profile: false, $geoip_disable: true });
    }
    f.client.decline();
    assert.equal(await f.client.capture(events[0]), false);
    assert.equal(f.requests.length, events.length);
  });
}

test('all existing organic mappings remain eligible for Desktop handoff', () => {
  const contents = ['free_private_local', 'existing_provider', 'daily_compass', 'local_data_sharing'];
  for (const [prefix, source] of [['ig', 'instagram'], ['fb', 'facebook']]) {
    contents.forEach((content, index) => {
      const code = `${prefix}_202609_org_0${index + 1}`;
      const url = `https://forger.cloud/instagram?utm_source=${source}&utm_medium=organic_social&utm_campaign=forger_first_app_2026_09&utm_content=${content}`;
      assert.equal(campaignCodeForUrl(url), code);
      assert.equal(desktopCampaignUrl(code), `forger://campaign?code=${code}`);
    });
  }
});

test('LATAM attribution rejects duplicate or unsupported campaign values', () => {
  const url = 'https://forger.cloud/es/instagram?utm_source=instagram&utm_medium=paid_social&utm_campaign=first_app_latam_2026_09&utm_content=reel_01';
  for (const candidate of [url + '&utm_campaign=first_app_latam_2026_09', url + '&utm_content=reel_01', url.replace('reel_01', 'reel_03'), url.replace('instagram&utm', 'facebook&utm')]) {
    assert.equal(campaignCodeForUrl(candidate), null);
  }
});

test('unknown, duplicate, malformed and unrelated attribution never reaches Desktop', () => {
  for (const url of [locationHref + '&utm_content=reel_01', locationHref.replace('reel_01', 'private_name'), locationHref.replace('/instagram?', '/private?'), 'not a URL']) {
    assert.equal(campaignCodeForUrl(url), null);
  }
  for (const code of ['ig_202609_paid_01&email=private', 'IG_202609_PAID_01', '', undefined, 'unattributed']) assert.equal(desktopCampaignUrl(code), null);
});

test('initial load, clicks and refusal create no identifier or analytics request', async () => {
  const f = fixture();
  assert.equal(f.client.status(), 'undecided');
  for (const event of measurementEvents) assert.equal(await f.client.capture(event), false);
  assert.equal(f.ids, 0); assert.equal(f.writes.length, 0); assert.equal(f.requests.length, 0);
  f.client.decline();
  assert.equal(f.client.status(), 'denied');
  assert.equal(f.ids, 0); assert.equal(f.requests.length, 0);
  assert.deepEqual(JSON.parse(f.values.get(consentStorageKey)), { version: 1, status: 'denied' });
});

test('explicit consent sends only the exact manual event schema, without a URL or personal properties', async () => {
  const f = fixture();
  assert.equal(f.client.allow(), true);
  assert.equal(f.ids, 1);
  for (const event of measurementEvents) assert.equal(await f.client.capture(event), true);
  for (const request of f.requests) {
    assert.equal(request.url, config.endpoint);
    assert.equal(request.init.credentials, 'omit');
    assert.equal(request.init.referrerPolicy, 'no-referrer');
    assert.equal(request.init.redirect, 'error');
    assert.equal(request.init.keepalive, undefined);
    assert.deepEqual(request.body, {
      api_key: config.projectToken, event: request.body.event, distinct_id: id,
      properties: { campaign_code: 'ig_202609_paid_01', surface: 'web', schema_version: 1, environment: 'test', $process_person_profile: false, $geoip_disable: true },
    });
    assert.doesNotMatch(JSON.stringify(request.body), /email|private|fbclid|utm_|current_url|referrer|ip_address|\$ip/);
  }
  const before = f.requests.length;
  assert.equal(await f.client.capture('$identify'), false);
  assert.equal(await f.client.capture('forger_installed'), false);
  assert.equal(f.requests.length, before);
});

test('unknown campaign labels are counted only as unattributed', async () => {
  const f = fixture({ locationHref: 'https://forger.cloud/instagram?utm_source=private_name' });
  f.client.allow(); await f.client.capture(measurementEvents[0]);
  assert.equal(f.requests[0].body.properties.campaign_code, 'unattributed');
});

test('a remembered valid grant reuses its random browser identifier, not a new person', async () => {
  const f = fixture({ initial: { version: 1, status: 'granted', id } });
  assert.equal(f.client.status(), 'granted');
  await f.client.capture(measurementEvents[0]);
  assert.equal(f.ids, 0); assert.equal(f.requests[0].body.distinct_id, id);
});

test('old, malformed or poisoned stored consent does not opt anyone in', async () => {
  for (const initial of [{ version: 0, status: 'granted', id }, { version: 1, status: 'granted', id: 'person@example.com' }, { version: 1, status: true, id }, { version: 1, status: 'denied', id }]) {
    const f = fixture({ initial });
    assert.notEqual(f.client.status(), 'granted');
    assert.equal(await f.client.capture(measurementEvents[0]), false);
    assert.equal(f.requests.length, 0);
  }
});

test('missing config or an unexpected endpoint/host prevents requests, identifiers and writes', () => {
  for (const options of [
    { config: { ...config, enabled: false } }, { config: { ...config, projectToken: '' } },
    { config: { ...config, endpoint: 'https://private.example/capture' } },
    { locationHref: 'http://localhost:4321/instagram' }, { locationHref: 'https://forger.cloud.evil/instagram' },
    { locationHref: 'http://forger.cloud/instagram' }, { locationHref: 'https://forger.cloud/private' },
  ]) {
    const f = fixture(options);
    assert.equal(f.client.status(), 'unavailable');
    assert.equal(f.client.allow(), false);
    f.client.decline();
    assert.equal(f.ids, 0); assert.equal(f.writes.length, 0); assert.equal(f.requests.length, 0);
  }
});

test('withdrawal clears the ID, cancels in-flight delivery and never emits a refusal event', async () => {
  let signal;
  const f = fixture({ fetch: (_url, init) => new Promise((_resolve, reject) => {
    signal = init.signal;
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
  }) });
  f.client.allow();
  const pending = f.client.capture(measurementEvents[0]);
  f.client.decline();
  assert.equal(signal.aborted, true);
  assert.equal(await pending, false);
  assert.equal(await f.client.capture(measurementEvents[1]), false);
  assert.deepEqual(JSON.parse(f.values.get(consentStorageKey)), { version: 1, status: 'denied' });
});

test('withdrawal in another tab prevents the next event', async () => {
  const f = fixture(); f.client.allow();
  f.storage.setItem(consentStorageKey, JSON.stringify({ version: 1, status: 'denied' }));
  f.client.syncConsent();
  assert.equal(f.client.status(), 'denied');
  assert.equal(await f.client.capture(measurementEvents[0]), false);
  assert.equal(f.requests.length, 0);
});

test('withdrawal in another tab aborts an already pending request', async () => {
  let signal;
  const f = fixture({ fetch: (_url, init) => new Promise((_resolve, reject) => {
    signal = init.signal;
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
  }) });
  f.client.allow();
  const pending = f.client.capture(measurementEvents[0]);
  f.storage.setItem(consentStorageKey, JSON.stringify({ version: 1, status: 'denied' }));
  f.client.syncConsent();
  assert.equal(signal.aborted, true);
  assert.equal(await pending, false);
});

test('storage and network failures remain non-blocking and never cause hidden retries', async () => {
  let attempts = 0;
  const f = fixture({
    storage: { getItem() { throw new Error('Blocked'); }, setItem() { throw new Error('Blocked'); }, removeItem() { throw new Error('Blocked'); } },
    fetch: async () => { attempts += 1; throw new Error('Offline'); },
  });
  assert.equal(f.client.status(), 'undecided');
  assert.equal(f.client.allow(), true);
  assert.equal(f.client.choiceIsSaved(), false);
  assert.equal(await f.client.capture(measurementEvents[0]), false);
  assert.equal(attempts, 1);
  f.client.decline();
  assert.equal(await f.client.capture(measurementEvents[1]), false);
  assert.equal(attempts, 1);
});

test('a blocked browser cannot silently revive an old grant without an unsaved-withdrawal warning', async () => {
  const oldGrant = JSON.stringify({ version: 1, status: 'granted', id });
  const f = fixture({ storage: { getItem: () => oldGrant, setItem() { throw new Error('Quota'); }, removeItem() { throw new Error('Blocked'); } } });
  assert.equal(f.client.status(), 'granted');
  assert.equal(f.client.decline(), false);
  assert.equal(f.client.status(), 'denied');
  assert.equal(await f.client.capture(measurementEvents[0]), false);
  assert.equal(f.requests.length, 0);
});

test('missing secure random UUID fails closed instead of inventing an identifying fallback', () => {
  const f = fixture({ randomUUID: () => { throw new Error('Unavailable'); } });
  assert.equal(f.client.allow(), false);
  assert.equal(f.writes.length, 0); assert.equal(f.requests.length, 0);
});

test('the page keeps downloads independent and exposes bilingual consent, withdrawal and honest handoff copy', async () => {
  const page = await readFile(new URL('../src/components/InstagramCampaignPage.astro', import.meta.url), 'utf8');
  const panel = await readFile(new URL('../src/components/CampaignMeasurement.astro', import.meta.url), 'utf8');
  assert.match(page, /CampaignMeasurement lang=\{lang\}/);
  assert.doesNotMatch(page, /sessionStorage|forger:download-intent|addEventListener\(['"]blur/);
  for (const control of ['allow', 'decline', 'withdraw', 'status', 'desktop-open']) assert.match(panel, new RegExp(`data-measurement-${control}`));
  assert.match(panel, /Downloads work either way/);
  assert.match(panel, /Puedes descargar aunque no aceptes/);
  assert.match(panel, /does not confirm an installation/);
  assert.match(panel, /no confirma una instalaci[oó]n/);
  assert.match(panel, /separately inside Forger/);
});
