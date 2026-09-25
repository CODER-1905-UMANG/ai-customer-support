import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import retrieveRelevantChunks from "./src/rag/retriever.js";
import buildContext from "./src/rag/contextBuilder.js";

dotenv.config();

const testContext = async () => {
  try {
    await connectDB();

    const query = "What is your refund policy?";

    console.log(`\nQuery: ${query}\n`);

    const results = await retrieveRelevantChunks(query, 5);

    const { context, sources } = buildContext(results);

    console.log("========== CONTEXT ==========\n");
    console.log(context);

    console.log("\n========== SOURCES ==========\n");
    console.log(sources);
  } catch (error) {
    console.error("Context test failed:", error.message);
  } finally {
    process.exit(0);
  }
};

testContext();