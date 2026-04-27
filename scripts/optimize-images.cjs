/**
 * One-shot image optimizer.
 * Resizes oversized banner WebPs in public/images to a sane max width
 * and re-encodes at lower quality. Run manually:
 *   node scripts/optimize-images.cjs
 *
 * Skips: favicons, app icons, arcadedeck-banner (used full-bleed).
 * Skips files already <= TARGET_WIDTH and reasonably small.
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
sharp.cache(false);

const DIR = path.join(__dirname, '..', 'public', 'images');
const TARGET_WIDTH = 640;
const QUALITY = 70;
const SIZE_THRESHOLD = 50 * 1024;

const SKIP = new Set([
  'favicon.webp',
  'icon-192x192.webp',
  'icon-512x512.webp',
  'arcadedeck-banner.webp',
  'bg.webp',
]);

(async () => {
  const files = fs.readdirSync(DIR).filter(f => f.toLowerCase().endsWith('.webp'));
  let totalBefore = 0, totalAfter = 0;
  for (const f of files) {
    if (SKIP.has(f)) continue;
    const p = path.join(DIR, f);
    const before = fs.statSync(p).size;
    if (before < SIZE_THRESHOLD) continue;
    const meta = await sharp(p).metadata();
    if ((meta.width || 0) <= TARGET_WIDTH && before < 200 * 1024) continue;
    const buf = await sharp(p)
      .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();
    const tmp = p + '.tmp';
    fs.writeFileSync(tmp, buf);
    fs.renameSync(tmp, p);
    const after = buf.length;
    totalBefore += before;
    totalAfter += after;
    console.log(`${f}: ${(before/1024).toFixed(0)}K -> ${(after/1024).toFixed(0)}K`);
  }
  console.log(`\nTotal: ${(totalBefore/1024).toFixed(0)}K -> ${(totalAfter/1024).toFixed(0)}K (saved ${((totalBefore-totalAfter)/1024).toFixed(0)}K)`);
})();
