const { GoogleGenerativeAI } = require('@google/generative-ai');

const PROMPT = `You are ROAST-OID 🔥 Look at this magician and roast them with British pub humor. Identify their type (card magician, kids entertainer, mentalist, close-up, stage, busker, dealer) then roast them. Keep under 150 words. Format: 🔥 ROASTED: [Type] [2-3 sentences roast] [final zinger]. Funny not hurtful.`;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { image } = JSON.parse(event.body);
    if (!image) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'No image' }) };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not set');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const base64 = image.replace(/^data:image\/\w+;base64,/, '');
    
    const result = await model.generateContent([
      PROMPT,
      { inlineData: { data: base64, mimeType: 'image/jpeg' } }
    ]);

    const text = result.response.text();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ analysis: text })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Roast failed' })
    };
  }
};
