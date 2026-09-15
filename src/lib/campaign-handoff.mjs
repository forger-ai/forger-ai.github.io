const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const maxValueLength = 100;

/** Only campaign labels may cross from a mobile browser to the canonical site. */
export function buildCampaignUrl(locationHref) {
  const result = new URL('https://forger.cloud/instagram');
  try {
    const source = new URL(locationHref);
    if (/^\/es\/instagram\/?$/.test(source.pathname)) result.pathname = '/es/instagram';
    for (const key of campaignKeys) {
      const values = source.searchParams.getAll(key);
      if (values.length !== 1) continue;
      const raw = values[0];
      const value = raw.trim();
      if (raw.length > maxValueLength || !value || !/^[\p{L}\p{N} _.-]+$/u.test(raw)) continue;
      result.searchParams.set(key, value);
    }
  } catch {
    // A malformed location still produces a usable, safe public URL.
  }
  return result.toString();
}

function selectForManualCopy(input, url) {
  input.value = url;
  input.focus();
  input.select();
  input.setSelectionRange(0, url.length);
  return 'manualCopy';
}

export async function copyHandoffLink({ navigator, input, url }) {
  input.value = url;
  try {
    if (!navigator.clipboard?.writeText) return selectForManualCopy(input, url);
    await navigator.clipboard.writeText(url);
    return 'copied';
  } catch {
    return selectForManualCopy(input, url);
  }
}

export async function shareHandoffLink({ navigator, input, url, title, text }) {
  input.value = url;
  const data = { title, text, url };
  if (!navigator.share) return copyHandoffLink({ navigator, input, url });
  try {
    if (navigator.canShare && !navigator.canShare(data)) return copyHandoffLink({ navigator, input, url });
    await navigator.share(data);
    return 'shared';
  } catch (error) {
    if (error?.name === 'AbortError') return 'cancelled';
    return selectForManualCopy(input, url);
  }
}
