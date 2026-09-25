import dotenv from "dotenv";
import generateResponse from "./src/services/groqService.js";

dotenv.config();

const testGroq = async () => {
  try {
    const response = await generateResponse(
      "Explain what an AI customer support system is in 2 sentences."
    );

    console.log("\nGroq Response:\n");
    console.log(response);
  } catch (error) {
    console.error("Groq test failed:", error.message);
  }
};

testGroq();