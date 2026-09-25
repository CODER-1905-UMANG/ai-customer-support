import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

/*
 * Mock the local embedding model for Jest.
 *
 * The real Hugging Face embedding model is used by the application.
 * We mock it here because Jest's VM environment causes a
 * Float32Array runtime issue with the Transformers model.
 *
 * The mocked vector still has 384 dimensions, matching
 * all-MiniLM-L6-v2.
 */
jest.unstable_mockModule("../src/rag/embeddings.js", () => ({
  default: async () => new Array(384).fill(0.01),
}));

const { default: app } = await import("../app.js");
const { default: connectDB } = await import("../src/config/db.js");

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("AI Customer Support API", () => {
  // ---------------------------------------------------------
  // HEALTH
  // ---------------------------------------------------------

  test("GET /health should return healthy status", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("healthy");
  });

  // ---------------------------------------------------------
  // ORDER API
  // ---------------------------------------------------------

  test("GET /api/orders/45821 should return order details", async () => {
    const response = await request(app).get("/api/orders/45821");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.orderId).toBe("45821");
  });

  // ---------------------------------------------------------
  // PAYMENT API
  // ---------------------------------------------------------

  test("GET /api/payments/45821 should return payment details", async () => {
    const response = await request(app).get("/api/payments/45821");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.orderId).toBe("45821");
  });

  // ---------------------------------------------------------
  // INVALID ORDER
  // ---------------------------------------------------------

  test("GET /api/orders/99999 should return 404", async () => {
    const response = await request(app).get("/api/orders/99999");

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
  });

  // ---------------------------------------------------------
  // HUMAN ESCALATION
  // ---------------------------------------------------------

  test("POST /api/escalate should create an escalation ticket", async () => {
    const response = await request(app)
      .post("/api/escalate")
      .send({
        customerId: "6ab505cee04af8d903c2696d",
        subject: "Automated test escalation",
        description: "Testing human escalation endpoint.",
        category: "other",
        reason: "Automated API test",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.priority).toBe("high");
    expect(response.body.data.status).toBe("open");
    expect(response.body.data.ticketId).toBeDefined();
  });

  // ---------------------------------------------------------
  // RAG / KNOWLEDGE BASE
  // ---------------------------------------------------------

  test(
    "POST /api/chat should answer a knowledge-base question",
    async () => {
      const response = await request(app)
        .post("/api/chat")
        .send({
          sessionId: `test-faq-${Date.now()}`,
          customerId: "6ab505cee04af8d903c2696d",
          message: "What payment methods do you accept?",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBeDefined();
      expect(response.body.data.intent).toBeDefined();
    },
    30000
  );

  test(
    "POST /api/chat should retrieve refund policy using RAG",
    async () => {
      const response = await request(app)
        .post("/api/chat")
        .send({
          sessionId: `test-refund-${Date.now()}`,
          customerId: "6ab505cee04af8d903c2696d",
          message: "What is your refund policy?",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBeDefined();
    },
    30000
  );

  // ---------------------------------------------------------
  // AI AGENT - ORDER
  // ---------------------------------------------------------

  test(
    "POST /api/chat should check order status",
    async () => {
      const response = await request(app)
        .post("/api/chat")
        .send({
          sessionId: `test-order-${Date.now()}`,
          customerId: "6ab505cee04af8d903c2696d",
          message: "Where is my order 45821?",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.intent).toBe("order_status");
      expect(response.body.data.toolResult).toBeDefined();
      expect(response.body.data.toolResult.data.orderId).toBe("45821");
    },
    30000
  );

  // ---------------------------------------------------------
  // AI AGENT - PAYMENT
  // ---------------------------------------------------------

  test(
    "POST /api/chat should check payment status",
    async () => {
      const response = await request(app)
        .post("/api/chat")
        .send({
          sessionId: `test-payment-${Date.now()}`,
          customerId: "6ab505cee04af8d903c2696d",
          message: "What payment method did I use for order 45821?",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.intent).toBe("payment_status");
      expect(response.body.data.toolResult).toBeDefined();
    },
    30000
  );

  // ---------------------------------------------------------
  // UNKNOWN QUERY
  // ---------------------------------------------------------

  test(
    "POST /api/chat should handle an unknown question",
    async () => {
      const response = await request(app)
        .post("/api/chat")
        .send({
          sessionId: `test-unknown-${Date.now()}`,
          customerId: "6ab505cee04af8d903c2696d",
          message: "What is the population of Mars?",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.intent).toBe("unknown");
    },
    30000
  );

  // ---------------------------------------------------------
  // INVALID ORDER THROUGH AI AGENT
  // ---------------------------------------------------------

  test(
    "POST /api/chat should handle an invalid order ID",
    async () => {
      const response = await request(app)
        .post("/api/chat")
        .send({
          sessionId: `test-invalid-order-${Date.now()}`,
          customerId: "6ab505cee04af8d903c2696d",
          message: "Where is my order 99999?",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      // Current agent preserves the original intent.
      expect(response.body.data.intent).toBe("order_status");
      expect(response.body.data.message).toContain("99999");
    },
    30000
  );

  // ---------------------------------------------------------
  // MULTIPLE TOOL REQUEST
  // ---------------------------------------------------------

  test(
    "POST /api/chat should handle multiple requests in one message",
    async () => {
      const response = await request(app)
        .post("/api/chat")
        .send({
          sessionId: `test-multiple-${Date.now()}`,
          customerId: "6ab505cee04af8d903c2696d",
          message:
            "Where is my order 45821 and what payment method did I use?",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);

      expect(response.body.data.action).toBe("multiple_actions");
      expect(response.body.data.toolResult).toBeDefined();
      expect(response.body.data.toolResult.length).toBeGreaterThanOrEqual(
        2
      );
    },
    30000
  );

  // ---------------------------------------------------------
  // CONVERSATION MEMORY
  // ---------------------------------------------------------

  test(
    "POST /api/chat should remember the previous order ID",
    async () => {
      const sessionId = `test-memory-${Date.now()}`;

      // First message establishes order 45821 in conversation context.
      const firstResponse = await request(app)
        .post("/api/chat")
        .send({
          sessionId,
          customerId: "6ab505cee04af8d903c2696d",
          message: "Where is my order 45821?",
        });

      expect(firstResponse.statusCode).toBe(200);
      expect(firstResponse.body.success).toBe(true);
      expect(firstResponse.body.data.intent).toBe("order_status");

      // Follow-up does not mention the order number.
      const secondResponse = await request(app)
        .post("/api/chat")
        .send({
          sessionId,
          customerId: "6ab505cee04af8d903c2696d",
          message: "When will it arrive?",
        });

      expect(secondResponse.statusCode).toBe(200);
      expect(secondResponse.body.success).toBe(true);
      expect(secondResponse.body.data.intent).toBe("order_status");
      expect(secondResponse.body.data.toolResult).toBeDefined();
      expect(secondResponse.body.data.toolResult.data.orderId).toBe(
        "45821"
      );
    },
    30000
  );
});