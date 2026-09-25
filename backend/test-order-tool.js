import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import checkOrderStatus from "./src/tools/orderTool.js";

dotenv.config();

const testOrderTool = async () => {
  try {
    await connectDB();

    console.log("\n--- Valid Order Test ---");

    const validOrder = await checkOrderStatus("45821");

    console.log(JSON.stringify(validOrder, null, 2));

    console.log("\n--- Invalid Order Test ---");

    const invalidOrder = await checkOrderStatus("99999");

    console.log(JSON.stringify(invalidOrder, null, 2));

    process.exit(0);
  } catch (error) {
    console.error("Test failed:", error.message);
    process.exit(1);
  }
};

testOrderTool();