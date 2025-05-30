import axios from "axios";

const OPENAI_API_KEY =
  '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'

export async function generateProfileDescription(traits) {
  const prompt = `Write a friendly and engaging social profile description based on these traits: ${traits}.`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}
