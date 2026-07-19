/**
 * Renders the Zivan SVG brand icons into the standard PNG sizes used by the
 * PWA manifest and iOS home screen. Run with: node scripts/generate-icons.mjs
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const iconsDir = path.join(root, 'public', 'icons');

const jobs = [
  { src: 'zivan-icon.svg', out: 'zivan-192.png', size: 192 },
  { src: 'zivan-icon.svg', out: 'zivan-512.png', size: 512 },
  { src: 'zivan-icon-maskable.svg', out: 'zivan-maskable-512.png', size: 512 },
  { src: 'zivan-icon.svg', out: 'apple-touch-icon.png', size: 180 },
];

for (const { src, out, size } of jobs) {
  const svg = await readFile(path.join(iconsDir, src));
  await sharp(svg, { density: 300 })
    .resize(size, size)
    .png()
    .toFile(path.join(iconsDir, out));
  console.log(`Generated icons/${out} (${size}x${size})`);
}
