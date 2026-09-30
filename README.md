# AI Customer Support & Ticket Automation System

🎥 **Demo Video:** [Watch the demo](https://drive.google.com/file/d/1G9HOl3GIN5LOvK-yLj4IUpPsT6_XYucH/view?usp=sharing)
📊 **Presentation (PPT):** [View the slides](https://docs.google.com/presentation/d/1Ww3zW6elqBI7ux1sYDJBvpsD1-xBXHvP/edit?usp=sharing&ouid=106347510061517579263&rtpof=true&sd=true)
💻 **Repository:** [github.com/CODER-1905-UMANG/ai-customer-support](https://github.com/CODER-1905-UMANG/ai-customer-support)

An AI-powered customer support application that combines **RAG, embeddings, an AI agent, tool calling, conversation memory, ticket automation, and human escalation** to handle both knowledge-based and action-based customer requests.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Objectives](#3-objectives)
4. [Features](#4-features)
5. [Technology Stack](#5-technology-stack)
6. [System Architecture](#6-system-architecture)
7. [Application Workflow](#7-application-workflow)
8. [RAG Architecture](#8-rag-architecture)
9. [Agent Workflow](#9-agent-workflow)
10. [Tool Documentation](#10-tool-documentation)
11. [Conversation Memory](#11-conversation-memory)
12. [API Documentation](#12-api-documentation)
13. [Installation](#13-installation)
14. [Environment Variables](#14-environment-variables)
15. [Running Instructions](#15-running-instructions)
16. [Testing](#16-testing)
17. [Error Handling](#17-error-handling)
18. [Known Limitations](#18-known-limitations)
19. [Future Improvements](#19-future-improvements)
20. [Additional Information](#20-additional-information) (Ticket Management, Sample Queries, Project Structure, Security, Screenshots, Demo)

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/CODER-1905-UMANG/ai-customer-support.git
cd ai-customer-support

# 2. Backend setup
cd backend
npm install
cp .env.example .env        # then fill in MONGODB_URI and GROQ_API_KEY

# 3. Load sample data and index the knowledge base
npm run seed
node index-knowledge.js

# 4. Start the backend (http://localhost:5000)
npm run dev

# 5. In a new terminal, start the frontend (http://localhost:5173)
cd ../frontend
npm install
npm run dev
```

> You also need to create the Atlas Vector Search index `vector_index` (cosine, 384 dimensions). See [RAG Architecture](#8-rag-architecture).

---

## 1. Project Overview

This project was developed as a 3-week Generative AI project assignment for DSTARIX TECHNO.

The system is designed to handle common customer-support requests such as:

- Order status
- Payment information
- Refund and cancellation policies
- Shipping and product questions
- Support-ticket creation
- Human escalation
- Follow-up questions using conversation context

Unlike a basic LLM chatbot, the application combines **RAG + Agent + Tools + Memory + APIs + Database + Testing**.

---

## 2. Problem Statement

Customer-support teams receive repetitive requests involving orders, payments, refunds, cancellations, delivery, products, accounts, and company policies.

The goal is to automate common requests while allowing the AI system to:

1. Retrieve reliable company-specific information.
2. Perform application actions through tools.
3. Maintain conversation context.
4. Create support tickets.
5. Escalate issues that require human intervention.

---

## 3. Objectives

- Build a functional AI customer-support system.
- Implement Retrieval-Augmented Generation (RAG).
- Generate and store text embeddings.
- Use MongoDB Atlas Vector Search for semantic retrieval.
- Implement an AI agent for intent/action selection.
- Implement functional tools for order, payment, ticket, and escalation workflows.
- Maintain conversation memory.
- Provide backend APIs.
- Handle invalid input and service failures gracefully.
- Test the required customer-support scenarios.
- Provide documentation, screenshots, architecture, and demo material.

---

## 4. Features

### Customer Support
- Natural-language customer queries
- Knowledge-base questions
- Order status lookup
- Payment status lookup
- Support-ticket creation
- Human escalation

### Generative AI
- Groq LLM integration
- AI-based intent/action selection
- Grounded RAG responses
- Context-aware responses

### RAG
- Markdown knowledge-base documents
- Document loading and text chunking with overlap
- Hugging Face embeddings
- MongoDB Atlas Vector Search
- Relevant context retrieval
- Source references in responses

### Agent & Tools
- AI agent determines the required action
- Order-status, payment-status, support-ticket, and human-escalation tools
- Multiple actions can be processed in a single request

### Conversation Memory
- Conversation history and context stored in MongoDB
- Follow-up questions resolved from stored context (see [section 11](#11-conversation-memory))

### Error Handling
- Validation and fallbacks for invalid input, tool failures, LLM failures, and retrieval failures (see [section 17](#17-error-handling))

---

## 5. Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, CSS / inline UI styling |
| Backend | Node.js, Express.js, REST APIs |
| Database | MongoDB Atlas, Mongoose, MongoDB Atlas Vector Search |
| Generative AI | Groq API, `openai/gpt-oss-20b` |
| Embeddings | Hugging Face Transformers, `Xenova/all-MiniLM-L6-v2` (384 dimensions) |
| Testing | Jest, Supertest |
| Dev Tools | Git, GitHub, VS Code, Postman |

---

## 6. System Architecture

```text
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
       │    RAG Pipeline     │                │  Application Tools  │
       └──────────┬──────────┘                └──────────┬──────────┘
                  │                                      │
                  ▼                                      ▼
       ┌─────────────────────┐                ┌─────────────────────┐
       │ MongoDB Vector      │                │ MongoDB Application │
       │ Search              │                │ Data                │
       └──────────┬──────────┘                └──────────┬──────────┘
                  │                                      ├── Orders
                  ▼                                      ├── Payments
       ┌─────────────────────┐                           ├── Customers
       │ Knowledge Base      │                           └── Tickets
       │ Markdown Documents  │
       └─────────────────────┘

       ┌─────────────────────┐        ┌─────────────────────┐
       │      Groq LLM       │        │ Conversation Memory │
       │                     │        │      (MongoDB)      │
       └─────────────────────┘        └─────────────────────┘
```

Detailed diagram: `docs/architecture.png`

---

## 7. Application Workflow

```text
Customer Query
      │
      ▼
Express /api/chat
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

---

## 8. RAG Architecture

### Pipeline

```text
Company Documents
       │
       ▼
Document Loader
       │
       ▼
Text Chunking (with overlap)
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
Grounded Customer Response (with source references)
```

### Knowledge Base

Stored in `backend/knowledge_base/`:

```text
faq.md
product_information.md
refund_policy.md
cancellation_policy.md
shipping_policy.md
payment_policy.md
account_policy.md
support_guidelines.md
```

### Embeddings

| Setting | Value |
|---|---|
| Model | `Xenova/all-MiniLM-L6-v2` |
| Dimensions | 384 |

### Vector Search

| Setting | Value |
|---|---|
| Index name | `vector_index` |
| Similarity | cosine |
| Dimensions | 384 |

### Indexing

```bash
cd backend
node index-knowledge.js
```

This loads the Markdown documents, creates chunks, generates embeddings, and stores the vectors in MongoDB Atlas. Re-run it whenever the knowledge base changes.

---

## 9. Agent Workflow

The agent receives the customer's request and decides which action to perform.

Supported intents:

```text
knowledge
order_status
payment_status
support_ticket
human_escalation
unknown
```

**Examples**

| Customer message | Intent | Action |
|---|---|---|
| "What is your refund policy?" | `knowledge` | RAG |
| "Where is my order 45821?" | `order_status` | Order Tool |
| "I want to speak to a human." | `human_escalation` | Escalation Tool |
| "Where is my order 45821 and what payment method did I use?" | multiple | Order Tool + Payment Tool |

---

## 10. Tool Documentation

### 1. Order Status Tool: `checkOrderStatus(orderId)`
Looks up the order in MongoDB and returns order ID, product, amount, status, estimated delivery, delivery address, and customer information.

### 2. Payment Status Tool: `checkPaymentStatus(orderId)`
Looks up the corresponding order and payment record and returns payment information.

### 3. Support Ticket Tool: `createSupportTicket(...)`
Creates a real support ticket in MongoDB with ticket ID, customer, subject, description, category, priority, status, and source.

### 4. Human Escalation Tool: `escalateToHuman(...)`
Creates a high-priority support ticket and records the reason for escalation.

> **Note:** `POST /api/escalate` is a direct API call for escalation. The `escalateToHuman` tool is the same workflow triggered by the AI agent during a chat.

---

## 11. Conversation Memory

Memory is implemented with the `Conversation` MongoDB model. Each conversation stores:

- `sessionId`
- `customerId`
- Message history
- Last order ID
- Last intent
- Last tool used

**Example**

```text
User: Where is my order 45821?
AI:   Your order 45821 has been shipped...

User: When will it arrive?
AI:   Uses the stored order context and understands that
      "it" refers to order 45821.
```

This lets customers ask follow-up questions without repeating information.

---

## 12. API Documentation

Base URL: `http://localhost:5000`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/api/chat` | Send a customer message to the AI agent |
| POST | `/api/tickets` | Create a support ticket |
| GET | `/api/tickets/:id` | Get a ticket by ID |
| GET | `/api/orders/:id` | Get an order by ID |
| GET | `/api/payments/:id` | Get a payment by ID |
| POST | `/api/escalate` | Escalate to a human agent (creates a high-priority ticket) |

### GET `/health`

Returns a simple status response confirming the server is running.

### POST `/api/chat`

**Request body**

```json
{
  "sessionId": "session-123",
  "customerId": "CUSTOMER_ID",
  "message": "Where is my order 45821?"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `sessionId` | string | Yes | Identifies the conversation (used for memory) |
| `customerId` | string | Yes | Customer the conversation belongs to |
| `message` | string | Yes | The customer's message |

**Example response** *(update to match your actual output)*

```json
{
  "reply": "Your order 45821 has been shipped and is expected to arrive soon.",
  "intent": "order_status",
  "toolsUsed": ["checkOrderStatus"],
  "sources": []
}
```

For knowledge questions, `sources` contains the names of the knowledge-base documents used.

### POST `/api/tickets`

**Request body** *(adjust field names to match your controller)*

```json
{
  "customerId": "CUSTOMER_ID",
  "subject": "Damaged product",
  "description": "The item arrived damaged.",
  "category": "order",
  "priority": "medium"
}
```

### GET `/api/tickets/:id`, `/api/orders/:id`, `/api/payments/:id`

Return the matching record, or a not-found response if the ID does not exist.

### POST `/api/escalate`

Creates a high-priority ticket and records the escalation reason.

### Status Codes

| Code | Meaning |
|---|---|
| 200 / 201 | Success |
| 400 | Missing or invalid input |
| 404 | Order, payment, or ticket not found |
| 500 | Internal or service failure |

---

## 13. Installation

**Prerequisites:** Node.js, npm, a MongoDB Atlas cluster, and a Groq API key.

```bash
git clone https://github.com/CODER-1905-UMANG/ai-customer-support.git
cd ai-customer-support
```

**Backend**

```bash
cd backend
npm install
cp .env.example .env
```

**Frontend** (in a second terminal)

```bash
cd frontend
npm install
```

**Atlas Vector Search index**

Create an Atlas Vector Search index named `vector_index` on the knowledge-base chunks collection, using cosine similarity and 384 dimensions.

---

## 14. Environment Variables

Create `backend/.env` from `backend/.env.example`.

| Variable | Required | Description |
|---|---|---|
| `PORT` | No (default `5000`) | Port the backend listens on |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `GROQ_API_KEY` | Yes | API key for the Groq LLM |

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
```

---

## 15. Running Instructions

**1. Seed the database** (sample customers, orders, payments, and tickets)

```bash
cd backend
npm run seed
```

**2. Index the knowledge base**

```bash
node index-knowledge.js
```

**3. Start the backend**

```bash
npm run dev
# http://localhost:5000
```

**4. Start the frontend**

```bash
cd ../frontend
npm run dev
# http://localhost:5173
```

---

## 16. Testing

The project uses Jest and Supertest.

```bash
cd backend
npm test
```

The automated API test suite contains **13 passing tests**:

| Scenario | Status |
|---|---|
| Health check | ✅ |
| Order API | ✅ |
| Payment API | ✅ |
| Invalid order | ✅ |
| Human escalation | ✅ |
| General/KB question | ✅ |
| Refund question | ✅ |
| Order status | ✅ |
| Payment status | ✅ |
| Unknown question | ✅ |
| Multiple requests | ✅ |
| Conversation memory | ✅ |
| API validation/error behavior | ✅ |

Additional failure-path testing for tool and retrieval failures was performed during development.

---

## 17. Error Handling

The application uses validation, structured tool responses, exception handling, and fallback responses.

| Case | Behavior |
|---|---|
| Invalid order (e.g. "Where is my order 99999?") | The order tool returns a meaningful not-found response instead of failing silently |
| Missing input | Controllers validate required fields (`sessionId`, `message`, `customerId`, ticket information) and return a 400 error |
| Tool failure | Tool exceptions are caught and converted into structured failure responses |
| Retrieval failure | The RAG service catches retrieval errors and returns a controlled application error |
| Empty retrieval results | Handled with a fallback instead of an ungrounded answer |
| LLM failure | Groq API errors are caught by the LLM service and passed to the application's error handler |
| Ticket creation failure | Caught and returned as a structured error |

---

## 18. Known Limitations

- Order and payment data comes from MongoDB, not live external order/payment provider APIs.
- Human escalation creates a support ticket; it does not connect to a live human-agent platform.
- The frontend uses a fixed demo customer/session configuration.
- The knowledge base is Markdown-based and must be re-indexed when its content changes.
- This is a project/demo implementation, not a production customer-support platform.

---

## 19. Future Improvements

- Authentication and customer accounts
- Live order-management API integration
- Payment-provider integration
- Production ticket-management integration
- Streaming LLM responses
- Better conversation summarization for long sessions
- Admin dashboard for tickets
- Human-agent live chat
- More advanced evaluation and observability
- Production deployment with secure infrastructure
- Automated knowledge-base re-indexing

---

## 20. Additional Information

### Ticket Management

Tickets are stored using the `Ticket` model.

| Field | Allowed values |
|---|---|
| Category | `order`, `payment`, `refund`, `cancellation`, `delivery`, `product`, `account`, `other` |
| Priority | `low`, `medium`, `high`, `urgent` |
| Status | `open`, `in_progress`, `resolved`, `closed` |
| Source | `ai`, `customer`, `support_agent` |

### Sample Customer Queries

| Type | Query |
|---|---|
| Knowledge base | What is your refund policy? |
| Knowledge base | What payment methods do you accept? |
| Knowledge base | What is your cancellation policy? |
| Order | Where is my order 45821? |
| Payment | What payment method did I use for order 45821? |
| Multiple tools | Where is my order 45821 and what payment method did I use? |
| Memory | "Where is my order 45821?" followed by "When will it arrive?" |
| Human escalation | I want to speak to a human support agent. |

### Project Structure

```text
ai-customer-support/
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
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── architecture.png
│   └── screenshots/
├── README.md
└── .gitignore
```

### Security

- API keys are stored in environment variables.
- `.env` files are excluded from Git; `.env.example` contains placeholders only.
- No secrets or MongoDB credentials are committed to the repository.

### Screenshots

Located in `docs/screenshots/`:

| Screenshot | Shows |
|---|---|
| `01-home.png` | Home interface |
| `02-rag-response.png` | RAG response |
| `03-order-tool.png` | Order tool |
| `04-conversation-memory.png` | Conversation memory |
| `05-multiple-tools.png` | Multiple tool execution |

### Demo

🎥 [Watch the demo video](https://drive.google.com/file/d/1G9HOl3GIN5LOvK-yLj4IUpPsT6_XYucH/view?usp=drive_link) · 📊 [View the presentation](PASTE_YOUR_PPT_LINK_HERE)

The demo covers: knowledge-base question, RAG retrieval, order query with tool calling, multiple tools, conversation memory, support-ticket workflow, human escalation, error handling, and the technical architecture.

### Conclusion

The project demonstrates a complete AI customer-support workflow. It combines Generative AI with retrieval, application tools, persistent conversation context, APIs, testing, and automated support workflows, rather than functioning as an LLM-only chatbot.

---

## License

Add your license here (e.g. MIT), or remove this section if the repository is private.