const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const extractReceiptData = async (imageBuffer, mimeType) => {
  try {

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
    

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Gemini Scan Error:", error.message);
    throw error;
  }
};

module.exports = { extractReceiptData };
