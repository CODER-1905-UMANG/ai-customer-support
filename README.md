# AI Customer Support & Ticket Automation System

An AI-powered customer support system that combines **RAG, AI agents, tool calling, conversation memory, and automated ticket management** to handle customer queries and support workflows.

The system can answer company-specific questions from a knowledge base, check order and payment information, create support tickets, maintain conversation context, and escalate complex issues to human support.

---

## 1. Overview

Traditional customer support systems often require users to navigate multiple pages or wait for a support agent.

This project provides an AI-powered support assistant that can:

- Understand customer questions
- Search company knowledge using RAG
- Retrieve order information
- Retrieve payment information
- Create support tickets
- Escalate issues to human support
- Maintain conversation context
- Handle multiple requests in a single message
- Provide source information for knowledge-based answers
- Handle invalid inputs and service failures gracefully

The system is designed as an **AI support automation platform**, rather than a simple LLM chatbot.

---

## 2. Problem Statement

Customer support systems commonly face the following challenges:

- Repetitive support questions
- Slow access to company policies
- Manual order and payment verification
- Difficulty maintaining context across messages
- High workload for human support teams
- Lack of automated ticket creation
- Difficulty handling complex or unresolved issues

This project addresses these problems by combining an AI assistant with company knowledge, application tools, conversation memory, and ticket automation.

---

## 3. Objectives

The main objectives are:

1. Build an AI-powered customer support assistant.
2. Implement Retrieval-Augmented Generation (RAG).
3. Store and retrieve company knowledge using embeddings.
4. Implement an AI agent capable of selecting appropriate actions.
5. Implement tool calling for real application operations.
6. Maintain conversation memory.
7. Automate support ticket creation.
8. Support human escalation.
9. Provide backend APIs for support operations.
10. Implement error handling and automated testing.

---

## 4. Features

### AI Support Assistant

The assistant can understand different types of customer requests and route them to the appropriate workflow.

### Knowledge Base Search

Company-specific questions are answered using the internal knowledge base through RAG.

### RAG Pipeline

The system processes knowledge documents, creates chunks, generates embeddings, stores them in MongoDB Atlas Vector Search, retrieves relevant chunks, and provides the retrieved context to the LLM.

### AI Agent

The agent determines whether the request requires:

- Knowledge search
- Order status lookup
- Payment status lookup
- Support ticket creation
- Human escalation
- Direct handling of unknown requests

### Tool Calling

The system currently provides four functional tools:

1. Order status
2. Payment status
3. Support ticket creation
4. Human escalation

### Conversation Memory

The system stores conversation history and context.

For example:

```text
User: Where is my order 45821?

Assistant: Your order 45821 has been shipped...

User: When will it arrive?

Assistant: Your order 45821 is expected to arrive...
```

The second message does not repeat the order number. The system uses the stored conversation context.

### Multiple Requests

The agent can handle multiple requests in a single message.

Example:

```text
Where is my order 45821 and what payment method did I use?
```

The system can execute both the order and payment tools and combine their results.

### Human Escalation

Customers can request human support, and appropriate unresolved issues can be escalated by creating a high-priority support ticket.

### Ticket Automation

Support tickets contain information such as:

- Ticket ID
- Customer
- Subject
- Description
- Category
- Priority
- Status
- Source
- Escalation reason

---

# 5. Technology Stack

## Frontend

- React
- Vite
- JavaScript
- CSS / Inline styling

## Backend

- Node.js
- Express.js
- ES Modules

## Database

- MongoDB Atlas
- Mongoose

## AI / LLM

- Groq
- `openai/gpt-oss-20b`

## Embeddings

- Hugging Face Transformers
- `Xenova/all-MiniLM-L6-v2`
- 384-dimensional embeddings

## Vector Search

- MongoDB Atlas Vector Search
- Cosine similarity

## Testing

- Jest
- Supertest

## Development Tools

- Git
- GitHub
- Postman
- VS Code
- npm

---

# 6. System Architecture

```text
                         ┌─────────────────────┐
                         │      Customer       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   React Frontend   │
                         └──────────┬──────────┘
                                    │
                              HTTP / JSON
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Express.js Backend  │
                         │      API Layer      │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    AI Agent         │
                         │   Agent Router      │
                         └──────┬──────┬───────┘
                                │      │
              ┌─────────────────┘      └─────────────────┐
              │                                          │
              ▼                                          ▼
   ┌─────────────────────┐                    ┌─────────────────────┐
   │       RAG           │                    │       Tools         │
   │                     │                    │                     │
   │ Query Embedding     │                    │ Order Status        │
   │ Vector Search       │                    │ Payment Status      │
   │ Context Retrieval   │                    │ Ticket Creation     │
   │ LLM Generation      │                    │ Human Escalation    │
   └──────────┬──────────┘                    └──────────┬──────────┘
              │                                          │
              ▼                                          ▼
   ┌─────────────────────┐                    ┌─────────────────────┐
   │ MongoDB Atlas       │                    │ MongoDB Atlas       │
   │ Vector Search       │                    │ Application Data    │
   │                     │                    │                     │
   │ Knowledge Chunks    │                    │ Customers           │
   │ Embeddings          │                    │ Orders              │
   └─────────────────────┘                    │ Payments            │
                                              │ Tickets             │
                                              │ Conversations       │
                                              └─────────────────────┘

                         ┌─────────────────────┐
                         │       Groq LLM      │
                         │   gpt-oss-20b       │
                         └─────────────────────┘
```

---

# 7. Project Structure

```text
ai-customer-support/
│
├── backend/
│   ├── src/
│   │   ├── agents/
│   │   │   ├── agentService.js
│   │   │   └── agentRouter.js
│   │   │
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── chatController.js
│   │   │   ├── orderController.js
│   │   │   ├── paymentController.js
│   │   │   └── ticketController.js
│   │   │
│   │   ├── memory/
│   │   │   └── conversationMemory.js
│   │   │
│   │   ├── models/
│   │   │   ├── Customer.js
│   │   │   ├── Order.js
│   │   │   ├── Payment.js
│   │   │   ├── Ticket.js
│   │   │   ├── Conversation.js
│   │   │   └── KnowledgeChunk.js
│   │   │
│   │   ├── rag/
│   │   │   ├── documentLoader.js
│   │   │   ├── chunker.js
│   │   │   ├── embeddings.js
│   │   │   ├── retriever.js
│   │   │   └── contextBuilder.js
│   │   │
│   │   ├── routes/
│   │   │   ├── chatRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   ├── paymentRoutes.js
│   │   │   ├── ticketRoutes.js
│   │   │   └── escalateRoutes.js
│   │   │
│   │   ├── services/
│   │   │   ├── groqService.js
│   │   │   └── ragService.js
│   │   │
│   │   └── tools/
│   │       ├── orderTool.js
│   │       ├── paymentTool.js
│   │       ├── ticketTool.js
│   │       └── escalationTool.js
│   │
│   ├── knowledge_base/
│   │   ├── faq.md
│   │   ├── refund_policy.md
│   │   ├── cancellation_policy.md
│   │   ├── shipping_policy.md
│   │   ├── payment_policy.md
│   │   ├── account_policy.md
│   │   ├── product_information.md
│   │   └── support_guidelines.md
│   │
│   ├── test/
│   │   └── api.test.js
│   │
│   ├── app.js
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   ├── .env
│   └── .env.example
│
├── frontend/
│
├── docs/
│
├── .gitignore
└── README.md
```

---

# 8. Knowledge Base

The system uses company-specific Markdown documents as its knowledge base.

Current documents include:

```text
faq.md
refund_policy.md
cancellation_policy.md
shipping_policy.md
payment_policy.md
account_policy.md
product_information.md
support_guidelines.md
```

The knowledge base contains information about:

- FAQs
- Products
- Refunds
- Cancellations
- Shipping
- Payments
- Accounts
- Support guidelines

---

# 9. RAG Pipeline

The RAG pipeline follows this workflow:

```text
Knowledge Base Documents
          │
          ▼
   Document Loading
          │
          ▼
       Chunking
          │
          ▼
      Embeddings
          │
          ▼
 MongoDB Atlas Vector Search
          │
          │
Customer Query
          │
          ▼
 Query Embedding
          │
          ▼
 Vector Similarity Search
          │
          ▼
 Relevant Knowledge Chunks
          │
          ▼
     Context Builder
          │
          ▼
       Groq LLM
          │
          ▼
 Grounded Customer Answer
```

## Embedding Model

The project uses:

```text
Xenova/all-MiniLM-L6-v2
```

The model produces:

```text
384-dimensional embeddings
```

## Vector Database

MongoDB Atlas Vector Search stores the generated embeddings.

Configuration:

```text
Index: vector_index
Field: embedding
Dimensions: 384
Similarity: cosine
```

## Grounded Generation

The retrieved knowledge is supplied to the LLM as context.

The RAG prompt instructs the model to:

- Use only the provided knowledge
- Avoid inventing information
- Clearly state when information is unavailable
- Provide a concise customer-facing answer

Knowledge-based responses also return relevant source filenames.

---

# 10. AI Agent

The AI agent analyzes the customer's request and determines which action should be performed.

Possible intents include:

```text
knowledge
order_status
payment_status
support_ticket
human_escalation
unknown
```

The agent can also produce multiple actions when a customer asks for multiple pieces of information.

Example:

```text
Where is my order 45821 and what payment method did I use?
```

The agent can identify:

```text
1. order_status
2. payment_status
```

and execute both tools.

---

# 11. Tools

The system implements four functional tools.

## 11.1 Order Status Tool

Checks an order using its business order ID.

Example:

```text
Order: 45821
Status: shipped
```

---

## 11.2 Payment Status Tool

Retrieves payment information associated with an order.

It can return:

- Payment ID
- Amount
- Payment status
- Payment method
- Transaction ID
- Payment date

---

## 11.3 Support Ticket Tool

Creates a support ticket for a customer.

A ticket includes:

```text
Ticket ID
Customer
Subject
Description
Category
Priority
Status
Source
```

---

## 11.4 Human Escalation Tool

Creates a high-priority ticket when an issue requires human support.

The escalation reason is stored with the ticket.

Example endpoint:

```http
POST /api/escalate
```

---

# 12. Conversation Memory

Conversation memory is implemented using MongoDB.

Each conversation contains:

```text
sessionId
customerId
messages
context
```

The context stores information such as:

```text
orderId
lastIntent
lastToolUsed
```

Example:

```text
User:
Where is my order 45821?

System:
Stores orderId = 45821

User:
When will it arrive?

System:
Uses the stored orderId = 45821
```

This allows follow-up questions to reference information from earlier messages.

---

# 13. Ticket Management

Tickets are stored in MongoDB.

Ticket fields include:

```text
ticketId
customerId
subject
description
category
priority
status
source
escalationReason
createdAt
updatedAt
```

Supported categories include:

```text
order
payment
refund
cancellation
delivery
product
account
other
```

Supported priorities include:

```text
low
medium
high
urgent
```

---

# 14. API Endpoints

## Health

```http
GET /health
```

Returns:

```json
{
  "status": "healthy"
}
```

---

## Chat

```http
POST /api/chat
```

Request:

```json
{
  "sessionId": "session-123",
  "customerId": "customer-id",
  "message": "Where is my order 45821?"
}
```

---

## Order

```http
GET /api/orders/:id
```

Example:

```http
GET /api/orders/45821
```

---

## Payment

```http
GET /api/payments/:id
```

Example:

```http
GET /api/payments/45821
```

---

## Create Ticket

```http
POST /api/tickets
```

Example:

```json
{
  "customerId": "customer-id",
  "subject": "Refund request",
  "description": "I want to request a refund.",
  "category": "refund",
  "priority": "medium"
}
```

---

## Get Ticket

```http
GET /api/tickets/:id
```

---

## Human Escalation

```http
POST /api/escalate
```

Example:

```json
{
  "customerId": "customer-id",
  "subject": "Human support request",
  "description": "I want to speak to a human support agent.",
  "category": "other",
  "reason": "Customer explicitly requested human support."
}
```

---

# 15. Error Handling

The backend handles errors such as:

- Missing session ID
- Missing chat message
- Invalid order ID
- Order not found
- Payment not found
- Customer not found
- Missing ticket information
- Tool failures
- Retrieval failures
- Embedding failures
- LLM failures
- Ticket creation failures

The system returns structured API responses such as:

```json
{
  "success": false,
  "error": "Order 99999 not found."
}
```

Internal errors are logged on the backend while customer-facing responses remain controlled.

---

# 16. Testing

The project uses:

```text
Jest
Supertest
```

Run the test suite with:

```bash
cd backend
npm test
```

Current automated test result:

```text
Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
```

The automated tests cover:

1. Health endpoint
2. Order API
3. Payment API
4. Invalid order API
5. Human escalation
6. Knowledge-base question
7. Refund RAG flow
8. AI order-status tool
9. AI payment-status tool
10. Unknown query
11. Invalid order through the AI agent
12. Multiple requests in one message
13. Conversation memory

Additional failure scenarios have also been tested separately, including tool failure and retrieval failure.

---

# 17. Running the Project

## Prerequisites

Install:

- Node.js
- npm
- MongoDB Atlas account
- Groq API key

---

## Backend Setup

Navigate to:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create:

```text
.env
```

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
```

Never commit the real `.env` file.

---

## Seed Database

Run:

```bash
npm run seed
```

This creates sample:

- Customers
- Orders
- Payments
- Tickets

---

## Start Backend

Development:

```bash
npm run dev
```

Production-style:

```bash
npm start
```

Backend runs on:

```text
http://localhost:5000
```

---

## Start Frontend

Navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start Vite:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 18. Environment Variables

The following environment variables are required:

```env
PORT=
MONGODB_URI=
GROQ_API_KEY=
```

API keys and database credentials must never be committed to GitHub.

Use `.env.example` for documenting required variables.

---

# 19. Example Queries

### Knowledge Base

```text
What payment methods do you accept?
```

```text
What is your refund policy?
```

```text
Can I cancel my order after it has been shipped?
```

### Order

```text
Where is my order 45821?
```

### Payment

```text
What payment method did I use for order 45821?
```

### Multiple Requests

```text
Where is my order 45821 and what payment method did I use?
```

### Memory

```text
Where is my order 45821?
```

Follow-up:

```text
When will it arrive?
```

### Human Support

```text
I want to speak to a human support agent.
```

---

# 20. Sample Workflow

A typical order-status request follows this workflow:

```text
Customer
   │
   ▼
React Frontend
   │
   ▼
POST /api/chat
   │
   ▼
Agent Router
   │
   ▼
Agent identifies order_status
   │
   ▼
Order Status Tool
   │
   ▼
MongoDB
   │
   ▼
Order information
   │
   ▼
AI Response
   │
   ▼
Customer
```

A knowledge-based request follows:

```text
Customer
   │
   ▼
POST /api/chat
   │
   ▼
Agent
   │
   ▼
RAG Service
   │
   ▼
Query Embedding
   │
   ▼
MongoDB Vector Search
   │
   ▼
Relevant Knowledge
   │
   ▼
Groq LLM
   │
   ▼
Grounded Answer + Sources
   │
   ▼
Customer
```

---

# 21. Security Considerations

- API keys are stored in environment variables.
- `.env` should not be committed.
- Database credentials should not be exposed to the frontend.
- Backend APIs validate required inputs.
- Customer-facing responses do not expose internal prompts.
- RAG responses are instructed to use retrieved company knowledge rather than inventing unsupported information.

---

# 22. Limitations

Current limitations include:

- The application currently uses seeded sample customer/order/payment data.
- Authentication and authorization are not implemented as a production identity system.
- The human escalation workflow currently creates a support ticket rather than integrating with an external human-agent platform.
- External order/payment providers are not connected.
- The local embedding model requires the model to be available in the runtime environment.
- Production deployment would require additional security, monitoring, rate limiting, and infrastructure configuration.

---

# 23. Future Improvements

Possible future improvements include:

- Customer authentication
- Role-based access control
- Real order-management API integration
- Real payment-provider integration
- External helpdesk integration
- Streaming AI responses
- Better ticket dashboard
- Agent analytics
- Conversation analytics
- Feedback and response evaluation
- More advanced retrieval strategies
- Reranking retrieved documents
- Production monitoring and observability
- Rate limiting
- Automated deployment
- Cloud deployment

---

# 24. Demo Flow

The recommended demonstration flow is:

### 1. Knowledge Base Question

```text
What payment methods do you accept?
```

Show the generated answer and retrieved sources.

### 2. RAG

```text
What is your refund policy?
```

Show the answer and source documents.

### 3. Order Tool

```text
Where is my order 45821?
```

Show that the system retrieves real order data from MongoDB.

### 4. Payment Tool

```text
What payment method did I use for order 45821?
```

### 5. Multiple Tools

```text
Where is my order 45821 and what payment method did I use?
```

Show that multiple actions are executed.

### 6. Memory

```text
Where is my order 45821?
```

Then:

```text
When will it arrive?
```

Show that the second query uses the previous order context.

### 7. Ticket Creation

Ask for support that requires a ticket.

### 8. Human Escalation

```text
I want to speak to a human support agent.
```

Show the generated high-priority ticket.

### 9. Error Scenario

```text
Where is my order 99999?
```

Show the controlled error response.

---

# 25. Project Status

Current implementation includes:

- [x] React frontend
- [x] Express backend
- [x] MongoDB Atlas
- [x] Knowledge base
- [x] Document chunking
- [x] Embedding generation
- [x] MongoDB Vector Search
- [x] RAG pipeline
- [x] Groq LLM integration
- [x] AI agent
- [x] Order tool
- [x] Payment tool
- [x] Ticket creation tool
- [x] Human escalation tool
- [x] Conversation memory
- [x] Multiple-action handling
- [x] Error handling
- [x] API endpoints
- [x] Automated testing
- [x] 13 passing automated tests
- [ ] Architecture diagram image
- [ ] Demo video
- [ ] Final screenshots
- [ ] GitHub publication

---

# 26. Conclusion

This project demonstrates an AI-powered customer support system that combines:

```text
LLM
+
RAG
+
Embeddings
+
Vector Search
+
AI Agent
+
Tool Calling
+
Conversation Memory
+
Ticket Automation
+
Human Escalation
```

The architecture allows the AI assistant to move beyond simple conversational responses and interact with application data and support workflows through backend tools.