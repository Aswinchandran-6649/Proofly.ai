const { extractReceiptData } = require("../../services/geminiAi");

// Handle Receipt Scanning
exports.scanReceiptController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Heavy lifting is done by the service
    const extractedData = await extractReceiptData(
      req.file.buffer,
      req.file.mimetype
    );

    res.status(200).json(extractedData);
  } catch (error) {
    console.error("AI CONTROLLER ERROR:", error);
    res.status(500).json({
      error: "AI failed to process receipt",
      message: error.message,
    });
  }
};

