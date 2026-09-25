import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import routeAgentRequest from "./src/agents/agentRouter.js";
import Customer from "./src/models/Customer.js";

dotenv.config();

const testAgentRouter = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();

    // Use an existing seeded customer for ticket/escalation tests
    const customer = await Customer.findOne({
      email: "rahul@example.com",
    });

    if (!customer) {
      throw new Error("Test customer not found.");
    }

    const tests = [
      {
        name: "Knowledge / RAG",
        query: "What is your refund policy?",
      },
      {
        name: "Order Status Tool",
        query: "Where is my order 45821?",
      },
      {
        name: "Payment Status Tool",
        query: "Was my payment successful for order 45822?",
      },
      {
        name: "Support Ticket",
        query: "I want to report a problem with my order.",
      },
      {
        name: "Human Escalation",
        query: "I want to speak to a human support agent.",
      },
    ];

    for (const test of tests) {
      console.log("\n=================================");
      console.log(test.name);
      console.log("=================================");
      console.log("Customer:", test.query);

      const result = await routeAgentRequest({
        query: test.query,
        customerId: customer._id,
      });

      console.log("\nIntent:", result.intent);
      console.log("Action:", result.action);
      console.log("Answer:", result.answer);

      if (result.sources?.length > 0) {
        console.log("Sources:", result.sources);
      }

      if (result.toolResult) {
        console.log(
          "Tool Result:",
          JSON.stringify(result.toolResult, null, 2)
        );
      }
    }
  } catch (error) {
    console.error("\nAgent router test failed:", error.message);
  } finally {
    process.exit(0);
  }
};

testAgentRouter();