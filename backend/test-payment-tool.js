import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import checkPaymentStatus from "./src/tools/paymentTool.js";

dotenv.config();

const testPaymentTool = async () => {
  try {
    await connectDB();

    console.log("\n--- Valid Payment Test ---");

    const validPayment = await checkPaymentStatus("45821");

    console.log(JSON.stringify(validPayment, null, 2));

    console.log("\n--- Invalid Order Test ---");

    const invalidPayment = await checkPaymentStatus("99999");

    console.log(JSON.stringify(invalidPayment, null, 2));

    process.exit(0);
  } catch (error) {
    console.error("Test failed:", error.message);
    process.exit(1);
  }
};

testPaymentTool();