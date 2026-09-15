import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import sharp from 'sharp';

const manifestUrl = new URL(
  '../marketing/instagram/followup-2026-09-24/manifest.json',
  import.meta.url,
);
const generatorUrl = new URL('../scripts/generate-instagram-followup.mjs', import.meta.url);
const packageUrl = new URL('../package.json', import.meta.url);
const exportBaseUrl = new URL(
  '../marketing/instagram/followup-2026-09-24/exports/',
  import.meta.url,
);

const approvedSources = new Set([
  'campaign-2026-08/daily-compass-dashboard.png',
  'campaign-2026-08/daily-compass-week.png',
  'campaign-2026-08/daily-compass-focus.png',
  'campaign-2026-08/daily-compass-completed.png',
  'campaign-2026-08/agents-forger-marketer.png',
  'campaign-2026-08/automations-empty.png',
]);

const readBoxes = (buffer, start = 0, end = buffer.length) => {
  const boxes = [];
  let offset = start;
  while (offset + 8 <= end) {
    let size = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    let headerSize = 8;
    if (size === 1) {
      if (offset + 16 > end) break;
      size = Number(buffer.readBigUInt64BE(offset + 8));
      headerSize = 16;
    } else if (size === 0) {
      size = end - offset;
    }
    if (size < headerSize || offset + size > end) break;
    boxes.push({ type, start: offset, dataStart: offset + headerSize, end: offset + size });
    offset += size;
  }
  return boxes;
};

const findChild = (buffer, parent, type) =>
  readBoxes(buffer, parent.dataStart, parent.end).find((box) => box.type === type);

const inspectMp4 = (buffer) => {
  const topLevel = readBoxes(buffer);
  const moov = topLevel.find(({ type }) => type === 'moov');
  assert.ok(topLevel.some(({ type }) => type === 'ftyp'), 'MP4 must contain ftyp');
  assert.ok(moov, 'MP4 must contain moov');

  const mvhd = findChild(buffer, moov, 'mvhd');
  assert.ok(mvhd, 'MP4 must contain movie timing metadata');
  assert.equal(buffer[mvhd.dataStart], 0, 'encoder must emit version-0 mvhd metadata');
  const timescale = buffer.readUInt32BE(mvhd.dataStart + 12);
  const durationUnits = buffer.readUInt32BE(mvhd.dataStart + 16);
  const tracks = readBoxes(buffer, moov.dataStart, moov.end).filter(({ type }) => type === 'trak');
  const dimensions = tracks
    .map((track) => findChild(buffer, track, 'tkhd'))
    .filter(Boolean)
    .map((tkhd) => ({
      width: buffer.readUInt32BE(tkhd.dataStart + 76) / 65536,
      height: buffer.readUInt32BE(tkhd.dataStart + 80) / 65536,
    }))
    .find(({ width, height }) => width > 0 && height > 0);

  return {
    duration: durationUnits / timescale,
    width: dimensions?.width,
    height: dimensions?.height,
    hasH264: buffer.includes(Buffer.from('avc1')),
  };
};

test('follow-up campaign is reproducible, English, and grounded only in approved real screenshots', async () => {
  const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
  const generator = await readFile(generatorUrl, 'utf8');
  const packageJson = JSON.parse(await readFile(packageUrl, 'utf8'));
  const serialized = `${generator}\n${JSON.stringify(manifest)}`;

  assert.equal(manifest.language, 'English');
  assert.equal(manifest.sourceAuthenticity, 'real-current-product-screenshots');
  assert.equal(manifest.mockProductUi, false);
  assert.equal(
    packageJson.scripts['generate:instagram-followup'],
    'node scripts/generate-instagram-followup.mjs',
  );
  assert.ok(manifest.sourceScreenshots.length >= 4);
  for (const source of manifest.sourceScreenshots) {
    assert.ok(approvedSources.has(source), `${source} must be an approved screenshot`);
    await access(new URL(`../public/assets/screenshots/${source}`, import.meta.url));
  }
  assert.doesNotMatch(serialized, /chat-blank\.png|files-header\.png/i);
  assert.doesNotMatch(serialized, /(?:imagegen|unsplash|pexels|stock photo|lego|mock product ui)/i);
  assert.doesNotMatch(
    serialized,
    /\b(?:gratis|privado|seguro|descarga|instalaci[oó]n|archivos|carpetas|automatizaciones|agentes personales)\b/i,
  );
});

test('manifest defines the four approved organic posts on the requested cadence', async () => {
  const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
  assert.equal(manifest.timeZone, 'America/Santiago');
  assert.deepEqual(
    manifest.posts.map(({ scheduledLocal, format }) => ({ scheduledLocal, format })),
    [
      { scheduledLocal: '2026-09-24 13:00', format: 'reel' },
      { scheduledLocal: '2026-09-27 11:00', format: 'carousel' },
      { scheduledLocal: '2026-10-01 13:00', format: 'reel' },
      { scheduledLocal: '2026-10-04 11:00', format: 'carousel' },
    ],
  );

  const instagramContents = new Set();
  const facebookContents = new Set();
  for (const post of manifest.posts) {
    assert.deepEqual(post.lifecycle, {
      prepared: true,
      approved: false,
      scheduled: false,
      published: false,
    });
    assert.match(post.captions.instagram.text, /Create your first app/i);
    assert.match(post.captions.instagram.text, /Open forger\.cloud on your Mac/i);
    assert.match(post.captions.instagram.text, /link in bio/i);
    assert.match(post.captions.instagram.text, /Provider terms and costs may apply\./i);
    assert.doesNotMatch(post.captions.instagram.text, /https?:\/\//i);

    const instagramUrl = new URL(post.captions.instagram.bioUrl);
    assert.equal(`${instagramUrl.origin}${instagramUrl.pathname}`, 'https://forger.cloud/instagram');
    assert.equal(instagramUrl.searchParams.get('utm_source'), 'instagram');
    assert.equal(instagramUrl.searchParams.get('utm_medium'), 'organic_social');
    assert.equal(instagramUrl.searchParams.get('utm_campaign'), 'forger_first_app_2026_09');
    instagramContents.add(instagramUrl.searchParams.get('utm_content'));

    const facebookUrl = new URL(post.captions.facebook.destinationUrl);
    assert.equal(`${facebookUrl.origin}${facebookUrl.pathname}`, 'https://forger.cloud/instagram');
    assert.equal(facebookUrl.searchParams.get('utm_source'), 'facebook');
    assert.equal(facebookUrl.searchParams.get('utm_medium'), 'organic_social');
    assert.equal(facebookUrl.searchParams.get('utm_campaign'), 'forger_first_app_2026_09');
    assert.match(post.captions.facebook.text, /Provider terms and costs may apply\./i);
    assert.ok(post.captions.facebook.text.includes(post.captions.facebook.destinationUrl));
    facebookContents.add(facebookUrl.searchParams.get('utm_content'));

    assert.equal(post.channels.includes('Instagram'), true);
    assert.equal(post.channels.includes('Facebook'), true);
  }
  assert.equal(instagramContents.size, 4);
  assert.deepEqual(instagramContents, facebookContents);
});

test('each follow-up carousel has four distinct 1080 by 1350 PNG slides', async () => {
  const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
  const carousels = manifest.posts.filter(({ format }) => format === 'carousel');
  assert.equal(carousels.length, 2);

  for (const carousel of carousels) {
    assert.deepEqual(carousel.dimensions, { width: 1080, height: 1350 });
    assert.equal(carousel.slides.length, 4);
    const digests = new Set();
    for (const slide of carousel.slides) {
      const image = await readFile(new URL(slide.filename, exportBaseUrl));
      const metadata = await sharp(image).metadata();
      assert.equal(metadata.format, 'png', slide.filename);
      assert.equal(metadata.width, 1080, slide.filename);
      assert.equal(metadata.height, 1350, slide.filename);
      digests.add(createHash('sha256').update(image).digest('hex'));
    }
    assert.equal(digests.size, 4, `${carousel.id} slides must be distinct`);
  }
});

test('both Reels are practical silent 1080 by 1920 H.264 masters lasting 12 to 15 seconds', async () => {
  const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
  const reels = manifest.posts.filter(({ format }) => format === 'reel');
  assert.equal(reels.length, 2);

  for (const reel of reels) {
    assert.deepEqual(reel.dimensions, { width: 1080, height: 1920 });
    assert.ok(reel.durationSeconds >= 12 && reel.durationSeconds <= 15, reel.id);
    assert.equal(reel.framesPerSecond, 30);
    assert.equal(reel.audio, 'silent master');
    assert.match(reel.publishingNote, /Meta Sound Collection/i);

    const video = await readFile(new URL(reel.filename, exportBaseUrl));
    const metadata = inspectMp4(video);
    assert.ok(metadata.duration >= 12 && metadata.duration <= 15.1, `${reel.id}: ${metadata.duration}`);
    assert.equal(metadata.width, 1080, reel.id);
    assert.equal(metadata.height, 1920, reel.id);
    assert.equal(metadata.hasH264, true, reel.id);
    assert.ok(video.length < 20_000_000, `${reel.id} should stay practical to upload`);

    for (const [filename, dimensions] of [
      [reel.coverFilename, { width: 1080, height: 1920 }],
      [reel.storyboardFilename, { width: 2160, height: 1350 }],
    ]) {
      const image = await readFile(new URL(filename, exportBaseUrl));
      const metadataImage = await sharp(image).metadata();
      assert.equal(metadataImage.width, dimensions.width, filename);
      assert.equal(metadataImage.height, dimensions.height, filename);
    }
  }
});

test('copy covers the two propositions without absolute privacy or cost claims', async () => {
  const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
  const serialized = JSON.stringify(manifest);

  assert.match(serialized, /FREE\. PRIVATE\. LOCAL\./i);
  assert.match(serialized, /no added Forger subscription/i);
  assert.match(serialized, /Codex/i);
  assert.match(serialized, /Claude Code/i);
  assert.match(serialized, /Antigravity/i);
  assert.match(serialized, /Turn your idea into an app you actually use\./i);
  assert.match(serialized, /local data/i);
  assert.match(serialized, /explicitly share/i);
  assert.match(serialized, /Open/i);
  assert.match(serialized, /Focus/i);
  assert.match(serialized, /Complete/i);
  assert.doesNotMatch(
    serialized,
    /everything stays local|never (?:leaves|uploaded)|100% private|completely private|fully secure|free ai|zero cost|no cost/i,
  );
});

test('Daily Compass Reel opens on the visible result before the Open, Focus, Complete sequence', async () => {
  const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
  const reel = manifest.posts.find(({ id }) => id === '2026-10-01-daily-compass');
  assert.ok(reel);
  assert.equal(reel.scenes[0].source, 'campaign-2026-08/daily-compass-completed.png');
  assert.deepEqual(
    reel.scenes.slice(1, 4).map(({ accent }) => accent),
    ['OPEN', 'FOCUS', 'COMPLETE'],
  );
  assert.deepEqual(reel.screenshotSequence, reel.scenes.slice(0, 4).map(({ source }) => source));
  assert.match(reel.scenes.at(-1).support, /Turn your idea into an app you actually use\./i);
});

test('two paid Reel variants are prepared for Apple silicon without activating spend or delivery', async () => {
  const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
  assert.equal(manifest.paidVariants.length, 2);

  const expectedContent = new Set(['reel_01', 'reel_02']);
  for (const variant of manifest.paidVariants) {
    assert.deepEqual(variant.lifecycle, {
      prepared: true,
      approved: false,
      scheduled: false,
      published: false,
    });
    assert.equal(variant.spendUsd, 0);
    assert.equal(variant.macCompatibilityLabel, 'FOR MAC WITH APPLE SILICON');
    assert.match(variant.endCard.accent, /Create your first app|Open forger\.cloud on your Mac/i);
    assert.equal(variant.endCard.support, variant.macCompatibilityLabel);
    assert.match(variant.primaryText, /Provider terms and costs may apply\./i);
    assert.doesNotMatch(variant.primaryText, /free ai|no cost|installs? in|in seconds?|in minutes?/i);

    const destination = new URL(variant.destinationUrl);
    assert.equal(`${destination.origin}${destination.pathname}`, 'https://forger.cloud/instagram');
    assert.equal(destination.searchParams.get('utm_source'), 'instagram');
    assert.equal(destination.searchParams.get('utm_medium'), 'paid_social');
    assert.equal(
      destination.searchParams.get('utm_campaign'),
      'first_app_2026_09',
    );
    assert.ok(expectedContent.delete(destination.searchParams.get('utm_content')));

    const video = await readFile(new URL(variant.filename, exportBaseUrl));
    const metadata = inspectMp4(video);
    assert.ok(metadata.duration >= 12 && metadata.duration <= 15.1);
    assert.equal(metadata.width, 1080);
    assert.equal(metadata.height, 1920);
    assert.equal(metadata.hasH264, true);
    assert.ok(video.length < 20_000_000);

    const cover = await readFile(new URL(variant.coverFilename, exportBaseUrl));
    const coverMetadata = await sharp(cover).metadata();
    assert.equal(coverMetadata.width, 1080);
    assert.equal(coverMetadata.height, 1920);
  }
  assert.equal(expectedContent.size, 0);
});
