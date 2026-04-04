CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    name TEXT,
    email TEXT,
    picture TEXT,
    last_login_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
    created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
    updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
    deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    ip TEXT,
    user_agent TEXT,
    device TEXT,
    device_type TEXT,
    device_vendor TEXT,
    browser TEXT,
    os TEXT,
    city TEXT,
    country TEXT,
    expires_at TEXT NOT NULL,
    last_active_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
    created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
    updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
    deleted_at TEXT,
    is_revoked INTEGER DEFAULT 0 CHECK (is_revoked IN (0, 1)),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE INDEX idx_sessions_user_id ON sessions (user_id);

CREATE INDEX idx_sessions_session_id ON sessions (session_id);

CREATE INDEX idx_users_user_id ON users (user_id);

CREATE INDEX idx_sessions_expires_at ON sessions (expires_at);