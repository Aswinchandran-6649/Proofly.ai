const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Ensure your API key in .env is from the "Default Gemini Project"
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const extractReceiptData = async (imageBuffer, mimeType) => {
  try {
    // 1. Switch to 'gemini-1.5-flash'. 
    // If this still 404s, your region may only support 'gemini-pro-vision' 
    // or requires the 'latest' tag.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = "Analyze this receipt. Return ONLY a JSON object with: storeName, purchaseDate (YYYY-MM-DD), totalAmount (number), productName.";

    const result = await model.generateContent([
      {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType
        }
      },
      { text: prompt }
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Clean potential markdown characters
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Gemini Scan Error:", error.message);
    throw error;
  }
};

module.exports = { extractReceiptData };