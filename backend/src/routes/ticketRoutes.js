import express from "express";

import {
  createTicket,
  getTicketById,
  escalateTicket,
} from "../controllers/ticketController.js";

const router = express.Router();

router.post("/", createTicket);
router.post("/escalate", escalateTicket);
router.get("/:id", getTicketById);

export default router;