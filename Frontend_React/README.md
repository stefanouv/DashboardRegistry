# Dashboard Registry — Frontend

A React single-page app for registering BI dashboards / reports and tracking their approval status.

## Features

- **Registration form** with ~20 fields in 6 sections (general, team, portal menu, publishing, data source, calculated fields)
  - client-side validation with conditional rules (the query is required only for custom queries, the refresh rate only for scheduled refresh)
  - inline help popovers for every field
- **Records table**: search across all columns, filter by date, expand long cells, copy SQL queries with one click, export a record to PDF
- **Status workflow**: change a record's status (Requested / Accepted / Rejected / Removed) with confirmation
- **Audit log**: every status change is recorded and can be searched and exported

## Tech stack

React 19 · Vite · React-Bootstrap · jsPDF · React Compiler

## Run locally

```bash
npm install
npm run dev
```

The app runs at http://localhost:5173 and expects the backend at http://localhost:8080 (see the backend README).
