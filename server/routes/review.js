import express from "express";
import axios from "axios";
import validateReviewRequest from "../middleware/validateReviewRequest.js";
import {reviewPrompt} from "../prompts/reviewPrompt.js";

const router = express.Router();

router.post("/", validateReviewRequest, async (req, res) => {
  try {
    const { documentText, context } = req.body;

    const systemPrompt = reviewPrompt(context?.jurisdiction);

    // For now we handle talking to robot directly here.
    // Later we can abstract this to a service layer. (Just like at job)
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: documentText },
        ],
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices?.[0]?.message?.content;
    const parsed =
      typeof content === "string" ? JSON.parse(content) : content || {};

    return res.json({
      success: true,
      data: {
        summary: parsed.summary || "",
        issues: parsed.issues || [],
        suggestedClauses: parsed.suggestedClauses || [],
      },
    });
  } catch (error) {
    console.error("OpenAI Review Error:", error.response?.data || error.message);

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
