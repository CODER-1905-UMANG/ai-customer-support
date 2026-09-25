import dotenv from "dotenv";
import detectIntent from "./src/agents/agentService.js";

dotenv.config();

const testAgent = async () => {
  const testQueries = [
    "What is your refund policy?",
    "Where is my order 45821?",
    "Was my payment successful for order 45822?",
    "I want to create a support ticket.",
    "I want to speak to a human agent.",
  ];

  try {
    for (const query of testQueries) {
      console.log("\n=================================");
      console.log("Customer:", query);

      const result = await detectIntent(query);

      console.log("Agent:", result);
    }
  } catch (error) {
    console.error("Agent test failed:", error.message);
  } finally {
    process.exit(0);
  }
};

testAgent();