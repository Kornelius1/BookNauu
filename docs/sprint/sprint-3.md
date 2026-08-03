# Sprint 3 — Payment Integration

Status: ⏳ Planned

Duration: 2 Weeks

---

# Objective

Mengintegrasikan Payment Gateway.

---

# Module

payment/

---

# Backlog

## Entity

- [ ] Payment

---

## DTO

- [ ] PaymentRequest
- [ ] PaymentResponse

---

## Repository

- [ ] PaymentRepository

---

## Service

- [ ] PaymentService

---

## Controller

- [ ] PaymentController

---

## Features

- [ ] Create Payment
- [ ] Callback Verification
- [ ] Payment Status
- [ ] Payment History

---

## Gateway

Target awal:

- [ ] DOKU

Target berikutnya:

- [ ] Midtrans

---

## API

- [ ] POST /payments
- [ ] POST /payments/callback
- [ ] GET /payments/{id}

---

## Security

- [ ] Signature Verification
- [ ] Callback Validation

---

## Testing

- [ ] Payment Success
- [ ] Payment Failed
- [ ] Callback Test

---

# Deliverables

- Payment Gateway terintegrasi
- Callback berjalan
- Status pembayaran otomatis diperbarui

---

# Acceptance Criteria

- Payment berhasil dibuat
- Callback tervalidasi
- Status reservation diperbarui setelah pembayaran sukses
- Event Google Calendar belum dibuat (akan dikerjakan pada Sprint 4)