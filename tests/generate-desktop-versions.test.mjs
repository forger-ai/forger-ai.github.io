import assert from 'node:assert/strict';
import test from 'node:test';

import {
  indexEntryForMetadata,
  metadataForRelease,
  validateMetadata,
  validateMetadataIndex,
} from '../scripts/generate-desktop-versions.mjs';

const releaseAsset = (name, size = 1024) => ({
  name,
  browser_download_url: `https://github.com/forger-ai/forger-desktop/releases/download/forger-desktop%2Fv1.2.3/${name}`,
  size,
});

const release = (assets) => ({
  tag_name: 'forger-desktop/v1.2.3',
  published_at: '2026-06-15T12:00:00Z',
  body: ['Forger Desktop v1.2.3', '', '- Adds experimental downloads'].join('\n'),
  assets,
});

test('generates schema v1 metadata for stable macOS ARM and experimental desktop assets', async () => {
  const metadata = await metadataForRelease(
    release([
      releaseAsset('forger-desktop-macos-arm64.dmg'),
      releaseAsset('forger-desktop-macos-x64.dmg'),
      releaseAsset('forger-desktop-windows-x64.exe'),
      releaseAsset('forger-desktop-linux-x64.deb'),
      releaseAsset('forger-desktop-windows-arm64.exe'),
    ]),
  );

  validateMetadata(metadata);

  assert.equal(metadata.schemaVersion, 1);
  assert.deepEqual(
    metadata.assets.map((asset) => [asset.platform, asset.arch, asset.kind, asset.experimental]),
    [
      ['darwin', 'arm64', 'dmg', undefined],
      ['darwin', 'x64', 'dmg', true],
      ['win32', 'x64', 'nsis', true],
      ['linux', 'x64', 'deb', true],
      ['win32', 'arm64', 'nsis', true],
    ],
  );
});

test('omits Windows ARM metadata when the release asset does not exist', async () => {
  const metadata = await metadataForRelease(
    release([
      releaseAsset('forger-desktop-macos-arm64.dmg'),
      releaseAsset('forger-desktop-macos-x64.dmg'),
      releaseAsset('forger-desktop-windows-x64.exe'),
      releaseAsset('forger-desktop-linux-x64.deb'),
    ]),
  );

  validateMetadata(metadata);

  assert.equal(
    metadata.assets.some((asset) => asset.platform === 'win32' && asset.arch === 'arm64'),
    false,
  );
});

test('generates compact desktop version index entries with release summaries', async () => {
  const metadata = await metadataForRelease(
    release([
      releaseAsset('forger-desktop-macos-arm64.dmg'),
    ]),
  );

  const metadataIndex = {
    schemaVersion: 1,
    releases: [indexEntryForMetadata(metadata)],
  };

  validateMetadataIndex(metadataIndex);
  assert.deepEqual(metadataIndex.releases[0], {
    version: '1.2.3',
    publishedAt: '2026-06-15T12:00:00Z',
    summary: 'Forger Desktop v1.2.3',
    assets: metadata.assets,
  });
});

test('parses first non-heading release body line as desktop update markdown summary', async () => {
  const metadata = await metadataForRelease({
    ...release([releaseAsset('forger-desktop-macos-arm64.dmg')]),
    body: ['# Release', '', '**Improves** updates and [local runtimes](https://forger.cloud).', '', '- Hidden detail'].join('\n'),
  });

  assert.equal(indexEntryForMetadata(metadata).summary, '**Improves** updates and [local runtimes](https://forger.cloud).');
});
