import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const screenshotDir = resolve(rootDir, 'public/assets/screenshots');
const outputDir = resolve(rootDir, 'marketing/instagram/pilot/exports');
const manifestPath = resolve(
  rootDir,
  'marketing/instagram/pilot/professional-pilot-2026-08-27.json',
);
const logoPath = resolve(rootDir, 'public/icon-dark.svg');
const encoderPath = resolve(rootDir, 'scripts/encode-image-sequence.swift');
const carouselSize = { width: 1080, height: 1350 };
const reelSize = { width: 1080, height: 1920 };

const approvedSources = new Set([
  'campaign-2026-08/chat-blank.png',
  'campaign-2026-08/daily-compass-dashboard.png',
  'campaign-2026-08/daily-compass-week.png',
  'campaign-2026-08/daily-compass-focus.png',
  'campaign-2026-08/daily-compass-completed.png',
]);

const escapeXml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

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

const svg = (width, height, content, defs = '') =>
  Buffer.from(`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs>${content}</svg>`);

const backgroundSvg = (width, height, { variant = 'warm' } = {}) => {
  const accent = variant === 'cool' ? '#759DD0' : '#D97832';
  return svg(
    width,
    height,
    `<rect width="${width}" height="${height}" fill="url(#base)"/>
     <rect width="${width}" height="${height}" fill="url(#glow)"/>
     <rect width="${width}" height="${height}" fill="url(#grid)" opacity="0.24"/>
     <circle cx="${width * 0.92}" cy="${height * 0.08}" r="${width * 0.34}" fill="none" stroke="${accent}" stroke-opacity="0.13" stroke-width="2"/>`,
    `<linearGradient id="base" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#090D12"/><stop offset="0.55" stop-color="#111820"/><stop offset="1" stop-color="#171D24"/></linearGradient>
     <radialGradient id="glow" cx="15%" cy="5%" r="90%"><stop offset="0" stop-color="${accent}" stop-opacity="0.27"/><stop offset="0.58" stop-color="${accent}" stop-opacity="0.04"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
     <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M42 0H0V42" fill="none" stroke="#FFFFFF" stroke-opacity="0.055" stroke-width="1"/></pattern>`,
  );
};

const maskRounded = (width, height, radius) =>
  svg(width, height, `<rect width="${width}" height="${height}" rx="${radius}" fill="#FFFFFF"/>`);

const approvedScreenshot = async (
  source,
  width,
  height,
  { fit = 'cover', position = 'centre', radius = 30, blur = 0, background = '#0D1117' } = {},
) => {
  if (!approvedSources.has(source)) {
    throw new Error(`Screenshot is not approved for the professional pilot: ${source}`);
  }
  let pipeline = sharp(resolve(screenshotDir, source)).resize({
    width,
    height,
    fit,
    position,
    background,
  });
  if (blur > 0) pipeline = pipeline.blur(blur);
  const image = await pipeline.png().toBuffer();
  if (!radius) return image;
  return sharp(image)
    .composite([{ input: maskRounded(width, height, radius), blend: 'dest-in' }])
    .png()
    .toBuffer();
};

const frameSvg = ({ x, y, width, height, radius = 32, accent = '#D97832' }) =>
  svg(
    carouselSize.width,
    carouselSize.height,
    `<rect x="${x - 4}" y="${y - 4}" width="${width + 8}" height="${height + 8}" rx="${radius + 4}" fill="#070A0E" stroke="${accent}" stroke-opacity="0.62" stroke-width="3"/>
     <rect x="${x + 18}" y="${y + 18}" width="11" height="11" rx="5.5" fill="#FF6B61"/>
     <rect x="${x + 36}" y="${y + 18}" width="11" height="11" rx="5.5" fill="#F1B27A"/>
     <rect x="${x + 54}" y="${y + 18}" width="11" height="11" rx="5.5" fill="#68C891"/>`,
  );

const carouselChrome = (slide) =>
  svg(
    carouselSize.width,
    carouselSize.height,
    `<text x="64" y="74" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" letter-spacing="5">FORGER</text>
     <text x="1016" y="74" text-anchor="end" fill="#F1B27A" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" letter-spacing="2">${escapeXml(slide.step)}</text>
     <rect x="64" y="1280" width="952" height="2" fill="#FFFFFF" fill-opacity="0.14"/>
     <text x="64" y="1320" fill="#CBD5E1" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" letter-spacing="2">${escapeXml(slide.footer)}</text>
     <circle cx="1000" cy="1312" r="8" fill="#D97832"/>`,
  );

const carouselHeadline = (slide, { y = 150, size = 66, lineHeight = 72 } = {}) =>
  svg(
    carouselSize.width,
    carouselSize.height,
    `<text x="64" y="${y}" fill="#F1B27A" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" letter-spacing="2.3">${escapeXml(slide.eyebrow)}</text>
     ${textLines({ values: slide.hookLines, x: 64, y: y + 74, size, lineHeight })}
     <text x="64" y="${y + 74 + slide.hookLines.length * lineHeight + 20}" fill="#CBD5E1" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="400">${escapeXml(slide.body)}</text>`,
  );

const renderCarouselSlide = async (slide, logo) => {
  const layers = [];
  let base = backgroundSvg(carouselSize.width, carouselSize.height);

  if (slide.layout === 'immersive-prompt') {
    const screen = { x: 50, y: 410, width: 980, height: 808 };
    layers.push({ input: carouselHeadline(slide, { y: 132, size: 66, lineHeight: 72 }) });
    layers.push({ input: frameSvg(screen) });
    layers.push({
      input: await approvedScreenshot(slide.screenshot, screen.width, screen.height, {
        position: 'centre',
        radius: 30,
      }),
      left: screen.x,
      top: screen.y,
    });
    layers.push({
      input: svg(
        carouselSize.width,
        carouselSize.height,
        `<rect x="50" y="410" width="980" height="808" rx="30" fill="url(#fade)"/>
         <rect x="86" y="1100" width="256" height="52" rx="26" fill="#D97832"/>
         <text x="214" y="1134" text-anchor="middle" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" letter-spacing="1.8">DESCRIBE THE RESULT</text>`,
        `<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0.64" stop-color="#070A0E" stop-opacity="0"/><stop offset="1" stop-color="#070A0E" stop-opacity="0.72"/></linearGradient>`,
      ),
    });
  } else if (slide.layout === 'focused-app-card') {
    base = backgroundSvg(carouselSize.width, carouselSize.height, { variant: 'cool' });
    const screen = { x: 80, y: 434, width: 920, height: 518 };
    layers.push({ input: carouselHeadline(slide, { y: 134, size: 64, lineHeight: 70 }) });
    layers.push({
      input: svg(
        carouselSize.width,
        carouselSize.height,
        `<text x="980" y="1000" text-anchor="end" fill="#FFFFFF" fill-opacity="0.035" font-family="Arial, Helvetica, sans-serif" font-size="540" font-weight="700">2</text>
         <circle cx="540" cy="700" r="390" fill="none" stroke="#759DD0" stroke-opacity="0.25" stroke-width="2"/>
         <circle cx="540" cy="700" r="330" fill="#759DD0" fill-opacity="0.05"/>`,
      ),
    });
    layers.push({ input: frameSvg({ ...screen, accent: '#759DD0' }) });
    layers.push({
      input: await approvedScreenshot(slide.screenshot, screen.width, screen.height, {
        fit: 'contain',
        radius: 30,
      }),
      left: screen.x,
      top: screen.y,
    });
    layers.push({
      input: svg(
        carouselSize.width,
        carouselSize.height,
        `<rect x="320" y="1046" width="440" height="58" rx="29" fill="#759DD0"/>
         <text x="540" y="1083" text-anchor="middle" fill="#071018" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" letter-spacing="1.8">REAL APP · REAL WORKFLOW</text>`,
      ),
    });
  } else if (slide.layout === 'real-result') {
    const screen = { x: 50, y: 416, width: 980, height: 620 };
    layers.push({ input: carouselHeadline(slide, { y: 132, size: 64, lineHeight: 70 }) });
    layers.push({ input: frameSvg(screen) });
    layers.push({
      input: await approvedScreenshot(slide.screenshot, screen.width, screen.height, {
        fit: 'contain',
        position: 'right top',
        radius: 30,
        background: '#F7F7F4',
      }),
      left: screen.x,
      top: screen.y,
    });
    layers.push({
      input: svg(
        carouselSize.width,
        carouselSize.height,
        `<rect x="642" y="956" width="332" height="58" rx="29" fill="#D97832"/>
         <text x="808" y="993" text-anchor="middle" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" letter-spacing="1.6">REAL APP RESULT</text>
         <rect x="64" y="1086" width="8" height="92" rx="4" fill="#D97832"/>
         <text x="94" y="1126" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700">Free for people.</text>
         <text x="94" y="1168" fill="#CBD5E1" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="400">No added Forger subscription.</text>`,
      ),
    });
  } else {
    throw new Error(`Unknown carousel layout: ${slide.layout}`);
  }

  layers.push({ input: carouselChrome(slide) });
  layers.push({ input: logo, left: 20, top: 42 });
  return sharp(base).composite(layers).png().toBuffer();
};

const reelSceneOverlay = (scene, index) => {
  const isCta = Boolean(scene.cta);
  const focusMarkup =
    index === 2
      ? `<rect x="812" y="830" width="194" height="76" rx="18" fill="none" stroke="#F1B27A" stroke-width="5"/>
         <circle cx="985" cy="890" r="20" fill="#D97832" fill-opacity="0.95"/><circle cx="985" cy="890" r="38" fill="none" stroke="#D97832" stroke-opacity="0.42" stroke-width="5"/>`
      : index === 3
        ? `<rect x="260" y="804" width="560" height="130" rx="22" fill="none" stroke="#68C891" stroke-width="5"/>`
        : '';
  return svg(
    reelSize.width,
    reelSize.height,
    `<rect width="1080" height="1920" fill="url(#shade)"/>
     <rect x="40" y="340" width="1000" height="1120" rx="40" fill="none" stroke="#FFFFFF" stroke-opacity="0.17" stroke-width="3"/>
     ${isCta ? '<rect x="40" y="340" width="1000" height="1120" rx="40" fill="#070A0E" fill-opacity="0.64"/>' : ''}
     <text x="64" y="92" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" letter-spacing="5">FORGER</text>
     <text x="1016" y="92" text-anchor="end" fill="#F1B27A" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" letter-spacing="2">${escapeXml(scene.eyebrow)}</text>
     ${textLines({ values: scene.headline, x: 64, y: 178, size: isCta ? 70 : 62, lineHeight: isCta ? 78 : 68 })}
     ${focusMarkup}
     <rect x="64" y="1516" width="${isCta ? 378 : 210}" height="58" rx="29" fill="${isCta ? '#D97832' : '#FFFFFF'}" fill-opacity="${isCta ? '1' : '0.1'}" stroke="${isCta ? '#D97832' : '#FFFFFF'}" stroke-opacity="0.28"/>
     <text x="${isCta ? 253 : 169}" y="1554" text-anchor="middle" fill="${isCta ? '#FFFFFF' : '#F1B27A'}" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" letter-spacing="1.8">${escapeXml(scene.accent)}</text>
     ${textLines({ values: [scene.support], x: 64, y: 1644, size: isCta ? 25 : 27, lineHeight: 36, color: '#CBD5E1', weight: 400 })}
     <text x="64" y="1816" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" letter-spacing="4">FORGER</text>
     <text x="1016" y="1816" text-anchor="end" fill="#F1B27A" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">forger.cloud</text>`,
    `<linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070A0E" stop-opacity="0.78"/><stop offset="0.22" stop-color="#070A0E" stop-opacity="0.42"/><stop offset="0.78" stop-color="#070A0E" stop-opacity="0.18"/><stop offset="1" stop-color="#070A0E" stop-opacity="0.9"/></linearGradient>`,
  );
};

const renderReelScene = async (scene, index, logo) => {
  const background = await approvedScreenshot(scene.source, reelSize.width, reelSize.height, {
    fit: 'cover',
    position: 'right top',
    radius: 0,
    blur: 26,
  });
  const productScreenshot = await approvedScreenshot(scene.source, 1000, 563, {
    fit: 'contain',
    position: 'centre',
    radius: 24,
    background: '#F8F3E6',
  });
  const productBackground = await approvedScreenshot(scene.source, 1000, 1120, {
    fit: 'cover',
    position: 'centre',
    radius: 40,
    blur: 28,
  });
  const product = await sharp(productBackground)
    .modulate({ brightness: 0.42, saturation: 0.58 })
    .composite([{ input: productScreenshot, left: 0, top: 279 }])
    .png()
    .toBuffer();
  return sharp(background)
    .modulate({ brightness: 0.38, saturation: 0.62 })
    .composite([
      { input: backgroundSvg(reelSize.width, reelSize.height), blend: 'screen' },
      { input: product, left: 40, top: 340 },
      { input: reelSceneOverlay(scene, index) },
      { input: logo, left: 20, top: 60 },
    ])
    .flatten({ background: '#090D12' })
    .png()
    .toBuffer();
};

const buildStoryboard = async (sceneBuffers, reel, logo) => {
  const width = 2160;
  const height = 1350;
  const thumbWidth = 360;
  const thumbHeight = 640;
  const layers = [
    {
      input: svg(
        width,
        height,
        `<rect width="${width}" height="${height}" fill="#090D12"/>
         <text x="92" y="110" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="700">Reel storyboard · real interaction</text>
         <text x="92" y="162" fill="#CBD5E1" font-family="Arial, Helvetica, sans-serif" font-size="27">10 seconds · 1080 × 1920 · silent master</text>
         <text x="92" y="1242" fill="#F1B27A" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">ADD META SOUND COLLECTION AUDIO ONLY WHEN PUBLISHING</text>`,
      ),
    },
    { input: logo, left: 2030, top: 72 },
  ];

  for (const [index, buffer] of sceneBuffers.entries()) {
    const thumb = await sharp(buffer)
      .resize({ width: thumbWidth, height: thumbHeight, fit: 'cover' })
      .png()
      .toBuffer();
    const left = 80 + index * 408;
    layers.push({ input: thumb, left, top: 240 });
    layers.push({
      input: svg(
        width,
        height,
        `<rect x="${left}" y="910" width="360" height="106" rx="18" fill="#171D24" stroke="#FFFFFF" stroke-opacity="0.15"/>
         <text x="${left + 20}" y="952" fill="#F1B27A" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700">SCENE ${index + 1}</text>
         <text x="${left + 20}" y="990" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700">${escapeXml(reel.scenes[index].accent)}</text>`,
      ),
    });
  }
  return sharp({ create: { width, height, channels: 4, background: '#090D12' } })
    .composite(layers)
    .png()
    .toBuffer();
};

const encodeVideo = (framesDir, outputPath, reel) =>
  new Promise((resolvePromise, rejectPromise) => {
    const process = spawn(
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
    process.once('error', rejectPromise);
    process.once('exit', (code) => {
      if (code === 0) resolvePromise();
      else rejectPromise(new Error(`Swift video encoder exited with code ${code}`));
    });
  });

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
for (const source of manifest.sourceScreenshots) {
  if (!approvedSources.has(source)) {
    throw new Error(`Manifest includes an unreviewed product screenshot: ${source}`);
  }
}

await mkdir(outputDir, { recursive: true });
const logo = await sharp(logoPath).resize({ width: 34, height: 34, fit: 'contain' }).png().toBuffer();

for (const slide of manifest.carousel.slides) {
  const artwork = await renderCarouselSlide(slide, logo);
  await sharp(artwork).png().toFile(resolve(outputDir, slide.filename));
}

const sceneBuffers = [];
for (const [index, scene] of manifest.reel.scenes.entries()) {
  sceneBuffers.push(await renderReelScene(scene, index, logo));
}
await sharp(sceneBuffers[0]).png().toFile(resolve(outputDir, manifest.reel.coverFilename));
const storyboard = await buildStoryboard(sceneBuffers, manifest.reel, logo);
await sharp(storyboard).png().toFile(resolve(outputDir, manifest.reel.storyboardFilename));

if (process.platform !== 'darwin') {
  throw new Error('The checked-in Reel master is encoded with macOS AVFoundation; regenerate it on macOS.');
}

const framesDir = await mkdtemp(join(tmpdir(), 'forger-instagram-reel-'));
try {
  const totalFrames = manifest.reel.durationSeconds * manifest.reel.framesPerSecond;
  const renderFrame = async (frameIndex) => {
    const sceneIndex = manifest.reel.scenes.findIndex(
      ({ startFrame, endFrame }) => frameIndex >= startFrame && frameIndex <= endFrame,
    );
    if (sceneIndex < 0) throw new Error(`No Reel scene covers frame ${frameIndex}`);
    const scene = manifest.reel.scenes[sceneIndex];
    const sceneFrameCount = scene.endFrame - scene.startFrame + 1;
    const progress = (frameIndex - scene.startFrame) / Math.max(1, sceneFrameCount - 1);
    const scale = 1 + progress * 0.012;
    const scaledWidth = Math.ceil(reelSize.width * scale);
    const scaledHeight = Math.ceil(reelSize.height * scale);
    const left = Math.floor((scaledWidth - reelSize.width) / 2);
    const top = Math.floor((scaledHeight - reelSize.height) / 2);
    const progressWidth = Math.max(8, Math.round(((frameIndex + 1) / totalFrames) * reelSize.width));
    const frame = await sharp(sceneBuffers[sceneIndex])
      .resize({ width: scaledWidth, height: scaledHeight, fit: 'fill' })
      .extract({ left, top, width: reelSize.width, height: reelSize.height })
      .composite([
        {
          input: svg(
            reelSize.width,
            reelSize.height,
            `<rect x="0" y="1908" width="1080" height="12" fill="#FFFFFF" fill-opacity="0.12"/>
             <rect x="0" y="1908" width="${progressWidth}" height="12" fill="#D97832"/>`,
          ),
        },
      ])
      .jpeg({ quality: 86, chromaSubsampling: '4:4:4' })
      .toBuffer();
    const filename = `${String(frameIndex).padStart(4, '0')}.jpg`;
    await sharp(frame).toFile(resolve(framesDir, filename));
  };

  for (let start = 0; start < totalFrames; start += 8) {
    const batch = Array.from(
      { length: Math.min(8, totalFrames - start) },
      (_, offset) => renderFrame(start + offset),
    );
    await Promise.all(batch);
  }

  await encodeVideo(framesDir, resolve(outputDir, manifest.reel.filename), manifest.reel);
} finally {
  await rm(framesDir, { recursive: true, force: true });
}

console.log(
  `Generated ${manifest.carousel.slides.length} carousel slides and one ${manifest.reel.durationSeconds}-second Reel in ${outputDir}.`,
);
