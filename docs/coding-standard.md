# Coding Standards

## Reservation Management System

Version: 1.0.0

---

# Purpose

Dokumen ini mendefinisikan standar penulisan kode yang wajib diikuti oleh seluruh developer agar kode tetap:

- Konsisten
- Mudah dibaca
- Mudah dipelihara
- Mudah diuji
- Enterprise Ready

---

# General Principles

Project mengikuti prinsip berikut:

- Clean Code
- SOLID Principle
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple)
- Separation of Concerns
- Convention over Configuration

---

# Java Version

Gunakan

```
Java 21 LTS
```

---

# Package Structure

Gunakan Modular Architecture.

```
src/main/java/com/reservation

├── auth
├── user
├── reservation
├── payment
├── calendar
├── sheet
├── common
└── config
```

Setiap module memiliki struktur:

```
reservation

├── controller
├── service
├── repository
├── entity
├── dto
├── mapper
└── exception
```

---

# Naming Convention

## Package

Gunakan huruf kecil.

✅

```
reservation

payment

calendar
```

❌

```
Reservation

ReservationModule
```

---

## Class

Gunakan PascalCase.

✅

```
ReservationController

UserService

PaymentRepository
```

---

## Interface

Tidak menggunakan prefix "I".

✅

```
UserService
```

❌

```
IUserService
```

---

## Method

Gunakan camelCase.

✅

```
createReservation()

findById()

updatePaymentStatus()
```

---

## Variable

Gunakan camelCase.

```
reservationDate

paymentStatus

googleEventId
```

---

## Constant

Gunakan UPPER_CASE.

```
MAX_LOGIN_ATTEMPT

DEFAULT_PAGE_SIZE
```

---

# Controller Rules

Controller hanya bertugas:

- menerima request
- memanggil service
- mengembalikan response

Controller tidak boleh:

- business logic
- query database
- kalkulasi

---

Contoh

```java
@PostMapping
public ApiResponse createReservation(
        @Valid @RequestBody ReservationRequest request) {

    return reservationService.create(request);
}
```

---

# Service Rules

Business Logic hanya boleh berada di Service.

Contoh

```
ReservationService

PaymentService

CalendarService
```

Service tidak boleh mengetahui HTTP Request.

---

# Repository Rules

Repository hanya untuk database.

Tidak boleh:

- validasi
- business logic

---

# Entity Rules

Entity hanya merepresentasikan tabel.

Tidak boleh:

- DTO
- Business Logic
- JSON Response

---

# DTO Rules

Gunakan DTO untuk seluruh request dan response.

Jangan pernah mengirim Entity langsung ke client.

Contoh

```
LoginRequest

ReservationRequest

ReservationResponse
```

---

# Validation

Gunakan Jakarta Validation.

Contoh

```java
@NotBlank

@Email

@NotNull

@Size

@Positive
```

Validation dilakukan di DTO.

---

# Dependency Injection

Gunakan Constructor Injection.

✅

```java
@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository repository;

}
```

❌

```java
@Autowired

private UserRepository repository;
```

---

# Lombok

Gunakan seperlunya.

Direkomendasikan

```
@Getter

@Setter

@Builder

@RequiredArgsConstructor

@NoArgsConstructor

@AllArgsConstructor
```

Hindari

```
@Data
```

karena menghasilkan terlalu banyak method secara otomatis.

---

# Exception Handling

Seluruh Exception harus ditangani melalui

```
GlobalExceptionHandler
```

Controller tidak boleh menggunakan

```
try-catch
```

---

# Logging

Gunakan

```java
@Slf4j
```

Contoh

```java
log.info("Reservation {} created", reservationId);
```

Jangan pernah menggunakan

```java
System.out.println()
```

---

# Transaction

Gunakan

```java
@Transactional
```

pada Service.

Jangan gunakan pada Controller.

---

# API Response

Gunakan format standar.

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
  "message": "Validation Failed"
}
```

---

# Database Naming

Gunakan

snake_case

Contoh

```
reservation_date

payment_status

created_at
```

---

# Table Naming

Gunakan bentuk plural.

```
users

payments

reservations
```

---

# Migration

Semua perubahan database wajib melalui Flyway.

Contoh

```
V1__create_users.sql

V2__create_reservations.sql
```

Jangan mengubah database secara manual.

---

# Commit Convention

Gunakan Conventional Commit.

```
feat:

fix:

docs:

refactor:

test:

ci:

build:

perf:

chore:
```

Contoh

```
feat(auth): implement login

fix(payment): verify callback

docs: update roadmap
```

---

# Git Branch

```
main

develop

feature/*
```

Contoh

```
feature/authentication

feature/payment

feature/google-calendar
```

---

# REST API Naming

Gunakan noun.

✅

```
GET /reservations

POST /reservations

GET /users
```

❌

```
GET /getReservation

POST /createReservation
```

---

# HTTP Method

GET

Mengambil data

POST

Membuat data

PUT

Update seluruh resource

PATCH

Update sebagian resource

DELETE

Menghapus data

---

# Pagination

Gunakan parameter berikut.

```
?page=0

&size=10

&sort=createdAt
```

---

# Code Formatting

Gunakan

```
4 Spaces

UTF-8

LF Line Ending
```

---

# Maximum Rules

Method

```
≤ 30 baris
```

Class

```
≤ 300 baris
```

Parameter Method

```
≤ 4 parameter
```

Jika lebih, gunakan DTO.

---

# Comment

Hanya komentar jika benar-benar diperlukan.

❌

```java
// increment i
i++;
```

✅

```java
// Calculate remaining reservation slot
```

---

# TODO

Gunakan format.

```java
// TODO(kornelius): Implement Google Calendar synchronization
```

---

# Testing

Gunakan

- JUnit 5
- Mockito
- Spring Boot Test

Minimal coverage

```
80%
```

---

# Documentation

Semua Public API wajib memiliki Swagger Annotation.

Contoh

```java
@Operation(summary = "Create Reservation")
```

---

# Security

Password

```
BCrypt
```

JWT

```
Bearer Token
```

Credential

Tidak boleh di-hardcode.

Gunakan

```
application.yml

Environment Variable
```

---

# Pull Request Checklist

Sebelum Merge

- [ ] Build berhasil
- [ ] Test berhasil
- [ ] Tidak ada warning
- [ ] Swagger diperbarui
- [ ] Flyway diperbarui (jika perlu)
- [ ] Dokumentasi diperbarui

---

# Code Review Checklist

Reviewer harus memastikan:

- Penamaan sesuai standar
- Tidak ada duplicate code
- Tidak ada business logic di Controller
- DTO digunakan dengan benar
- Validation lengkap
- Logging sesuai
- Exception ditangani
- Unit Test tersedia

---

# Tools

Direkomendasikan

- IntelliJ IDEA
- PostgreSQL
- pgAdmin
- Docker Desktop
- Git
- Maven
- Postman
- Bruno (Opsional)

---

# References

- Oracle Java Code Conventions
- Spring Boot Documentation
- Spring Security Documentation
- Flyway Documentation
- REST API Best Practices

---

# Document Owner

Backend Team

---

Last Updated

August 2026