const fs = require('fs');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function check() {
  const imageBuffer = fs.readFileSync('src/assets/images/qavelle_photo_logo_1788789921113.jpg');
  const base64Image = imageBuffer.toString('base64');

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: 'Describe this image in detail. What text is written? What is the font style, especially the letter Q? What ornament is on top? What is the tagline?'
          },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          }
        ]
      }
    ]
  });

  console.log('Gemini Description:\n', response.text);
}

check().catch(console.error);
