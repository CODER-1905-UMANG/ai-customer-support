import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import Customer from "./src/models/Customer.js";
import createSupportTicket from "./src/tools/ticketTool.js";

dotenv.config();

const testTicketTool = async () => {
  try {
    await connectDB();

    const customer = await Customer.findOne({
      email: "rahul@example.com",
    });

    if (!customer) {
      throw new Error("Test customer not found.");
    }

    console.log("\n--- Create Support Ticket Test ---");

    const result = await createSupportTicket({
      customerId: customer._id,
      subject: "Payment deducted but order failed",
      description:
        "Customer reports that the payment was deducted but the order failed.",
      category: "payment",
      priority: "high",
      source: "ai",
      escalationReason:
        "Payment successful but order failed.",
    });

    console.log(JSON.stringify(result, null, 2));

    process.exit(0);
  } catch (error) {
    console.error("Test failed:", error.message);
    process.exit(1);
  }
};

testTicketTool();