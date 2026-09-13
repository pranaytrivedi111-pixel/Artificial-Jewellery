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

console.log('Fonts loaded successfully.');
