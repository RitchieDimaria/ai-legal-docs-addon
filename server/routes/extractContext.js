import express from "express";
import { extractContextPrompt } from "../prompts/extractContextPrompt.js";
import { fetchOpenAIChat } from "../services/openaiService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { documentText } = req.body;

    console.log("Extracting context from document, text length:", documentText?.length || 0);

    const systemPrompt = extractContextPrompt();

    const parsed = await fetchOpenAIChat({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: documentText },
      ],
      model: "gpt-4o-mini",
    });

    console.log("Raw OpenAI response:", JSON.stringify(parsed, null, 2));

    // Extract the expected fields from the parsed response
    const contextData = {
      definedTerms: parsed.definedTerms || parsed["Defined Terms"] || [],
      parties: parsed.parties || parsed["Parties"] || null,
      jurisdiction: parsed.jurisdiction || parsed["Governing Law / Jurisdiction"] || parsed["Governing Law"] || null,
      docType: parsed.docType || parsed["Document Type"] || null,
      headings: parsed.headings || parsed["Headings / Section Titles"] || parsed["Headings"] || []
    };

    console.log("Formatted context data:", JSON.stringify(contextData, null, 2));

    return res.json({
      success: true,
      data: contextData,
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
