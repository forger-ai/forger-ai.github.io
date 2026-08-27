import { mkdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const screenshotDir = resolve(rootDir, 'public/assets/screenshots');
const outputDir = resolve(rootDir, 'marketing/instagram/exports');
const calendarPath = resolve(
  rootDir,
  'marketing/instagram/calendar-2026-08-27--2026-09-20.json',
);
const logoPath = resolve(rootDir, 'public/icon-dark.svg');
const width = 1080;
const height = 1350;

const currentScreenshotNames = new Set([
  'campaign-2026-08/chat-blank.png',
  'campaign-2026-08/apps-lego-public.png',
  'campaign-2026-08/agents-forger-marketer.png',
  'campaign-2026-08/automations-empty.png',
  'campaign-2026-08/files-header.png',
  'campaign-2026-08/backups-lego-public.png',
]);

const escapeXml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const textLines = ({ values, x, y, size, lineHeight, color = '#FFFFFF', weight = 700 }) =>
  values
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * lineHeight}" fill="${color}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}">${escapeXml(line)}</text>`,
    )
    .join('');

const canvasSvg = (content, defs = '') => Buffer.from(`
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>${defs}</defs>
    ${content}
  </svg>
`);

const baseSvg = canvasSvg(
  `<rect width="${width}" height="${height}" fill="url(#base)"/>
   <rect width="${width}" height="${height}" fill="url(#warmGlow)"/>
   <circle cx="980" cy="110" r="310" fill="none" stroke="#D97832" stroke-opacity="0.16" stroke-width="2"/>
   <circle cx="980" cy="110" r="410" fill="none" stroke="#FFFFFF" stroke-opacity="0.05" stroke-width="2"/>`,
  `<linearGradient id="base" x1="0" y1="0" x2="1" y2="1">
     <stop offset="0" stop-color="#0D1117"/>
     <stop offset="1" stop-color="#171D24"/>
   </linearGradient>
   <radialGradient id="warmGlow" cx="18%" cy="12%" r="82%">
     <stop offset="0" stop-color="#D97832" stop-opacity="0.24"/>
     <stop offset="1" stop-color="#D97832" stop-opacity="0"/>
   </radialGradient>`,
);

const eyebrowMarkup = (label, x, y, maxWidth = 520) => {
  const pillWidth = Math.min(maxWidth, Math.max(230, 76 + label.length * 14));
  return `<rect x="${x}" y="${y}" width="${pillWidth}" height="46" rx="23" fill="#D97832" fill-opacity="0.16" stroke="#D97832" stroke-opacity="0.68"/>
    <text x="${x + 24}" y="${y + 30}" fill="#F1B27A" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="700" letter-spacing="1.8">${escapeXml(label)}</text>`;
};

const brandBarSvg = (footer) => canvasSvg(`
  <rect x="0" y="1244" width="${width}" height="106" fill="#090D12" fill-opacity="0.95"/>
  <text x="142" y="1309" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" letter-spacing="5">FORGER</text>
  <text x="1012" y="1309" text-anchor="end" fill="#F1B27A" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="700" letter-spacing="1.2">${escapeXml(footer)}</text>
`);

const frameSvg = ({ x, y, frameWidth, frameHeight, radius = 28, accent = false }) =>
  canvasSvg(`<rect x="${x - 3}" y="${y - 3}" width="${frameWidth + 6}" height="${frameHeight + 6}" rx="${radius + 3}" fill="#090D12" stroke="${accent ? '#D97832' : '#FFFFFF'}" stroke-opacity="${accent ? '0.74' : '0.18'}" stroke-width="3"/>`);

const fullBleedOverlaySvg = canvasSvg(
  `<rect width="${width}" height="${height}" fill="url(#shade)"/>
   <rect x="0" y="0" width="${width}" height="12" fill="#D97832"/>`,
  `<linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
     <stop offset="0" stop-color="#070A0E" stop-opacity="0.08"/>
     <stop offset="0.46" stop-color="#070A0E" stop-opacity="0.32"/>
     <stop offset="0.72" stop-color="#070A0E" stop-opacity="0.88"/>
     <stop offset="1" stop-color="#070A0E" stop-opacity="0.98"/>
   </linearGradient>`,
);

const roundedScreenshot = async (
  name,
  frameWidth,
  frameHeight,
  { fit = 'cover', position = 'centre', radius = 28 } = {},
) => {
  if (!currentScreenshotNames.has(name)) {
    throw new Error(`Screenshot is not approved as current: ${name}`);
  }

  const screenshot = await sharp(resolve(screenshotDir, name))
    .resize({
      width: frameWidth,
      height: frameHeight,
      fit,
      position,
      background: '#0D1117',
    })
    .png()
    .toBuffer();
  const mask = Buffer.from(`
    <svg width="${frameWidth}" height="${frameHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${frameWidth}" height="${frameHeight}" rx="${radius}" fill="#FFFFFF"/>
    </svg>
  `);

  return sharp(screenshot)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
};

const headlineSvg = ({
  post,
  x,
  titleY,
  titleSize = 72,
  titleLineHeight = 80,
  bodyY,
  bodySize = 29,
  bodyLineHeight = 39,
}) =>
  canvasSvg(`
    ${eyebrowMarkup(post.visualCopy.eyebrow, x, titleY - 118)}
    ${textLines({ values: post.visualCopy.title, x, y: titleY, size: titleSize, lineHeight: titleLineHeight })}
    ${textLines({ values: post.visualCopy.body, x, y: bodyY, size: bodySize, lineHeight: bodyLineHeight, color: '#CBD5E1', weight: 400 })}
  `);

const layouts = {
  'full-bleed-bottom': async (post) => {
    const screenshot = await sharp(resolve(screenshotDir, post.screenshotSources[0]))
      .resize({ width, fit: 'contain' })
      .png()
      .toBuffer();
    return {
      base: baseSvg,
      layers: [
        { input: screenshot, left: 0, top: 0 },
        { input: fullBleedOverlaySvg },
        {
          input: headlineSvg({
            post,
            x: 66,
            titleY: 785,
            titleSize: 82,
            titleLineHeight: 90,
            bodyY: 1000,
            bodySize: 31,
            bodyLineHeight: 42,
          }),
        },
      ],
    };
  },

  'asymmetric-split': async (post) => {
    const screenshot = { x: 518, y: 270, width: 502, height: 820 };
    return {
      base: baseSvg,
      layers: [
        {
          input: headlineSvg({
            post,
            x: 62,
            titleY: 224,
            titleSize: 58,
            titleLineHeight: 66,
            bodyY: 846,
            bodySize: 27,
            bodyLineHeight: 38,
          }),
        },
        { input: frameSvg({ x: screenshot.x, y: screenshot.y, frameWidth: screenshot.width, frameHeight: screenshot.height, radius: 34, accent: true }) },
        { input: await roundedScreenshot(post.screenshotSources[0], screenshot.width, screenshot.height, { fit: 'contain', radius: 34 }), left: screenshot.x, top: screenshot.y },
        { input: canvasSvg(`<path d="M62 560h300" stroke="#D97832" stroke-width="8" stroke-linecap="round"/><text x="62" y="622" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="29" font-weight="700">OPEN · USE · RETURN</text>`) },
      ],
    };
  },

  'wide-agent-card': async (post) => {
    const screenshot = { x: 54, y: 480, width: 972, height: 260 };
    return {
      base: baseSvg,
      layers: [
        {
          input: headlineSvg({
            post,
            x: 62,
            titleY: 184,
            titleSize: 70,
            titleLineHeight: 78,
            bodyY: 842,
            bodySize: 30,
            bodyLineHeight: 42,
          }),
        },
        { input: frameSvg({ x: screenshot.x, y: screenshot.y, frameWidth: screenshot.width, frameHeight: screenshot.height, radius: 28, accent: true }) },
        { input: await roundedScreenshot(post.screenshotSources[0], screenshot.width, screenshot.height, { fit: 'contain', radius: 28 }), left: screenshot.x, top: screenshot.y },
        { input: canvasSvg(`<circle cx="164" cy="1072" r="66" fill="#D97832"/><text x="164" y="1085" text-anchor="middle" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="700">01</text><path d="M244 1072h660" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="2"/><text x="244" y="1064" fill="#F1B27A" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" letter-spacing="2">ONE CLEAR ROLE</text><text x="244" y="1106" fill="#CBD5E1" font-family="Arial, Helvetica, sans-serif" font-size="27">Selected context for focused work.</text>`) },
      ],
    };
  },

  'schedule-board': async (post) => {
    const screenshot = { x: 64, y: 422, width: 952, height: 574 };
    return {
      base: baseSvg,
      layers: [
        {
          input: headlineSvg({
            post,
            x: 62,
            titleY: 174,
            titleSize: 66,
            titleLineHeight: 74,
            bodyY: 1065,
            bodySize: 29,
            bodyLineHeight: 40,
          }),
        },
        { input: frameSvg({ x: screenshot.x, y: screenshot.y, frameWidth: screenshot.width, frameHeight: screenshot.height, radius: 30 }) },
        { input: await roundedScreenshot(post.screenshotSources[0], screenshot.width, screenshot.height, { radius: 30 }), left: screenshot.x, top: screenshot.y },
        { input: canvasSvg(`<rect x="720" y="348" width="270" height="96" rx="48" fill="#D97832"/><circle cx="778" cy="396" r="23" fill="none" stroke="#FFFFFF" stroke-width="5"/><path d="M778 381v17l13 10" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/><text x="824" y="405" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">SCHEDULE</text>`) },
      ],
    };
  },

  'header-crop': async (post) => {
    const screenshot = { x: 44, y: 500, width: 992, height: 210 };
    return {
      base: baseSvg,
      layers: [
        {
          input: headlineSvg({
            post,
            x: 62,
            titleY: 194,
            titleSize: 76,
            titleLineHeight: 84,
            bodyY: 850,
            bodySize: 30,
            bodyLineHeight: 42,
          }),
        },
        { input: canvasSvg(`<rect x="18" y="450" width="1044" height="310" rx="52" fill="#FFFFFF" fill-opacity="0.05"/><circle cx="928" cy="786" r="80" fill="#D97832"/><path d="M898 786l20 20 40-46" fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`) },
        { input: frameSvg({ x: screenshot.x, y: screenshot.y, frameWidth: screenshot.width, frameHeight: screenshot.height, radius: 26, accent: true }) },
        { input: await roundedScreenshot(post.screenshotSources[0], screenshot.width, screenshot.height, { fit: 'contain', radius: 26 }), left: screenshot.x, top: screenshot.y },
      ],
    };
  },

  'choice-split': async (post) => {
    const screenshot = { x: 66, y: 470, width: 948, height: 572 };
    return {
      base: baseSvg,
      layers: [
        {
          input: headlineSvg({
            post,
            x: 62,
            titleY: 176,
            titleSize: 70,
            titleLineHeight: 78,
            bodyY: 1090,
            bodySize: 29,
            bodyLineHeight: 40,
          }),
        },
        { input: frameSvg({ x: screenshot.x, y: screenshot.y, frameWidth: screenshot.width, frameHeight: screenshot.height, radius: 30 }) },
        { input: await roundedScreenshot(post.screenshotSources[0], screenshot.width, screenshot.height, { radius: 30 }), left: screenshot.x, top: screenshot.y },
        { input: canvasSvg(`<rect x="70" y="390" width="246" height="74" rx="37" fill="#D97832"/><text x="193" y="437" text-anchor="middle" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">LOCAL</text><rect x="332" y="390" width="246" height="74" rx="37" fill="#FFFFFF" fill-opacity="0.09" stroke="#FFFFFF" stroke-opacity="0.28"/><text x="455" y="437" text-anchor="middle" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">CLOUD</text><text x="924" y="430" text-anchor="end" fill="#F1B27A" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">YOU CHOOSE</text>`) },
      ],
    };
  },

  'workspace-mosaic': async (post) => {
    const frames = [
      { x: 54, y: 392, width: 460, height: 390, source: 0, fit: 'contain' },
      { x: 540, y: 392, width: 486, height: 220, source: 1, fit: 'contain' },
      { x: 540, y: 636, width: 486, height: 300, source: 2, fit: 'cover' },
      { x: 54, y: 806, width: 460, height: 300, source: 3, fit: 'cover' },
    ];
    const layers = [
      {
        input: headlineSvg({
          post,
          x: 62,
          titleY: 168,
          titleSize: 64,
          titleLineHeight: 72,
          bodyY: 1148,
          bodySize: 27,
          bodyLineHeight: 38,
        }),
      },
    ];
    for (const [index, frame] of frames.entries()) {
      layers.push({ input: frameSvg({ x: frame.x, y: frame.y, frameWidth: frame.width, frameHeight: frame.height, radius: 24, accent: index === 0 }) });
      layers.push({ input: await roundedScreenshot(post.screenshotSources[frame.source], frame.width, frame.height, { fit: frame.fit, radius: 24 }), left: frame.x, top: frame.y });
    }
    return { base: baseSvg, layers };
  },

  'full-bleed-question': async (post) => {
    const screenshot = await sharp(resolve(screenshotDir, post.screenshotSources[0]))
      .resize({ width, height, fit: 'cover', position: 'right' })
      .blur(1.2)
      .png()
      .toBuffer();
    const questionOverlay = canvasSvg(
      `<rect width="${width}" height="${height}" fill="#090D12" fill-opacity="0.74"/>
       <rect x="54" y="70" width="972" height="1092" rx="46" fill="#0D1117" fill-opacity="0.58" stroke="#D97832" stroke-opacity="0.62" stroke-width="3"/>
       ${eyebrowMarkup(post.visualCopy.eyebrow, 86, 126)}
       ${textLines({ values: post.visualCopy.title, x: 86, y: 408, size: 78, lineHeight: 88 })}
       ${textLines({ values: post.visualCopy.body, x: 86, y: 820, size: 32, lineHeight: 44, color: '#CBD5E1', weight: 400 })}
       <circle cx="900" cy="1000" r="92" fill="#D97832"/>
       <path d="M865 1000h70M900 965v70" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round"/>`,
    );
    return { base: screenshot, layers: [{ input: questionOverlay }] };
  },
};

const calendar = JSON.parse(await readFile(calendarPath, 'utf8'));
const logo = await sharp(logoPath)
  .resize({ width: 64, height: 64, fit: 'contain' })
  .png()
  .toBuffer();
const readyPosts = calendar.posts.filter(({ assetStatus }) => assetStatus === 'ready');

await mkdir(outputDir, { recursive: true });

for (const post of readyPosts) {
  if (!post.screenshotSources.length) {
    throw new Error(`${post.filename} is marked ready without screenshot sources`);
  }
  for (const source of post.screenshotSources) {
    if (!currentScreenshotNames.has(source)) {
      throw new Error(`${post.filename} uses a screenshot that has not been reviewed as current: ${source}`);
    }
  }

  const renderLayout = layouts[post.layout];
  if (!renderLayout) {
    throw new Error(`Unknown Instagram layout: ${post.layout}`);
  }

  const { base, layers } = await renderLayout(post);
  const artwork = await sharp(base)
    .resize({ width, height, fit: 'cover' })
    .composite(layers)
    .png()
    .toBuffer();
  await sharp(artwork)
    .composite([
      { input: brandBarSvg(post.visualCopy.footer) },
      { input: logo, left: 64, top: 1264 },
    ])
    .png()
    .toFile(resolve(outputDir, post.filename));
}

console.log(`Generated ${readyPosts.length} Instagram feed assets in ${outputDir}.`);
