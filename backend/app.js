import express from "express";
import cors from "cors";

import chatRoutes from "./src/routes/chatRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import ticketRoutes from "./src/routes/ticketRoutes.js";
import escalateRoutes from "./src/routes/escalateRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/escalate", escalateRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "AI Customer Support API is running",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
  });
});

export default app;