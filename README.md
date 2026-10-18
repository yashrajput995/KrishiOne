# KrishiOne v2: Unified Agricultural Portal & High-Concurrency Token Reservation

> 📖 **Full System Documentation:** For comprehensive architectural blueprints, sequence diagrams, ERDs, REST API dictionaries, and concurrency deep-dives, see **[KrishiOne_Complete_Documentation.md](KrishiOne_Complete_Documentation.md)**.

KrishiOne v2 is an enterprise-grade agricultural portal designed for Indian farmers and mandi administrators. It addresses the systemic issues of fragmented government portals (e-Uparjan, e-Vikas, e-Anugya, and e-Token-MP) by offering:
1. **Unified Mandi Intelligence:** Synchronized daily crop prices from Madhya Pradesh Mandi Board ([e-Anugya दैनिक आवक / भाव](https://eanugya.mp.gov.in/Inward_Quote.aspx)) and Agmarknet/data.gov.in, cached in Redis with one-click **Web Speech Audio Readout** in Hindi and English.
2. **Zero Double-Booking Reservation Engine:** A 4-tier locking architecture (Redisson Distributed Lock + Redis SETNX + JVM ReentrantLock + PostgreSQL `SELECT ... FOR UPDATE` pessimistic write locks) guaranteeing inventory safety during high-demand fertilizer (DAP / Urea) and crop-selling token rushes.
3. **Low Digital Literacy Accessibility:** Instant Hindi/English switching, high-contrast visual capacity indicators, and QR-verifiable gate pass receipt generation.

---

## Technical Stack

| Layer | Technology | Details |
|---|---|---|
| **Runtime & Language** | Java 21 (LTS) | Virtual threads ready, records, pattern matching |
| **Backend Framework** | Spring Boot 3.2.5 | Spring Data JPA, Spring Security, Validation |
| **Primary Database** | PostgreSQL 17 | Relational persistence, ACID check constraints |
| **Database Migrations** | Flyway 10.10.0 | Versioned schema (`V1__init_schema.sql`, `V2__seed_initial_data.sql`) |
| **Caching & Distributed Locks** | Redis 7 + Redisson 3.27.2 | High-speed response caching and distributed locking |
| **HTML Parser** | JSoup 1.17.2 | Automated e-Anugya mandi portal quote extraction |
| **Frontend** | React 18 / Vanilla HTML5+CSS SPA | Glassmorphic design, Web Speech API, QR Code generation |
| **Security & Auth** | Spring Security 6 + JJWT 0.12.5 | Stateless JWT authentication, role-based authorization |

---

## Database Configuration (PostgreSQL 17 / pgAdmin 4)

- **Database Name:** `krishionedb`
- **Username:** `postgres`
- **Password:** `admin`
- **Host / Port:** `localhost:5432`

You can inspect all tables in **pgAdmin 4** under `Servers -> PostgreSQL 17 -> Databases -> krishionedb -> Schemas -> public -> Tables`:
- `users`
- `mandis`
- `commodities`
- `mandi_prices`
- `slots`
- `bookings`
- `notifications`

---

## Pre-Seeded Demo Credentials

| Role | Mobile Phone | Password | Default Language |
|---|---|---|---|
| **Farmer (किसान)** | `9876543210` | `password123` | Hindi (`hi`) |
| **Mandi Admin (मंडी सचिव)** | `9876543211` | `password123` | Hindi (`hi`) |
| **Super Admin (कृषि निदेशक)** | `9876543212` | `password123` | English (`en`) |

---

## How to Run

### 1. Start PostgreSQL & Redis
Ensure PostgreSQL is running on port `5432` with username `postgres` and password `admin`, and Redis is running on port `6379`.

### 2. Execute Flyway Migrations (via Maven)
```powershell
.\mvnw.cmd flyway:migrate
```

### 3. Run the Spring Boot Application
```powershell
.\mvnw.cmd spring-boot:run
```

Access the portal in your browser:
👉 **`http://localhost:8080`**

### 4. Run Concurrency and Unit Tests
```powershell
.\mvnw.cmd test "-Dtest=AuthServiceTest,SlotBookingConcurrencyTest"
```

---

## Core API Endpoints

- `GET /api/mandiprices/search?q={query}` - Cached search across mandis and crops
- `POST /api/mandiprices/sync-eanugya` - Live MP Mandi Board e-Anugya sync
- `GET /api/slots` - Query active slot inventory with capacities
- `POST /api/slots/book` - Concurrency-safe token booking (`Authorization: Bearer <token>`)
- `GET /api/slots/my-bookings` - Farmer's booking history and digital passes
- `POST /api/auth/login` - Farmer / Admin authentication
- `POST /api/admin/slots` - Quota provisioning (`MANDI_ADMIN`, `SUPER_ADMIN`)
- `PUT /api/admin/prices` - Emergency price override (evicts Redis cache)
- `GET /api/admin/analytics` - Governance dashboard & SMS audit logs
