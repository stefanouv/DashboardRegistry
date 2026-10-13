-- Dashboard Registry - SQLite schema
-- Runs on every backend start (spring.sql.init.mode=always).
-- "IF NOT EXISTS" keeps existing tables and data untouched.
-- Dates are stored as ISO-8601 text: completed_date = 'yyyy-MM-dd',
-- timestamps = 'yyyy-MM-ddTHH:mm:ss.SSSZ' (UTC), so they sort correctly as text.

CREATE TABLE IF NOT EXISTS dashboards (
    id                    INTEGER PRIMARY KEY AUTOINCREMENT,

    -- General information
    dashboard_name        TEXT NOT NULL,
    requested_by          TEXT NOT NULL,
    developed_by          TEXT NOT NULL,
    completed_date        TEXT NOT NULL,

    -- Team information
    team_name             TEXT NOT NULL,
    team_manager          TEXT NOT NULL,

    -- Data information
    data_source_name      TEXT NOT NULL,
    custom_query_flag     TEXT NOT NULL CHECK (custom_query_flag IN ('Yes', 'No')),
    query_text            TEXT NOT NULL DEFAULT '',
    shared_data_source    TEXT NOT NULL CHECK (shared_data_source IN ('Yes', 'No')),
    connection_mode       TEXT NOT NULL CHECK (connection_mode IN ('Live', 'Scheduled')),
    refresh_rate          TEXT NOT NULL DEFAULT '',
    connection_user_db    TEXT NOT NULL,

    -- Portal menu information
    menu_name             TEXT NOT NULL,
    menu_group_name       TEXT NOT NULL,
    menu_entry_name       TEXT NOT NULL,
    access_roles          TEXT NOT NULL,

    -- Publishing information
    workspace_name        TEXT NOT NULL,
    folder_name           TEXT NOT NULL,
    published_report_name TEXT NOT NULL,
    report_url            TEXT NOT NULL,

    -- Calculated fields
    calculated_fields     TEXT NOT NULL,

    -- Lifecycle
    submitted_at          TEXT NOT NULL,
    current_status        TEXT NOT NULL CHECK (current_status IN ('Requested', 'Accepted', 'Removed', 'Rejected')),
    update_status         TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS dashboard_audit (
    audit_id              INTEGER PRIMARY KEY AUTOINCREMENT,
    dashboard_id          INTEGER NOT NULL REFERENCES dashboards (id),
    changed_by            TEXT,                -- reserved for a future login feature
    previous_status       TEXT NOT NULL,
    new_status            TEXT NOT NULL,
    change_timestamp      TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_dashboard_audit_dashboard_id ON dashboard_audit (dashboard_id);
