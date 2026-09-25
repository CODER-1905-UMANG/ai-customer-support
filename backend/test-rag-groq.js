import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import generateRagResponse from "./src/services/ragService.js";

dotenv.config();

const testRagGroq = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();

    const query = "What is your refund policy?";

    console.log("\nCustomer Question:");
    console.log(query);

    console.log("\nGenerating RAG response...");

    const result = await generateRagResponse(query);

    console.log("\n=================================");
    console.log("AI RESPONSE:");
    console.log("=================================");
    console.log(result.answer);

    console.log("\n=================================");
    console.log("SOURCES:");
    console.log("=================================");
    console.log(result.sources);
  } catch (error) {
    console.error("\nRAG + Groq test failed:", error.message);
  } finally {
    process.exit(0);
  }
};

testRagGroq();