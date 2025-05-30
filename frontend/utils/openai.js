import axios from "axios";

const OPENAI_API_KEY = "FAKE_API_KEY"; // Replace with your actual OpenAI API key

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
