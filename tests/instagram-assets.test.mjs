import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import sharp from 'sharp';

const generator = new URL('../scripts/generate-instagram-assets.mjs', import.meta.url);
const campaignCalendar = new URL(
  '../marketing/instagram/calendar-2026-08-27--2026-09-20.json',
  import.meta.url,
);

test('Instagram generator uses only current checked-in Forger screenshots as visual sources', async () => {
  const source = await readFile(generator, 'utf8');
  const screenshots = [
    'campaign-2026-08/chat-blank.png',
    'campaign-2026-08/apps-lego-public.png',
    'campaign-2026-08/agents-forger-marketer.png',
    'campaign-2026-08/automations-empty.png',
    'campaign-2026-08/files-header.png',
    'campaign-2026-08/backups-lego-public.png',
  ];

  assert.match(source, /public\/assets\/screenshots/);
  for (const screenshot of screenshots) {
    assert.match(source, new RegExp(screenshot.replace('.', '\\.')));
    await access(new URL(`../public/assets/screenshots/${screenshot}`, import.meta.url));
  }

  assert.doesNotMatch(source, /(?:imagegen|mockup|unsplash|pexels)/i);
  assert.doesNotMatch(
    source,
    /forger-(?:catalog|my-apps|chat-load|chat-categorize)\.png/,
    'historical Finance OS screenshots must not be used for new campaign exports',
  );
});

test('the six existing Instagram story exports remain intact', async () => {
  const expectedExports = [
    '01-gratis-tu-cuenta.png',
    '02-local-y-bajo-tu-control.png',
    '03-crea-una-app-que-te-sirva.png',
    '01-free-use-your-account.png',
    '02-local-under-your-control.png',
    '03-create-an-app-that-helps.png',
  ];

  for (const exportName of expectedExports) {
    const exportUrl = new URL(`../marketing/instagram/exports/${exportName}`, import.meta.url);
    await access(exportUrl);
    const metadata = await sharp(fileURLToPath(exportUrl)).metadata();
    assert.equal(metadata.width, 1080, exportName);
    assert.equal(metadata.height, 1920, exportName);
  }
});

test('campaign screenshots contain only reviewed safe crops from the current product', async () => {
  const expectedScreenshots = new Map([
    ['chat-blank.png', [1272, 768]],
    ['apps-lego-public.png', [480, 445]],
    ['agents-forger-marketer.png', [1272, 300]],
    ['automations-empty.png', [1272, 768]],
    ['files-header.png', [1272, 205]],
    ['backups-lego-public.png', [1272, 768]],
  ]);

  for (const [filename, [expectedWidth, expectedHeight]] of expectedScreenshots) {
    const screenshotUrl = new URL(`../public/assets/screenshots/campaign-2026-08/${filename}`, import.meta.url);
    await access(screenshotUrl);
    const metadata = await sharp(fileURLToPath(screenshotUrl)).metadata();
    assert.equal(metadata.width, expectedWidth, filename);
    assert.equal(metadata.height, expectedHeight, filename);
  }
});

test('English Instagram story variants are generated alongside the Spanish versions', async () => {
  const expectedExports = [
    '01-free-use-your-account.png',
    '02-local-under-your-control.png',
    '03-create-an-app-that-helps.png',
  ];

  for (const exportName of expectedExports) {
    await access(new URL(`../marketing/instagram/exports/${exportName}`, import.meta.url));
  }
});

test('future Instagram feed campaign schedules two posts a week for four weeks in Santiago time', async () => {
  const calendar = JSON.parse(await readFile(campaignCalendar, 'utf8'));

  assert.equal(calendar.timezone, 'America/Santiago');
  assert.equal(calendar.cadence, '2 posts per week for 4 weeks');
  assert.equal(calendar.posts.length, 8);
  assert.equal(calendar.measurement.installerDownloadCount, 38);
  assert.equal(
    Object.values(calendar.measurement.installerDownloadsByAsset).reduce((total, count) => total + count, 0),
    calendar.measurement.installerDownloadCount,
  );
  assert.match(calendar.measurement.limitation, /downloads, not completed installations/i);
  assert.deepEqual(
    calendar.posts.map(({ scheduledLocal }) => scheduledLocal),
    [
      '2026-08-27 13:00',
      '2026-08-30 11:00',
      '2026-09-03 13:00',
      '2026-09-06 11:00',
      '2026-09-10 13:00',
      '2026-09-13 11:00',
      '2026-09-17 13:00',
      '2026-09-20 11:00',
    ],
  );

  for (const [index, post] of calendar.posts.entries()) {
    assert.equal(post.week, Math.floor(index / 2) + 1);
    assert.equal(post.status, 'scheduled');
  }
});

test('future feed posts use the approved hooks, checked-in screenshots, and safe English captions', async () => {
  const calendar = JSON.parse(await readFile(campaignCalendar, 'utf8'));
  const approvedScreenshots = new Set([
    'campaign-2026-08/chat-blank.png',
    'campaign-2026-08/apps-lego-public.png',
    'campaign-2026-08/agents-forger-marketer.png',
    'campaign-2026-08/automations-empty.png',
    'campaign-2026-08/files-header.png',
    'campaign-2026-08/backups-lego-public.png',
  ]);
  const expectedHooks = [
    'Start with one need. Build around it.',
    'Not another chat tab. A real app you can open.',
    'Personal agents for focused work.',
    'Schedule local workflows.',
    'Share files explicitly.',
    'Backups, by your choice.',
    'One workspace. Many workflows.',
    'What should your computer do for you?',
  ];

  assert.deepEqual(
    calendar.posts.map(({ hook }) => hook),
    expectedHooks,
  );
  assert.equal(new Set(calendar.posts.map(({ filename }) => filename)).size, 8);

  for (const post of calendar.posts) {
    assert.match(post.filename, /\.png$/);
    assert.match(post.caption, /forger\.cloud/i);
    assert.doesNotMatch(post.caption, /link in bio/i);
    assert.doesNotMatch(post.caption, /everything (?:stays|is) local|all data stays local/i);
    if (post.assetStatus === 'ready') {
      assert.ok(post.screenshotSources.length >= 1);
      for (const screenshot of post.screenshotSources) {
        assert.ok(approvedScreenshots.has(screenshot), `${screenshot} must be an approved current screenshot`);
        await access(new URL(`../public/assets/screenshots/${screenshot}`, import.meta.url));
      }
    } else {
      assert.equal(post.assetStatus, 'awaiting-current-screenshot');
      assert.deepEqual(post.screenshotSources, []);
      assert.ok(post.screenshotRequirement.length > 20);
    }
  }

  const filePost = calendar.posts[4];
  assert.match(filePost.caption, /not accessed unless you explicitly share them/i);
  assert.match(filePost.caption, /choose what to share/i);
});

test('future feed exports are 1080 by 1350 and use varied compositions', async () => {
  const calendar = JSON.parse(await readFile(campaignCalendar, 'utf8'));
  const layouts = new Set(calendar.posts.map(({ layout }) => layout));

  assert.ok(layouts.size >= 6, 'the feed must not repeat one visual template');

  for (const post of calendar.posts.filter(({ assetStatus }) => assetStatus === 'ready')) {
    const exportUrl = new URL(`../marketing/instagram/exports/${post.filename}`, import.meta.url);
    await access(exportUrl);
    const metadata = await sharp(fileURLToPath(exportUrl)).metadata();
    assert.equal(metadata.width, 1080, post.filename);
    assert.equal(metadata.height, 1350, post.filename);
  }
});
