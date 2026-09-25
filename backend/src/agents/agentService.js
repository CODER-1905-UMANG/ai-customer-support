import generateResponse from "../services/groqService.js";

const detectIntent = async (query) => {
  try {
    if (!query || !query.trim()) {
      throw new Error("Query is required.");
    }

    const prompt = `
You are an intent classification agent for a customer support system.

A customer message may contain ONE or MULTIPLE requests.

Identify ALL applicable actions from these intents:

- knowledge
- order_status
- payment_status
- support_ticket
- human_escalation
- unknown

Definitions:

knowledge:
Questions about company policies, FAQs, products, shipping, refunds,
cancellation, accounts, or other information available in the knowledge base.

order_status:
Questions asking about an order's status, delivery, or estimated delivery.

payment_status:
Questions about payment status, payment failure, payment confirmation,
transaction, or whether money was deducted.

support_ticket:
The customer wants to report an issue or create a support request,
but does not explicitly ask for human support.

human_escalation:
The customer explicitly asks to speak to a human/agent or requests
human assistance.

unknown:
The request does not clearly fit any of the categories.

IMPORTANT RULES:

1. Return EVERY applicable intent.
2. If the customer asks about both order status AND payment status,
   return BOTH actions.
3. If the same order ID applies to multiple actions, use that order ID
   for each action.
4. Do not invent an order ID.
5. If no clear intent exists, return one "unknown" action.
6. Do not include duplicate actions.
7. Return ONLY valid JSON.

Customer message:
${query}

Return JSON in exactly this format:

{
  "actions": [
    {
      "intent": "order_status",
      "orderId": "45821"
    },
    {
      "intent": "payment_status",
      "orderId": "45821"
    }
  ]
}

If there is only one request:

{
  "actions": [
    {
      "intent": "order_status",
      "orderId": "45821"
    }
  ]
}
`;

    const response = await generateResponse(prompt);

    const cleanedResponse = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleanedResponse);

    const validIntents = [
      "knowledge",
      "order_status",
      "payment_status",
      "support_ticket",
      "human_escalation",
      "unknown",
    ];

    if (!Array.isArray(parsed.actions) || parsed.actions.length === 0) {
      throw new Error("Invalid actions returned by AI.");
    }

    const actions = parsed.actions
      .filter((action) => validIntents.includes(action.intent))
      .map((action) => ({
        intent: action.intent,
        orderId: action.orderId || null,
      }));

    if (actions.length === 0) {
      throw new Error("No valid actions returned by AI.");
    }

    // Remove duplicate intent + order combinations
    const uniqueActions = [];

    for (const action of actions) {
      const exists = uniqueActions.some(
        (existing) =>
          existing.intent === action.intent &&
          existing.orderId === action.orderId
      );

      if (!exists) {
        uniqueActions.push(action);
      }
    }

    return {
      actions: uniqueActions,
    };
  } catch (error) {
    console.error("Intent detection error:", error.message);

    return {
      actions: [
        {
          intent: "unknown",
          orderId: null,
        },
      ],
    };
  }
};

export default detectIntent;