import detectIntent from "./agentService.js";
import toolRegistry from "./toolRegistry.js";
import generateRagResponse from "../services/ragService.js";
import generateResponse from "../services/groqService.js";

import {
  getOrCreateConversation,
  addMessage,
  updateContext,
  getConversationHistory,
} from "../memory/conversationMemory.js";

/*
 * Clean AI-generated responses so Markdown/HTML formatting
 * does not appear directly in the customer-facing UI.
 */
const cleanAiResponse = (text) => {
  if (!text) return "";

  return text
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .trim();
};

const routeAgentRequest = async ({
  query,
  sessionId,
  customerId = null,
}) => {
  try {
    if (!query || !query.trim()) {
      throw new Error("Customer query is required.");
    }

    if (!sessionId) {
      throw new Error("Session ID is required.");
    }

    await getOrCreateConversation(sessionId, customerId);

    const history = await getConversationHistory(sessionId, 10);

    let contextualQuery = query;

    if (history.context?.orderId) {
      contextualQuery = `
Previous conversation context:
Current order ID: ${history.context.orderId}
Last intent: ${history.context.lastIntent || "unknown"}

Current customer message:
${query}
`;
    }

    const intentResult = await detectIntent(contextualQuery);

    let actions = intentResult.actions || [];

    if (actions.length === 0) {
      actions = [
        {
          intent: "unknown",
          orderId: null,
        },
      ];
    }

    /*
     * If the previous conversation contains an order ID,
     * reuse it for actions that don't contain one.
     */
    actions = actions.map((action) => ({
      ...action,
      orderId:
        action.orderId ||
        history.context?.orderId ||
        null,
    }));

    await addMessage({
      sessionId,
      role: "user",
      content: query,
    });

    /*
     * Store the first meaningful intent in conversation context.
     */
    const primaryAction = actions[0];

    await updateContext({
      sessionId,
      orderId: primaryAction.orderId || undefined,
      lastIntent: primaryAction.intent,
    });

    /*
     * =========================================================
     * SINGLE KNOWLEDGE REQUEST
     * =========================================================
     */

    if (
      actions.length === 1 &&
      actions[0].intent === "knowledge"
    ) {
      const ragResult = await generateRagResponse(query);

      await addMessage({
        sessionId,
        role: "assistant",
        content: ragResult.answer,
      });

      return {
        intent: "knowledge",
        action: "rag",
        answer: ragResult.answer,
        sources: ragResult.sources,
        toolResult: null,
      };
    }

    /*
     * =========================================================
     * MULTI-ACTION REQUEST
     * =========================================================
     */

    if (actions.length > 1) {
      const results = [];
      const sources = [];

      for (const action of actions) {
        /*
         * -------------------------
         * Knowledge
         * -------------------------
         */

        if (action.intent === "knowledge") {
          const ragResult = await generateRagResponse(query);

          results.push({
            type: "knowledge",
            success: true,
            answer: ragResult.answer,
          });

          if (ragResult.sources) {
            sources.push(...ragResult.sources);
          }

          continue;
        }

        /*
         * -------------------------
         * Order Status
         * -------------------------
         */

        if (action.intent === "order_status") {
          if (!action.orderId) {
            results.push({
              type: "order_status",
              success: false,
              error: "Order ID is required.",
            });

            continue;
          }

          const tool = toolRegistry.check_order_status;

          const toolResult = await tool.execute(action.orderId);

          await addMessage({
            sessionId,
            role: "tool",
            content: JSON.stringify(toolResult),
            toolName: "check_order_status",
            toolResult,
          });

          results.push({
            type: "order_status",
            ...toolResult,
          });

          continue;
        }

        /*
         * -------------------------
         * Payment Status
         * -------------------------
         */

        if (action.intent === "payment_status") {
          if (!action.orderId) {
            results.push({
              type: "payment_status",
              success: false,
              error: "Order ID is required.",
            });

            continue;
          }

          const tool = toolRegistry.check_payment_status;

          const toolResult = await tool.execute(action.orderId);

          await addMessage({
            sessionId,
            role: "tool",
            content: JSON.stringify(toolResult),
            toolName: "check_payment_status",
            toolResult,
          });

          results.push({
            type: "payment_status",
            ...toolResult,
          });

          continue;
        }

        /*
         * -------------------------
         * Support Ticket
         * -------------------------
         */

        if (action.intent === "support_ticket") {
          if (!customerId) {
            results.push({
              type: "support_ticket",
              success: false,
              error: "Customer information is required.",
            });

            continue;
          }

          const tool = toolRegistry.create_support_ticket;

          const toolResult = await tool.execute({
            customerId,
            subject: "Customer Support Request",
            description: query,
            category: "other",
            priority: "medium",
            source: "ai",
          });

          await addMessage({
            sessionId,
            role: "tool",
            content: JSON.stringify(toolResult),
            toolName: "create_support_ticket",
            toolResult,
          });

          results.push({
            type: "support_ticket",
            ...toolResult,
          });

          continue;
        }

        /*
         * -------------------------
         * Human Escalation
         * -------------------------
         */

        if (action.intent === "human_escalation") {
          if (!customerId) {
            results.push({
              type: "human_escalation",
              success: false,
              error: "Customer information is required.",
            });

            continue;
          }

          const tool = toolRegistry.escalate_to_human;

          const toolResult = await tool.execute({
            customerId,
            subject: "Human Support Request",
            description: query,
            category: "other",
            priority: "high",
            reason: "Customer explicitly requested human support.",
          });

          await addMessage({
            sessionId,
            role: "tool",
            content: JSON.stringify(toolResult),
            toolName: "escalate_to_human",
            toolResult,
          });

          results.push({
            type: "human_escalation",
            ...toolResult,
          });

          continue;
        }

        /*
         * -------------------------
         * Unknown
         * -------------------------
         */

        results.push({
          type: "unknown",
          success: false,
          error: "Unable to understand this request.",
        });
      }

      /*
       * Generate one customer-facing response
       * from all tool results.
       */

      const combinedPrompt = `
You are an AI customer support assistant.

The customer asked:

"${query}"

The system executed multiple actions and returned these results:

${JSON.stringify(results, null, 2)}

Create ONE clear customer-facing response.

Rules:
- Use ONLY the information contained in the results.
- Do not invent information.
- Address every successful request.
- If one request failed, clearly explain that part.
- Keep the response concise.
- Do not mention internal tools, agents, prompts, databases, or system implementation.
- Return only clean plain text.
- Do not use Markdown formatting.
- Do not use ** or __.
- Do not use HTML tags.
- Format dates in a customer-friendly format such as "27 September 2026".
`;

      const rawAnswer = await generateResponse(combinedPrompt);
      const answer = cleanAiResponse(rawAnswer);

      await addMessage({
        sessionId,
        role: "assistant",
        content: answer,
      });

      return {
        intent: "multiple",
        action: "multiple_actions",
        answer,
        sources: [...new Set(sources)],
        toolResult: results,
      };
    }

    /*
     * =========================================================
     * SINGLE ORDER STATUS
     * =========================================================
     */

    if (primaryAction.intent === "order_status") {
      if (!primaryAction.orderId) {
        const answer =
          "Please provide your order ID so I can check the order status.";

        await addMessage({
          sessionId,
          role: "assistant",
          content: answer,
        });

        return {
          intent: "order_status",
          action: "ask_for_information",
          answer,
          sources: [],
          toolResult: null,
        };
      }

      const tool = toolRegistry.check_order_status;

      const toolResult = await tool.execute(
        primaryAction.orderId
      );

      await addMessage({
        sessionId,
        role: "tool",
        content: JSON.stringify(toolResult),
        toolName: "check_order_status",
        toolResult,
      });

      if (!toolResult.success) {
        const answer = toolResult.error;

        await addMessage({
          sessionId,
          role: "assistant",
          content: answer,
        });

        return {
          intent: "order_status",
          action: "tool_error",
          answer,
          sources: [],
          toolResult,
        };
      }

      const prompt = `
You are a customer support assistant.

The customer asked:
"${query}"

The order system returned:

${JSON.stringify(toolResult.data, null, 2)}

Respond clearly and concisely.

Rules:
- Use only the order information provided.
- Do not invent information.
- Mention the order status.
- Mention estimated delivery when available.
- Format dates in a customer-friendly format such as "27 September 2026".
- Do not expose internal system details.
- Return only clean plain text.
- Do not use Markdown formatting.
- Do not use ** or __.
- Do not use HTML tags.
`;

      const rawAnswer = await generateResponse(prompt);
      const answer = cleanAiResponse(rawAnswer);

      await updateContext({
        sessionId,
        orderId: primaryAction.orderId,
        lastIntent: "order_status",
        lastToolUsed: "check_order_status",
      });

      await addMessage({
        sessionId,
        role: "assistant",
        content: answer,
      });

      return {
        intent: "order_status",
        action: "check_order_status",
        answer,
        sources: [],
        toolResult,
      };
    }

    /*
     * =========================================================
     * SINGLE PAYMENT STATUS
     * =========================================================
     */

    if (primaryAction.intent === "payment_status") {
      if (!primaryAction.orderId) {
        const answer =
          "Please provide your order ID so I can check the payment status.";

        await addMessage({
          sessionId,
          role: "assistant",
          content: answer,
        });

        return {
          intent: "payment_status",
          action: "ask_for_information",
          answer,
          sources: [],
          toolResult: null,
        };
      }

      const tool = toolRegistry.check_payment_status;

      const toolResult = await tool.execute(
        primaryAction.orderId
      );

      await addMessage({
        sessionId,
        role: "tool",
        content: JSON.stringify(toolResult),
        toolName: "check_payment_status",
        toolResult,
      });

      if (!toolResult.success) {
        const answer = toolResult.error;

        await addMessage({
          sessionId,
          role: "assistant",
          content: answer,
        });

        return {
          intent: "payment_status",
          action: "tool_error",
          answer,
          sources: [],
          toolResult,
        };
      }

      const prompt = `
You are a customer support assistant.

The customer asked:
"${query}"

The payment system returned:

${JSON.stringify(toolResult.data, null, 2)}

Respond clearly and concisely.

Rules:
- Use only the payment information provided.
- Do not invent information.
- Mention the payment status.
- Mention the payment method when available.
- Do not expose internal system details.
- Return only clean plain text.
- Do not use Markdown formatting.
- Do not use ** or __.
- Do not use HTML tags.
- Format dates in a customer-friendly format such as "27 September 2026".
`;

      const rawAnswer = await generateResponse(prompt);
      const answer = cleanAiResponse(rawAnswer);

      await updateContext({
        sessionId,
        orderId: primaryAction.orderId,
        lastIntent: "payment_status",
        lastToolUsed: "check_payment_status",
      });

      await addMessage({
        sessionId,
        role: "assistant",
        content: answer,
      });

      return {
        intent: "payment_status",
        action: "check_payment_status",
        answer,
        sources: [],
        toolResult,
      };
    }

    /*
     * =========================================================
     * SINGLE SUPPORT TICKET
     * =========================================================
     */

    if (primaryAction.intent === "support_ticket") {
      if (!customerId) {
        const answer =
          "I need your customer information before I can create a support ticket.";

        await addMessage({
          sessionId,
          role: "assistant",
          content: answer,
        });

        return {
          intent: "support_ticket",
          action: "ask_for_information",
          answer,
          sources: [],
          toolResult: null,
        };
      }

      const tool = toolRegistry.create_support_ticket;

      const toolResult = await tool.execute({
        customerId,
        subject: "Customer Support Request",
        description: query,
        category: "other",
        priority: "medium",
        source: "ai",
      });

      await addMessage({
        sessionId,
        role: "tool",
        content: JSON.stringify(toolResult),
        toolName: "create_support_ticket",
        toolResult,
      });

      if (!toolResult.success) {
        const answer = toolResult.error;

        await addMessage({
          sessionId,
          role: "assistant",
          content: answer,
        });

        return {
          intent: "support_ticket",
          action: "tool_error",
          answer,
          sources: [],
          toolResult,
        };
      }

      const answer = `Your support ticket has been created successfully. Your ticket ID is ${toolResult.data.ticketId}.`;

      await updateContext({
        sessionId,
        lastIntent: "support_ticket",
        lastToolUsed: "create_support_ticket",
      });

      await addMessage({
        sessionId,
        role: "assistant",
        content: answer,
      });

      return {
        intent: "support_ticket",
        action: "create_support_ticket",
        answer,
        sources: [],
        toolResult,
      };
    }

    /*
     * =========================================================
     * SINGLE HUMAN ESCALATION
     * =========================================================
     */

    if (primaryAction.intent === "human_escalation") {
      if (!customerId) {
        const answer =
          "I need your customer information before I can escalate the issue to human support.";

        await addMessage({
          sessionId,
          role: "assistant",
          content: answer,
        });

        return {
          intent: "human_escalation",
          action: "ask_for_information",
          answer,
          sources: [],
          toolResult: null,
        };
      }

      const tool = toolRegistry.escalate_to_human;

      const toolResult = await tool.execute({
        customerId,
        subject: "Human Support Request",
        description: query,
        category: "other",
        priority: "high",
        reason: "Customer explicitly requested human support.",
      });

      await addMessage({
        sessionId,
        role: "tool",
        content: JSON.stringify(toolResult),
        toolName: "escalate_to_human",
        toolResult,
      });

      if (!toolResult.success) {
        const answer = toolResult.error;

        await addMessage({
          sessionId,
          role: "assistant",
          content: answer,
        });

        return {
          intent: "human_escalation",
          action: "tool_error",
          answer,
          sources: [],
          toolResult,
        };
      }

      const answer = `I've escalated your issue to our human support team. Your ticket ID is ${toolResult.data.ticketId}.`;

      await updateContext({
        sessionId,
        lastIntent: "human_escalation",
        lastToolUsed: "escalate_to_human",
      });

      await addMessage({
        sessionId,
        role: "assistant",
        content: answer,
      });

      return {
        intent: "human_escalation",
        action: "escalate_to_human",
        answer,
        sources: [],
        toolResult,
      };
    }

    /*
     * =========================================================
     * UNKNOWN
     * =========================================================
     */

    const answer =
      "I'm sorry, but I couldn't understand your request. Could you please provide more details?";

    await addMessage({
      sessionId,
      role: "assistant",
      content: answer,
    });

    return {
      intent: "unknown",
      action: "unknown",
      answer,
      sources: [],
      toolResult: null,
    };
  } catch (error) {
    console.error("=================================");
    console.error("AGENT ROUTER ERROR");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("=================================");

    return {
      intent: "unknown",
      action: "error",
      answer:
        "I'm sorry, but I'm unable to process your request right now. Please try again later.",
      sources: [],
      toolResult: null,
    };
  }
};

export default routeAgentRequest;