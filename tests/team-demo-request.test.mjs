import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  TeamDemoRequestError,
  submitTeamDemoRequest,
} from '../src/lib/team-demo-request.mjs';

test('submits a normalized Teams demo request to Forger Cloud', async () => {
  let received;
  const response = await submitTeamDemoRequest({
    apiBaseUrl: 'https://platform.forger.cloud/',
    payload: {
      name: '  Ada Lovelace ',
      email: ' ADA@EXAMPLE.COM ',
      phone: ' +56 9 1234 5678 ',
      useCase: '  Internal reporting  ',
      website: '',
      source: 'website_es',
    },
    fetchImpl: async (url, init) => {
      received = { url, init };
      return new Response(null, { status: 202 });
    },
  });

  assert.equal(received.url, 'https://platform.forger.cloud/api/team_demo_requests');
  assert.deepEqual(JSON.parse(received.init.body), {
    contact_name: 'Ada Lovelace',
    email: 'ada@example.com',
    phone: '+56 9 1234 5678',
    use_case: 'Internal reporting',
    website: '',
    source: 'website_es',
  });
  assert.equal(response.accepted, true);
});

test('rejects incomplete contact data before making a request', async () => {
  let called = false;

  await assert.rejects(
    submitTeamDemoRequest({
      apiBaseUrl: 'https://platform.forger.cloud',
      payload: { name: '', email: 'not-an-email', phone: '', useCase: '', website: '', source: 'website_en' },
      fetchImpl: async () => {
        called = true;
        return new Response(null, { status: 202 });
      },
    }),
    (error) => error instanceof TeamDemoRequestError && error.code === 'invalid_request',
  );

  assert.equal(called, false);
});

test('does not disclose whether a contact already exists', async () => {
  const response = await submitTeamDemoRequest({
    apiBaseUrl: 'https://platform.forger.cloud',
    payload: {
      name: 'Ada',
      email: 'ada@example.com',
      phone: '+1 555 0100',
      useCase: 'Operations',
      website: '',
      source: 'website_en',
    },
    fetchImpl: async () => new Response(JSON.stringify({ accepted: true }), {
      status: 202,
      headers: { 'content-type': 'application/json' },
    }),
  });

  assert.deepEqual(response, { accepted: true });
});

test('homepage exposes an accessible Teams section and privacy link', async () => {
  const source = await readFile(new URL('../src/components/TeamDemoRequestForm.astro', import.meta.url), 'utf8');
  assert.match(source, /id="teams"/);
  assert.match(source, /name="email"/);
  assert.match(source, /name="phone"/);
  assert.match(source, /name="use_case"/);
  assert.match(source, /href=\{privacyPath\}/);
  assert.match(source, /name="website"/);
});
