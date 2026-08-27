import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import sharp from 'sharp';

const manifestUrl = new URL(
  '../marketing/instagram/pilot/professional-pilot-2026-08-27.json',
  import.meta.url,
);
const generatorUrl = new URL(
  '../scripts/generate-instagram-professional-pilot.mjs',
  import.meta.url,
);
const packageUrl = new URL('../package.json', import.meta.url);

const approvedSources = new Set([
  'campaign-2026-08/chat-blank.png',
  'campaign-2026-08/apps-lego-public.png',
  'campaign-2026-08/lego-news-public.png',
  'campaign-2026-08/lego-news-filter-open.png',
  'campaign-2026-08/lego-news-price-drops.png',
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
  const ftyp = topLevel.find(({ type }) => type === 'ftyp');
  const moov = topLevel.find(({ type }) => type === 'moov');
  assert.ok(ftyp, 'MP4 must contain an ftyp box');
  assert.ok(moov, 'MP4 must contain a moov box');

  const mvhd = findChild(buffer, moov, 'mvhd');
  assert.ok(mvhd, 'MP4 must contain movie timing metadata');
  const version = buffer[mvhd.dataStart];
  assert.equal(version, 0, 'pilot encoder must emit version-0 mvhd metadata');
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

test('professional pilot is reproducible and uses only real current Forger screens', async () => {
  const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
  const generator = await readFile(generatorUrl, 'utf8');
  const packageJson = JSON.parse(await readFile(packageUrl, 'utf8'));

  assert.equal(manifest.sourceAuthenticity, 'real-current-product-screenshots');
  assert.equal(manifest.mockProductUi, false);
  assert.equal(packageJson.scripts['generate:instagram-pilot'], 'node scripts/generate-instagram-professional-pilot.mjs');
  assert.doesNotMatch(generator, /(?:imagegen|unsplash|pexels|mock product ui)/i);

  for (const source of manifest.sourceScreenshots) {
    assert.ok(approvedSources.has(source), `${source} must be an approved current screenshot`);
    await access(new URL(`../public/assets/screenshots/${source}`, import.meta.url));
  }
});

test('carousel contains three distinct 1080 by 1350 slides with concise safe copy', async () => {
  const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));

  assert.equal(manifest.carousel.slides.length, 3);
  assert.deepEqual(manifest.carousel.dimensions, { width: 1080, height: 1350 });
  assert.match(manifest.carousel.finalCta, /free for people/i);
  assert.match(manifest.carousel.finalCta, /forger\.cloud/i);

  const digests = new Set();
  for (const slide of manifest.carousel.slides) {
    const outputUrl = new URL(`../marketing/instagram/pilot/exports/${slide.filename}`, import.meta.url);
    const image = await readFile(outputUrl);
    const metadata = await sharp(image).metadata();
    assert.equal(metadata.width, 1080, slide.filename);
    assert.equal(metadata.height, 1350, slide.filename);
    assert.ok(slide.hook.split(/\s+/).length <= 8, `${slide.filename} hook must stay concise`);
    assert.doesNotMatch(`${slide.hook} ${slide.body}`, /everything stays local|100% private|free ai/i);
    digests.add(image.subarray(0, 512).toString('base64'));
  }
  assert.equal(digests.size, 3, 'carousel slides must be visually distinct files');
});

test('Reel is a ten-second vertical H.264 video built from the captured real interaction', async () => {
  const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
  const reel = manifest.reel;
  const reelUrl = new URL(`../marketing/instagram/pilot/exports/${reel.filename}`, import.meta.url);
  const video = await readFile(reelUrl);
  const metadata = inspectMp4(video);

  assert.deepEqual(reel.dimensions, { width: 1080, height: 1920 });
  assert.equal(reel.durationSeconds, 10);
  assert.equal(reel.framesPerSecond, 30);
  assert.equal(reel.interaction, 'open news filter and choose price drops');
  assert.deepEqual(reel.screenshotSequence, [
    'campaign-2026-08/lego-news-public.png',
    'campaign-2026-08/lego-news-filter-open.png',
    'campaign-2026-08/lego-news-price-drops.png',
  ]);
  assert.ok(metadata.duration >= 9.9 && metadata.duration <= 10.1, `unexpected duration ${metadata.duration}`);
  assert.equal(metadata.width, 1080);
  assert.equal(metadata.height, 1920);
  assert.equal(metadata.hasH264, true);
  assert.ok(video.length < 12_000_000, 'Reel should stay practical to upload');
});

test('pilot copy keeps the product claims accurate and separates soundtrack from the master', async () => {
  const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
  const serialized = JSON.stringify(manifest);

  assert.match(serialized, /local-first/i);
  assert.match(serialized, /free for people/i);
  assert.match(serialized, /no added Forger subscription/i);
  assert.match(serialized, /provider terms and costs may apply/i);
  assert.doesNotMatch(serialized, /everything stays local|never uploaded|100% private|free ai/i);
  assert.equal(manifest.reel.audio, 'silent master');
  assert.match(manifest.reel.publishingNote, /Meta Sound Collection/i);
});
