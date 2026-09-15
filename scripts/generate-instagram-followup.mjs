import { spawn } from 'node:child_process';
import { link, mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const screenshotDir = resolve(rootDir, 'public/assets/screenshots');
const campaignDir = resolve(rootDir, 'marketing/instagram/followup-2026-09-24');
const outputDir = resolve(campaignDir, 'exports');
const manifestPath = resolve(campaignDir, 'manifest.json');
const logoPath = resolve(rootDir, 'public/icon-dark.svg');
const encoderPath = resolve(rootDir, 'scripts/encode-image-sequence.swift');
const carouselSize = { width: 1080, height: 1350 };
const reelSize = { width: 1080, height: 1920 };

const approvedSources = new Set([
  'campaign-2026-08/daily-compass-dashboard.png',
  'campaign-2026-08/daily-compass-week.png',
  'campaign-2026-08/daily-compass-focus.png',
  'campaign-2026-08/daily-compass-completed.png',
  'campaign-2026-08/agents-forger-marketer.png',
  'campaign-2026-08/automations-empty.png',
]);

const palettes = [
  { accent: '#F0A56B', glow: '#D97832', cool: '#121922' },
  { accent: '#83B5EA', glow: '#527FB5', cool: '#101925' },
  { accent: '#82CBA5', glow: '#3F8E68', cool: '#101C19' },
  { accent: '#C0A4E8', glow: '#7454A7', cool: '#181421' },
];

const escapeXml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const svg = (width, height, content, defs = '') =>
  Buffer.from(
    `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs>${content}</svg>`,
  );

const textLines = ({
  values,
  x,
  y,
  size,
  lineHeight,
  color = '#FFFFFF',
  weight = 700,
  letterSpacing = 0,
  anchor = 'start',
}) =>
  values
    .map(
      (value, index) =>
        `<text x="${x}" y="${y + index * lineHeight}" text-anchor="${anchor}" fill="${color}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" letter-spacing="${letterSpacing}">${escapeXml(value)}</text>`,
    )
    .join('');

const backgroundSvg = (width, height, palette, { spotlight = 'top-left' } = {}) => {
  const cx = spotlight === 'bottom-right' ? '88%' : '12%';
  const cy = spotlight === 'bottom-right' ? '86%' : '5%';
  return svg(
    width,
    height,
    `<rect width="${width}" height="${height}" fill="url(#base)"/>
     <rect width="${width}" height="${height}" fill="url(#glow)"/>
     <rect width="${width}" height="${height}" fill="url(#grid)" opacity="0.21"/>
     <circle cx="${width * 0.92}" cy="${height * 0.06}" r="${width * 0.34}" fill="none" stroke="${palette.accent}" stroke-opacity="0.14" stroke-width="2"/>
     <circle cx="${width * 0.92}" cy="${height * 0.06}" r="${width * 0.23}" fill="none" stroke="${palette.accent}" stroke-opacity="0.09" stroke-width="2"/>`,
    `<linearGradient id="base" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#080C11"/><stop offset="0.52" stop-color="${palette.cool}"/><stop offset="1" stop-color="#11171E"/></linearGradient>
     <radialGradient id="glow" cx="${cx}" cy="${cy}" r="92%"><stop offset="0" stop-color="${palette.glow}" stop-opacity="0.3"/><stop offset="0.55" stop-color="${palette.glow}" stop-opacity="0.045"/><stop offset="1" stop-color="${palette.glow}" stop-opacity="0"/></radialGradient>
     <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse"><path d="M44 0H0V44" fill="none" stroke="#FFFFFF" stroke-opacity="0.05" stroke-width="1"/></pattern>`,
  );
};

const roundedMask = (width, height, radius) =>
  svg(width, height, `<rect width="${width}" height="${height}" rx="${radius}" fill="#FFFFFF"/>`);

const screenshot = async (
  source,
  width,
  height,
  { fit = 'contain', position = 'centre', radius = 24, background = '#0B1016', blur = 0 } = {},
) => {
  if (!approvedSources.has(source)) throw new Error(`Unreviewed screenshot source: ${source}`);
  let pipeline = sharp(resolve(screenshotDir, source)).resize({
    width,
    height,
    fit,
    position,
    background,
  });
  if (blur > 0) pipeline = pipeline.blur(blur);
  const buffer = await pipeline.png().toBuffer();
  if (!radius) return buffer;
  return sharp(buffer)
    .composite([{ input: roundedMask(width, height, radius), blend: 'dest-in' }])
    .png()
    .toBuffer();
};

const brandHeader = (width, logo, { rightText, accent }) => [
  { input: logo, left: 48, top: 44 },
  {
    input: svg(
      width,
      128,
      `<text x="116" y="83" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" letter-spacing="6">FORGER</text>
       <text x="${width - 58}" y="82" text-anchor="end" fill="${accent}" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" letter-spacing="2">${escapeXml(rightText)}</text>`,
    ),
    left: 0,
    top: 0,
  },
];

const carouselScreenshotOptions = (layout) => {
  if (layout === 'agent-detail') return { fit: 'cover', position: 'left', background: '#10151C' };
  if (layout === 'data-detail') return { fit: 'cover', position: 'northwest', background: '#F8F3E6' };
  if (layout === 'wide-agent') return { fit: 'contain', position: 'centre', background: '#11171E' };
  if (layout === 'control-window') return { fit: 'contain', position: 'top', background: '#10151C' };
  if (layout === 'final-cta') return { fit: 'contain', position: 'centre', background: '#10151C' };
  return { fit: 'contain', position: 'centre', background: '#F8F3E6' };
};

const renderCarouselSlide = async (slide, slideIndex, logo) => {
  const palette = palettes[slideIndex % palettes.length];
  const screen = { x: 58, y: 462, width: 964, height: 540 };
  const layers = [
    ...brandHeader(carouselSize.width, logo, { rightText: slide.step, accent: palette.accent }),
    {
      input: svg(
        carouselSize.width,
        carouselSize.height,
        `<text x="58" y="174" fill="${palette.accent}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" letter-spacing="3">${escapeXml(slide.eyebrow)}</text>
         ${textLines({ values: slide.hookLines, x: 58, y: 254, size: 66, lineHeight: 72 })}
         <rect x="${screen.x - 4}" y="${screen.y - 4}" width="${screen.width + 8}" height="${screen.height + 8}" rx="32" fill="#06090D" stroke="${palette.accent}" stroke-opacity="0.54" stroke-width="3"/>
         <rect x="58" y="1054" width="8" height="104" rx="4" fill="${palette.accent}"/>
         <text x="92" y="1098" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700">${escapeXml(slide.body)}</text>
         <text x="58" y="1274" fill="#CBD5E1" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" letter-spacing="2.2">${escapeXml(slide.footer)}</text>
         <circle cx="1004" cy="1267" r="8" fill="${palette.accent}"/>
         <rect x="58" y="1225" width="964" height="2" fill="#FFFFFF" fill-opacity="0.12"/>`,
      ),
    },
    {
      input: await screenshot(slide.screenshot, screen.width, screen.height, {
        ...carouselScreenshotOptions(slide.layout),
        radius: 28,
      }),
      left: screen.x,
      top: screen.y,
    },
  ];

  if (slide.layout === 'agent-detail') {
    layers.push({
      input: svg(
        carouselSize.width,
        carouselSize.height,
        `<rect x="210" y="785" width="660" height="94" rx="22" fill="#070B10" fill-opacity="0.82" stroke="${palette.accent}" stroke-opacity="0.7" stroke-width="2"/>
         <text x="540" y="828" text-anchor="middle" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="700">SUPPORTED PROVIDER ACCESS</text>
         <text x="540" y="860" text-anchor="middle" fill="${palette.accent}" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="700">CODEX · CLAUDE CODE · ANTIGRAVITY</text>`,
      ),
    });
  }

  if (slide.layout === 'final-cta') {
    layers.push({
      input: svg(
        carouselSize.width,
        carouselSize.height,
        `<rect x="58" y="462" width="964" height="540" rx="28" fill="#070B10" fill-opacity="0.48"/>
         <rect x="296" y="839" width="488" height="76" rx="38" fill="${palette.glow}"/>
         <text x="540" y="887" text-anchor="middle" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="700" letter-spacing="2.1">DOWNLOAD FREE · FORGER.CLOUD</text>`,
      ),
    });
  }

  return sharp(backgroundSvg(carouselSize.width, carouselSize.height, palette))
    .composite(layers)
    .flatten({ background: '#080C11' })
    .png()
    .toBuffer();
};

const reelOverlay = (scene, palette) => {
  const cta = Boolean(scene.cta);
  return svg(
    reelSize.width,
    reelSize.height,
    `<rect width="1080" height="1920" fill="url(#shade)"/>
     <text x="58" y="190" fill="${palette.accent}" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="700" letter-spacing="3">${escapeXml(scene.eyebrow)}</text>
     ${textLines({ values: scene.headline, x: 58, y: 292, size: cta ? 76 : 72, lineHeight: 82 })}
     <rect x="44" y="535" width="992" height="684" rx="38" fill="none" stroke="#FFFFFF" stroke-opacity="0.17" stroke-width="3"/>
     ${cta ? '<rect x="44" y="535" width="992" height="684" rx="38" fill="#06090D" fill-opacity="0.58"/>' : ''}
     <rect x="58" y="1310" width="${cta ? 382 : 252}" height="62" rx="31" fill="${cta ? palette.glow : '#FFFFFF'}" fill-opacity="${cta ? 1 : 0.1}" stroke="${palette.accent}" stroke-opacity="0.35"/>
     <text x="${cta ? 249 : 184}" y="1350" text-anchor="middle" fill="${cta ? '#FFFFFF' : palette.accent}" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" letter-spacing="1.7">${escapeXml(scene.accent)}</text>
     <text x="58" y="1458" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="29" font-weight="700">${escapeXml(scene.support)}</text>
     <text x="58" y="1788" fill="#CBD5E1" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" letter-spacing="2">FORGER · FREE FOR PEOPLE</text>
     <text x="1022" y="1788" text-anchor="end" fill="${palette.accent}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">forger.cloud</text>
     <rect x="58" y="1734" width="964" height="2" fill="#FFFFFF" fill-opacity="0.12"/>`,
    `<linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070A0E" stop-opacity="0.65"/><stop offset="0.28" stop-color="#070A0E" stop-opacity="0.22"/><stop offset="0.72" stop-color="#070A0E" stop-opacity="0.18"/><stop offset="1" stop-color="#070A0E" stop-opacity="0.9"/></linearGradient>`,
  );
};

const renderReelScene = async (scene, sceneIndex, logo) => {
  const palette = palettes[sceneIndex % palettes.length];
  const blurred = await screenshot(scene.source, reelSize.width, reelSize.height, {
    fit: 'cover',
    position: 'centre',
    radius: 0,
    blur: 30,
  });
  const product = await screenshot(scene.source, 992, 684, {
    fit: 'contain',
    position: 'centre',
    radius: 34,
    background: scene.source.includes('daily-compass') ? '#F8F3E6' : '#10151C',
  });
  return sharp(blurred)
    .modulate({ brightness: 0.35, saturation: 0.62 })
    .composite([
      { input: backgroundSvg(reelSize.width, reelSize.height, palette), blend: 'screen' },
      { input: product, left: 44, top: 535 },
      { input: reelOverlay(scene, palette) },
      ...brandHeader(reelSize.width, logo, { rightText: `${sceneIndex + 1} / 5`, accent: palette.accent }),
    ])
    .flatten({ background: '#080C11' })
    .png()
    .toBuffer();
};

const buildStoryboard = async (sceneBuffers, reel, logo) => {
  const width = 2160;
  const height = 1350;
  const thumbWidth = 320;
  const thumbHeight = 569;
  const gap = 82;
  const leftStart = 76;
  const layers = [
    {
      input: svg(
        width,
        height,
        `<rect width="${width}" height="${height}" fill="#080C11"/>
         <text x="86" y="112" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="700">${escapeXml(reel.headline)} · storyboard</text>
         <text x="86" y="166" fill="#CBD5E1" font-family="Arial, Helvetica, sans-serif" font-size="27">${reel.durationSeconds} seconds · 1080 × 1920 · silent master</text>
         <rect x="86" y="1170" width="1988" height="2" fill="#FFFFFF" fill-opacity="0.12"/>
         <text x="86" y="1234" fill="#F0A56B" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">ADD META SOUND COLLECTION AUDIO ONLY WHEN PUBLISHING</text>`,
      ),
    },
    { input: logo, left: 2020, top: 64 },
  ];

  for (const [index, sceneBuffer] of sceneBuffers.entries()) {
    const left = leftStart + index * (thumbWidth + gap);
    layers.push({
      input: await sharp(sceneBuffer).resize(thumbWidth, thumbHeight).png().toBuffer(),
      left,
      top: 238,
    });
    layers.push({
      input: svg(
        width,
        height,
        `<rect x="${left}" y="844" width="${thumbWidth}" height="142" rx="18" fill="#151C24" stroke="#FFFFFF" stroke-opacity="0.13"/>
         <text x="${left + 20}" y="887" fill="#F0A56B" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700">SCENE ${index + 1}</text>
         <text x="${left + 20}" y="930" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700">${escapeXml(reel.scenes[index].accent)}</text>
         <text x="${left + 20}" y="963" fill="#CBD5E1" font-family="Arial, Helvetica, sans-serif" font-size="17">${((reel.scenes[index].endFrame - reel.scenes[index].startFrame + 1) / reel.framesPerSecond).toFixed(1)} s</text>`,
      ),
    });
  }

  return sharp({ create: { width, height, channels: 4, background: '#080C11' } })
    .composite(layers)
    .png()
    .toBuffer();
};

const encodeVideo = (framesDir, outputPath, reel) =>
  new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(
      '/usr/bin/swift',
      [
        encoderPath,
        framesDir,
        outputPath,
        String(reel.framesPerSecond),
        String(reel.dimensions.width),
        String(reel.dimensions.height),
      ],
      { stdio: 'inherit' },
    );
    child.once('error', rejectPromise);
    child.once('exit', (code) => {
      if (code === 0) resolvePromise();
      else rejectPromise(new Error(`Swift video encoder exited with code ${code}`));
    });
  });

const buildFrameSequence = async (framesDir, sceneBuffers, reel) => {
  const variantsDir = resolve(framesDir, 'variants');
  await mkdir(variantsDir, { recursive: true });
  const variantCount = 13;
  const variants = [];

  for (const [sceneIndex, sceneBuffer] of sceneBuffers.entries()) {
    const sceneVariants = [];
    for (let variantIndex = 0; variantIndex < variantCount; variantIndex += 1) {
      const progress = variantIndex / (variantCount - 1);
      const scale = 1 + progress * 0.012;
      const width = Math.ceil(reelSize.width * scale);
      const height = Math.ceil(reelSize.height * scale);
      const variantPath = resolve(variantsDir, `${sceneIndex}-${variantIndex}.jpg`);
      await sharp(sceneBuffer)
        .resize(width, height)
        .extract({
          left: Math.floor((width - reelSize.width) / 2),
          top: Math.floor((height - reelSize.height) / 2),
          width: reelSize.width,
          height: reelSize.height,
        })
        .composite([
          {
            input: svg(
              reelSize.width,
              reelSize.height,
              `<rect x="0" y="1908" width="1080" height="12" fill="#FFFFFF" fill-opacity="0.12"/>`,
            ),
          },
        ])
        .jpeg({ quality: 84, chromaSubsampling: '4:2:0' })
        .toFile(variantPath);
      sceneVariants.push(variantPath);
    }
    variants.push(sceneVariants);
  }

  const totalFrames = reel.durationSeconds * reel.framesPerSecond;
  for (let frameIndex = 0; frameIndex < totalFrames; frameIndex += 1) {
    const sceneIndex = reel.scenes.findIndex(
      ({ startFrame, endFrame }) => frameIndex >= startFrame && frameIndex <= endFrame,
    );
    if (sceneIndex < 0) throw new Error(`No scene covers frame ${frameIndex}`);
    const scene = reel.scenes[sceneIndex];
    const sceneProgress =
      (frameIndex - scene.startFrame) / Math.max(1, scene.endFrame - scene.startFrame);
    const variantIndex = Math.min(variantCount - 1, Math.floor(sceneProgress * variantCount));
    const framePath = resolve(framesDir, `${String(frameIndex).padStart(4, '0')}.jpg`);
    await link(variants[sceneIndex][variantIndex], framePath);
  }
};

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
for (const source of manifest.sourceScreenshots) {
  if (!approvedSources.has(source)) throw new Error(`Manifest includes an unreviewed screenshot: ${source}`);
}

await mkdir(outputDir, { recursive: true });
const logo = await sharp(logoPath).resize({ width: 48, height: 48, fit: 'contain' }).png().toBuffer();

for (const post of manifest.posts.filter(({ format }) => format === 'carousel')) {
  for (const [slideIndex, slide] of post.slides.entries()) {
    const artwork = await renderCarouselSlide(slide, slideIndex, logo);
    await sharp(artwork).png().toFile(resolve(outputDir, slide.filename));
  }
}

if (process.platform !== 'darwin') {
  throw new Error('Reel masters use macOS AVFoundation and must be regenerated on macOS.');
}

for (const reel of manifest.posts.filter(({ format }) => format === 'reel')) {
  const sceneBuffers = [];
  for (const [sceneIndex, scene] of reel.scenes.entries()) {
    sceneBuffers.push(await renderReelScene(scene, sceneIndex, logo));
  }

  const coverIndex = reel.coverSceneIndex ?? reel.scenes.length - 1;
  await sharp(sceneBuffers[coverIndex]).png().toFile(resolve(outputDir, reel.coverFilename));
  const storyboard = await buildStoryboard(sceneBuffers, reel, logo);
  await sharp(storyboard).png().toFile(resolve(outputDir, reel.storyboardFilename));

  const framesDir = await mkdtemp(join(tmpdir(), `forger-${reel.id}-`));
  try {
    await buildFrameSequence(framesDir, sceneBuffers, reel);
    await encodeVideo(framesDir, resolve(outputDir, reel.filename), reel);
  } finally {
    await rm(framesDir, { recursive: true, force: true });
  }
}

for (const variant of manifest.paidVariants) {
  const sourceReel = manifest.posts.find(({ id }) => id === variant.sourceReelId);
  if (!sourceReel || sourceReel.format !== 'reel') {
    throw new Error(`Paid variant source Reel was not found: ${variant.sourceReelId}`);
  }
  if (variant.spendUsd !== 0 || variant.lifecycle.approved || variant.lifecycle.scheduled || variant.lifecycle.published) {
    throw new Error(`Paid variant must remain prepared and inactive: ${variant.id}`);
  }

  const finalTiming = sourceReel.scenes.at(-1);
  const paidScenes = [
    ...sourceReel.scenes.slice(0, -1),
    {
      ...variant.endCard,
      startFrame: finalTiming.startFrame,
      endFrame: finalTiming.endFrame,
    },
  ];
  const paidReel = {
    ...variant,
    scenes: paidScenes,
  };
  const sceneBuffers = [];
  for (const [sceneIndex, scene] of paidScenes.entries()) {
    sceneBuffers.push(await renderReelScene(scene, sceneIndex, logo));
  }
  await sharp(sceneBuffers.at(-1)).png().toFile(resolve(outputDir, variant.coverFilename));

  const framesDir = await mkdtemp(join(tmpdir(), `forger-${variant.id}-`));
  try {
    await buildFrameSequence(framesDir, sceneBuffers, paidReel);
    await encodeVideo(framesDir, resolve(outputDir, variant.filename), paidReel);
  } finally {
    await rm(framesDir, { recursive: true, force: true });
  }
}

console.log(
  `Generated ${manifest.posts.length} organic posts and ${manifest.paidVariants.length} inactive paid variants in ${outputDir}.`,
);
