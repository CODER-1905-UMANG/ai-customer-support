import dotenv from "dotenv";
import connectDB from "./src/config/db.js";

import Customer from "./src/models/Customer.js";
import Order from "./src/models/Order.js";
import Payment from "./src/models/Payment.js";
import Ticket from "./src/models/Ticket.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Customer.deleteMany({});
    await Order.deleteMany({});
    await Payment.deleteMany({});
    await Ticket.deleteMany({});

    // -------------------------
    // CUSTOMERS
    // -------------------------

    const customers = await Customer.insertMany([
      {
        name: "Rahul Sharma",
        email: "rahul@example.com",
        phone: "9876543210",
      },
      {
        name: "Priya Verma",
        email: "priya@example.com",
        phone: "9876543211",
      },
      {
        name: "Aman Singh",
        email: "aman@example.com",
        phone: "9876543212",
      },
    ]);

    console.log("Customers created");

    // -------------------------
    // ORDERS
    // -------------------------

    const orders = await Order.insertMany([
      {
        orderId: "45821",
        customerId: customers[0]._id,
        product: "Wireless Headphones",
        amount: 2499,
        status: "shipped",
        estimatedDelivery: new Date("2026-09-27"),
        deliveryAddress: "Delhi, India",
      },
      {
        orderId: "45822",
        customerId: customers[0]._id,
        product: "Mechanical Keyboard",
        amount: 3499,
        status: "processing",
        estimatedDelivery: new Date("2026-09-29"),
        deliveryAddress: "Delhi, India",
      },
      {
        orderId: "45823",
        customerId: customers[1]._id,
        product: "Smart Watch",
        amount: 5999,
        status: "delivered",
        estimatedDelivery: new Date("2026-09-22"),
        deliveryAddress: "Noida, India",
      },
      {
        orderId: "45824",
        customerId: customers[2]._id,
        product: "Bluetooth Speaker",
        amount: 1999,
        status: "failed",
        deliveryAddress: "Gurgaon, India",
      },
    ]);

    console.log("Orders created");

    // -------------------------
    // PAYMENTS
    // -------------------------

    await Payment.insertMany([
      {
        paymentId: "PAY10001",
        orderId: orders[0]._id,
        customerId: customers[0]._id,
        amount: 2499,
        status: "successful",
        paymentMethod: "upi",
        transactionId: "TXN10001",
        paidAt: new Date(),
      },
      {
        paymentId: "PAY10002",
        orderId: orders[1]._id,
        customerId: customers[0]._id,
        amount: 3499,
        status: "successful",
        paymentMethod: "credit_card",
        transactionId: "TXN10002",
        paidAt: new Date(),
      },
      {
        paymentId: "PAY10003",
        orderId: orders[2]._id,
        customerId: customers[1]._id,
        amount: 5999,
        status: "successful",
        paymentMethod: "debit_card",
        transactionId: "TXN10003",
        paidAt: new Date(),
      },
      {
        paymentId: "PAY10004",
        orderId: orders[3]._id,
        customerId: customers[2]._id,
        amount: 1999,
        status: "successful",
        paymentMethod: "upi",
        transactionId: "TXN10004",
        paidAt: new Date(),
      },
    ]);

    console.log("Payments created");

    // -------------------------
    // SUPPORT TICKETS
    // -------------------------

    await Ticket.insertMany([
      {
        ticketId: "TKT10001",
        customerId: customers[1]._id,
        subject: "Refund request",
        description: "Customer wants a refund for a delivered product.",
        category: "refund",
        priority: "medium",
        status: "open",
        source: "customer",
      },
      {
        ticketId: "TKT10002",
        customerId: customers[2]._id,
        subject: "Payment deducted but order failed",
        description:
          "Payment was successful but the order failed to process.",
        category: "payment",
        priority: "high",
        status: "open",
        source: "ai",
        escalationReason: "Payment successful but order failed.",
      },
    ]);

    console.log("Tickets created");

    console.log("\nDatabase seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();