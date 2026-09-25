import Groq from "groq-sdk";

const generateResponse = async (prompt) => {
  try {
    if (!prompt || !prompt.trim()) {
      throw new Error("Prompt is required.");
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
      include_reasoning: false,
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Groq API error:", error.message);
    throw new Error("Failed to generate AI response.");
  }
};

export default generateResponse;