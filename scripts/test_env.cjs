require('dotenv').config();
console.log('API key length:', (process.env.GEMINI_API_KEY || '').length);
