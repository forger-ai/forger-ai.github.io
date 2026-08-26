import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const screenshotDir = resolve(rootDir, 'public/assets/screenshots');
const outputDir = resolve(rootDir, 'marketing/instagram/exports');
const width = 1080;
const height = 1920;

const stories = [
  {
    filename: '01-gratis-tu-cuenta.png',
    screenshot: 'forger-new-experience.png',
    eyebrow: 'FORGER · GRATIS PARA PERSONAS',
    title: ['Tu IA. Tus apps.', 'Tu computador.'],
    body: ['Usa ChatGPT, Claude o Antigravity', 'con la cuenta que ya tienes.'],
    footer: 'Sin suscripción adicional de Forger',
    note: 'Aplican los límites y condiciones de tu proveedor de IA.',
  },
  {
    filename: '02-local-y-bajo-tu-control.png',
    screenshot: 'forger-my-apps.png',
    eyebrow: 'LOCAL PRIMERO',
    title: ['Tus apps viven', 'en tu computador.'],
    body: ['Crea herramientas que trabajan contigo', 'en un espacio local y privado.'],
    footer: 'Tú decides qué archivos usar y compartir',
    note: 'Forger es gratis para personas.',
  },
  {
    filename: '03-crea-una-app-que-te-sirva.png',
    screenshot: 'forger-catalog.png',
    eyebrow: 'HECHO PARA TU VIDA Y TU TRABAJO',
    title: ['Crea una app que', 'realmente te sirva.'],
    body: ['Parte de una necesidad concreta.', 'Hazla tuya con la IA que ya conoces.'],
    footer: 'Descarga Forger gratis · link en bio',
    note: 'Tus apps, tu computador, tu control.',
  },
  {
    filename: '01-free-use-your-account.png',
    screenshot: 'forger-new-experience.png',
    eyebrow: 'FORGER · FREE FOR PEOPLE',
    title: ['Your AI. Your apps.', 'Your computer.'],
    body: ['Use ChatGPT, Claude, or Antigravity', 'with the account you already have.'],
    footer: 'No extra Forger subscription',
    note: 'Your AI provider’s limits and terms still apply.',
  },
  {
    filename: '02-local-under-your-control.png',
    screenshot: 'forger-my-apps.png',
    eyebrow: 'LOCAL-FIRST',
    title: ['Your apps live', 'on your computer.'],
    body: ['Create tools that work with you', 'in a private, local workspace.'],
    footer: 'You choose which files to use and share',
    note: 'Forger is free for people.',
  },
  {
    filename: '03-create-an-app-that-helps.png',
    screenshot: 'forger-catalog.png',
    eyebrow: 'FOR LIFE AND WORK',
    title: ['Create an app that', 'actually helps you.'],
    body: ['Start with a specific need.', 'Make it yours with the AI you already know.'],
    footer: 'Download Forger free · link in bio',
    note: 'Your apps, your computer, your control.',
  },
];

const escapeXml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const lines = (values, startY, fontSize, lineHeight, color, weight = 600) =>
  values
    .map(
      (line, index) =>
        `<text x="72" y="${startY + index * lineHeight}" fill="${color}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="${weight}">${escapeXml(line)}</text>`,
    )
    .join('');

const backgroundSvg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="base" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0D1117"/>
        <stop offset="1" stop-color="#1C2228"/>
      </linearGradient>
      <radialGradient id="glow" cx="20%" cy="12%" r="80%">
        <stop offset="0" stop-color="#D97832" stop-opacity="0.27"/>
        <stop offset="1" stop-color="#D97832" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#base)"/>
    <rect width="${width}" height="${height}" fill="url(#glow)"/>
    <circle cx="900" cy="220" r="260" fill="none" stroke="#D97832" stroke-opacity="0.14" stroke-width="2"/>
    <circle cx="900" cy="220" r="360" fill="none" stroke="#FFFFFF" stroke-opacity="0.05" stroke-width="2"/>
  </svg>`;

const screenshotFrameSvg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <rect x="52" y="818" width="976" height="680" rx="34" fill="#090D12" stroke="#FFFFFF" stroke-opacity="0.14" stroke-width="2"/>
  </svg>`;

const foregroundSvg = ({ eyebrow, title, body, footer, note }) => `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <rect x="72" y="92" width="${Math.min(800, 78 + eyebrow.length * 17)}" height="52" rx="26" fill="#D97832" fill-opacity="0.14" stroke="#D97832" stroke-opacity="0.6"/>
    <text x="98" y="126" fill="#F2B47D" font-family="Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="2">${escapeXml(eyebrow)}</text>
    ${lines(title, 248, 76, 88, '#FFFFFF', 700)}
    ${lines(body, 455, 31, 45, '#CBD5E1', 400)}
    <rect x="72" y="1548" width="936" height="104" rx="28" fill="#D97832"/>
    <text x="108" y="1613" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="31" font-weight="700">${escapeXml(footer)}</text>
    <text x="72" y="1730" fill="#94A3B8" font-family="Arial, sans-serif" font-size="24" font-weight="400">${escapeXml(note)}</text>
    <text x="72" y="1830" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="25" font-weight="700" letter-spacing="5">FORGER</text>
    <text x="72" y="1874" fill="#94A3B8" font-family="Arial, sans-serif" font-size="22">forger.cloud</text>
  </svg>`;

await mkdir(outputDir, { recursive: true });

for (const story of stories) {
  const screenshot = await sharp(resolve(screenshotDir, story.screenshot))
    .resize({ width: 936, height: 640, fit: 'cover', position: 'centre' })
    .png()
    .toBuffer();

  await sharp(Buffer.from(backgroundSvg))
    .composite([
      { input: Buffer.from(screenshotFrameSvg) },
      { input: screenshot, left: 72, top: 838 },
      { input: Buffer.from(foregroundSvg(story)) },
    ])
    .png()
    .toFile(resolve(outputDir, story.filename));
}

console.log(`Generated ${stories.length} Instagram assets in ${outputDir}`);
