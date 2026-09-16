import { campaignMeasurementConfig } from './campaign-measurement-config.mjs';
import { createCampaignMeasurement, consentStorageKey } from './campaign-measurement.mjs';
import { campaignCodeForUrl, desktopCampaignUrl } from './campaign-registry.mjs';

export function recordHandoffOutcome(client, outcome) {
  if (outcome === 'copied') void client.capture('forger_campaign_handoff_copy');
  else if (outcome === 'shared') void client.capture('forger_campaign_handoff_share');
}

/** Keep DOM wiring separate from the auditable, tested consent and transport boundary. */
export function setupCampaignMeasurement({ document, window, mobile }) {
  let storage;
  try { storage = window.localStorage; } catch { /* Consent remains tab-local if storage is blocked. */ }
  const client = createCampaignMeasurement({
    config: campaignMeasurementConfig, locationHref: window.location.href, storage,
    randomUUID: () => window.crypto.randomUUID(), fetch: window.fetch.bind(window),
  });
  const panel = document.querySelector('[data-campaign-measurement]');
  if (!panel) return client;
  let withdrawalUnsaved = false;

  function render() {
    const status = client.status();
    const message = withdrawalUnsaved ? 'denied-unsaved' : status === 'granted' && !client.choiceIsSaved() ? 'granted-unsaved' : status;
    panel.querySelector('[data-measurement-status]').textContent = panel.getAttribute(`data-status-${message}`);
    panel.querySelector('[data-measurement-choices]').hidden = status === 'granted' || status === 'unavailable';
    panel.querySelector('[data-measurement-withdraw]').hidden = status !== 'granted';
  }
  panel.querySelector('[data-measurement-allow]').addEventListener('click', () => {
    const wasGranted = client.status() === 'granted';
    if (client.allow()) {
      withdrawalUnsaved = false;
      if (!wasGranted) void client.capture('forger_campaign_landing_view');
    }
    render();
  });
  for (const selector of ['[data-measurement-decline]', '[data-measurement-withdraw]']) {
    panel.querySelector(selector).addEventListener('click', () => { withdrawalUnsaved = !client.decline(); render(); });
  }
  window.addEventListener('storage', (event) => {
    if (event.key === consentStorageKey || event.key === null) { client.syncConsent(); render(); }
  });

  // A public code is transferred only on an explicit click, never a browser ID or consent.
  const code = campaignCodeForUrl(window.location.href);
  const desktopUrl = desktopCampaignUrl(code);
  if (desktopUrl && !mobile) {
    panel.querySelector('[data-measurement-desktop]').hidden = false;
    panel.querySelector('[data-measurement-code]').textContent = code;
    const open = panel.querySelector('[data-measurement-desktop-open]');
    open.href = desktopUrl;
    open.addEventListener('click', () => { void client.capture('forger_campaign_desktop_handoff'); });
  }
  render();
  void client.capture('forger_campaign_landing_view');
  return client;
}
