# 🌟 ETC English Center — AI-Powered LMS & Academic Management Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-12.0-red?logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x%20%2F%206.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon%20Serverless-336791?logo=postgresql)](https://neon.tech/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-Flash%20%2F%20Pro-8E75B2?logo=google)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

> **ETC English Center** is a modern, enterprise-grade Learning Management System (LMS) and Education Enterprise Resource Planning (ERP) platform integrated with Next-Gen Artificial Intelligence (Google Gemini GenAI). Tailored for foreign language centers, it provides end-to-end automation across four primary roles: **Administrator**, **Academic Counselor (Staff)**, **Teacher**, and **Student**.

🌐 **Live Demo:** [etcedu.vercel.app](https://etcedu.vercel.app/)  
📚 **Swagger API Docs:** `http://localhost:8000/api/docs` (available upon starting the backend server)

---

## 📌 Table of Contents

1. [System Overview](#-1-system-overview)
2. [Key Capabilities & Highlights](#-2-key-capabilities--highlights)
3. [Technology Stack](#-3-technology-stack)
4. [System Architecture](#-4-system-architecture)
5. [Directory Structure](#-5-directory-structure)
6. [Getting Started & Installation](#-6-getting-started--installation)
   - [Method 1: Instant Deployment with Docker (Recommended)](#method-1-instant-deployment-with-docker-recommended)
   - [Method 2: Manual Local Installation](#method-2-manual-local-installation)
   - [Common Docker Operations & Maintenance](#common-docker-operations--maintenance)
7. [Demo Test Credentials](#-7-demo-test-credentials)
8. [Role-Based Functional Modules](#-8-role-based-functional-modules)
9. [Interactive API Documentation (Swagger)](#-9-interactive-api-documentation-swagger)
10. [Testing & Quality Assurance](#-10-testing--quality-assurance)
11. [Contact & Support](#-11-contact--support)

---

## 📖 1. System Overview

The **ETC English Center Management Platform** is engineered following standard multi-tier architectural patterns, strict **ACID transactional consistency**, fine-grained **Role-Based Access Control (RBAC)**, and a **3-Tier Defense Mechanism** for Large Language Model (LLM) integrations.

The platform eliminates manual administrative overhead by streamlining course catalog design, schedule conflict detection, automated multi-tranche tuition invoicing, 4-state session attendance, weighted grade calculations, and AI-driven personalized learning pathways.

---

## 🎯 2. Key Capabilities & Highlights

* **Academic & Operational Administration:**
  * Comprehensive Course & Class lifecycle management (IELTS, TOEIC, Communicative English, CEFR A1–C2).
  * Automated timetable scheduling with automated room and teacher collision detection.
  * Student enrollment processing, capacity constraints, and teacher load balancing.

* **Finance, Invoicing & Tuition:**
  * Automatic invoice creation upon course/class enrollment.
  * Real-time outstanding debt tracking, split-payment receipts, and printable A4 payment receipts.

* **Attendance Matrix & Weighted Grading:**
  * 4-state session attendance: *Present*, *Late*, *Excused Absence*, and *Unexcused Absence*.
  * Course-wide interactive Attendance Matrix and per-student attendance auditing.
  * Weighted grade computation:
    $$\text{Final Grade} = (20\% \times \text{Attendance}) + (30\% \times \text{Midterm}) + (50\% \times \text{Final Exam})$$
  * Automatic pass/fail determinations with academic transcripts.

* **Google Gemini Generative AI Suite:**
  * 🤖 **AI Course & Class Consultation:** Evaluates the student's entry CEFR level, target score, and weekly schedule availability to recommend the optimal learning roadmap and open classes.
  * 📝 **AI Practice Generator:** Automatically creates 4-skill CEFR-graded multiple-choice quizzes with instant grading, correct answer validation, and detailed explanations.
  * 📊 **AI Progress Summarization:** Synthesizes historical attendance and exam records into diagnostic reports highlighting strengths, weaknesses, and actionable study roadmaps.

---

## 🛠️ 3. Technology Stack

### Backend (RESTful API Service)
* **Core Framework:** [NestJS](https://nestjs.com/) (Node.js runtime with modern TypeScript)
* **Database & ORM:** [Prisma ORM 6](https://www.prisma.io/) with PostgreSQL hosted on [Neon Serverless](https://neon.tech/) or Docker Container (14 relational tables in 3NF)
* **Authentication & Security:** Argon2 password hashing, Passport.js JWT strategies, Role Guards, and OWASP-hardened validation pipes
* **API Documentation:** Swagger / OpenAPI 3.0 specification
* **AI Integration:** Official `@google/genai` SDK running Google Gemini 2.5 / 3.8 Flash with structured JSON schema outputs

### Frontend (Client Web Application)
* **Framework:** [Next.js](https://nextjs.org/) (App Router architecture with Turbopack bundler & standalone Docker output)
* **Libraries:** React 19, TypeScript
* **Design & Styling:** Tailwind CSS v4, Modern Dark Theme Dashboard System
* **Icons & Visualization:** Lucide React icons, lightweight dynamic charts
* **Networking & Utilities:** Axios HTTP client with interceptors, SheetJS (`xlsx`) for tabular data reporting

---

## 🏗️ 4. System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Next.js Frontend Client                         │
│     (App Router, React 19, Dark Theme Dashboard, RBAC Route Guards)    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / RESTful API (Bearer JWT)
┌───────────────────────────────────▼────────────────────────────────────┐
│                          NestJS API Gateway                            │
│  ┌───────────────────────┬──────────────────────┬───────────────────┐  │
│  │  Argon2 / JWT Guards  │ Validation Pipes DTO │  Swagger OpenAPI  │  │
│  └───────────────────────┴──────────────────────┴───────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                         Business Services                        │  │
│  │  Auth • Users • Courses • Classes • Enrollments • Fees • AI Hub  │  │
│  └──────────────────┬─────────────────────────────┬─────────────────┘  │
└─────────────────────┼─────────────────────────────┼────────────────────┘
                      │                             │
                      ▼                             ▼
       ┌────────────────────────────┐  ┌────────────────────────────┐
       │     PostgreSQL (Neon/DB)   │  │      Google Gemini AI      │
       │    Prisma ORM (14 3NF)     │  │   Zero-Trust Structured    │
       │  ACID Database Transaction │  │  JSON Schema Output Engine │
       └────────────────────────────┘  └────────────────────────────┘
```

### GenAI 3-Tier Defense Mechanism
1. **Zero-Trust System Prompting:** Strict prompt boundaries preventing hallucinations and prompt injection.
2. **Schema Validation:** Enforces exact JSON Schema contracts (`responseMimeType: "application/json"`) on all model responses.
3. **Graceful Fallback & Audit Logging:** Persistent logging of prompt tokens, latency, and automated fallback caching in the event of API rate limits.

---

## 📂 5. Directory Structure

```text
LMS-AI/
├── .agents/                       # Sub-agents configuration & automated skills
├── backend/                       # NestJS API Server
│   ├── prisma/
│   │   ├── schema.prisma          # 14-table 3NF relational database schema
│   │   └── seed.ts                # Comprehensive database seeder script
│   ├── src/
│   │   ├── modules/               # Core business modules (auth, users, courses,
│   │   │                          # classes, enrollments, attendances, grades, ai...)
│   │   ├── common/                # Shared guards, interceptors, filters, DTOs
│   │   ├── config/                # Environment configurations & AI credentials
│   │   └── main.ts                # Backend bootstrap entrypoint (Port 8000)
│   ├── Dockerfile                 # Multi-stage production container image
│   ├── test/                      # Vitest unit & E2E test suites
│   └── package.json
│
├── frontend/                      # Next.js App Router Web Client
│   ├── src/
│   │   ├── app/                   # Role-based route hierarchy
│   │   │   ├── admin/             # Administrator dashboard & management views
│   │   │   ├── staff/             # Academic staff & tuition cash desk views
│   │   │   ├── teacher/           # Teacher portal (attendance, grading, AI quiz)
│   │   │   ├── student/           # Student portal (schedule, grades, AI advice)
│   │   │   └── login/             # Authentication & role redirection
│   │   ├── components/            # Reusable UI component library
│   │   └── services/api.ts        # Axios API client & token interceptors
│   ├── Dockerfile                 # Standalone production container image
│   └── package.json
│
├── docs/                          # Technical specifications & project reports
│   ├── design/
│   │   ├── EnglishCenterTOP.docx  # Baseline architectural & requirements specification
│   │   └── EnglishCenterTOP.md    # Full Markdown technical documentation
│   └── testing/                   # Test plan, 145 test cases & QA report
├── scripts/                       # Deployment, migration, and automation scripts
├── docker-compose.yml             # Docker services orchestration (DB + Backend + Frontend)
├── .env.example                   # Environment configuration template
└── README.md                      # Project master documentation
```

---

## 🚀 6. Getting Started & Installation

You can deploy and run ETC English Center using **Docker** (recommended for instant 1-command deployment) or via **Manual Local Installation**.

---

### Method 1: Instant Deployment with Docker (Recommended)

Run the entire stack (PostgreSQL database, NestJS Backend API, and Next.js Frontend) on any operating system (Windows, macOS, Linux) with a single command.

#### 📋 Prerequisites
* Install **Docker** and **Docker Compose**:
  * **Windows / macOS:** Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) (enable WSL 2 on Windows).
  * **Ubuntu Linux:** Install Docker Engine (`sudo apt install docker.io docker-compose-plugin`).

#### 🚀 4-Step Deployment Guide

1. **Clone the repository & configure environment:**
   ```bash
   git clone https://github.com/phongls206/LMS-AI.git
   cd LMS-AI

   # Copy environment configuration template
   cp .env.example .env
   ```
   > **Note:** Open `.env` and set your `GEMINI_API_KEY` to enable the GenAI features.

2. **Launch all 3 container services:**
   ```bash
   docker compose up -d --build
   ```
   Docker automatically spins up:
   * **`etc_english_db`:** PostgreSQL 15 on port `5432` with a persistent Docker volume.
   * **`etc_english_backend`:** NestJS API Server on port `8000` (multi-stage build).
   * **`etc_english_frontend`:** Next.js Standalone Web App on port `3000`.

3. **Synchronize database schema & seed initial demo data:**
   ```bash
   # Synchronize Prisma schema into PostgreSQL container
   docker compose exec backend npx prisma db push

   # Seed sample data (courses, classes, faculty, students, invoices)
   docker compose exec backend npm run db:seed
   ```

4. **Access the application:**
   * 🌐 **Frontend Web App:** [http://localhost:3000](http://localhost:3000)
   * 📚 **Interactive Swagger API Docs:** [http://localhost:8000/api/docs](http://localhost:8000/api/docs)
   * 🗄️ **PostgreSQL Database:** `localhost:5432` (`etc_user` / `etc_password_secure_2026`)

---

### Method 2: Manual Local Installation

#### 📋 Prerequisites
* **Node.js:** Version `>= 18.x` (Recommended: Node.js 20 or 22 LTS)
* **Package Manager:** `npm` (`>= 9.x`) or `pnpm`
* **Git:** Latest stable version
* **PostgreSQL:** Neon Serverless cloud instance or local PostgreSQL server

#### Step 1: Clone the Repository
```bash
git clone https://github.com/phongls206/LMS-AI.git
cd LMS-AI
```

#### Step 2: Configure & Start the Backend
1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Create `.env` based on `.env.example`:
   ```env
   DATABASE_URL="postgresql://username:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="24h"
   PORT=8000
   NODE_ENV="development"
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
   GEMINI_FLASH_MODEL="gemini-3.8-flash"
   GEMINI_PRO_MODEL="gemini-3.1-pro"
   GEMINI_TIMEOUT_MS=30000
   ```
3. Install dependencies and initialize database:
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```
4. Start the backend development server:
   ```bash
   npm run start:dev
   ```
   * 🎯 **API Root:** `http://localhost:8000`
   * 📚 **Swagger Docs:** `http://localhost:8000/api/docs`

#### Step 3: Configure & Start the Frontend
1. Open a new terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Set API URL in `.env.local`:
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
   ```
3. Install dependencies & run development server:
   ```bash
   npm install
   npm run dev
   ```
   * 🌐 **Web Client Application:** `http://localhost:3000`

---

### Common Docker Operations & Maintenance

```bash
# View real-time aggregated logs
docker compose logs -f

# View individual service logs
docker compose logs -f backend
docker compose logs -f frontend

# Check container health & status
docker compose ps

# Restart a specific service
docker compose restart backend

# Stop all services (database volume remains preserved)
docker compose stop

# Stop and remove containers & bridge network
docker compose down

# Backup PostgreSQL database to host machine
docker exec -t etc_english_db pg_dump -U etc_user etc_english > backup_etc.sql

# Restore PostgreSQL database from backup file
docker exec -i etc_english_db psql -U etc_user etc_english < backup_etc.sql
```

---

## 👥 7. Demo Test Credentials

| Role | Username | Password | Features / Test Scope |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin01` | `Admin@123` | Executive dashboard, course & class provisioning, schedule conflict detection, teacher assignment, center-wide tuition auditing, revenue & completion reports |
| **Teacher** | `teacher01` | `Admin@123` | Assigned classes & weekly timetable, 4-state session attendance matrix, weighted grading ($20\% + 30\% + 50\%$), AI quiz generator |
| **Student** | `student01` | `Admin@123` | Class schedule, transcripts, self-service enrollment, tuition balance & payment deadlines, AI study advisor & interactive practice |
| **Academic Staff / Counselor** | `staff01` | `Admin@123` | Student onboarding & CEFR placement level recording, course counseling, class enrollment, tuition invoice generation & split-payment cash desk |

---

## 🖥️ 8. Role-Based Functional Modules

### 1. Administrator Portal (`/admin`)
* **Executive Dashboard (`/admin/dashboard`):** Real-time analytics on revenue, active student count, class utilization, and CEFR level distribution.
* **Course Catalog (`/admin/courses`):** Manage IELTS, TOEIC, and Communicative curriculum, prerequisites, duration, and tuition fee schedules.
* **Class & Schedule Management (`/admin/classes`):** Class provisioning, classroom allocation, instructor assignment, and automated collision detection.
* **Student Registry (`/admin/students`):** Complete student database, enrollment history, outstanding balance overview, and detailed 360° modal profiles.
* **Faculty Directory (`/admin/teachers`):** Faculty profiles, academic specializations, and teaching assignment metrics.
* **Finance & Accounting (`/admin/fees`):** Center-wide tuition invoice auditing, payment recording, and cashier logs.
* **Reports & Analytics (`/admin/reports`):** Monthly revenue reports, course completion rates, and enrollment trends.

### 2. Teacher Portal (`/teacher`)
* **Assigned Classes & Schedule (`/teacher/classes`):** Assigned class rosters, curriculum progress, and interactive weekly timetables.
* **Session Attendance (`/teacher/attendance`):** 4-state session check-ins with an integrated **Full-Course Attendance Matrix** and absence history tracking.
* **Grading & Academic Transcripts (`/teacher/grades`):** Continuous assessment scoring (Attendance 20%, Midterm 30%, Final 50%) with automatic classification (Pass/Fail).
* **AI Quiz Generator (`/teacher/ai-exercises`):** Specify skill focus (Reading/Listening/Grammar/Vocabulary) and target CEFR level to automatically produce formatted test items with answers.

### 3. Student Portal (`/student`)
* **Student Workspace & Timetable (`/student/dashboard`, `/student/schedule`):** Today's sessions, assigned rooms, and instructor details.
* **Transcripts & Progress (`/student/grades`):** Term-by-term score breakdowns, GPA computation, and graduation eligibility status.
* **Class Registration (`/student/enroll`):** Self-service registration into eligible classes matching entrance level, triggering real-time automated invoice creation.
* **Tuition & Payment History (`/student/fees`):** Instant access to invoice balances, payment history, and payment deadlines.
* **AI Study Advisor (`/student/ai-consult`):** Interactive AI counselor assessing target scores and availability to prescribe tailored course tracks.
* **AI Interactive Practice (`/student/ai-practice`):** On-demand practice test generation with instant AI scoring and explanatory feedback.
* **AI Learning Summary (`/student/ai-progress`):** Generative academic diagnostics highlighting areas for reinforcement and revision strategies.

### 4. Academic Staff / Counselor Portal (`/staff`)
* **Counselor Workspace (`/staff/dashboard`):** Daily enrollment overview, pending fee collections, and student consultation tasks.
* **Student Admission & Profiling (`/staff/new-student`):** Register new student profiles, record contact details, and input initial CEFR placement test results.
* **Class Enrollment & Registration (`/staff/collect-fee`, `/staff/enroll`):** Enroll students into suitable open classes based on CEFR level and schedule availability.
* **Tuition Fee Collection & Receipts (`/staff/collect-fee`):** Process single or split payments (cash or bank transfer), recalculate balances, and generate printable A4 tuition receipts.

---

## 📚 9. Interactive API Documentation (Swagger)

The backend provides complete OpenAPI documentation accessible at:  
👉 **`http://localhost:8000/api/docs`**

Key highlights:
* Covers all **14 Core Use Cases** specified in the design baseline.
* Full DTO schemas with parameter constraints and response types.
* Integrated **Authorize** button with Bearer JWT support for immediate API execution within the browser.

---

## 🧪 10. Testing & Quality Assurance

The codebase includes automated test suites and linting utilities:

```bash
# Run unit tests via Vitest
npm run test

# Run end-to-end (E2E) tests
npm run test:e2e

# Run test coverage report
npm run test:cov

# Run code linter
npm run lint
```

To explore the database schema visually:
```bash
npx prisma studio
```

---

## 📬 11. Contact & Support

For inquiries, academic collaboration, or architectural discussions:
* **Lead Developer:** Le Hong Phong
* **Email:** [lehongphong2108@outlook.com](mailto:lehongphong2108@outlook.com)
* **Project Repository:** [github.com/phongls206/LMS-AI](https://github.com/phongls206/LMS-AI)

---
