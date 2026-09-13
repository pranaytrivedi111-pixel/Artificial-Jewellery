const fs = require('fs');
const opentype = require('opentype.js');

function loadFont(filePath) {
  const buf = fs.readFileSync(filePath);
  const arrayBuf = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  return opentype.parse(arrayBuf);
}

const fontPlayfairBold = loadFont('src/assets/fonts/PlayfairDisplay-Bold.ttf');
const fontCinzel = loadFont('src/assets/fonts/Cinzel-Bold.ttf');

const qPath = fontPlayfairBold.getPath('QAVELLE', 0, 0, 160);
const qBBox = qPath.getBoundingBox();
console.log('QAVELLE (size 160) bbox:', qBBox);

// Let's test custom tracking for QAVELLE
const letters = 'QAVELLE'.split('');
let totalW = 0;
const tracking = 14; // spacing between letters in px
letters.forEach((char, i) => {
  const glyph = fontPlayfairBold.charToGlyph(char);
  totalW += (glyph.advanceWidth / fontPlayfairBold.unitsPerEm) * 160;
  if (i < letters.length - 1) totalW += tracking;
});
console.log('QAVELLE total width with tracking 14:', totalW);

// Tagline: CRAFTED FOR THE QUEEN IN YOU
const tagLetters = 'CRAFTED FOR THE QUEEN IN YOU'.split('');
const tagSize = 34;
let tagNaturalW = 0;
tagLetters.forEach(char => {
  const glyph = fontCinzel.charToGlyph(char);
  tagNaturalW += (glyph.advanceWidth / fontCinzel.unitsPerEm) * tagSize;
});
console.log('Tagline natural width (size 34):', tagNaturalW);
const tagTracking = (totalW - tagNaturalW) / (tagLetters.length - 1);
console.log('Tagline tracking needed to match QAVELLE width:', tagTracking);
