CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  google_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  picture TEXT NOT NULL,
  last_login_at TEXT DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  user_id INTEGER NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TEXT NOT NULL,
  last_active_at TEXT DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT,
  is_revoked INTEGER DEFAULT 0 CHECK (is_revoked IN (0, 1)),
  FOREIGN KEY (user_id) REFERENCES users (id)
);