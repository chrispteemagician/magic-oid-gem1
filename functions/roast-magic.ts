const { GoogleGenerativeAI } = require("@google/generative-ai");

const ROAST_PROMPT = `You are ROAST-OID 🔥. Identify the magician archetype (Move Monkey, Mentalist, etc.) and roast them affectionately. Max 150 words.`;

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  try {
    const { image } = JSON.parse(event.body);
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const result = await model.generateContent([
      ROAST_PROMPT, 
      { inlineData: { data: image.split(",")[1], mimeType: "image/jpeg" } }
    ]);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ roast: result.response.text() })
    };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};