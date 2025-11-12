import axios from "axios";

export async function fetchOpenAIChat({ messages, model = "gpt-4o-mini" }) {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model,
          messages,
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
  
      // If it's a string, attempt JSON.parse, otherwise return raw object
      return typeof content === "string" ? JSON.parse(content) : content || {};
    } catch (error) {
      console.error("OpenAI API Error:", error.response?.data || error.message);
      throw error;
    }
  }