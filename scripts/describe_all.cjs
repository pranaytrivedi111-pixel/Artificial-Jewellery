require('dotenv').config();
const sharp = require('sharp');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const files = [
  'Hero_website.png',
  'Cinematic.png',
  'ChatGPT Image Aug 31, 2026, 10_37_17 PM.png',
  'UGC.png',
  'UGC_1.png',
  'UGC_2.png',
  'UGC_3.png'
];

async function run() {
  for (const file of files) {
    try {
      const meta = await sharp(file).metadata();
      const thumb = await sharp(file).resize(380, 380, { fit: 'inside' }).jpeg({ quality: 75 }).toBuffer();
      const resp = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: 'Describe in 1 sentence: What does this image show? (What is the shot: e.g. Infographic with text/badges, pure product on silk/table without text, model wearing earring, woman holding in hand, close-up of specific earring, etc.)' },
              { inlineData: { mimeType: 'image/jpeg', data: thumb.toString('base64') } }
            ]
          }
        ]
      });
      console.log(`[${file}] (${meta.width}x${meta.height}): ${resp.text.trim()}`);
    } catch (err) {
      console.error(`Error on ${file}:`, err.message);
    }
  }
}

run();
