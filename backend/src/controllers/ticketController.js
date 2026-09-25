import Ticket from "../models/Ticket.js";
import Customer from "../models/Customer.js";

const createTicket = async (req, res) => {
  try {
    const {
      customerId,
      subject,
      description,
      category = "other",
      priority = "medium",
      source = "customer",
      escalationReason,
    } = req.body;

    // Validate required fields
    if (!customerId) {
      return res.status(400).json({
        success: false,
        error: "Customer ID is required.",
      });
    }

    if (!subject || !subject.trim()) {
      return res.status(400).json({
        success: false,
        error: "Subject is required.",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        error: "Description is required.",
      });
    }

    // Verify customer exists
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: "Customer not found.",
      });
    }

    // Create ticket
    const ticket = await Ticket.create({
      ticketId: `TKT${Date.now()}`,
      customerId,
      subject: subject.trim(),
      description: description.trim(),
      category,
      priority,
      source,
      escalationReason: escalationReason || undefined,
    });

    return res.status(201).json({
      success: true,
      data: {
        ticketId: ticket.ticketId,
        customer: customer.name,
        subject: ticket.subject,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        source: ticket.source,
        escalationReason: ticket.escalationReason || null,
        createdAt: ticket.createdAt,
      },
    });
  } catch (error) {
    console.error("Create ticket error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Unable to create support ticket.",
    });
  }
};

const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !id.trim()) {
      return res.status(400).json({
        success: false,
        error: "Ticket ID is required.",
      });
    }

    const ticket = await Ticket.findOne({ ticketId: id }).populate(
      "customerId",
      "name email phone"
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: `Ticket ${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ticketId: ticket.ticketId,
        customer: ticket.customerId
          ? {
              name: ticket.customerId.name,
              email: ticket.customerId.email,
              phone: ticket.customerId.phone,
            }
          : null,
        subject: ticket.subject,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        source: ticket.source,
        escalationReason: ticket.escalationReason || null,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get ticket error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Unable to retrieve ticket.",
    });
  }
};

const escalateTicket = async (req, res) => {
  try {
    const {
      customerId,
      subject,
      description,
      category = "other",
      reason = "Issue requires human support.",
    } = req.body;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        error: "Customer ID is required.",
      });
    }

    if (!subject || !subject.trim()) {
      return res.status(400).json({
        success: false,
        error: "Subject is required.",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        error: "Description is required.",
      });
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: "Customer not found.",
      });
    }

    const ticket = await Ticket.create({
      ticketId: `TKT${Date.now()}`,
      customerId,
      subject: subject.trim(),
      description: description.trim(),
      category,
      priority: "high",
      status: "open",
      source: "support_agent",
      escalationReason: reason,
    });

    return res.status(201).json({
      success: true,
      data: {
        ticketId: ticket.ticketId,
        customer: customer.name,
        subject: ticket.subject,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        escalationReason: ticket.escalationReason,
        message: "Your issue has been escalated to our human support team.",
        createdAt: ticket.createdAt,
      },
    });
  } catch (error) {
    console.error("Escalate ticket error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Unable to escalate the issue.",
    });
  }
};

export {
  createTicket,
  getTicketById,
  escalateTicket,
};