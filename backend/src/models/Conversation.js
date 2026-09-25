import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant", "tool"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    toolName: {
      type: String,
      trim: true,
    },

    toolResult: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const conversationSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },

    messages: {
      type: [messageSchema],
      default: [],
    },

    context: {
      orderId: {
        type: String,
      },

      lastIntent: {
        type: String,
      },

      lastToolUsed: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model(
  "Conversation",
  conversationSchema
);

export default Conversation;