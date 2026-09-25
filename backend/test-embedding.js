import dotenv from "dotenv";
import generateEmbedding from "./src/rag/embeddings.js";

dotenv.config();

const testEmbedding = async () => {
  try {
    const text = "What is your refund policy?";

    console.log("Generating embedding...");

    const embedding = await generateEmbedding(text);

    console.log("Embedding generated successfully.");
    console.log("Vector dimensions:", embedding.length);
    console.log("First 10 values:", embedding.slice(0, 10));
  } catch (error) {
    console.error("Embedding test failed:", error.message);
  }
};

testEmbedding();