/**
 * Builds PWA / favicon PNGs from the official Zivan mark.
 * Run: node scripts/generate-icons.mjs
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const brandMark = path.join(root, 'public', 'brand', 'zivan-mark.png');
const iconsDir = path.join(root, 'public', 'icons');
const white = { r: 255, g: 255, b: 255, alpha: 1 };
const transparent = { r: 0, g: 0, b: 0, alpha: 0 };

const markBuf = await readFile(brandMark);

async function makeAppIcon(size, outName, scale = 0.72) {
  const mark = await sharp(markBuf)
    .resize(Math.round(size * scale), Math.round(size * scale), {
      fit: 'contain',
      background: transparent,
    })
    .png()
    .toBuffer();

  await sharp({
    create: { width: size, height: size, channels: 4, background: white },
  })
    .composite([{ input: mark, gravity: 'centre' }])
    .png()
    .toFile(path.join(iconsDir, outName));

  console.log(`Generated icons/${outName} (${size}x${size})`);
}

await makeAppIcon(192, 'zivan-192.png');
await makeAppIcon(512, 'zivan-512.png');
await makeAppIcon(180, 'apple-touch-icon.png');
// Maskable safe zone: keep the mark smaller on a solid white canvas.
await makeAppIcon(512, 'zivan-maskable-512.png', 0.5);
await makeAppIcon(512, 'zivan-icon.png', 0.7);

for (const size of [32, 64, 128]) {
  await sharp(markBuf)
    .resize(size, size, {
      fit: 'contain',
      background: transparent,
    })
    .png()
    .toFile(
      size === 128
        ? path.join(root, 'public', 'brand', 'zivan-mark-128.png')
        : path.join(root, 'public', size === 32 ? 'favicon-32.png' : 'favicon.png'),
    );
  console.log(`Generated ${size === 128 ? 'brand/zivan-mark-128.png' : size === 32 ? 'favicon-32.png' : 'favicon.png'} (${size}x${size})`);
}
