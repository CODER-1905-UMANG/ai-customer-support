import { pipeline } from "@huggingface/transformers";

let extractor = null;

const getExtractor = async () => {
  if (!extractor) {
    console.log("Loading Hugging Face embedding model...");

    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    console.log("Embedding model loaded.");
  }

  return extractor;
};

const generateEmbedding = async (text) => {
  try {
    if (!text || !text.trim()) {
      throw new Error("Text is required for embedding generation.");
    }

    const model = await getExtractor();

    const output = await model(text, {
      pooling: "mean",
      normalize: true,
    });

    return Array.from(output.data);
  } catch (error) {
    console.error("Embedding generation error:", error.message);
    throw new Error("Failed to generate text embedding.");
  }
};

export default generateEmbedding;