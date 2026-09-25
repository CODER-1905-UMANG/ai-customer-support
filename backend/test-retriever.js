import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import retrieveRelevantChunks from "./src/rag/retriever.js";

dotenv.config();

const testRetriever = async () => {
  try {
    await connectDB();

    const query = "What is your refund policy?";

    console.log("\nQuery:");
    console.log(query);

    console.log("\nSearching knowledge base...\n");

    const results = await retrieveRelevantChunks(query, 5);

    console.log(`Found ${results.length} relevant chunks:\n`);

    results.forEach((result, index) => {
      console.log(`========== Result ${index + 1} ==========`);
      console.log(`Source: ${result.source}`);
      console.log(`Chunk: ${result.chunkIndex}`);
      console.log(`Score: ${result.score}`);
      console.log(`Content:\n${result.content}\n`);
    });
  } catch (error) {
    console.error("Retriever test failed:", error.message);
  } finally {
    process.exit(0);
  }
};

testRetriever();