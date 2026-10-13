# Dashboard Registry — Backend

Spring Boot REST API for the Dashboard Registry app. It stores dashboards and their status history in a SQLite database.

## Tech stack

Java 17 · Spring Boot 3 · Spring JDBC (`JdbcTemplate`) · Bean Validation · SQLite · Lombok

## Run locally

```bash
mvn spring-boot:run
```

The API runs at http://localhost:8080. No database server is needed: the database is the file `data/dashboard_registry.db`.

## Demo data

The database comes with 24 fictional dashboards and their status history.

- On every start the backend runs `src/main/resources/db/schema.sql` and `data.sql`. They only create tables and rows that are **missing**, so changes made during a demo are kept.
- **Reset to the original demo data:** stop the backend, delete `data/dashboard_registry.db`, start it again. The file is recreated automatically.

## API

| Method | Path | Description |
|---|---|---|
| `POST` | `/submit` | Register a new dashboard (validated; status starts as `Requested`) |
| `GET` | `/getAllMainData` | All dashboards, newest first |
| `PATCH` | `/updateStatusById` | Body `{ "id": 1, "currentStatus": "Accepted" }`. Changes the status and writes an audit row in one transaction |
| `GET` | `/getAllAuditData` | Status change history, newest first |
| `GET` | `/db-test` | Database connectivity check |

Errors are returned as `{ "status": 400, "error_message": "...", "fieldErrors": [...] }`
(400 invalid input, 404 unknown id, 500 unexpected).

## Database

| Table | Purpose |
|---|---|
| `dashboards` | One row per registered dashboard. `id` is `INTEGER PRIMARY KEY AUTOINCREMENT` |
| `dashboard_audit` | One row per status change (`dashboard_id` → `dashboards.id`) |

Dates are stored as ISO-8601 text (UTC), so they sort correctly.
