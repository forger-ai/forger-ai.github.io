import assert from 'node:assert/strict';
import test from 'node:test';
import { metadataForRelease } from '../scripts/generate-desktop-versions.mjs';
import { desktopAssetMap, detectDownloadTarget, isMobileDevice } from '../src/lib/desktop-download.mjs';

const assetNames = [
  'forger-desktop-macos-arm64.dmg', 'forger-desktop-macos-x64.dmg',
  'forger-desktop-windows-x64.exe', 'forger-desktop-windows-arm64.exe',
  'forger-desktop-linux-x64.deb',
];
const metadata = await metadataForRelease({
  tag_name: 'forger-desktop/v1.2.3', published_at: '2026-06-15T12:00:00Z', body: '- Desktop downloads',
  assets: assetNames.map((name) => ({ name, size: 1024, browser_download_url: `https://github.com/forger-ai/forger-desktop/releases/download/forger-desktop%2Fv1.2.3/${name}` })),
});
const assets = desktopAssetMap(metadata);

for (const [name, nav] of [
  ['iPhone with Mac OS X in its user agent', { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)', platform: 'iPhone' }],
  ['iPad', { userAgent: 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)', platform: 'iPad' }],
  ['iPad using desktop mode', { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', platform: 'MacIntel', maxTouchPoints: 5 }],
  ['Android phone', { userAgent: 'Mozilla/5.0 (Linux; Android 15; Pixel 9)', platform: 'Linux armv8l' }],
  ['Android tablet', { userAgent: 'Mozilla/5.0 (Linux; Android 15; SM-X)', userAgentData: { platform: 'Android', mobile: false } }],
  ['mobile browser client hints', { userAgent: 'Mozilla/5.0', userAgentData: { platform: 'Linux', mobile: true } }],
]) {
  test(`${name} offers desktop versions without selecting an installer`, async () => {
    assert.equal(isMobileDevice(nav), true);
    assert.equal(await detectDownloadTarget(nav, assets), 'mobile');
  });
}

for (const [platform, architecture, expected] of [
  ['macOS', 'arm', 'mac-arm'], ['macOS', 'x86', 'mac-intel'],
  ['Windows', 'x86', 'windows-x64'], ['Windows', 'arm', 'windows-arm'],
  ['Linux', 'x86', 'linux-x64'],
]) {
  test(`${platform} ${architecture} selects its generated release asset`, async () => {
    const nav = { userAgentData: { platform, getHighEntropyValues: async () => ({ architecture }) } };
    assert.equal(await detectDownloadTarget(nav, assets), expected);
    assert.equal(assets.get(expected).url, metadata.assets.find((asset) => asset.url.endsWith({ 'mac-arm': assetNames[0], 'mac-intel': assetNames[1], 'windows-x64': assetNames[2], 'windows-arm': assetNames[3], 'linux-x64': assetNames[4] }[expected])).url);
  });
}

test('unknown Mac architecture keeps Apple silicon default and all generated options available', async () => {
  assert.equal(await detectDownloadTarget({ platform: 'MacIntel', userAgent: 'Macintosh; Intel Mac OS X' }, assets), 'mac-arm');
  assert.deepEqual([...assets.keys()].sort(), ['linux-x64', 'mac-arm', 'mac-intel', 'windows-arm', 'windows-x64']);
});

test('missing metadata allows existing desktop fallback downloads, but unavailable metadata assets are not selected', async () => {
  assert.equal(await detectDownloadTarget({ platform: 'Win32' }, null), 'windows-x64');
  assert.equal(await detectDownloadTarget({ platform: 'Win32' }, new Map()), 'unsupported');
  const stableOnly = desktopAssetMap({ assets: metadata.assets.filter((asset) => asset.platform === 'darwin' && asset.arch === 'arm64') });
  assert.equal(await detectDownloadTarget({ platform: 'Win32' }, stableOnly), 'unsupported');
  assert.equal(await detectDownloadTarget({ userAgentData: { platform: 'macOS', getHighEntropyValues: async () => ({ architecture: 'x86' }) } }, stableOnly), 'unsupported');
});

test('architecture detection failure does not prevent a Windows download or manual selection', async () => {
  assert.equal(await detectDownloadTarget({ userAgentData: { platform: 'Windows', getHighEntropyValues: async () => { throw new Error('Blocked'); } } }, assets), 'windows-x64');
  assert.equal(await detectDownloadTarget({ platform: 'Linux aarch64' }, assets), 'unsupported');
  assert.equal(await detectDownloadTarget({ platform: 'Unknown' }, assets), 'unsupported');
});

test('metadata only accepts release URLs from the actual Desktop repository', () => {
  assert.equal(desktopAssetMap({ assets: [{ platform: 'darwin', arch: 'arm64', url: 'javascript:alert(1)' }] }).size, 0);
  assert.equal(desktopAssetMap({ assets: [{ platform: 'darwin', arch: 'arm64', url: 'https://github.com/another/repo/releases/a.dmg' }] }).size, 0);
  assert.equal(desktopAssetMap(null), null);
});
