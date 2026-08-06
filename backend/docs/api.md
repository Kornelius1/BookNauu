# API Specification

## Reservation Management System

Version: 1.0.0

---

# Overview

Dokumen ini mendefinisikan seluruh REST API yang digunakan pada Reservation Management System.

Base URL

```
http://localhost:8080/api/v1
```

Production

```
https://api.reservation-system.com/api/v1
```

---

# API Standard

Semua API menggunakan format JSON.

Request Header

```http
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

---

# Standard Success Response

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

---

# Standard Error Response

```json
{
  "success": false,
  "message": "Validation Failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

# HTTP Status Code

| Code | Description |
|------|-------------|
|200|OK|
|201|Created|
|204|No Content|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|409|Conflict|
|422|Validation Error|
|500|Internal Server Error|

---

# Authentication

## Register

POST

```
/auth/register
```

### Request

```json
{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
}
```

### Response

```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "id": 1
    }
}
```

---

## Login

POST

```
/auth/login
```

### Request

```json
{
    "email":"john@example.com",
    "password":"Password123"
}
```

### Response

```json
{
    "success": true,
    "message":"Login Success",
    "data":{
        "accessToken":"JWT_TOKEN",
        "expiresIn":3600
    }
}
```

---

## Get Current User

GET

```
/auth/me
```

Authorization Required

---

# User Module

## Get Profile

GET

```
/users/profile
```

---

## Update Profile

PUT

```
/users/profile
```

---

## Change Password

PUT

```
/users/change-password
```

---

# Reservation Module

## Create Reservation

POST

```
/reservations
```

### Request

```json
{
    "reservationDate":"2026-08-20",
    "reservationTime":"14:00",
    "guestCount":5,
    "notes":"Birthday Event"
}
```

---

## Get Reservation List

GET

```
/reservations
```

Query Parameter

```
?page=1

&size=10

&status=PENDING
```

---

## Get Reservation Detail

GET

```
/reservations/{id}
```

---

## Update Reservation

PUT

```
/reservations/{id}
```

---

## Cancel Reservation

DELETE

```
/reservations/{id}
```

---

## Check Availability

GET

```
/reservations/availability
```

Query

```
date=2026-08-20

time=14:00
```

Response

```json
{
    "available": true
}
```

---

# Payment Module

## Create Payment

POST

```
/payments
```

Request

```json
{
    "reservationId":1,
    "paymentMethod":"QRIS"
}
```

---

## Payment Callback

POST

```
/payments/callback
```

Dipanggil oleh Payment Gateway.

---

## Get Payment Status

GET

```
/payments/{id}
```

---

# Google Calendar

## Sync Reservation

POST

```
/calendar/sync/{reservationId}
```

---

## Update Calendar Event

PUT

```
/calendar/{reservationId}
```

---

## Delete Calendar Event

DELETE

```
/calendar/{reservationId}
```

---

# Google Sheets

## Export Reservation

POST

```
/sheets/export
```

---

## Export by Date

POST

```
/sheets/export/date
```

Request

```json
{
    "startDate":"2026-08-01",
    "endDate":"2026-08-31"
}
```

---

# Dashboard

## Dashboard Summary

GET

```
/dashboard/summary
```

Response

```json
{
    "todayReservation":10,
    "todayRevenue":2500000,
    "pendingPayment":4
}
```

---

## Reservation Statistics

GET

```
/dashboard/statistics
```

---

# Admin

## Get Users

GET

```
/admin/users
```

---

## Create Staff

POST

```
/admin/users
```

---

## Update User

PUT

```
/admin/users/{id}
```

---

## Delete User

DELETE

```
/admin/users/{id}
```

---

# Health Check

GET

```
/health
```

Response

```json
{
    "status":"UP"
}
```

---

# Error Codes

| Code | Meaning |
|------|---------|
|AUTH001|Invalid Email|
|AUTH002|Invalid Password|
|AUTH003|Unauthorized|
|RES001|Reservation Not Found|
|RES002|Reservation Conflict|
|PAY001|Payment Failed|
|PAY002|Payment Expired|
|CAL001|Google Calendar Sync Failed|
|SHEET001|Google Sheets Export Failed|

---

# Pagination Standard

Response

```json
{
    "success": true,
    "data": {
        "content": [],
        "page": 1,
        "size": 10,
        "totalElements": 120,
        "totalPages": 12
    }
}
```

---

# Filtering

Example

```
GET /reservations?status=PAID

GET /reservations?date=2026-08-20

GET /reservations?customer=John

GET /payments?status=SUCCESS
```

---

# Sorting

```
sort=reservationDate

sort=createdAt

sort=paymentStatus
```

---

# Security

Authentication

```
JWT Bearer Token
```

Authorization

| Role | Permission |
|------|------------|
|ADMIN|Full Access|
|STAFF|Reservation & Payment|
|CUSTOMER|Own Reservation|

---

# API Versioning

Current Version

```
v1
```

Base URL

```
/api/v1
```

Future

```
/api/v2
```

---

# Swagger

Swagger UI

```
http://localhost:8080/swagger-ui/index.html
```

OpenAPI

```
http://localhost:8080/v3/api-docs
```

---

# Future API

Planned Endpoint

```
/notifications

/email

/whatsapp

/files

/reports

/analytics
```