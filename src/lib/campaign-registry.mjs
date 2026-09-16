// Only desktopEligible public codes are allowlisted by the published Forger Desktop.
// This registry is not a person identifier and never accepts arbitrary UTM data.
const entries = [];
for (const number of ['01', '02']) {
  entries.push({ code: `ig_202609_paid_${number}`, desktopEligible: true, utm: { utm_source: 'instagram', utm_medium: 'paid_social', utm_campaign: 'first_app_2026_09', utm_content: `reel_${number}` } });
}
const organicContents = ['free_private_local', 'existing_provider', 'daily_compass', 'local_data_sharing'];
for (const [prefix, source] of [['ig', 'instagram'], ['fb', 'facebook']]) {
  organicContents.forEach((content, index) => entries.push({ code: `${prefix}_202609_org_0${index + 1}`, desktopEligible: true, utm: { utm_source: source, utm_medium: 'organic_social', utm_campaign: 'forger_first_app_2026_09', utm_content: content } }));
}
// LATAM can be measured on the website without emitting unsupported Desktop links.
for (const number of ['01', '02']) {
  entries.push({ code: `ig_202609_latam_paid_${number}`, desktopEligible: false, utm: { utm_source: 'instagram', utm_medium: 'paid_social', utm_campaign: 'first_app_latam_2026_09', utm_content: `reel_${number}` } });
}
export const campaignRegistry = Object.freeze(entries.map((entry) => Object.freeze({ ...entry, utm: Object.freeze(entry.utm) })));

export function campaignCodeForUrl(locationHref) {
  try {
    const url = new URL(locationHref);
    if (!/^\/(?:es\/)?instagram\/?$/.test(url.pathname)) return null;
    return campaignRegistry.find(({ utm }) => Object.entries(utm).every(([key, value]) => {
      const values = url.searchParams.getAll(key);
      return values.length === 1 && values[0] === value;
    }))?.code ?? null;
  } catch { return null; }
}

export function desktopCampaignUrl(code) {
  return campaignRegistry.some((entry) => entry.code === code && entry.desktopEligible === true) ? `forger://campaign?code=${code}` : null;
}
