import express from "express";
import { extractContextPrompt } from "../prompts/extractContextPrompt.js";
import { fetchOpenAIChat } from "../services/openaiService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { documentText } = req.body;

    const systemPrompt = extractContextPrompt();

    const parsed = await fetchOpenAIChat({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: documentText },
      ],
      model: "gpt-4o-mini",
    });

    console.log(parsed.suggestedClauses);
    return res.json({
      success: true,
      data: {
        summary: parsed.summary || "",
        issues: parsed.issues || [],
        suggestedClauses: parsed.suggestedClauses || [],
      },
    });
  } catch (error) {
    console.error(
      "OpenAI Review Error:",
      error.response?.data || error.message
    );

    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        error: "Rate limit reached. Please try again in a few seconds.",
      });
    }

    return res.status(500).json({
      success: false,
      error: "AI review failed. Please try again later.",
      details: error.response?.data || error.message,
    });
  }
});

export default router;
