const fs = require('fs');
const sharp = require('sharp');

// Let's craft the exact Q path
// Q body: outer oval from x=66 to x=224, y=398 to y=515
// Inner counter: oval from x=108 to x=182, y=415 to y=498
// Q swash tail: dramatic curve starting inside the lower right of the oval,
// sweeping down to y=554, sweeping back left across to x=72, y=512!

const qPath = `
  M 145 398
  C 188 398 224 424 224 456
  C 224 485 198 508 162 514
  C 175 526 195 536 218 542
  C 240 547 262 548 276 548
  C 260 554 235 555 204 550
  C 172 545 148 534 135 522
  C 120 534 98 544 76 550
  C 64 553 54 552 50 548
  C 48 544 54 536 68 528
  C 82 520 102 513 124 507
  C 88 497 66 478 66 456
  C 66 424 102 398 145 398 Z
  M 145 414
  C 118 414 98 433 98 456
  C 98 479 118 498 145 498
  C 172 498 192 479 192 456
  C 192 433 172 414 145 414 Z
`.replace(/\s+/g, ' ').trim();

console.log('Q path defined.');
