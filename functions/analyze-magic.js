const { GoogleGenerativeAI } = require("@google/generative-ai");

const EXPERT_PROMPT = `You are Magic-Oid 🎩. Identify this magic trick/prop/book.
1. WHAT IS IT? (Name, Maker, Era)
2. HOW TO USE? (Plot summary only, keep secrets)
3. VALUE? (Estimate in £GBP)
Format: **🎩 IDENTIFIED**:...`;

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
      EXPERT_PROMPT, 
      { inlineData: { data: image.split(",")[1], mimeType: "image/jpeg" } }
    ]);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ analysis: result.response.text() })
    };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};