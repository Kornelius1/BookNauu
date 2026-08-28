# BookNauu

BookNauu is a multi-tenant reservation management system for businesses.

The application helps businesses manage:

* Businesses
* Resources
* Resource Types
* Reservations
* Customers
* Team Members
* Operating Hours
* Google Calendar

The backend is built with Spring Boot, while the frontend is built with React.

## Status

Core reservation management is fully operational.

Available features:

* Authentication & JWT authorization
* Business and membership management
* Resource and Resource Type management
* Customer management
* Reservation management
* Reservation status management
* Operating hours and reservation conflict validation
* Dashboard
* Public reservations
* Google Calendar OAuth
* Google Calendar connection storage
* Reservation synchronization with Google Calendar
* Create, update, and delete Google Calendar events

Google Calendar push notifications for **Google Calendar → BookNauu** synchronization are still under development and require a public HTTPS webhook.

AI Assistant is planned.

## Main Features

### Authentication

* Registration and login
* JWT authentication
* Role-based authorization
* Business membership
* Roles:

  * `OWNER`
  * `ADMIN`
  * `CUSTOMER`

### Business

* Business profile and business context
* Operating hours
* Business-specific resources
* Business-specific reservations and customers

### Resources

* Resource CRUD
* Resource Type management
* Availability/status management
* Resource pricing

### Reservations

* Create, read, update, and delete reservations
* Status:

  * `PENDING`
  * `CONFIRMED`
  * `CANCELLED`
  * `COMPLETED`
* Reservation conflict validation
* Business operating hours validation
* Resource validation
* Customer association
* Total price calculation
* Public reservations

### Customers

* Customer data is associated with a business
* Public reservations can create a new customer or use an existing customer
* Customers do not need to log in to make a public reservation

### Dashboard

The dashboard displays information such as:

* Reservation summary
* Today's reservations
* Recent activities
* Resource availability
* Reservation value
* Customer and resource statistics

## Google Calendar

Each business can connect its Google Calendar through OAuth.

After connecting, BookNauu creates a dedicated calendar:

```text
BookNauu Reservations
```

`CONFIRMED` reservations can be synchronized to this calendar.

### Current Synchronization

```text
BookNauu

   │

   ├── Create reservation
   ├── Update reservation
   ├── Change status
   └── Delete reservation

   │

   ▼

Google Calendar
```

BookNauu stores the `googleCalendarEventId` on each reservation so the corresponding event can be updated or deleted.

Existing `CONFIRMED` reservations created before Google Calendar was connected can also be synchronized once the connection is established.

### OAuth

OAuth uses the authorization code flow with offline access.

The following data is stored in the database:

* Google account email
* Google Calendar ID
* Refresh token
* Connection timestamp
* Update timestamp

Access tokens are not stored in local files.

OAuth state:

* Generated using a secure random generator
* Valid for 10 minutes
* Can only be used once
* Stored in the database

The refresh token is a sensitive credential and must never be:

* Committed to the repository
* Written to logs
* Sent to the frontend

### Google Calendar → BookNauu

Two-way synchronization is currently being developed using Google Calendar push notifications.

The planned flow is:

```text
Google Calendar

      │

      ▼

HTTPS Webhook

      │

      ▼

BookNauu

      │

      ▼

Reservation
```

For local development, the webhook requires a public HTTPS URL, for example through a tunneling service.

## Technology Stack

### Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* PostgreSQL
* Flyway
* Lombok
* Maven
* JWT
* Google Calendar API / OAuth

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* React Router
* Axios
* Lucide React

## Project Structure

```text
BookNauu/

├── backend/
│   └── src/main/java/com/reservation/
│       ├── auth/
│       ├── business/
│       ├── common/
│       ├── customer/
│       ├── integration/
│       │   └── google/
│       ├── reservation/
│       ├── resource/
│       └── security/
│
└── frontend/
    └── src/
        ├── api/
        ├── components/
        ├── context/
        ├── hooks/
        ├── lib/
        ├── pages/
        ├── routes/
        ├── schemas/
        ├── services/
        ├── store/
        └── types/
```

## API

Example endpoints:

```text
/api/v1/auth/**

/api/v1/business/**

/api/v1/business/dashboard

/api/v1/business/operating-hours

/api/v1/integrations/google/calendar/**

/api/reservations

/api/public/**
```

## Development

### Backend

```bash
cd backend
mvn spring-boot:run
```

Default backend:

```text
http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Default frontend:

```text
http://localhost:5173
```

## Environment

Example frontend configuration:

```env
VITE_API_URL=http://localhost:8080
```

Google OAuth uses configuration such as:

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:8080/api/v1/integrations/google/calendar/callback
```

The Google Calendar webhook requires a public HTTPS URL:

```env
GOOGLE_WEBHOOK_URL=https://your-public-domain/api/v1/integrations/google/calendar/webhook
```

Never commit:

* Google client secret
* Google refresh token
* JWT secret
* Database password
* Other sensitive credentials

## Reservation Rules

Reservations are validated according to the business configuration.

Main validation rules:

* The resource must belong to the business
* The resource must be available
* End time must be after start time
* The reservation time must be within operating hours
* Reservation conflicts are not allowed
* Total price is calculated based on the reservation duration and resource price

## Design Principles

* Business logic belongs in backend services.
* Authorization is always enforced by the backend.
* Data is isolated by business.
* External integrations must not disrupt the core reservation flow.
* Avoid overengineering.
* Never store sensitive credentials in local files or source control.

## AI Assistant — Planned

The AI Assistant has not been implemented yet.

Initial plan:

```text
React

  ↓

Spring Boot AI Service

  ↓

Local LLM / Ollama

  ↓

Tool Calling

  ↓

Existing Business Services
```

The AI Assistant will use existing services instead of accessing the database directly.

Important or destructive operations will require user confirmation.

## Current Status

| Area                                | Status      |
| ----------------------------------- | ----------- |
| Authentication                      | Completed   |
| JWT Authorization                   | Completed   |
| Business Management                 | Completed   |
| Membership Management               | Completed   |
| Resource Management                 | Completed   |
| Resource Type Management            | Completed   |
| Customer Management                 | Completed   |
| Reservation Management              | Completed   |
| Public Reservations                 | Completed   |
| Operating Hours                     | Completed   |
| Dashboard                           | Completed   |
| Google Calendar OAuth               | Completed   |
| Google Calendar Connection          | Completed   |
| BookNauu → Google Calendar          | Completed   |
| Google Calendar →  BookNauu         | Working     |
| Existing Confirmed Reservation Sync | Working     |
| Google Calendar → BookNauu Webhook  | In Progress |
| AI Assistant                        | Planned     |

## License

Private / development project.
