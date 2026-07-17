export class TeamDemoRequestError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'TeamDemoRequestError';
    this.code = code;
  }
}

const normalizeText = (value) => String(value ?? '').trim();

const normalizedPayload = (payload) => ({
  contact_name: normalizeText(payload.name),
  email: normalizeText(payload.email).toLowerCase(),
  phone: normalizeText(payload.phone),
  use_case: normalizeText(payload.useCase),
  website: normalizeText(payload.website),
  source: normalizeText(payload.source),
});

const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export async function submitTeamDemoRequest({ apiBaseUrl, payload, fetchImpl = fetch }) {
  const normalized = normalizedPayload(payload);
  if (
    !normalized.contact_name ||
    !validEmail(normalized.email) ||
    !normalized.phone ||
    !normalized.use_case ||
    !normalized.source
  ) {
    throw new TeamDemoRequestError('invalid_request', 'The contact information is incomplete.');
  }

  const url = new URL('/api/team_demo_requests', apiBaseUrl);
  let response;
  try {
    response = await fetchImpl(url.toString(), {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(normalized),
    });
  } catch (error) {
    throw new TeamDemoRequestError('network_error', error instanceof Error ? error.message : 'Network error');
  }

  if (response.status !== 202) {
    throw new TeamDemoRequestError(
      response.status === 429 ? 'rate_limited' : 'request_failed',
      `Forger Cloud returned ${response.status}.`,
    );
  }

  return { accepted: true };
}
