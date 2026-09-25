import express from "express";
import getPaymentById from "../controllers/paymentController.js";

const router = express.Router();

router.get("/:id", getPaymentById);

export default router;