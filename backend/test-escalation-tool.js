import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import Customer from "./src/models/Customer.js";
import escalateToHuman from "./src/tools/escalationTool.js";

dotenv.config();

const testEscalationTool = async () => {
  try {
    await connectDB();

    const customer = await Customer.findOne({
      email: "rahul@example.com",
    });

    if (!customer) {
      throw new Error("Test customer not found.");
    }

    console.log("\n--- Human Escalation Test ---");

    const result = await escalateToHuman({
      customerId: customer._id,
      subject: "Order failed but payment was deducted",
      description:
        "Customer says the order failed but the payment was successfully deducted.",
      category: "payment",
      priority: "high",
      reason: "Payment successful but order failed. Human investigation required.",
    });

    console.log(JSON.stringify(result, null, 2));

    process.exit(0);
  } catch (error) {
    console.error("Test failed:", error.message);
    process.exit(1);
  }
};

testEscalationTool();