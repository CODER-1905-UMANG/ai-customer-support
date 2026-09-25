# AI Customer Support & Ticket Automation System

An AI-powered customer support application that combines **RAG,
embeddings, an AI agent, tool calling, conversation memory, ticket
automation, and human escalation** to handle both knowledge-based and
action-based customer requests.

## 1. Project Overview

This project was developed as a 3-week Generative AI project assignment
for DSTARIX TECHNO.

The system is designed to handle common customer-support requests such
as:

-   Order status
-   Payment information
-   Refund and cancellation policies
-   Shipping and product questions
-   Support-ticket creation
-   Human escalation
-   Follow-up questions using conversation context

Unlike a basic LLM chatbot, the application combines **RAG + Agent +
Tools + Memory + APIs + Database + Testing**.

------------------------------------------------------------------------

## 2. Problem Statement

Customer-support teams receive repetitive requests involving orders,
payments, refunds, cancellations, delivery, products, accounts, and
company policies.

The objective is to automate common requests while allowing the AI
system to:

1.  Retrieve reliable company-specific information.
2.  Perform application actions through tools.
3.  Maintain conversation context.
4.  Create support tickets.
5.  Escalate issues that require human intervention.

------------------------------------------------------------------------

## 3. Objectives

-   Build a functional AI customer-support system.
-   Implement Retrieval-Augmented Generation (RAG).
-   Generate and store text embeddings.
-   Use MongoDB Atlas Vector Search for semantic retrieval.
-   Implement an AI agent for intent/action selection.
-   Implement functional tools for order, payment, ticket, and
    escalation workflows.
-   Maintain conversation memory.
-   Provide backend APIs.
-   Handle invalid input and service failures gracefully.
-   Test the required customer-support scenarios.
-   Provide documentation, screenshots, architecture, and demo material.

------------------------------------------------------------------------

## 4. Key Features

### Customer Support

-   Natural-language customer queries.
-   Knowledge-base questions.
-   Order status lookup.
-   Payment status lookup.
-   Support-ticket creation.
-   Human escalation.

### Generative AI

-   Groq LLM integration.
-   AI-based intent/action selection.
-   Grounded RAG responses.
-   Context-aware responses.

### RAG

-   Markdown knowledge-base documents.
-   Document loading.
-   Text chunking with overlap.
-   Hugging Face embeddings.
-   MongoDB Atlas Vector Search.
-   Relevant context retrieval.
-   Source references in responses.

### Agent & Tools

-   AI agent determines the required action.
-   Order-status tool.
-   Payment-status tool.
-   Support-ticket tool.
-   Human-escalation tool.
-   Multiple actions can be processed in a single request.

### Conversation Memory

Conversation history and relevant context are stored in MongoDB.

Example:

``` text
Customer: Where is my order 45821?

Customer: When will it arrive?

System: Understands that "it" refers to order 45821.
```

### Error Handling

The application includes validation and fallback handling for:

-   Invalid input
-   Invalid order IDs
-   Missing information
-   Tool failures
-   LLM/API failures
-   Retrieval failures
-   Empty retrieval results
-   Invalid tool parameters
-   Ticket creation failures

------------------------------------------------------------------------

## 5. Technology Stack

### Frontend

-   React
-   Vite
-   JavaScript
-   CSS / Inline UI styling

### Backend

-   Node.js
-   Express.js
-   REST APIs

### Database

-   MongoDB Atlas
-   Mongoose
-   MongoDB Atlas Vector Search

### Generative AI

-   Groq API
-   `openai/gpt-oss-20b`

### Embeddings

-   Hugging Face Transformers
-   `Xenova/all-MiniLM-L6-v2`
-   384-dimensional embeddings

### Testing

-   Jest
-   Supertest

### Development Tools

-   Git
-   GitHub
-   VS Code
-   Postman

------------------------------------------------------------------------

## 6. System Architecture

``` text
                         ┌─────────────────────┐
                         │      Customer       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    React Frontend   │
                         └──────────┬──────────┘
                                    │ HTTP
                                    ▼
                         ┌─────────────────────┐
                         │   Express Backend   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      AI Agent       │
                         └──────┬─────┬────────┘
                                │     │
                 ┌──────────────┘     └─────────────────┐
                 ▼                                      ▼
       ┌─────────────────────┐                ┌─────────────────────┐
       │    RAG Pipeline     │                │   Application Tools │
       └──────────┬──────────┘                └──────────┬──────────┘
                  │                                      │
                  ▼                                      ▼
       ┌─────────────────────┐                ┌─────────────────────┐
       │ MongoDB Vector      │                │ MongoDB Application │
       │ Search              │                │ Data                │
       └──────────┬──────────┘                └──────────┬──────────┘
                  │                                      │
                  ▼                                      ├── Orders
       ┌─────────────────────┐                           ├── Payments
       │ Knowledge Base      │                           ├── Customers
       │ Markdown Documents  │                           └── Tickets
       └─────────────────────┘

                         ┌─────────────────────┐
                         │     Groq LLM        │
                         └─────────────────────┘

                         ┌─────────────────────┐
                         │ Conversation Memory│
                         │     MongoDB         │
                         └─────────────────────┘
```

Detailed architecture diagram:

`docs/architecture.png`

------------------------------------------------------------------------

## 7. Application Workflow

``` text
Customer Query
      │
      ▼
Express /chat API
      │
      ▼
Conversation Memory
      │
      ▼
AI Agent
      │
      ├── Knowledge Question ──► RAG ──► Vector Search ──► Groq ──► Response
      │
      ├── Order Question ──────► Order Tool ──────────────► Groq ──► Response
      │
      ├── Payment Question ────► Payment Tool ────────────► Groq ──► Response
      │
      ├── Support Request ─────► Ticket Tool ─────────────► Response
      │
      └── Human Request ───────► Escalation Tool ─────────► Ticket
```

------------------------------------------------------------------------

## 8. Knowledge Base

The knowledge base is stored in:

``` text
backend/knowledge_base/
```

It contains:

``` text
faq.md
product_information.md
refund_policy.md
cancellation_policy.md
shipping_policy.md
payment_policy.md
account_policy.md
support_guidelines.md
```

These documents provide company-specific information used by the RAG
pipeline.

------------------------------------------------------------------------

## 9. RAG Architecture

The RAG pipeline follows:

``` text
Company Documents
       │
       ▼
Document Loader
       │
       ▼
Text Chunking
       │
       ▼
Hugging Face Embeddings
       │
       ▼
MongoDB Atlas Vector Search
       │
       ▼
User Query Embedding
       │
       ▼
Similarity Retrieval
       │
       ▼
Relevant Context
       │
       ▼
Groq LLM
       │
       ▼
Grounded Customer Response
```

### Embedding Model

``` text
Xenova/all-MiniLM-L6-v2
```

Embedding dimension:

``` text
384
```

### Vector Search

MongoDB Atlas Vector Search is configured using:

``` text
Index: vector_index
Similarity: cosine
```

The application also returns relevant source document names with RAG
responses.

------------------------------------------------------------------------

## 10. AI Agent Workflow

The agent receives the customer's request and determines which action
should be performed.

Supported intents include:

``` text
knowledge
order_status
payment_status
support_ticket
human_escalation
unknown
```

For example:

``` text
"What is your refund policy?"
        ↓
knowledge
        ↓
RAG
```

Whereas:

``` text
"Where is my order 45821?"
        ↓
order_status
        ↓
Order Tool
```

For a combined request:

``` text
"Where is my order 45821 and what payment method did I use?"
        ↓
Multiple Actions
        ↓
Order Tool + Payment Tool
```

------------------------------------------------------------------------

## 11. Tool Documentation

### 1. Order Status Tool

``` text
checkOrderStatus(orderId)
```

Looks up the order in MongoDB and returns:

-   Order ID
-   Product
-   Amount
-   Status
-   Estimated delivery
-   Delivery address
-   Customer information

### 2. Payment Status Tool

``` text
checkPaymentStatus(orderId)
```

Looks up the corresponding order and payment record and returns payment
information.

### 3. Support Ticket Tool

``` text
createSupportTicket(...)
```

Creates a real support ticket in MongoDB with:

-   Ticket ID
-   Customer
-   Subject
-   Description
-   Category
-   Priority
-   Status
-   Source

### 4. Human Escalation Tool

``` text
escalateToHuman(...)
```

Creates a high-priority support ticket and records the reason for
escalation.

------------------------------------------------------------------------

## 12. Conversation Memory

Conversation memory is implemented using the `Conversation` MongoDB
model.

Each conversation contains:

-   `sessionId`
-   `customerId`
-   Message history
-   Last order ID
-   Last intent
-   Last tool used

Example:

``` text
User:
Where is my order 45821?

AI:
Your order 45821 has been shipped...

User:
When will it arrive?

AI:
Uses the stored order context and understands that
"it" refers to order 45821.
```

This allows follow-up questions without requiring the customer to repeat
previously supplied information.

------------------------------------------------------------------------

## 13. Ticket Management

Tickets are stored in MongoDB using the `Ticket` model.

Supported ticket categories include:

``` text
order
payment
refund
cancellation
delivery
product
account
other
```

Ticket priorities:

``` text
low
medium
high
urgent
```

Ticket statuses:

``` text
open
in_progress
resolved
closed
```

Tickets can originate from:

``` text
ai
customer
support_agent
```

------------------------------------------------------------------------

## 14. API Documentation

### Health Check

``` http
GET /health
```

### Chat

``` http
POST /api/chat
```

Example:

``` json
{
  "sessionId": "session-123",
  "customerId": "CUSTOMER_ID",
  "message": "Where is my order 45821?"
}
```

### Create Ticket

``` http
POST /api/tickets
```

### Get Ticket

``` http
GET /api/tickets/:id
```

### Get Order

``` http
GET /api/orders/:id
```

### Get Payment

``` http
GET /api/payments/:id
```

### Human Escalation

``` http
POST /api/escalate
```

------------------------------------------------------------------------

## 15. Project Structure

``` text
ai-customer-support/
│
├── backend/
│   ├── knowledge_base/
│   ├── src/
│   │   ├── agents/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── memory/
│   │   ├── models/
│   │   ├── rag/
│   │   ├── routes/
│   │   ├── services/
│   │   └── tools/
│   ├── test/
│   ├── app.js
│   ├── server.js
│   ├── seed.js
│   ├── index-knowledge.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   ├── architecture.png
│   └── screenshots/
│       ├── 01-home.png
│       ├── 02-rag-response.png
│       ├── 03-order-tool.png
│       ├── 04-conversation-memory.png
│       └── 05-multiple-tools.png
│
├── README.md
└── .gitignore
```

------------------------------------------------------------------------

## 16. Installation

### Clone the repository

``` bash
git clone https://github.com/CODER-1905-UMANG/ai-customer-support.git
cd ai-customer-support
```

### Backend

``` bash
cd backend
npm install
```

Create:

``` text
backend/.env
```

using:

``` text
backend/.env.example
```

Required environment variables:

``` env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
```

### Frontend

Open another terminal:

``` bash
cd frontend
npm install
```

------------------------------------------------------------------------

## 17. Running the Application

### Start Backend

From `backend/`:

``` bash
npm run dev
```

Backend:

``` text
http://localhost:5000
```

### Start Frontend

From `frontend/`:

``` bash
npm run dev
```

Frontend:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

## 18. Seed Database

To populate the application database with sample customers, orders,
payments, and tickets:

``` bash
cd backend
npm run seed
```

------------------------------------------------------------------------

## 19. Index Knowledge Base

To generate embeddings and index knowledge-base chunks:

``` bash
cd backend
node index-knowledge.js
```

This loads the Markdown documents, creates chunks, generates embeddings,
and stores the vectors in MongoDB Atlas.

------------------------------------------------------------------------

## 20. Testing

The project uses Jest and Supertest.

Run:

``` bash
cd backend
npm test
```

The final automated API test suite contains **13 passing tests**.

Covered scenarios include:

  Scenario                        Status
  ------------------------------- --------
  Health check                    ✅
  Order API                       ✅
  Payment API                     ✅
  Invalid order                   ✅
  Human escalation                ✅
  General/KB question             ✅
  Refund question                 ✅
  Order status                    ✅
  Payment status                  ✅
  Unknown question                ✅
  Multiple requests               ✅
  Conversation memory             ✅
  API validation/error behavior   ✅

Additional failure-path testing was performed for tool and retrieval
failures during development.

------------------------------------------------------------------------

## 21. Sample Customer Queries

### Knowledge Base

``` text
What is your refund policy?
```

``` text
What payment methods do you accept?
```

``` text
What is your cancellation policy?
```

### Order

``` text
Where is my order 45821?
```

### Payment

``` text
What payment method did I use for order 45821?
```

### Multiple Tools

``` text
Where is my order 45821 and what payment method did I use?
```

### Memory

``` text
Where is my order 45821?
```

Followed by:

``` text
When will it arrive?
```

### Human Escalation

``` text
I want to speak to a human support agent.
```

------------------------------------------------------------------------

## 22. Error Handling

The application uses validation, structured tool responses, exception
handling, and fallback responses.

Examples include:

### Invalid Order

``` text
Where is my order 99999?
```

The order tool returns a meaningful not-found response instead of
failing silently.

### Retrieval Failure

The RAG service catches retrieval errors and returns a controlled
application error.

### Tool Failure

Tool exceptions are caught and converted into structured failure
responses.

### LLM Failure

Groq API errors are caught by the LLM service and propagated through the
application's error-handling flow.

### Missing Input

API controllers validate required fields such as:

``` text
sessionId
message
customerId
ticket information
```

------------------------------------------------------------------------

## 23. Security

-   API keys are stored in environment variables.
-   `.env` files are excluded from Git.
-   `.env.example` contains placeholders only.
-   Secrets are not committed to GitHub.
-   MongoDB credentials are not stored in source code.

------------------------------------------------------------------------

## 24. Screenshots

Project screenshots are available in:

``` text
docs/screenshots/
```

Included screenshots demonstrate:

1.  Home interface
2.  RAG response
3.  Order tool
4.  Conversation memory
5.  Multiple tool execution

------------------------------------------------------------------------

## 25. Demo Video

Watch the full project demonstration here:

🎥 [Demo Video](PASTE_YOUR_DEMO_VIDEO_LINK_HERE)

------------------------------------------------------------------------

## 26. Demo

The final demonstration covers:

1.  Knowledge-base question
2.  RAG retrieval
3.  Action-based order query
4.  Tool calling
5.  Multiple tools
6.  Conversation memory
7.  Support-ticket workflow
8.  Human escalation
9.  Error handling
10. Technical architecture

------------------------------------------------------------------------

## 27. Known Limitations

-   Order and payment information currently uses application data stored
    in MongoDB rather than live external order/payment provider APIs.
-   Human escalation creates a support ticket; it does not connect to a
    live human-agent platform.
-   The frontend currently uses a fixed demo customer/session
    configuration.
-   The knowledge base is currently Markdown-based and must be
    re-indexed when its content changes.
-   The system is intended as a project/demo implementation rather than
    a production customer-support platform.

------------------------------------------------------------------------

## 28. Future Improvements

-   Authentication and customer accounts.
-   Live order-management API integration.
-   Payment-provider integration.
-   Production ticket-management integration.
-   Streaming LLM responses.
-   Better conversation summarization for long sessions.
-   Admin dashboard for tickets.
-   Human-agent live chat.
-   More advanced evaluation and observability.
-   Production deployment with secure infrastructure.
-   Automated knowledge-base re-indexing.

------------------------------------------------------------------------

## 29. Final Project Status

``` text
✅ React Frontend
✅ Express Backend
✅ MongoDB Atlas
✅ Knowledge Base
✅ Document Processing
✅ Text Chunking
✅ Embeddings
✅ MongoDB Vector Search
✅ RAG Pipeline
✅ Groq LLM
✅ AI Agent
✅ Order Tool
✅ Payment Tool
✅ Support Ticket Tool
✅ Human Escalation Tool
✅ Conversation Memory
✅ Multiple-Action Handling
✅ Error Handling
✅ REST APIs
✅ Automated Testing
✅ 13 Passing API Tests
✅ Architecture Diagram
✅ Screenshots
✅ Demo
✅ GitHub Repository
```

------------------------------------------------------------------------

## 30. Repository

GitHub:

https://github.com/CODER-1905-UMANG/ai-customer-support

------------------------------------------------------------------------

## 31. Conclusion

The project demonstrates a complete AI customer-support workflow:

``` text
Customer
   ↓
React Frontend
   ↓
Express API
   ↓
AI Agent
   ↓
┌───────────────┬────────────────┐
│               │                │
RAG           Tools           Memory
│               │                │
Vector DB    App Database      MongoDB
│               │
└───────────────┴────────────────┘
                ↓
              Groq
                ↓
       Customer Response
                ↓
      Ticket / Escalation
```

The system combines Generative AI with retrieval, application tools,
persistent conversation context, APIs, testing, and automated support
workflows rather than functioning as an LLM-only chatbot.