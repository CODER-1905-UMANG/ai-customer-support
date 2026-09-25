import routeAgentRequest from "../agents/agentRouter.js";

const chat = async (req, res) => {
  try {
    const { sessionId, customerId, message } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: "Session ID is required.",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "Message is required.",
      });
    }

    const result = await routeAgentRequest({
      query: message,
      sessionId,
      customerId: customerId || null,
    });

    return res.status(200).json({
      success: true,
      data: {
        sessionId,
        message: result.answer,
        intent: result.intent,
        action: result.action,
        sources: result.sources || [],
        toolResult: result.toolResult || null,
      },
    });
  } catch (error) {
    console.error("Chat controller error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Unable to process your request.",
    });
  }
};

export default chat;