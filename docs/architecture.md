# System Architecture

## Reservation Management System

Version: 1.0.0

---

# Overview

Reservation Management System merupakan backend berbasis **Spring Boot** yang menyediakan REST API untuk mengelola reservasi, pembayaran, sinkronisasi Google Calendar, serta ekspor laporan ke Google Sheets.

Arsitektur sistem dirancang menggunakan **Layered Architecture** dengan prinsip **Clean Code**, **SOLID**, dan pemisahan tanggung jawab (Separation of Concerns).

---

# Architecture Goals

- Mudah dikembangkan
- Mudah diuji (Testable)
- Mudah dipelihara
- Modular
- Enterprise Ready
- Mendukung integrasi layanan pihak ketiga

---

# High Level Architecture

```text
                        Client
     (Web / Mobile / Admin Dashboard)
                        │
                        ▼
                Spring Boot REST API
                        │
        ┌───────────────┴───────────────┐
        │                               │
 Authentication                  Business Modules
        │                               │
        ▼                               ▼
   Security Layer                 Service Layer
        │                               │
        └───────────────┬───────────────┘
                        ▼
                 Repository Layer
                        │
                        ▼
                  PostgreSQL Database

────────────────────────────────────────────

External Integrations

Payment Gateway
Google Calendar API
Google Sheets API
```

---

# Layer Architecture

## Controller Layer

Responsibilities

- Receive HTTP Request
- Validate Request
- Return HTTP Response
- Call Service

Controller **tidak boleh** berisi business logic.

Contoh

```
ReservationController

AuthenticationController

PaymentController
```

---

## Service Layer

Responsibilities

- Business Logic
- Validation
- Transaction
- Call Repository
- Call External Services

Contoh

```
ReservationService

PaymentService

CalendarService
```

Semua aturan bisnis ditempatkan pada layer ini.

---

## Repository Layer

Responsibilities

- Database Access
- CRUD
- Query

Menggunakan

- Spring Data JPA
- Hibernate

Repository tidak boleh memiliki business logic.

---

## Entity Layer

Representasi tabel database.

Contoh

```
User

Reservation

Payment

ReservationLog
```

---

## DTO Layer

Digunakan untuk komunikasi API.

Contoh

```
LoginRequest

LoginResponse

ReservationRequest

ReservationResponse
```

Entity **tidak dikirim langsung ke client**.

---

# Security Architecture

Menggunakan

- Spring Security
- JWT Authentication
- BCrypt Password Encoder

Flow

```
Login

↓

JWT Generated

↓

Client Store Token

↓

Authorization Header

↓

JWT Filter

↓

Authentication

↓

Controller
```

---

# Reservation Flow

```text
Customer

↓

Create Reservation

↓

Reservation Validation

↓

Save Reservation

↓

Generate Payment

↓

Waiting Payment

↓

Payment Success

↓

Google Calendar Sync

↓

Google Sheets Export

↓

Reservation Confirmed
```

---

# Payment Architecture

```text
Customer

↓

Backend

↓

Payment Gateway

↓

Customer Payment

↓

Payment Callback

↓

Backend Verification

↓

Update Payment Status
```

---

# Google Calendar Integration

System akan membuat event secara otomatis setelah pembayaran berhasil.

Flow

```
Reservation Confirmed

↓

Create Google Calendar Event

↓

Store Event ID

↓

Future Update

↓

Delete Event
```

Sinkronisasi yang direncanakan

- Create Event
- Update Event
- Delete Event
- Two-way Synchronization

---

# Google Sheets Integration

Digunakan untuk kebutuhan reporting.

Flow

```
Reservation

↓

Payment

↓

Generate Report

↓

Append Row

↓

Google Sheets
```

---

# Database Architecture

Database

```
PostgreSQL
```

Migration

```
Flyway
```

Naming Convention

```
snake_case
```

Contoh

```
created_at

updated_at

reservation_date
```

---

# Planned Database Tables

```
users

roles

reservations

reservation_details

payments

payment_transactions

calendar_events

sheet_exports

reservation_logs
```

---

# Project Structure

```
src/main/java/com/reservation

├── auth
│
├── user
│
├── reservation
│
├── payment
│
├── calendar
│
├── sheet
│
├── common
│
└── config
```

---

# Common Module

```
common

config

exception

security

response

mapper

util
```

---

# External Services

## Payment Gateway

Planned

- DOKU
- Midtrans

---

## Google

Google Calendar API

Google Sheets API

---

# Error Handling

Menggunakan

Global Exception Handler

Semua response error memiliki format yang sama.

Contoh

```json
{
  "timestamp": "...",
  "status": 404,
  "message": "Reservation not found",
  "path": "/api/reservations/1"
}
```

---

# API Response Standard

Semua endpoint menggunakan format berikut

Success

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

# Logging

Menggunakan

Spring Boot Logging

Future

- Logback
- ELK Stack

---

# Testing Strategy

Unit Test

Repository Test

Integration Test

Controller Test

Service Test

---

# Deployment Architecture

Future Deployment

```text
GitHub

↓

GitHub Actions

↓

Docker Image

↓

Docker Compose

↓

VPS / Cloud Server

↓

Nginx

↓

Spring Boot

↓

PostgreSQL
```

---

# Architecture Principles

Project mengikuti prinsip berikut

- SOLID Principle
- Clean Architecture
- Layered Architecture
- Separation of Concerns
- Dependency Injection
- RESTful API
- Conventional Commit
- Git Flow

---

# Future Improvements

- Redis Cache
- RabbitMQ
- Email Notification
- WhatsApp Notification
- QR Code Check-in
- Dashboard Analytics
- Multi Branch Reservation
- Multi Tenant Support

---

# Document Owner

Backend Team

---

Last Updated

August 2026