 const {GoogleGenAI} = require('@google/genai');
 const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

async function callToAi(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    config: {
      responseMimeType: "application/json"},
    contents:prompt ,
  });
  console.log(response.text);
}

module.exports= callToAi;