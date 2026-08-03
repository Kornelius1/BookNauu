---

# 📸 System Preview

> UI akan dikembangkan pada tahap berikutnya. Berikut adalah gambaran alur sistem.

```mermaid
flowchart LR

Customer --> Website

Website --> SpringBoot

SpringBoot --> PostgreSQL

SpringBoot --> GoogleCalendar

SpringBoot --> GoogleSheets

SpringBoot --> PaymentGateway
```

---

# 🏛 System Architecture

```mermaid
flowchart TD

A[Client]

A --> B[REST Controller]

B --> C[Service Layer]

C --> D[Repository]

D --> E[(PostgreSQL)]

C --> F[Google Calendar API]

C --> G[Google Sheets API]

C --> H[Payment Gateway]
```

---

# 🧩 Clean Architecture

```
Controller
    │
    ▼
Service
    │
    ▼
Repository
    │
    ▼
Database
```

Additional Layers

```
Security

↓

Validation

↓

Exception Handler

↓

DTO Mapper
```

---

# 🗂 Project Modules

| Module | Description | Status |
|---------|-------------|--------|
| Authentication | Login & JWT | 🚧 |
| User | User Management | 🚧 |
| Reservation | Reservation Module | 🚧 |
| Payment | Payment Gateway | 🚧 |
| Calendar | Google Calendar Sync | 🚧 |
| Sheets | Google Sheets Export | 🚧 |
| Dashboard | Reporting Dashboard | 🚧 |

---

# 📅 Reservation Workflow

```mermaid
sequenceDiagram

Customer->>System: Create Reservation

System->>Database: Save Reservation

System->>Payment Gateway: Create Payment

Payment Gateway-->>System: Payment Success

System->>Google Calendar: Create Event

System->>Google Sheets: Append Record

System-->>Customer: Reservation Confirmed
```

---

# 💳 Payment Flow

```mermaid
sequenceDiagram

Customer->>Website: Checkout

Website->>Backend: Create Payment

Backend->>Payment Gateway: Request Payment

Payment Gateway-->>Customer: Payment Page

Customer->>Payment Gateway: Complete Payment

Payment Gateway-->>Backend: Callback

Backend->>Database: Update Status

Backend-->>Customer: Payment Success
```

---

# 📅 Google Calendar Synchronization

```
Reservation Created

↓

Create Calendar Event

↓

Update Calendar Event

↓

Delete Calendar Event

↓

Synchronize Changes
```

Future Enhancement

- Two-way Synchronization
- Automatic Conflict Detection
- Reminder Notification

---

# 📊 Google Sheets Export

```
Reservation

↓

Generate Report

↓

Append Row

↓

Google Sheets
```

Export Fields

- Reservation ID
- Customer
- Reservation Date
- Reservation Time
- Payment Status
- Total Amount

---

# 🗃 Database Design

```
users

reservations

payments

reservation_logs

calendar_sync

sheet_exports
```

Entity Relationship Diagram tersedia di:

```
docs/erd.md
```

---

# 📈 Development Timeline

```mermaid
gantt

title Reservation System Roadmap

dateFormat YYYY-MM-DD

section Foundation

Project Setup :done, a1, 2026-08-01, 3d

Database :done, a2, after a1, 2d

Authentication :a3, after a2, 5d

section Core

Reservation :a4, after a3, 7d

Payment :a5, after a4, 5d

section Integration

Google Calendar :a6, after a5, 4d

Google Sheets :a7, after a6, 3d

section Deployment

Docker :a8, after a7, 3d

CI/CD :a9, after a8, 3d
```

---

# 🛡 Security Features

- JWT Authentication
- BCrypt Password Encryption
- Role-Based Authorization
- Request Validation
- SQL Injection Prevention
- XSS Protection
- CSRF Protection
- Global Exception Handling

---

# 📦 Planned Integrations

| Service | Purpose |
|----------|---------|
| Google Calendar API | Reservation Scheduling |
| Google Sheets API | Reporting |
| Midtrans / Xendit / DOKU | Payment Gateway |
| Gmail API | Email Notification |
| Docker | Deployment |
| GitHub Actions | CI/CD |

---

# 🧪 Testing Strategy

| Test | Status |
|------|--------|
| Unit Test | ⏳ |
| Integration Test | ⏳ |
| Repository Test | ⏳ |
| Service Test | ⏳ |
| API Test | ⏳ |

Framework

- JUnit 5
- Mockito
- Spring Boot Test

---

# 📚 Coding Standards

Project mengikuti standar:

- Clean Code
- SOLID Principle
- RESTful API
- Layered Architecture
- Conventional Commit
- Git Flow
- Java Code Convention

---

# 📖 Documentation

| Document | Description |
|----------|-------------|
| architecture.md | System Architecture |
| erd.md | Entity Relationship Diagram |
| roadmap.md | Project Roadmap |
| api.md | API Specification |
| deployment.md | Deployment Guide |
| coding-standard.md | Coding Guidelines |

---

# ⭐ Future Enhancements

- Multi Branch Support
- Reservation Reminder
- Email Notification
- WhatsApp Notification
- Dashboard Analytics
- QR Code Check-in
- Customer Loyalty Program
- AI-based Reservation Prediction

---