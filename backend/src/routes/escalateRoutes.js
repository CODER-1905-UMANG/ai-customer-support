import express from "express";
import { escalateTicket } from "../controllers/ticketController.js";

const router = express.Router();

router.post("/", escalateTicket);

export default router;