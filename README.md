# Dashboard Registry — User Guide

Dashboard Registry is a small web application for **registering BI dashboards and reports** and following them through an approval workflow.

A team fills in one form describing a new dashboard: who requested it, who built it, where its data comes from and where it is published. The request is saved with the status **Requested**. A reviewer then accepts, rejects or removes it, and every status change is kept in an **audit log**.

The project has two parts:

| Part | Technology | Default address |
|---|---|---|
| Frontend | React 19, Vite, React-Bootstrap | http://localhost:5173 |
| Backend (REST API) | Java 17, Spring Boot 3, SQLite | http://localhost:8080 |

The repository includes a ready-to-use SQLite database with **24 fictional dashboards** and their status history, so you can explore the app right away.

---

## Contents

1. [Requirements](#1-requirements)
2. [Getting started](#2-getting-started)
3. [Registering a dashboard](#3-registering-a-dashboard)
4. [Browsing the registered dashboards](#4-browsing-the-registered-dashboards)
5. [Changing a dashboard's status](#5-changing-a-dashboards-status)
6. [The audit log](#6-the-audit-log)
7. [Exporting a record to PDF](#7-exporting-a-record-to-pdf)
8. [Demo data and resetting the database](#8-demo-data-and-resetting-the-database)
9. [REST API](#9-rest-api)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Requirements

- **Java 17** or newer
- **Maven 3.9+** (or an IDE with Maven support, e.g. IntelliJ IDEA)
- **Node.js 20.19+ or 22.12+** with npm

No database server is needed. The database is a single SQLite file inside the backend folder.

---

## 2. Getting started

Start the backend first, then the frontend, each in its own terminal.

### Backend

```bash
cd dashboard-registry-backend
mvn spring-boot:run
```

- The first run downloads the Maven dependencies, which can take a minute or two.
- When the log shows `Started DashboardRegistryApplication`, the API is ready at http://localhost:8080.
- Quick check: open http://localhost:8080/db-test. It should say **"Database connection is OK!"**

> **Running from an IDE?** Run the class `com.example.DashboardRegistryApplication`. Make sure the working directory is the backend folder, so the app finds `data/dashboard_registry.db`.

### Frontend

```bash
cd dashboard-registry-frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

The app has three tabs at the top:

| Tab | What it is for |
|---|---|
| **Project Form** | Register a new dashboard |
| **Table Data** | Browse, search, export and change the status of registered dashboards |
| **Audit Log Table Data** | See the history of every status change |

---

## 3. Registering a dashboard

Open the **Project Form** tab. The form is split into six sections. Every field has a **?** button next to its label that shows a short explanation.

### General Information

| Field | Description |
|---|---|
| Dashboard Name | The name of the dashboard or report |
| Requested By | The person who asked for the dashboard |
| Developed By | The person who built it |
| Published Date | When it was published. Defaults to today |

### Team Information

| Field | Description |
|---|---|
| Team Name | The team that owns the dashboard |
| Team Manager | The manager of that team |

### Portal Menu Information

Where the dashboard appears in the company's internal portal menu.

| Field | Description |
|---|---|
| Menu Name | The top-level menu, e.g. *Analytics* |
| Menu Group Name | The group inside the menu, e.g. *Sales* |
| Menu Entry Name | The entry that opens the dashboard |
| Access Roles | Which user roles can see the entry, e.g. *Viewer, Manager* |

### Publishing Information

Where the dashboard lives on the BI server.

| Field | Description |
|---|---|
| Workspace | The workspace (or site) on the BI server |
| Folder | The folder (or project) inside the workspace |
| Published Report Name | The report file name on the server |
| Report URL | The link that opens the dashboard |

### Data Information

| Field | Description |
|---|---|
| Data Source Main Table | The main table the dashboard reads from |
| Is Custom Query and What is the Query? | **Yes** if the dashboard uses its own SQL query, otherwise **No** (default) |
| Query | The SQL query. **Only enabled and required when *Is Custom Query* is *Yes*** |
| Is the Data Source Shared on the BI Server? | Whether the data source is published for other reports to reuse |
| Connection Mode | **Live connection** (queries the database directly) or **Scheduled refresh** (uses a copy of the data that is refreshed periodically) |
| Refresh Rate | How often the data is refreshed, from every 2 hours to monthly. **Only enabled and required for *Scheduled refresh*** |
| Connection User / Database | The account or database used for the connection |

### Calculated Fields

| Field | Description |
|---|---|
| Which of the Fields are Calculated | A free-text list of the calculated fields in the dashboard |

### Submitting

1. Click **Register Project** at the bottom of the page.
2. If any required field is empty, an error message appears and the missing fields are **highlighted in red**. The highlight disappears as soon as you fill a field in.
3. If everything is filled in, you are asked to confirm. Click **Ok**.
4. On success the form is cleared and the new dashboard appears in **Table Data** with status **Requested**.

The backend validates every submission again. If it rejects a field, the error message explains why and the field is highlighted in the form.

---

## 4. Browsing the registered dashboards

Open the **Table Data** tab. Dashboards are listed **newest first**, one row each, with every field as a column. Scroll sideways to see all of them.

| What you can do | How |
|---|---|
| **Search** | Type in the **Search** box. It matches text in any column. If the text starts with a number, only the **ID** column is searched, so typing `12` finds dashboard 12. |
| **Filter by date** | Pick a date in the date box. It shows rows whose submission date, last status change or published date is that day. |
| **Read long text** | Cells with long text are shortened. Click **...more** to expand and **...less** to collapse. |
| **Copy a SQL query** | Click anywhere in a **Query** cell. The query is copied to the clipboard and the 📋 icon briefly turns into ✅. |
| **Select a row** | Click a row; it turns blue. Click it again to deselect it. Selecting a row shows the **Export PDF** and **Toggle Status** buttons. |

Rows with status **Rejected** or **Removed** have a light red background.

> The table loads its data when you open the tab. To refresh it, click the **Table Data** tab again.

---

## 5. Changing a dashboard's status

Every dashboard has one of four statuses:

| Status | Meaning |
|---|---|
| **Requested** | Newly registered, waiting for review. Every new dashboard starts here |
| **Accepted** | Approved |
| **Rejected** | Not approved |
| **Removed** | Was in use, has been withdrawn |

To change it:

1. In **Table Data**, click the dashboard's row to select it.
2. Click **Toggle Status**. The button's colour shows the current status: blue for *Requested*, green for *Accepted*, red for *Rejected* or *Removed*.
3. Choose the new status. The current status is greyed out, because choosing it would change nothing.
4. Confirm with **Ok**.

The table refreshes, and the change is recorded in the audit log together with the previous status and the time.

---

## 6. The audit log

The **Audit Log Table Data** tab lists every status change, newest first:

| Column | Description |
|---|---|
| Audit ID | Unique number of the change |
| Dashboard ID | The dashboard that changed (the **ID** in *Table Data*) |
| Previous Status / New Status | The status before and after the change |
| Change Timestamp | When it happened |

The **Search** box and date filter work as in *Table Data*. To see the full history of one dashboard, type its ID in the search box.

---

## 7. Exporting a record to PDF

1. In **Table Data** or **Audit Log Table Data**, click a row to select it.
2. Click **Export PDF**.

A PDF with every field of that record, one per line, is downloaded as `Row_<id>.pdf`.

---

## 8. Demo data and resetting the database

The database file is `dashboard-registry-backend/data/dashboard_registry.db`. It contains **24 fictional dashboards** from seven teams (Sales, Finance, Customer Experience, Supply Chain, Marketing, HR, E-commerce) with a mix of statuses and a status history. All names, people and links are made up, and links point to `example.com`.

- **Your changes are kept.** Anything you register or change stays in the database, also after a restart.
- **To go back to the original demo data:**
  1. Stop the backend.
  2. Delete the file `data/dashboard_registry.db`. Delete only the file, not the `data` folder.
  3. Start the backend again. The database is recreated and filled automatically from `src/main/resources/db/schema.sql` and `data.sql`.
- **To look inside the database**, open the file with a tool such as [DB Browser for SQLite](https://sqlitebrowser.org/). Stop the backend first if you want to edit data there.

### Tables

| Table | Contents |
|---|---|
| `dashboards` | One row per registered dashboard. `id` is generated automatically |
| `dashboard_audit` | One row per status change, linked to `dashboards.id` |

---

## 9. REST API

The frontend talks to these endpoints, and you can also call them directly, e.g. with Postman or `curl`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/getAllMainData` | All dashboards, newest first |
| `POST` | `/submit` | Register a new dashboard. The JSON body has the form fields; the server sets the status to `Requested` and fills in the timestamps |
| `PATCH` | `/updateStatusById` | Change a status. Body: `{ "id": 5, "currentStatus": "Accepted" }` |
| `GET` | `/getAllAuditData` | The full status history, newest first |
| `GET` | `/db-test` | Checks the database connection |

Example:

```bash
curl -X PATCH http://localhost:8080/updateStatusById \
     -H "Content-Type: application/json" \
     -d '{ "id": 3, "currentStatus": "Accepted" }'
```

Errors are returned as JSON:

```json
{ "status": 400, "error_message": "Record 3 already has status 'Accepted'" }
```

| Code | When |
|---|---|
| `400` | Invalid input: missing field, unknown status, same status as before |
| `404` | The dashboard ID does not exist |
| `500` | Unexpected server error (details are in the backend log) |

---

## 10. Troubleshooting

| Problem | Solution |
|---|---|
| *"Could not reach the server. Is the backend running?"* | Start the backend and check that it runs on port 8080 |
| *"Failed to load table data"* | The backend cannot open the database. Start it from the backend folder, so that `data/dashboard_registry.db` is found |
| CORS error in the browser console | The frontend is not running on `http://localhost:5173`. Add your address to `app.cors.allowed-origins` in `application.properties` |
| *"database is locked"* | The database file is open in another program with unsaved changes. Close it |
| `ClassNotFoundException: org.sqlite.JDBC` | Dependencies are not loaded. Run `mvn clean spring-boot:run`, or reload the Maven project in your IDE |
| Port 8080 or 5173 already in use | Stop the other program using the port, or change `server.port` in `application.properties` / the Vite port (and the CORS setting) |
