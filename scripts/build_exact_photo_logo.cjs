const fs = require('fs');
const sharp = require('sharp');
const opentype = require('opentype.js');

function loadFont(filePath) {
  const buf = fs.readFileSync(filePath);
  const arrayBuf = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  return opentype.parse(arrayBuf);
}

const fontCinzel = loadFont('src/assets/fonts/Cinzel-Bold.ttf');
const fontPlayfair = loadFont('src/assets/fonts/PlayfairDisplay-Bold.ttf');

// 1. STAR ORNAMENT
// 4-pointed star with inner diamond cutout and flanking tapering rules
// Star center: (500, 350)
const starInnerCutout = `M 500 338 L 512 350 L 500 362 L 488 350 Z`;
const starOuterPath = `
  M 500 315
  C 503 334 507 344 528 350
  C 507 356 503 366 500 385
  C 497 366 493 356 472 350
  C 493 344 497 334 500 315 Z
`.replace(/\s+/g, ' ').trim();

// Tapering rules: Left rule from x=240 to x=460; Right rule from x=540 to x=760
// Drawn as thin polygons tapering from 2.2px at the star to 0.4px at the outer tip
const leftRulePath = `M 240 350 L 460 348.8 L 460 351.2 Z`;
const rightRulePath = `M 760 350 L 540 348.8 L 540 351.2 Z`;

// 2. MAIN WORDMARK: "QAVELLE"
// We design the exact letterforms:
// Q with the signature dramatic swooping tail that sweeps down and to the left!
// A, V, E, L, L, E with high-contrast serif Roman proportions

// Q body: outer oval from x=66 to x=202, y=405 to y=515
// Inner counter: oval from x=106 to x=162, y=422 to y=498
// The signature Q tail:
// Originates at bottom of O, sweeps down past baseline to y=552,
// flows left under the letter Q all the way to x=74, y=518 with an elegant pointed serif flick!
const qExactPath = `
  M 134 405
  C 178 405 204 430 204 460
  C 204 485 186 504 156 512
  C 166 524 182 534 204 539
  C 230 545 258 546 278 545
  C 260 551 234 553 202 548
  C 168 543 144 532 130 519
  C 118 532 94 544 72 550
  C 60 553 50 552 46 547
  C 44 542 50 535 64 526
  C 78 518 98 512 120 507
  C 86 498 64 480 64 460
  C 64 430 90 405 134 405 Z
  M 134 422
  C 114 422 96 438 96 460
  C 96 482 114 498 134 498
  C 154 498 172 482 172 460
  C 172 438 154 422 134 422 Z
`.replace(/\s+/g, ' ').trim();

// A: positioned from x=212 to x=342
const aPath = fontPlayfair.charToGlyph('A').getPath(215, 515, 156).toPathData(2);

// V: positioned from x=350 to x=480
const vPath = fontPlayfair.charToGlyph('V').getPath(352, 515, 156).toPathData(2);

// E: positioned from x=486 to x=590
const e1Path = fontPlayfair.charToGlyph('E').getPath(488, 515, 156).toPathData(2);

// L: positioned from x=596 to x=700
const l1Path = fontPlayfair.charToGlyph('L').getPath(598, 515, 156).toPathData(2);

// L: positioned from x=706 to x=810
const l2Path = fontPlayfair.charToGlyph('L').getPath(708, 515, 156).toPathData(2);

// E: positioned from x=816 to x=920
const e2Path = fontPlayfair.charToGlyph('E').getPath(818, 515, 156).toPathData(2);

// 3. TAGLINE: "CRAFTED FOR THE QUEEN IN YOU"
// Baseline at y=588. Exactly tracked to span from x=64 to x=936!
const tagText = 'CRAFTED FOR THE QUEEN IN YOU';
const tagSize = 34;

let naturalTagW = 0;
for (let i = 0; i < tagText.length; i++) {
  const char = tagText[i];
  const glyph = fontCinzel.charToGlyph(char);
  naturalTagW += (glyph.advanceWidth / fontCinzel.unitsPerEm) * tagSize;
}

const targetTagW = 872; // from x=64 to x=936
const tagSpacing = (targetTagW - naturalTagW) / (tagText.length - 1);

let curX = 64;
const tagPaths = [];
for (let i = 0; i < tagText.length; i++) {
  const char = tagText[i];
  const glyph = fontCinzel.charToGlyph(char);
  const path = glyph.getPath(curX, 588, tagSize);
  tagPaths.push(path.toPathData(2));
  curX += (glyph.advanceWidth / fontCinzel.unitsPerEm) * tagSize + tagSpacing;
}

console.log('Wordmark and tagline layout calculated.');

// 4. SVG DEFINITIONS
// Linear gradients for antique metallic gold
const goldDefs = `
  <defs>
    <!-- Rich metallic antique gold gradient -->
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#b68f51"/>
      <stop offset="35%" stop-color="#d4b06f"/>
      <stop offset="70%" stop-color="#a67e42"/>
      <stop offset="100%" stop-color="#c8a464"/>
    </linearGradient>

    <!-- Horizontal gold rule gradient -->
    <linearGradient id="leftRuleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#b68f51" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#b68f51" stop-opacity="1"/>
    </linearGradient>
    <linearGradient id="rightRuleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#b68f51" stop-opacity="1"/>
      <stop offset="100%" stop-color="#b68f51" stop-opacity="0.1"/>
    </linearGradient>

    <!-- Paper linen texture simulation for photo version -->
    <pattern id="linenTexture" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="#faf8f5"/>
      <circle cx="2" cy="2" r="0.6" fill="#000000" opacity="0.018"/>
      <circle cx="6" cy="6" r="0.6" fill="#000000" opacity="0.015"/>
    </pattern>
  </defs>
`;

function buildSquareSvg({ withBackground = true } = {}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  ${goldDefs}
  ${withBackground ? `<rect width="1000" height="1000" fill="url(#linenTexture)"/>` : ''}

  <!-- Top Star Ornament & Divider Lines -->
  <g id="star-ornament">
    <!-- Left Tapering Line -->
    <path d="${leftRulePath}" fill="url(#leftRuleGrad)"/>
    <!-- Right Tapering Line -->
    <path d="${rightRulePath}" fill="url(#rightRuleGrad)"/>
    <!-- 4-Pointed Gold Star with Hollow Diamond Center -->
    <path d="${starOuterPath} ${starInnerCutout}" fill="url(#goldGradient)" fill-rule="evenodd"/>
  </g>

  <!-- QAVELLE Wordmark with Dramatic Swooping Q Tail -->
  <g id="qavelle-letters" fill="#0c0c0c">
    <!-- Q with signature swash tail -->
    <path d="${qExactPath}"/>
    <!-- A -->
    <path d="${aPath}"/>
    <!-- V -->
    <path d="${vPath}"/>
    <!-- E -->
    <path d="${e1Path}"/>
    <!-- L -->
    <path d="${l1Path}"/>
    <!-- L -->
    <path d="${l2Path}"/>
    <!-- E -->
    <path d="${e2Path}"/>
  </g>

  <!-- Tagline: CRAFTED FOR THE QUEEN IN YOU -->
  <g id="tagline" fill="url(#goldGradient)">
    ${tagPaths.map(d => `<path d="${d}"/>`).join('\n    ')}
  </g>
</svg>`;
}

// Compact Horizontal Lockup for Navbar and Header
// Bounding box: x: 40 to 950, y: 305 to 615 -> width 910, height 310
function buildHorizontalSvg({ transparent = true } = {}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="40 305 920 310" width="920" height="310">
  ${goldDefs}
  ${!transparent ? `<rect x="40" y="305" width="920" height="310" fill="#faf8f5"/>` : ''}

  <!-- Top Star Ornament -->
  <g id="star-ornament">
    <path d="${leftRulePath}" fill="url(#leftRuleGrad)"/>
    <path d="${rightRulePath}" fill="url(#rightRuleGrad)"/>
    <path d="${starOuterPath} ${starInnerCutout}" fill="url(#goldGradient)" fill-rule="evenodd"/>
  </g>

  <!-- QAVELLE Wordmark with Signature Swash Tail -->
  <g id="qavelle-letters" fill="#0c0c0c">
    <path d="${qExactPath}"/>
    <path d="${aPath}"/>
    <path d="${vPath}"/>
    <path d="${e1Path}"/>
    <path d="${l1Path}"/>
    <path d="${l2Path}"/>
    <path d="${e2Path}"/>
  </g>

  <!-- Tagline -->
  <g id="tagline" fill="url(#goldGradient)">
    ${tagPaths.map(d => `<path d="${d}"/>`).join('\n    ')}
  </g>
</svg>`;
}

// Favicon / Emblem Star
function buildCrestSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="460 305 80 90" width="128" height="128">
  ${goldDefs}
  <path d="${starOuterPath} ${starInnerCutout}" fill="url(#goldGradient)" fill-rule="evenodd"/>
</svg>`;
}

async function renderAssets() {
  const photoSquareSvg = buildSquareSvg({ withBackground: true });
  const transSquareSvg = buildSquareSvg({ withBackground: false });
  const transHorizontalSvg = buildHorizontalSvg({ transparent: true });
  const photoHorizontalSvg = buildHorizontalSvg({ transparent: false });
  const crestSvg = buildCrestSvg();

  // 1. Write SVGs
  fs.writeFileSync('public/qavelle_logo.svg', photoSquareSvg);
  fs.writeFileSync('public/qavelle_logo_transparent.svg', transSquareSvg);
  fs.writeFileSync('public/qavelle_logo_horizontal.svg', transHorizontalSvg);
  fs.writeFileSync('public/qavelle_logo_horizontal_photo.svg', photoHorizontalSvg);
  fs.writeFileSync('public/qavelle_crest.svg', crestSvg);

  // 2. Render High-Resolution PNG & JPEG (2048x2048 and 1024x1024)
  // Exact Square Photo (matches the user uploaded photo with warm paper texture)
  await sharp(Buffer.from(photoSquareSvg))
    .resize(1024, 1024)
    .jpeg({ quality: 98 })
    .toFile('public/qavelle_logo.jpg');

  await sharp(Buffer.from(photoSquareSvg))
    .resize(1024, 1024)
    .png({ quality: 100 })
    .toFile('public/qavelle_logo_exact.png');

  // Update src/assets/images brand logo
  await sharp(Buffer.from(photoSquareSvg))
    .resize(1024, 1024)
    .jpeg({ quality: 98 })
    .toFile('src/assets/images/qavelle_brand_logo_1788290647404.jpg');

  // Transparent Square PNG
  await sharp(Buffer.from(transSquareSvg))
    .resize(1024, 1024)
    .png()
    .toFile('public/qavelle_logo_transparent.png');

  // Horizontal Transparent PNG for Navbar
  await sharp(Buffer.from(transHorizontalSvg))
    .resize(1840, 620)
    .png()
    .toFile('public/qavelle_logo_horizontal.png');

  // Horizontal Photo (with background)
  await sharp(Buffer.from(photoHorizontalSvg))
    .resize(1840, 620)
    .jpeg({ quality: 98 })
    .toFile('public/qavelle_logo_horizontal_photo.jpg');

  // Crest Favicon PNG
  await sharp(Buffer.from(crestSvg))
    .resize(256, 256)
    .png()
    .toFile('public/qavelle_crest_transparent.png');

  console.log('Successfully rendered all exact photo and vector logo assets!');
}

renderAssets().catch(console.error);
