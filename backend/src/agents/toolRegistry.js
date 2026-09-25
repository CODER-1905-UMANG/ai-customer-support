import checkOrderStatus from "../tools/orderTool.js";
import checkPaymentStatus from "../tools/paymentTool.js";
import createSupportTicket from "../tools/ticketTool.js";
import escalateToHuman from "../tools/escalationTool.js";

const toolRegistry = {
  check_order_status: {
    description:
      "Check the current status, product, amount, and estimated delivery of a customer order.",
    execute: checkOrderStatus,
  },

  check_payment_status: {
    description:
      "Check the payment status, payment method, transaction ID, and amount for a customer order.",
    execute: checkPaymentStatus,
  },

  create_support_ticket: {
    description:
      "Create a support ticket when the customer's issue requires support assistance.",
    execute: createSupportTicket,
  },

  escalate_to_human: {
    description:
      "Escalate a complex or unresolved customer issue to human support by creating an escalation ticket.",
    execute: escalateToHuman,
  },
};

export default toolRegistry;