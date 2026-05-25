# ✨ Questly ✨
### *The Ultimate Real-Time Collaborative Technical Interview Platform*

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-blue.svg)](https://nodejs.org)
[![Express Version](https://img.shields.io/badge/express-v5.0-green.svg)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/mongodb-atlas-emerald.svg)](https://mongodb.com)
[![License](https://img.shields.io/badge/license-ISC-orange.svg)](#)

Questly is a highly optimized, enterprise-grade, full-stack technical interview platform that connects candidates and interviewers in real-time. Architected with high scalability and tested under rigorous load simulations, Questly enables concurrent collaborative code compilation, high-fidelity video/audio call channels, and interactive chat rooms.

---

## 📷 Platform Screenshot

![Questly Screenshot](/frontend/public/screenshot-for-readme.png)

---

## ⚡ Performance Engineering & Concurrency Load Testing

Questly stands out because of its **rigorous performance engineering**. The platform includes a customized benchmarking and profiling suite under `backend/benchmark/` to simulate concurrent stress conditions and eliminate latency bottlenecks.

```
┌────────────────────────┐         100+ Concurrent Requests
│   autocannon client    │ ──────────────────────────────────────────┐
└────────────────────────┘                                           │
                                                                     ▼
┌────────────────────────┐         Bypass External Clerk API         ┌───────────────┐
│   Mock Auth Harness    │ ◄──────────────────────────────────────── │               │
└────────────────────────┘                                           │  Express App  │
                                                                     │  (Port 4000)  │
┌────────────────────────┐         Bypass External Stream API        │               │
│   Mock Stream SDK      │ ◄──────────────────────────────────────── │               │
└────────────────────────┘                                           └───────────────┘
                                                                             │
                                   O(1) Compound Index Scans                 ▼
                               ┌──────────────────────────────────────────────┐
                               │            MongoDB Atlas Database            │
                               │  - 524x Less Disk Scanned                    │
                               │  - User Cache Saves 1 DB RTT/Request         │
                               └──────────────────────────────────────────────┘
```

### 📊 Performance Optimizations & Measurable Impact
Through query optimization, database index engineering, and Express middleware lifecycle tuning, we isolated database connection pool exhaustion and achieved massive performance leaps under stress:

| Metric / Scenario | Baseline (No Indexes & DB Scans) | Optimized (Indexes & User Caching) | Performance Delta |
| :--- | :---: | :---: | :---: |
| **GET /health** *(Express Baseline)* | 14,624 Req/sec \| P50: 6ms | 13,626 Req/sec \| P50: 6ms | *System Baseline* |
| **GET /api/sessions/active** *(DB Read)* | 30.0 Req/sec \| P50: 2,901ms | **42.3 Req/sec** \| **P50: 1,956ms** | **+41.0% Throughput** / **-32.5% Latency** |
| **POST /api/sessions** *(DB Write)* | 45.4 Req/sec \| P50: 983ms | **100.1 Req/sec** \| **P50: 72ms** | **+120.4% Throughput** / **-92.6% Latency** |

### 🛠️ Optimization Strategy Implemented

* ** O(1) Index Engineering**: Transitioned queries from slow O(N) Collection Scans (`COLLSCAN`) examining all **10,499** records to highly optimized O(1) Index Scans (`IXSCAN`), reducing document scans by **99.8%**.
* ** Middleware In-Memory Caching**: Implemented a thread-safe user lookup cache in our authorization middleware. This eliminated a redundant MongoDB Atlas network round-trip query on every protected endpoint request under load, doubling POST write capacity.
* ** Isolated Testing Harnesses**: Architected modular mock authentication and external Stream Video/Chat SDK toggles to completely isolate and test the application logic and DB performance under high traffic without getting rate-limited by third-party services.

---

## 🚀 Key Features

* **🧑‍💻 Collaborative Code Editor**: Fully integrated, interactive editor featuring real-time state synchronization, language syntax highlighting, and autocomplete.
* **🎥 1-on-1 Video Interview Rooms**: Dynamic audio/video rooms powered by Stream Video SDK with microphone/camera controls, screen sharing, and recording capability.
* **💬 Real-Time Chat System**: Dedicated messaging channel created instantly per session for interview coordination.
* **⚙️ Isolated Code Execution**: Protected proxy routing code executions to Judge0 API, supporting multiple compilers (`JavaScript`, `Python`, `C++`, `Java`) and returning stdout/stderr instantly.
* **🎯 Automated Feedback & Confetti**: Runs candidate code against test cases in real-time, displaying immediate success (confetti animations) or precise failure traces.
* **🧠 Event-Driven User Sync**: Utilizes Clerk authentication webhooks combined with Inngest background job workers to synchronize profiles into MongoDB and Stream Chat asynchronously.
* **🛡️ Auto-Healing User Sync**: Integrates a dynamic Clerk synchronization fallback inside the authorization middleware, automatically recreating missing user database documents from the Clerk API on-the-fly to guarantee zero application breakdown if database wipes occur.
* **🔒 Lobby & Room Lock Controls**: Strict room occupancy rules allowing only two authenticated participants (Host + Candidate) to prevent security breaches.

---

## 📐 Directory Structure

```
questly/
├── backend/
│   ├── benchmark/           # ⚡ Performance Load-Testing & Seeding Harness
│   │   ├── seed.js          # Seeds 10,000+ mock records for database stress tests
│   │   ├── profile.js       # Runs .explain() to analyze MongoDB query execution plans
│   │   └── loadTest.js      # Programmatic concurrent load-testing client using autocannon
│   ├── src/
│   │   ├── controllers/     # API request handling & logic (session, execution, chat)
│   │   ├── middleware/      # Auth protection, dynamic mocks & logging
│   │   ├── models/          # MongoDB Mongoose schemas & compound indexes
│   │   ├── routes/          # API route mappings (chat, execution, session)
│   │   └── server.js        # Main Express server bootstrapper
│   └── package.json
├── frontend/
│   ├── src/                 # React component library & core views
│   │   ├── components/      # UI components (VideoCall, CodeEditor, ChatBox)
│   │   ├── pages/           # Dashboard, InterviewRoom, PracticeProblems
│   │   └── main.jsx
│   └── package.json
└── README.md
```

---

## 🗺️ Systems Architecture & Event Flows

### 1. User Sync Pipeline (Event-Driven Async Webhook)
```
[Clerk Auth Event] ──► [Inngest Webhook Handler] ──► [MongoDB User Upsert] ──► [Stream Chat User Sync]
```
When a user signs up or modifies their profile via Clerk, an asynchronous webhook is emitted to Inngest, ensuring immediate database consistency without blocking frontend page rendering.

### 2. Interview Session Flow
```
Host User             Create Session              Express Server           Database
    │ ─────────────────────────────────────────────────► │ ──────────────────► │ (Create Room Doc)
    │                                                    │ ──────────────────► │ (Index: status, createdAt)
    │ ◄───────────────────────────────────────────────── │ ◄──────────────────
    │ (Returns callId)
    ▼
Join Room
    │ ───────────────► Stream Video SDK Call & Messaging Channel Sync ◄─────────────── Candidate User
```

---

## 📡 API Endpoint Reference

### 🔐 Protected Routes (Require Clerk Session JWT)

#### 📅 Session Management (`/api/sessions`)
* **`POST /`**: Create a new collaborative session.
  * *Body*: `{ "problem": "Two Sum", "difficulty": "easy" }`
  * *Response*: `{ "session": { "_id": "...", "callId": "...", "status": "active" } }`
* **`GET /active`**: Fetch 20 most recent active lobbies waiting for participants. (Optimized with compound index `{ status: 1, createdAt: -1 }`).
* **`GET /my-recent`**: Fetch recent completed sessions the authenticated user participated in. (Optimized with indexes `{ host: 1, status: 1, createdAt: -1 }` and `{ participant: 1, status: 1, createdAt: -1 }`).
* **`POST /:id/join`**: Join an active session lobby.
* **`POST /:id/end`**: Conclude session and delete Stream Chat/Video call channels.

#### ⚙️ Isolated Code Execution (`/api/execute`)
* **`POST /`**: Compile and execute base64-encoded source code in an isolated judge environment.
  * *Body*: `{ "language": "javascript", "code": "console.log('Hello World');" }`
  * *Response*: `{ "success": true, "output": "Hello World", "error": null }`

#### 💬 Chat Tokens (`/api/chat`)
* **`GET /token`**: Retrieve JWT connection tokens for Stream Chat client sync.

#### 🩺 Public Routes
* **`GET /health`**: Server health validation. Returns `{ "msg": "api is running perfectly" }`.

---

## 🏁 Getting Started

### 1. Setup Environment Configurations
Add your local API credentials inside the environment files:

#### Backend Config (`/backend/.env`)
```bash
PORT=3000
NODE_ENV=development
DB_URL=your_mongodb_connection_url
CLIENT_URL=http://localhost:5173

# Background Jobs Key
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# Clerk Keys
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Stream SDK API Keys
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
```

#### Frontend Config (`/frontend/.env`)
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:3000/api
VITE_STREAM_API_KEY=your_stream_api_key
```

### 2. Launch the Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Launch the Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## ⚡ Running the Performance & Load Testing Suite

You can execute the performance testing suite on your local workspace to verify database query plans and request throughput:

### Step 1: Pre-seed Database Records
Create 10,010 mock records (representing historical database volume) to run realistic tests:
```bash
cd backend
node benchmark/seed.js
```

### Step 2: Analyze Query Plans
Run MongoDB's execution profiling to inspect index hits, documents examined, and sorting strategies (`IXSCAN` vs `COLLSCAN`):
```bash
node benchmark/profile.js
```

### Step 3: Run Load Performance Benchmarks
Launch the Express test server and run high-concurrency (100 concurrent users) load simulations using `autocannon` to print request throughput and P50/P90/P99 latency metrics:
```bash
node benchmark/loadTest.js
```