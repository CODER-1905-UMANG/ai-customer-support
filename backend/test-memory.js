import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import routeAgentRequest from "./src/agents/agentRouter.js";
import Customer from "./src/models/Customer.js";
import Conversation from "./src/models/Conversation.js";

dotenv.config();

const testMemory = async () => {
  const sessionId = `memory-test-${Date.now()}`;

  try {
    console.log("Connecting to MongoDB...");
    await connectDB();

    const customer = await Customer.findOne({
      email: "rahul@example.com",
    });

    if (!customer) {
      throw new Error("Test customer not found.");
    }

    // --------------------------------------------------
    // MESSAGE 1
    // --------------------------------------------------

    const firstQuery = "Where is my order 45821?";

    console.log("\n=================================");
    console.log("MESSAGE 1");
    console.log("=================================");
    console.log("Customer:", firstQuery);

    const firstResponse = await routeAgentRequest({
      query: firstQuery,
      sessionId,
      customerId: customer._id,
    });

    console.log("Intent:", firstResponse.intent);
    console.log("Action:", firstResponse.action);
    console.log("Answer:", firstResponse.answer);

    // --------------------------------------------------
    // MESSAGE 2
    // --------------------------------------------------

    const secondQuery = "When will it arrive?";

    console.log("\n=================================");
    console.log("MESSAGE 2");
    console.log("=================================");
    console.log("Customer:", secondQuery);

    const secondResponse = await routeAgentRequest({
      query: secondQuery,
      sessionId,
      customerId: customer._id,
    });

    console.log("Intent:", secondResponse.intent);
    console.log("Action:", secondResponse.action);
    console.log("Answer:", secondResponse.answer);

    // --------------------------------------------------
    // CHECK DATABASE MEMORY
    // --------------------------------------------------

    const conversation = await Conversation.findOne({
      sessionId,
    });

    console.log("\n=================================");
    console.log("SAVED MEMORY");
    console.log("=================================");

    console.log(
      JSON.stringify(
        {
          sessionId: conversation.sessionId,
          context: conversation.context,
          messages: conversation.messages.map((message) => ({
            role: message.role,
            content: message.content,
            toolName: message.toolName,
          })),
        },
        null,
        2
      )
    );
  } catch (error) {
    console.error("\nMemory test failed:", error.message);
  } finally {
    process.exit(0);
  }
};

testMemory();