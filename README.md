# CartPilot-AI

Autonomous Multi-Agent E-Commerce Grocery Workforce coordinating planning, product research, recommendations, and cart management under strict budget constraints.

## System Architecture

CartPilot-AI implements a 5-layer autonomous agent architecture:

1. **Frontend**: Next.js 14, React, Tailwind CSS, Lucide icons (Chat interface, Product catalog, Active cart, Real-time SSE Agent Activity timeline).
2. **Backend API**: Node.js, Express, TypeScript, REST API, JWT session derivation, Server-Sent Events (SSE).
3. **Agent Orchestrator**: LangGraph.js coordinating StateGraph workflows, conditional branching, replanning loops, and human-in-the-loop checkpoints.
   - **Agent 1 (Shopping Planner)**: Converts natural language into structured category and budget distributions.
   - **Agent 2 (Product Research)**: Queries MongoDB for real inventory, verified prices, and stock constraints.
   - **Agent 3 (Recommendation)**: Ranks products against user preferences and suggests substitutions.
   - **Agent 4 (Cart Manager)**: Merges duplicates and computes exact server-side line-item totals.
   - **Agent 5 (Budget & Policy Validator)**: Deterministic TypeScript verification ensuring cart total strictly respects budget and stock limits.
4. **Tools & Business Logic**: Typed, validated tools (`searchProducts`, `getProductDetails`, `checkInventory`, `calculateCartTotal`, `validateCart`, `applyApprovedCart`).
5. **Database**: MongoDB (Mongoose models for Users, Products, Carts, ShoppingSessions, Orders, and AgentEvents). Money is tracked in integer paise.

---

## Workflow Graph

```
[Start]
   │
   ▼
parse_request / create_plan (Agent 1)
   │
   ▼
search_products (Agent 2)
   │
   ▼
rank_products (Agent 3)
   │
   ▼
build_proposed_cart (Agent 4)
   │
   ▼
validate_cart (Agent 5) ──[Invalid & Retries < 3]──► revise_plan ──► validate_cart
   │
   ├─► [Valid or Max Retries Exceeded]
   │
   ▼
await_approval (Human Checkpoint)
   │
   ▼
apply_approval (Cart Persisted)
   │
   ▼
[End]
```

---

## Monorepo Structure

```
CartPilot-AI/
├── apps/
│   ├── api/          # Express API, LangGraph workflow, Mongoose models, tools, routes
│   └── web/          # Next.js 14 frontend, Tailwind UI, Chat & Timeline components
├── packages/
│   └── shared/       # Zod schemas, TypeScript types, validation contracts
├── scripts/          # Database seeding and test utilities
└── package.json      # Monorepo workspaces
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB instance (Local or Atlas)
- Gemini API Key (optional; intelligent deterministic fallback built-in)

### Installation
```bash
npm install
```

### Environment Variables
Copy `.env.example` in `apps/api/.env` and `apps/web/.env.local`:

**`apps/api/.env`**:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cartpilot
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
```

**`apps/web/.env.local`**:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Seed Catalog
Populate the MongoDB database with 40+ products:
```bash
npm run seed
```

### Run Development Servers
```bash
# Terminal 1: Backend API
npm run dev:api

# Terminal 2: Next.js Frontend
npm run dev:web
```

### Testing
Run unit and validation test suites:
```bash
npm test
```
