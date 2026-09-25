import express from "express";
import getOrderById from "../controllers/orderController.js";

const router = express.Router();

router.get("/:id", getOrderById);

export default router;