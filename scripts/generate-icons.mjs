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

async function makeAppIcon(size, outName, scale = 0.72, background = white) {
  const mark = await sharp(markBuf)
    .resize(Math.round(size * scale), Math.round(size * scale), {
      fit: 'contain',
      background: transparent,
    })
    .png()
    .toBuffer();

  await sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: mark, gravity: 'centre' }])
    .png()
    .toFile(path.join(iconsDir, outName));

  console.log(`Generated icons/${outName} (${size}x${size})`);
}

await makeAppIcon(192, 'zivan-192.png');
await makeAppIcon(512, 'zivan-512.png');
await makeAppIcon(180, 'apple-touch-icon.png');
await makeAppIcon(512, 'zivan-maskable-512.png', 0.58);
await makeAppIcon(512, 'zivan-icon.png', 0.7);

await sharp(markBuf)
  .resize(64, 64, {
    fit: 'contain',
    background: transparent,
  })
  .png()
  .toFile(path.join(root, 'public', 'favicon.png'));
console.log('Generated favicon.png');
