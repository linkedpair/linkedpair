import axios from "axios";

const OPENAI_API_KEY = "FAKE";

export async function generateProfileDescription(traits) {
  //const prompt = `Write a friendly and engaging description for a dating app 'AboutMe' section based on these traits: ${traits}. 
  //  Keep it below 25 words and don't make it so cringey`;
  const prompt = 'reply with a random spanish food.'

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

export async function generateEmbeddingFromProfile(profileText) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/embeddings",
      {
        model: "text-embedding-3-large",
        input: profileText,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    // Returns the embedding vector array
    return response.data.data[0].embedding;
  } catch (error) {
    console.error("OpenAI Embedding API error:", error);
    throw error;
  }
}
