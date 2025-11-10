export default function validateReviewRequest(req, res, next) {
    const { documentText, context } = req.body;
  

    if (!documentText || typeof documentText !== "string") {
      return res.status(400).json({
        success: false,
        error: "Missing or invalid 'documentText' field",
      });
    }
  
    // For now we can limit length. Later we will implement chunking for up to 100 pages.
    const maxLength = 15000;
    if (documentText.length > maxLength) {
      return res.status(400).json({
        success: false,
        error: `Document too long (max ${maxLength} characters).`,
      });
    }
  
    if (context && typeof context !== "object") {
      return res.status(400).json({
        success: false,
        error: "'context' must be an object if provided",
      });
    }
  
    next();
  }