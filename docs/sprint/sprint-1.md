# Sprint 1 — Authentication

Status: 🚧 In Progress

Duration: 2 Weeks

---

# Objective

Membangun Authentication System menggunakan JWT.

---

# Module

auth/

---

# Backlog

## Entity

- [ ] User

---

## DTO

- [ ] RegisterRequest
- [ ] LoginRequest
- [ ] LoginResponse
- [ ] UserResponse

---

## Repository

- [ ] UserRepository

---

## Service

- [ ] UserService
- [ ] AuthenticationService

---

## Controller

- [ ] AuthController

---

## Security

- [ ] JWT Provider
- [ ] JWT Filter
- [ ] Password Encoder
- [ ] Security Config

---

## API

- [ ] POST /auth/register
- [ ] POST /auth/login
- [ ] GET /auth/me

---

## Exception

- [ ] Email Already Exists
- [ ] Invalid Password
- [ ] User Not Found

---

## Testing

- [ ] Register Test
- [ ] Login Test

---

# Deliverables

- Login
- Register
- JWT Authentication
- BCrypt Password

---

# Acceptance Criteria

- Register berhasil
- Login menghasilkan JWT
- JWT dapat digunakan
- Password terenkripsi
- Swagger terdokumentasi

---

# Branch

feature/authentication