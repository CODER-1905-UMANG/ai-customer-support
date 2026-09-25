import Ticket from "../models/Ticket.js";
import Customer from "../models/Customer.js";

const createSupportTicket = async ({
  customerId,
  subject,
  description,
  category = "other",
  priority = "medium",
  source = "ai",
  escalationReason,
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
      source,
      escalationReason,
    });

    return {
      success: true,
      data: {
        ticketId: ticket.ticketId,
        customer: customer.name,
        subject: ticket.subject,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        createdAt: ticket.createdAt,
      },
    };
  } catch (error) {
    console.error("createSupportTicket error:", error.message);

    return {
      success: false,
      error: "Unable to create support ticket at the moment.",
    };
  }
};

export default createSupportTicket;