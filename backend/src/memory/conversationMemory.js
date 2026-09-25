import Conversation from "../models/Conversation.js";

const getOrCreateConversation = async (sessionId, customerId = null) => {
  try {
    if (!sessionId) {
      throw new Error("Session ID is required.");
    }

    let conversation = await Conversation.findOne({ sessionId });

    if (!conversation) {
      conversation = await Conversation.create({
        sessionId,
        customerId,
        messages: [],
        context: {
          orderId: null,
          lastIntent: null,
          lastToolUsed: null,
        },
      });
    } else if (customerId && !conversation.customerId) {
      conversation.customerId = customerId;
      await conversation.save();
    }

    return conversation;
  } catch (error) {
    console.error("Get conversation error:", error.message);
    throw new Error("Failed to load conversation.");
  }
};

const addMessage = async ({
  sessionId,
  role,
  content,
  toolName = null,
  toolResult = null,
}) => {
  try {
    if (!sessionId || !role || !content) {
      throw new Error("Session ID, role, and content are required.");
    }

    const conversation = await Conversation.findOne({ sessionId });

    if (!conversation) {
      throw new Error("Conversation not found.");
    }

    conversation.messages.push({
      role,
      content,
      toolName,
      toolResult,
    });

    await conversation.save();

    return conversation;
  } catch (error) {
    console.error("Add message error:", error.message);
    throw new Error("Failed to save conversation message.");
  }
};

const updateContext = async ({
  sessionId,
  orderId = undefined,
  lastIntent = undefined,
  lastToolUsed = undefined,
}) => {
  try {
    const conversation = await Conversation.findOne({ sessionId });

    if (!conversation) {
      throw new Error("Conversation not found.");
    }

    if (orderId !== undefined) {
      conversation.context.orderId = orderId;
    }

    if (lastIntent !== undefined) {
      conversation.context.lastIntent = lastIntent;
    }

    if (lastToolUsed !== undefined) {
      conversation.context.lastToolUsed = lastToolUsed;
    }

    await conversation.save();

    return conversation.context;
  } catch (error) {
    console.error("Update context error:", error.message);
    throw new Error("Failed to update conversation context.");
  }
};

const getConversationHistory = async (sessionId, limit = 10) => {
  try {
    const conversation = await Conversation.findOne({ sessionId });

    if (!conversation) {
      return {
        messages: [],
        context: {},
      };
    }

    const messages = conversation.messages
      .slice(-limit)
      .map((message) => ({
        role: message.role,
        content: message.content,
        toolName: message.toolName || null,
      }));

    return {
      messages,
      context: conversation.context || {},
    };
  } catch (error) {
    console.error("Conversation history error:", error.message);
    throw new Error("Failed to retrieve conversation history.");
  }
};

export {
  getOrCreateConversation,
  addMessage,
  updateContext,
  getConversationHistory,
};