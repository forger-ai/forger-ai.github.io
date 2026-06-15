import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const repo = process.env.FORGER_DESKTOP_REPO ?? 'forger-ai/forger-desktop';
const outputDir = path.resolve('dist', 'desktop-versions');
const releaseApiUrl = `https://api.github.com/repos/${repo}/releases?per_page=100`;

const assetRules = [
  {
    name: 'forger-desktop-macos-arm64.dmg',
    platform: 'darwin',
    arch: 'arm64',
    kind: 'dmg',
  },
  {
    name: 'forger-desktop-macos-x64.dmg',
    platform: 'darwin',
    arch: 'x64',
    kind: 'dmg',
    experimental: true,
  },
  {
    name: 'forger-desktop-windows-x64.exe',
    platform: 'win32',
    arch: 'x64',
    kind: 'nsis',
    experimental: true,
  },
  {
    name: 'forger-desktop-linux-x64.deb',
    platform: 'linux',
    arch: 'x64',
    kind: 'deb',
    experimental: true,
  },
  {
    name: 'forger-desktop-windows-arm64.exe',
    platform: 'win32',
    arch: 'arm64',
    kind: 'nsis',
    experimental: true,
  },
];

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'forger-pages-desktop-version-generator',
};

if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

const fetchJson = async (url) => {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API request failed (${response.status}) for ${url}`);
  }
  return await response.json();
};

const fetchText = async (url) => {
  const response = await fetch(url, { headers: { ...headers, Accept: 'application/octet-stream' } });
  if (!response.ok) {
    throw new Error(`Asset request failed (${response.status}) for ${url}`);
  }
  return await response.text();
};

const versionFromRelease = (release) => {
  const match = /^forger-desktop\/v(.+)$/.exec(release.tag_name ?? '');
  if (!match) {
    return null;
  }
  return match[1];
};

const parseReleaseNotes = (body, version) => {
  const lines = String(body ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const changes = lines
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, '').trim())
    .filter(Boolean);
  const summary = lines.find((line) => !/^#{1,6}\s+/.test(line) && !/^[-*]\s+/.test(line));
  return {
    summary: summary && summary !== `Forger Desktop v${version}` ? summary : `Forger Desktop v${version}`,
    changes,
  };
};

export const parseSha256 = async (asset) => {
  const checksumAsset = asset.releaseAssets.find((candidate) => candidate.name === `${asset.name}.sha256`);
  if (!checksumAsset?.browser_download_url) {
    return undefined;
  }
  const checksumText = await fetchText(checksumAsset.browser_download_url);
  const match = /\b([a-f0-9]{64})\b/i.exec(checksumText);
  return match?.[1]?.toLowerCase();
};

export const metadataForRelease = async (release) => {
  const version = versionFromRelease(release);
  if (!version || !release.published_at) {
    return null;
  }

  const assets = [];
  for (const rule of assetRules) {
    const releaseAsset = release.assets.find((candidate) => candidate.name === rule.name);
    if (!releaseAsset?.browser_download_url) {
      continue;
    }
    const metadataAsset = {
      platform: rule.platform,
      arch: rule.arch,
      kind: rule.kind,
      url: releaseAsset.browser_download_url,
      sha256: await parseSha256({ ...rule, releaseAssets: release.assets }),
      size: releaseAsset.size,
    };
    if (rule.experimental) {
      metadataAsset.experimental = true;
    }
    assets.push(metadataAsset);
  }

  if (assets.length === 0) {
    return null;
  }

  return {
    schemaVersion: 1,
    version,
    publishedAt: release.published_at,
    releaseNotes: parseReleaseNotes(release.body, version),
    assets,
  };
};

export const validateMetadata = (metadata) => {
  if (metadata.schemaVersion !== 1) throw new Error(`Invalid schema for ${metadata.version}`);
  if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(metadata.version)) {
    throw new Error(`Invalid semver for ${metadata.version}`);
  }
  if (Number.isNaN(Date.parse(metadata.publishedAt))) {
    throw new Error(`Invalid publishedAt for ${metadata.version}`);
  }
  if (!Array.isArray(metadata.assets) || metadata.assets.length === 0) {
    throw new Error(`No assets for ${metadata.version}`);
  }
  for (const asset of metadata.assets) {
    const url = new URL(asset.url);
    if (url.protocol !== 'https:' || url.hostname !== 'github.com') {
      throw new Error(`Invalid asset URL for ${metadata.version}: ${asset.url}`);
    }
    if (asset.sha256 && !/^[a-f0-9]{64}$/.test(asset.sha256)) {
      throw new Error(`Invalid checksum for ${metadata.version}: ${asset.url}`);
    }
    if (asset.experimental !== undefined && asset.experimental !== true) {
      throw new Error(`Invalid experimental flag for ${metadata.version}: ${asset.url}`);
    }
  }
};

export const main = async () => {
  const releases = await fetchJson(releaseApiUrl);
  if (!Array.isArray(releases)) {
    throw new Error('GitHub releases response is not an array');
  }

  const metadataEntries = (
    await Promise.all(
      releases
        .filter((release) => !release.draft)
        .map((release) => metadataForRelease(release)),
    )
  )
    .filter(Boolean)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

  if (metadataEntries.length === 0) {
    throw new Error(`No desktop releases with supported assets found in ${repo}`);
  }

  await fs.mkdir(outputDir, { recursive: true });
  for (const metadata of metadataEntries) {
    validateMetadata(metadata);
    await fs.writeFile(
      path.join(outputDir, `${metadata.version}.json`),
      `${JSON.stringify(metadata, null, 2)}\n`,
      'utf8',
    );
  }

  await fs.writeFile(
    path.join(outputDir, 'latest.json'),
    `${JSON.stringify(metadataEntries[0], null, 2)}\n`,
    'utf8',
  );
  console.log(`Generated ${metadataEntries.length} desktop version metadata file(s).`);
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
