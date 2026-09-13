const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');
const sharp = require('sharp');

function loadFont(filePath) {
  const buf = fs.readFileSync(filePath);
  const arrayBuf = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  return opentype.parse(arrayBuf);
}

const fontPlayfairBold = loadFont('src/assets/fonts/PlayfairDisplay-Bold.ttf');
const fontCinzel = loadFont('src/assets/fonts/Cinzel-Bold.ttf');

const GOLD_COLOR = '#b3874b';
const BLACK_COLOR = '#0c0c0c';

// 1. Generate QAVELLE glyph paths with precise letter-spacing
const qavelleText = 'QAVELLE';
const qavelleSize = 160;
const qavelleTracking = 14;

let currentX = 0;
const qavelleGlyphPaths = [];

for (let i = 0; i < qavelleText.length; i++) {
  const char = qavelleText[i];
  const glyph = fontPlayfairBold.charToGlyph(char);
  const glyphPath = glyph.getPath(currentX, 0, qavelleSize);
  qavelleGlyphPaths.push(glyphPath.toPathData(2));
  currentX += (glyph.advanceWidth / fontPlayfairBold.unitsPerEm) * qavelleSize;
  if (i < qavelleText.length - 1) {
    currentX += qavelleTracking;
  }
}

const qavelleTotalWidth = currentX;
console.log('QAVELLE Total Width:', qavelleTotalWidth);

// 2. Generate Tagline glyph paths: CRAFTED FOR THE QUEEN IN YOU
const tagText = 'CRAFTED FOR THE QUEEN IN YOU';
const tagSize = 34;

let naturalTagWidth = 0;
for (let i = 0; i < tagText.length; i++) {
  const char = tagText[i];
  const glyph = fontCinzel.charToGlyph(char);
  naturalTagWidth += (glyph.advanceWidth / fontCinzel.unitsPerEm) * tagSize;
}

// Adjust tracking so tagline spans exactly matching width (approx 98% of QAVELLE width)
const targetTagWidth = qavelleTotalWidth * 0.98;
const tagTracking = (targetTagWidth - naturalTagWidth) / (tagText.length - 1);

currentX = 0;
const tagGlyphPaths = [];
for (let i = 0; i < tagText.length; i++) {
  const char = tagText[i];
  const glyph = fontCinzel.charToGlyph(char);
  const glyphPath = glyph.getPath(currentX, 0, tagSize);
  tagGlyphPaths.push(glyphPath.toPathData(2));
  currentX += (glyph.advanceWidth / fontCinzel.unitsPerEm) * tagSize;
  if (i < tagText.length - 1) {
    currentX += tagTracking;
  }
}

const tagTotalWidth = currentX;
console.log('Tagline Total Width:', tagTotalWidth);

// 3. Define the Star & Line ornament
// Center of ornament is at x = 0, y = 0
// Outer 4-pointed star with inner hollow diamond
const starPath = `
  M 0 -36
  Q 4 -10 36 0
  Q 4 10 0 36
  Q -4 10 -36 0
  Q -4 -10 0 -36
  Z
  M 0 -17
  L -15 0
  L 0 17
  L 15 0
  Z
`.replace(/\s+/g, ' ').trim();

// Horizontal lines: left from -260 to -46, right from 46 to 260
const leftLinePath = `M -260 0 L -46 0`;
const rightLinePath = `M 46 0 L 260 0`;

// Combine into Square Logo (1000 x 1000)
// Center x = 500
// Star ornament y = 352
// QAVELLE baseline y = 515
// Tagline baseline y = 590

const qavelleStartX = 500 - qavelleTotalWidth / 2;
const tagStartX = 500 - tagTotalWidth / 2;

function buildSvg({ bg = 'none', width = 1000, height = 1000 } = {}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="${width}" height="${height}">
  ${bg !== 'none' ? `<rect width="1000" height="1000" fill="${bg}"/>` : ''}
  <!-- Top Ornament: Star and Divider Lines -->
  <g id="top-ornament" transform="translate(500, 352)">
    <!-- Left Divider Line -->
    <path d="${leftLinePath}" stroke="${GOLD_COLOR}" stroke-width="2.2" stroke-linecap="round"/>
    <!-- Right Divider Line -->
    <path d="${rightLinePath}" stroke="${GOLD_COLOR}" stroke-width="2.2" stroke-linecap="round"/>
    <!-- Center 4-Pointed Star with Hollow Diamond (fill-rule="evenodd") -->
    <path d="${starPath}" fill="${GOLD_COLOR}" fill-rule="evenodd"/>
  </g>

  <!-- QAVELLE Wordmark -->
  <g id="qavelle-wordmark" transform="translate(${qavelleStartX.toFixed(2)}, 515)" fill="${BLACK_COLOR}">
    ${qavelleGlyphPaths.map(d => `<path d="${d}"/>`).join('\n    ')}
  </g>

  <!-- Tagline: CRAFTED FOR THE QUEEN IN YOU -->
  <g id="tagline" transform="translate(${tagStartX.toFixed(2)}, 590)" fill="${GOLD_COLOR}">
    ${tagGlyphPaths.map(d => `<path d="${d}"/>`).join('\n    ')}
  </g>
</svg>`;
}

// 4. Horizontal Compact Logo for Navbar / Header
// Bounds of elements in horizontal:
// Star + line on top, QAVELLE in middle, Tagline on bottom, but cropped tightly
// Bounding box from y = 300 to y = 620 -> height = 320. Width = 860.
const hWidth = 860;
const hHeight = 320;
const hViewBox = `70 305 860 310`;

function buildHorizontalSvg({ bg = 'none', textColor = BLACK_COLOR } = {}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${hViewBox}" width="${hWidth}" height="${hHeight}">
  ${bg !== 'none' ? `<rect x="70" y="305" width="860" height="310" fill="${bg}"/>` : ''}
  <!-- Top Ornament -->
  <g id="top-ornament" transform="translate(500, 352)">
    <path d="${leftLinePath}" stroke="${GOLD_COLOR}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="${rightLinePath}" stroke="${GOLD_COLOR}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="${starPath}" fill="${GOLD_COLOR}" fill-rule="evenodd"/>
  </g>

  <!-- QAVELLE Wordmark -->
  <g id="qavelle-wordmark" transform="translate(${qavelleStartX.toFixed(2)}, 515)" fill="${textColor}">
    ${qavelleGlyphPaths.map(d => `<path d="${d}"/>`).join('\n    ')}
  </g>

  <!-- Tagline -->
  <g id="tagline" transform="translate(${tagStartX.toFixed(2)}, 590)" fill="${GOLD_COLOR}">
    ${tagGlyphPaths.map(d => `<path d="${d}"/>`).join('\n    ')}
  </g>
</svg>`;
}

async function run() {
  const squareSvgTransparent = buildSvg({ bg: 'none' });
  const squareSvgWhite = buildSvg({ bg: '#ffffff' });
  const horizontalSvgTransparent = buildHorizontalSvg({ bg: 'none', textColor: BLACK_COLOR });
  const horizontalSvgWhite = buildHorizontalSvg({ bg: '#ffffff', textColor: BLACK_COLOR });
  const horizontalSvgDark = buildHorizontalSvg({ bg: 'none', textColor: '#ffffff' });

  // Save SVGs
  fs.writeFileSync('public/qavelle_logo.svg', squareSvgTransparent);
  fs.writeFileSync('public/qavelle_logo_white_bg.svg', squareSvgWhite);
  fs.writeFileSync('public/qavelle_logo_horizontal.svg', horizontalSvgTransparent);
  fs.writeFileSync('public/qavelle_logo_horizontal_dark.svg', horizontalSvgDark);

  // Favicon / Emblem
  const emblemSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100" width="128" height="128">
  <path d="${starPath}" fill="${GOLD_COLOR}" fill-rule="evenodd"/>
</svg>`;
  fs.writeFileSync('public/qavelle_crest.svg', emblemSvg);

  // Render PNGs via Sharp
  await sharp(Buffer.from(squareSvgWhite))
    .resize(1024, 1024)
    .png()
    .toFile('public/qavelle_logo_exact.png');

  await sharp(Buffer.from(squareSvgTransparent))
    .resize(1024, 1024)
    .png()
    .toFile('public/qavelle_logo_transparent.png');

  await sharp(Buffer.from(horizontalSvgTransparent))
    .resize(860 * 2, 320 * 2)
    .png()
    .toFile('public/qavelle_logo_horizontal.png');

  await sharp(Buffer.from(emblemSvg))
    .resize(256, 256)
    .png()
    .toFile('public/qavelle_crest_transparent.png');

  // Also replace public/qavelle_logo.jpg with high-res white background version
  await sharp(Buffer.from(squareSvgWhite))
    .resize(1024, 1024)
    .jpeg({ quality: 98 })
    .toFile('public/qavelle_logo.jpg');

  // Update brand logo in src/assets/images
  await sharp(Buffer.from(squareSvgWhite))
    .resize(1024, 1024)
    .jpeg({ quality: 98 })
    .toFile('src/assets/images/qavelle_brand_logo_1788290647404.jpg');

  console.log('Successfully generated all exact SVG and PNG logo assets!');
}

run().catch(console.error);
