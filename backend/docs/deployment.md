# Deployment Guide

## Reservation Management System

Version: 1.0.0

---

# Overview

Dokumen ini menjelaskan proses deployment Reservation Management System mulai dari environment lokal hingga production.

Deployment dirancang menggunakan:

- Docker
- Docker Compose
- PostgreSQL
- Nginx
- GitHub Actions (Planned)

---

# Deployment Architecture

```text
                GitHub Repository
                       │
                       ▼
                GitHub Actions
                       │
                       ▼
               Docker Build Image
                       │
                       ▼
                Docker Registry
                       │
                       ▼
                VPS / Cloud Server
                       │
         ┌─────────────┴─────────────┐
         │                           │
      Nginx Reverse Proxy        PostgreSQL
         │
         ▼
 Spring Boot Application
         │
         ▼
 Google APIs / Payment Gateway
```

---

# Environment

## Development

| Component | Version |
|-----------|----------|
| Java | 21 LTS |
| Spring Boot | 4.x |
| PostgreSQL | 17 |
| Maven | 3.9+ |

---

## Production

Minimum Specification

| Resource | Recommendation |
|-----------|----------------|
| CPU | 2 Core |
| RAM | 4 GB |
| Storage | 40 GB SSD |
| OS | Ubuntu 24.04 LTS |

---

# Required Software

Server harus memiliki:

- Docker
- Docker Compose
- Git
- Nginx

---

# Clone Repository

```bash
git clone https://github.com/Kornelius1/reservation-system.git

cd reservation-system
```

---

# Configure Environment

Contoh `application-prod.yml`

```yaml
spring:
  datasource:
    url: jdbc:postgresql://postgres:5432/reservation_db
    username: postgres
    password: your_password

  jpa:
    hibernate:
      ddl-auto: validate

  flyway:
    enabled: true

server:
  port: 8080
```

---

# Environment Variables

Gunakan environment variable untuk data sensitif.

| Variable | Description |
|----------|-------------|
| DB_HOST | PostgreSQL Host |
| DB_PORT | PostgreSQL Port |
| DB_NAME | Database Name |
| DB_USERNAME | Database Username |
| DB_PASSWORD | Database Password |
| JWT_SECRET | JWT Secret Key |
| GOOGLE_CLIENT_ID | Google OAuth Client |
| GOOGLE_CLIENT_SECRET | Google OAuth Secret |
| GOOGLE_SHEET_ID | Spreadsheet ID |
| PAYMENT_API_KEY | Payment Gateway API Key |

---

# Maven Build

Build project

```bash
mvn clean package
```

Output

```
target/reservation-system.jar
```

---

# Docker Build

Build image

```bash
docker build -t reservation-system .
```

Check image

```bash
docker images
```

---

# Docker Compose

Menjalankan seluruh service

```bash
docker compose up -d
```

Stop service

```bash
docker compose down
```

---

# Planned docker-compose.yml

```yaml
version: "3.9"

services:

  app:
    build: .
    container_name: reservation-system

  postgres:
    image: postgres:17

  nginx:
    image: nginx:latest
```

---

# Database Migration

Flyway dijalankan otomatis ketika aplikasi startup.

Migration

```
src/main/resources/db/migration
```

Contoh

```
V1__create_users.sql

V2__create_reservations.sql
```

---

# Verify Deployment

Health Check

```
GET

/health
```

Expected Response

```json
{
    "status":"UP"
}
```

Swagger

```
http://server-ip/swagger-ui/index.html
```

---

# Reverse Proxy

Nginx

```text
Internet

↓

Nginx

↓

Spring Boot

↓

PostgreSQL
```

Future

- HTTPS
- Let's Encrypt
- HTTP/2

---

# SSL

Planned

Let's Encrypt

```
https://reservation.example.com
```

---

# Logging

Current

Spring Boot Logging

Future

- Logback
- ELK Stack
- Grafana Loki

---

# Monitoring

Planned

Spring Boot Actuator

Metrics

- CPU
- Memory
- Database Connection
- Request Count

---

# Backup Strategy

Database Backup

Daily

Retention

30 Days

Future

- Automatic Backup
- Cloud Storage

---

# Rollback Strategy

Jika deployment gagal

1. Stop application

2. Restore previous Docker image

3. Restore database backup (jika diperlukan)

4. Restart application

---

# Deployment Checklist

Before Deployment

- [ ] All tests passed
- [ ] Flyway migration reviewed
- [ ] Swagger updated
- [ ] Environment variables configured
- [ ] Database backup completed

After Deployment

- [ ] Health endpoint returns UP
- [ ] Swagger accessible
- [ ] Login works
- [ ] Reservation API works
- [ ] Payment callback tested
- [ ] Google Calendar sync tested
- [ ] Google Sheets export tested

---

# CI/CD (Planned)

Pipeline

```text
Developer

↓

Git Push

↓

GitHub Actions

↓

Run Test

↓

Build

↓

Docker Build

↓

Docker Push

↓

Deploy

↓

Health Check
```

---

# Release Flow

```text
feature/*

↓

develop

↓

Pull Request

↓

main

↓

Release

↓

Deploy
```

---

# Production Folder Structure

```
/opt/reservation-system/

├── app/
├── logs/
├── backup/
├── uploads/
├── docker-compose.yml
├── .env
└── nginx/
```

---

# Security Checklist

- JWT Secret menggunakan Environment Variable
- Password Database tidak disimpan di repository
- HTTPS aktif
- Firewall aktif
- PostgreSQL tidak diekspos ke internet
- Backup database terenkripsi
- Rate Limiting pada API
- CORS dikonfigurasi dengan benar

---

# Future Deployment

Target deployment:

- Docker Compose
- VPS Ubuntu
- DigitalOcean
- AWS EC2
- Google Cloud Compute Engine
- Azure VM

---

# Document Owner

Backend Team

---

Last Updated

August 2026