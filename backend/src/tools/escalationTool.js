import Ticket from "../models/Ticket.js";
import Customer from "../models/Customer.js";

const escalateToHuman = async ({
  customerId,
  subject,
  description,
  category = "other",
  priority = "high",
  reason,
}) => {
  try {
    if (!customerId) {
      return {
        success: false,
        error: "Customer ID is required.",
      };
    }

    if (!subject || !description) {
      return {
        success: false,
        error: "Subject and description are required.",
      };
    }

    if (!reason) {
      return {
        success: false,
        error: "Escalation reason is required.",
      };
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return {
        success: false,
        error: "Customer not found.",
      };
    }

    const ticketId = `TKT${Date.now()}`;

    const ticket = await Ticket.create({
      ticketId,
      customerId,
      subject,
      description,
      category,
      priority,
      source: "ai",
      status: "open",
      escalationReason: reason,
    });

    return {
      success: true,
      data: {
        ticketId: ticket.ticketId,
        customer: customer.name,
        status: ticket.status,
        priority: ticket.priority,
        escalationReason: ticket.escalationReason,
        message:
          "Your issue has been escalated to our human support team.",
      },
    };
  } catch (error) {
    console.error("escalateToHuman error:", error.message);

    return {
      success: false,
      error: "Unable to escalate the issue at the moment.",
    };
  }
};

export default escalateToHuman;