import { campaignCodeForUrl } from './campaign-registry.mjs';

export const consentStorageKey = 'forger-campaign-measurement-v1';
export const measurementEvents = Object.freeze([
  'forger_campaign_landing_view', 'forger_campaign_download_click',
  'forger_campaign_handoff_copy', 'forger_campaign_handoff_share',
  'forger_campaign_desktop_handoff',
]);
const endpoint = 'https://us.i.posthog.com/i/v0/e/';
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function availableForLocation(config, locationHref) {
  try {
    const url = new URL(locationHref);
    return config?.enabled === true && config.endpoint === endpoint
      && /^phc_[A-Za-z0-9_]{5,100}$/.test(config.projectToken)
      && ['production', 'test'].includes(config.environment)
      && url.origin === 'https://forger.cloud'
      && /^\/(?:es\/)?instagram\/?$/.test(url.pathname);
  } catch { return false; }
}

function readPreference(storage) {
  try {
    const value = JSON.parse(storage?.getItem(consentStorageKey) ?? 'null');
    if (value?.version !== 1) return { status: 'undecided' };
    if (value.status === 'denied') return { status: 'denied' };
    if (value.status === 'granted' && uuidPattern.test(value.id)) return { status: 'granted', id: value.id };
  } catch { /* Storage is optional; refusal and downloading still work. */ }
  return { status: 'undecided' };
}

/** Manual, consent-only capture. No SDK, queue, autocapture or browser-to-Desktop ID transfer. */
export function createCampaignMeasurement({ config, locationHref, storage, randomUUID, fetch }) {
  const available = availableForLocation(config, locationHref);
  let preference = available ? readPreference(storage) : { status: 'unavailable' };
  let persisted = preference.status === 'granted';
  const pending = new Set();
  const campaignCode = campaignCodeForUrl(locationHref) ?? 'unattributed';

  function cancelPending() {
    for (const controller of pending) controller.abort();
    pending.clear();
  }

  function savePreference(next) {
    try {
      storage.setItem(consentStorageKey, JSON.stringify({ version: 1, ...next }));
      return true;
    } catch { return false; }
  }

  function syncConsent() {
    if (!available || !persisted) return;
    const next = readPreference(storage);
    if (next.status !== 'granted' || next.id !== preference.id) cancelPending();
    preference = next;
    persisted = next.status === 'granted';
  }

  return {
    status: () => preference.status,
    choiceIsSaved: () => persisted,
    syncConsent,
    allow() {
      if (!available) return false;
      if (preference.status === 'granted') return true;
      try {
        const id = randomUUID();
        if (!uuidPattern.test(id)) return false;
        preference = { status: 'granted', id };
        persisted = savePreference(preference);
        return true;
      } catch { return false; }
    },
    decline() {
      if (!available) return false;
      cancelPending();
      preference = { status: 'denied' };
      persisted = false;
      let removed = false;
      try { storage.removeItem(consentStorageKey); removed = true; } catch { /* Report an unsaved choice if replacement also fails. */ }
      const saved = savePreference(preference);
      return removed || saved;
    },
    async capture(event) {
      syncConsent();
      if (!available || preference.status !== 'granted' || !measurementEvents.includes(event)) return false;
      const controller = new AbortController();
      pending.add(controller);
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const response = await fetch(endpoint, {
          method: 'POST', credentials: 'omit', referrerPolicy: 'no-referrer', redirect: 'error',
          headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
          body: JSON.stringify({
            api_key: config.projectToken, event, distinct_id: preference.id,
            properties: {
              campaign_code: campaignCode, surface: 'web', schema_version: 1,
              environment: config.environment, $process_person_profile: false, $geoip_disable: true,
            },
          }),
        });
        return !controller.signal.aborted && response.ok === true;
      } catch { return false; }
      finally { clearTimeout(timeout); pending.delete(controller); }
    },
  };
}
