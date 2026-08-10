<p align="center">
  <img src="public/fixitflow-banner.png" alt="FixItFlow Banner" width="100%" />
</p>

<h1 align="center">🔧 FixItFlow</h1>

<p align="center">
  <strong>AI-Powered Property Maintenance Dispatch — Your Agent Picks Up the Phone So You Don't Have To</strong>
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-the-problem">The Problem</a> •
  <a href="#-how-it-works">How It Works</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-contributing">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/CALL--E-Powered-blue?style=for-the-badge&logo=phone&logoColor=white" alt="CALL-E Powered" />
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
</p>

---

## 📋 Table of Contents

- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [How It Works](#-how-it-works)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [CALL-E Integration](#-call-e-integration)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Demo](#-demo)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🚨 The Problem

Property maintenance coordination is a **time-consuming, phone-heavy nightmare**:

1. A tenant reports a broken pipe at 2 AM.
2. The property manager wakes up, calls the tenant to understand the severity.
3. They call **3–5 different plumbers** to check who's available today — many of whom don't have websites or online booking.
4. They compare quotes, pick one, and call the tenant back to schedule.
5. They update the spreadsheet/CRM, send confirmation texts, and hope nobody cancels.

> **The average maintenance ticket takes 45 minutes of phone calls** across 4–6 separate conversations, often spread over hours of back-and-forth. Property managers handling 50+ units can spend their entire morning on the phone.

Most contractors — especially local, independent tradespeople — **don't have APIs, apps, or online scheduling**. They answer the phone, or they don't. There is no digital shortcut. Until now.

---

## 💡 The Solution

**FixItFlow** is an AI-powered maintenance dispatch agent that **autonomously handles the entire repair coordination workflow via real phone calls** using [CALL-E](https://github.com/CALLE-AI/call-e-integrations).

When a maintenance ticket is submitted, FixItFlow:

| Step | What the AI Does | CALL-E Tool |
|------|------------------|-------------|
| 🎯 **Triage** | Calls the tenant to understand the issue — asks clarifying questions, assesses urgency | `plan_call` → `run_call` |
| 📞 **Source** | Calls multiple contractors in the relevant trade, checks availability, and collects quotes | `run_call` (×N) |
| 🤝 **Match** | Compares quotes and availability, selects the best contractor based on configurable rules | Internal logic |
| 📅 **Schedule** | Calls the tenant back to confirm the appointment time | `run_call` |
| 📊 **Report** | Returns structured data to the dashboard — quotes, transcripts, and a final resolution summary | `get_call_run` |

**Zero human phone calls. Full structured reporting. Real conversations with real people.**

---

## 🔄 How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        FIXITFLOW ENGINE                         │
│                                                                 │
│   ┌──────────┐    ┌───────────┐    ┌───────────┐    ┌────────┐ │
│   │  Ticket   │───▶│  Triage   │───▶│  Sourcing │───▶│ Match  │ │
│   │  Created  │    │  Call #1  │    │ Calls #2-N│    │ Engine │ │
│   └──────────┘    └───────────┘    └───────────┘    └────────┘ │
│                         │               │               │       │
│                    ┌────▼───┐      ┌────▼───┐     ┌────▼────┐  │
│                    │ CALL-E │      │ CALL-E │     │Schedule │  │
│                    │  SDK   │      │  SDK   │     │Call #N+1│  │
│                    └────────┘      └────────┘     └─────────┘  │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Real-Time Dashboard (Next.js)              │   │
│   │  • Live call status  • Transcripts  • Quote comparison  │   │
│   └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Detailed Workflow

**1. Ticket Submission**
A property manager or tenant submits a maintenance request via the FixItFlow dashboard (or API). The ticket includes: property address, issue description, contact number, and urgency level.

**2. AI Triage Call (CALL-E `plan_call` + `run_call`)**
The agent calls the tenant to gather critical details:
- *"Hi, I'm calling from FixItFlow on behalf of your property manager. You reported a leak — can you tell me where exactly the water is coming from?"*
- *"Is anyone currently in danger? Is the water near electrical outlets?"*
- *"On a scale of 1 to 10, how severe would you say this is?"*

The call result is parsed into structured data: `{ category: "plumbing", urgency: "high", details: "pipe leak under kitchen sink" }`.

**3. Contractor Sourcing Calls (CALL-E `run_call` × N)**
The agent pulls contractors from the database matching the required trade and calls them one by one:
- *"Hi, this is FixItFlow calling about a plumbing job. We have an urgent pipe leak at 123 Main Street. Are you available today? What would you charge for a kitchen sink pipe repair?"*

Each response is logged: `{ contractor: "Mike's Plumbing", available: true, quote: 150, earliest: "2pm today" }`.

**4. Smart Matching**
The engine ranks contractors by a configurable scoring formula:

```
score = (urgency_weight × availability_speed) + (cost_weight × (1 / quote)) + (rating_weight × past_rating)
```

**5. Confirmation Call (CALL-E `run_call`)**
The agent calls the tenant back:
- *"Great news! We've booked Mike's Plumbing to come by at 2 PM today. The estimated cost is $150. Does that work for you?"*

**6. Dashboard Update**
The ticket status moves to `SCHEDULED`, and the property manager sees a full audit trail: all call transcripts, quotes received, the selected contractor, and the confirmed appointment.

---

## 🏗️ Architecture

```
                    ┌──────────────────────┐
                    │   Next.js Frontend   │
                    │   (Dashboard UI)     │
                    └──────────┬───────────┘
                               │ REST API
                    ┌──────────▼───────────┐
                    │  Next.js API Routes  │
                    │  (Orchestration)     │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
    ┌─────────▼──────┐ ┌──────▼──────┐ ┌───────▼──────┐
    │   CALL-E SDK   │ │  Database   │ │  Contractor  │
    │  plan_call     │ │  (SQLite/   │ │  Registry    │
    │  run_call      │ │   Prisma)   │ │              │
    │  get_call_run  │ │             │ │              │
    └────────────────┘ └─────────────┘ └──────────────┘
              │
    ┌─────────▼──────────┐
    │   Real Phone Calls │
    │   via CALL-E       │
    │   Infrastructure   │
    └────────────────────┘
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Next.js API Routes for orchestration** | Simplifies deployment to a single service — no separate backend needed |
| **CALL-E CLI via `child_process`** | Leverages the official CLI for `plan_call`, `run_call`, `get_call_run` — battle-tested and maintained |
| **SQLite + Prisma** | Zero-config database that ships with the app; easy to swap to PostgreSQL in production |
| **Server-Sent Events for live updates** | Dashboard shows real-time call progress without WebSocket complexity |
| **Configurable scoring formula** | Property managers have different priorities (speed vs. cost vs. rating) — the engine adapts |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16 + React 19 | Dashboard UI with App Router |
| **Styling** | Tailwind CSS 4 | Rapid, responsive styling with dark mode |
| **Language** | TypeScript 5 | Type-safe development across the stack |
| **Telephony** | CALL-E SDK/CLI | AI-powered phone calls (`plan_call`, `run_call`, `get_call_run`) |
| **Database** | SQLite + Prisma | Properties, tenants, contractors, tickets |
| **Real-time** | Server-Sent Events | Live call status streaming to dashboard |
| **Deployment** | Vercel / Docker | One-click deploy or containerized |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18.x with `npm`
- **CALL-E CLI** — [Installation Guide](https://github.com/CALLE-AI/call-e-integrations)
- A **CALL-E account** (comes with 20 free calls)

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/fixitflow.git
cd fixitflow
npm install
```

### 2. Setup CALL-E

```bash
# Install the CALL-E CLI globally
npm install -g @call-e/cli

# Install the CALL-E skill
npx -y skills add https://github.com/CALLE-AI/call-e-integrations --skill calle -g

# Authenticate (opens a browser window)
calle auth login

# Verify installation
calle auth status
calle mcp tools
# Should list: plan_call, run_call, get_call_run
```

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# CALL-E Configuration
CALLE_SOURCE=skills_sh
CALLE_INTEGRATION=skills_sh_skill
CALLE_INTEGRATION_VERSION=0.1.0

# Database
DATABASE_URL="file:./dev.db"

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Initialize Database

```bash
npx prisma generate
npx prisma db push
npx prisma db seed   # Seeds sample properties, tenants, and contractors
```

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the FixItFlow dashboard.

---

## 📞 CALL-E Integration

FixItFlow uses all three core CALL-E tools:

### `plan_call`
Generates a structured call plan with goals, conversation flow, and expected data to extract.

```typescript
const plan = await calleClient.planCall({
  objective: "Triage a maintenance issue reported by tenant",
  context: {
    tenantName: "Sarah Johnson",
    issueDescription: "Water leaking from kitchen ceiling",
    propertyAddress: "123 Main Street, Apt 4B"
  },
  dataToExtract: ["severity", "location_detail", "timeline", "access_instructions"]
});
```

### `run_call`
Executes the call plan — dials out, holds a natural conversation, adapts in real time.

```typescript
const callRun = await calleClient.runCall({
  planId: plan.id,
  phoneNumber: "+1234567890",
  callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/call-complete`
});
```

### `get_call_run`
Retrieves structured results after the call completes.

```typescript
const result = await calleClient.getCallRun(callRun.id);

// result.extractedData:
// {
//   severity: "high",
//   location_detail: "pipe under kitchen sink",
//   timeline: "started 2 hours ago",
//   access_instructions: "doorman has spare key"
// }
```

---

## 📁 Project Structure

```
fixitflow/
├── public/
│   └── fixitflow-banner.png          # Project banner
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout with providers
│   │   ├── page.tsx                  # Dashboard home
│   │   ├── globals.css               # Global styles
│   │   ├── tickets/
│   │   │   ├── page.tsx              # Ticket list view
│   │   │   ├── [id]/page.tsx         # Ticket detail + call timeline
│   │   │   └── new/page.tsx          # New ticket form
│   │   ├── contractors/
│   │   │   └── page.tsx              # Contractor registry
│   │   ├── properties/
│   │   │   └── page.tsx              # Property management
│   │   └── api/
│   │       ├── tickets/
│   │       │   ├── route.ts          # CRUD for tickets
│   │       │   └── [id]/
│   │       │       ├── route.ts      # Single ticket ops
│   │       │       └── dispatch/
│   │       │           └── route.ts  # Triggers the CALL-E workflow
│   │       ├── contractors/
│   │       │   └── route.ts          # Contractor CRUD
│   │       ├── calls/
│   │       │   └── route.ts          # Call status & history
│   │       └── webhooks/
│   │           └── call-complete/
│   │               └── route.ts      # CALL-E callback handler
│   ├── lib/
│   │   ├── calle.ts                  # CALL-E SDK wrapper
│   │   ├── dispatch-engine.ts        # Orchestration state machine
│   │   ├── scoring.ts                # Contractor ranking algorithm
│   │   └── db.ts                     # Prisma client
│   ├── components/
│   │   ├── TicketCard.tsx            # Ticket summary card
│   │   ├── CallTimeline.tsx          # Visual call progress
│   │   ├── QuoteComparison.tsx       # Side-by-side contractor quotes
│   │   ├── LiveCallStatus.tsx        # Real-time call indicator
│   │   └── ContractorMap.tsx         # Contractor locations
│   └── types/
│       └── index.ts                  # Shared TypeScript types
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── seed.ts                       # Sample data seeder
├── .env.example                      # Environment template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md                         # You are here
```

---

## 📡 API Reference

### Tickets

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tickets` | List all tickets with filters |
| `POST` | `/api/tickets` | Create a new maintenance ticket |
| `GET` | `/api/tickets/:id` | Get ticket details + call history |
| `PATCH` | `/api/tickets/:id` | Update ticket status |
| `POST` | `/api/tickets/:id/dispatch` | **Trigger the AI dispatch workflow** |

### Contractors

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/contractors` | List contractors (filter by trade) |
| `POST` | `/api/contractors` | Register a new contractor |

### Calls

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/calls` | List all call records |
| `GET` | `/api/calls/:id` | Get call details + transcript |

### Webhooks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/webhooks/call-complete` | CALL-E callback when a call finishes |

---

## 🎬 Demo

> 📹 **[Watch the full demo on YouTube →]()**
>
> See FixItFlow autonomously:
> 1. Call a tenant to triage a plumbing emergency
> 2. Call three plumbers to check availability and quotes
> 3. Select the best match and call the tenant back to confirm
> 4. Update the dashboard with structured results — all in under 5 minutes

---

## 🗺️ Roadmap

- [x] Core CALL-E integration (`plan_call`, `run_call`, `get_call_run`)
- [x] Multi-step autonomous dispatch engine (Triage → Source → Match → Confirm)
- [x] High-aesthetic Next.js 16 Property Management Dashboard
- [x] Contractor scoring & ranking algorithm (rating, pricing, availability weighting)
- [x] Full REST API suite (`/api/tickets`, `/api/tickets/[id]/dispatch`, `/api/contractors`, `/api/properties`)
- [x] Prisma 7 database schema & mock data seeder
- [x] CALL-E call logs, transcript inspector, & voice recording visualizer
- [ ] SMS fallback for contractors who don't answer
- [ ] Multi-language support (CALL-E AI voice adapting per contractor dialect)
- [ ] Calendar integration (Google Calendar & Outlook sync)
- [ ] Tenant self-service ticket submission portal
- [ ] Batch dispatch engine — handling 10+ tickets simultaneously

---

## 🤝 Contributing

Contributions are welcome! This project was built for the [CALL-E: Your Code Is Calling](https://github.com/CALLE-AI/awesome-phone-call-agents) hackathon.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[CALL-E](https://github.com/CALLE-AI/call-e-integrations)** — The AI telephony platform that makes this possible. Your agents can finally pick up the phone. ☎️
- **[Next.js](https://nextjs.org)** — The React framework for production.
- **[Tailwind CSS](https://tailwindcss.com)** — Utility-first CSS framework.
- **[Prisma](https://prisma.io)** — Next-generation ORM for Node.js & TypeScript.

---

<p align="center">
  <strong>Built with ☎️ CALL-E for the "Your Code Is Calling" Hackathon</strong>
  <br/>
  <em>Your code is calling. Time to answer.</em>
</p>
