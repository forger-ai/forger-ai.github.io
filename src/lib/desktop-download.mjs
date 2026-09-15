const assetKinds = {
  'darwin:arm64': 'mac-arm',
  'darwin:x64': 'mac-intel',
  'win32:x64': 'windows-x64',
  'win32:arm64': 'windows-arm',
  'linux:x64': 'linux-x64',
};

/** Share one device decision between the landing and every download picker. */
export function isMobileDevice(nav) {
  const platform = nav.userAgentData?.platform || nav.platform || '';
  const ua = nav.userAgent || '';
  return nav.userAgentData?.mobile === true
    || /Android|iPhone|iPad|iPod|Mobile/i.test(`${platform} ${ua}`)
    // iPadOS desktop mode reports MacIntel and a desktop Safari user agent.
    || (/Mac/i.test(`${platform} ${ua}`) && nav.maxTouchPoints > 1);
}

/** null means metadata could not load; an empty Map means no usable assets. */
export function desktopAssetMap(metadata) {
  if (!Array.isArray(metadata?.assets)) return null;
  const assets = new Map();
  for (const asset of metadata.assets) {
    const kind = assetKinds[`${asset?.platform}:${asset?.arch}`];
    if (!kind) continue;
    try {
      const url = new URL(asset.url);
      if (url.protocol !== 'https:' || url.hostname !== 'github.com'
        || url.username || url.password
        || !url.pathname.startsWith('/forger-ai/forger-desktop/releases/')) continue;
      assets.set(kind, asset);
    } catch {
      // Ignore invalid assets; explicit supported versions remain available.
    }
  }
  return assets;
}

export async function detectDownloadTarget(nav, assets) {
  if (isMobileDevice(nav)) return 'mobile';
  const platform = nav.userAgentData?.platform || nav.platform || '';
  const ua = nav.userAgent || '';
  let architecture = '';
  try {
    architecture = (await nav.userAgentData?.getHighEntropyValues?.(['architecture']))?.architecture || '';
  } catch {
    // Browser hints are optional. All available versions stay selectable.
  }
  const available = (kind) => assets === null ? kind !== 'windows-arm' : assets.has(kind);
  const arm = /arm|aarch64/i.test(architecture || `${platform} ${ua}`);
  const intel = /x86|x64|amd64/i.test(architecture);
  const device = `${platform} ${ua}`;
  let kind;
  if (/Windows|Win32|Win64/i.test(device)) {
    kind = arm && available('windows-arm') ? 'windows-arm' : 'windows-x64';
  } else if (/Mac/i.test(device)) {
    // Safari reports "Intel Mac OS X" on Apple silicon too; do not infer Intel from UA.
    kind = intel ? 'mac-intel' : 'mac-arm';
  } else if (/Linux|Ubuntu/i.test(device) && !arm) {
    kind = 'linux-x64';
  }
  return kind && available(kind) ? kind : 'unsupported';
}
