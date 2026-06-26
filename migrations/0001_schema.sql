-- Schema D1 (SQLite) per carello-hub, sul database condiviso "prof-carello".
--
-- Conversioni dal Postgres originale (Supabase):
--   uuid          -> TEXT (generato lato app o con randomblob se assente)
--   timestamptz   -> TEXT (ISO 8601)
-- Le tabelle profiles/user_roles NON servono qui: l'admin è autenticato a
-- password dal Worker, non tramite ruoli sul database.

CREATE TABLE IF NOT EXISTS folders (
  id         TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name       TEXT NOT NULL,
  color      TEXT NOT NULL DEFAULT 'hsl(217, 91%, 60%)',
  position   INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS apps (
  id                 TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name               TEXT NOT NULL,
  icon_name          TEXT NOT NULL,
  href               TEXT NOT NULL,
  color              TEXT NOT NULL,
  position           INTEGER NOT NULL,
  folder_id          TEXT REFERENCES folders(id) ON DELETE SET NULL,
  position_in_folder INTEGER DEFAULT 0,
  created_at         TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_apps_position ON apps(position);
CREATE INDEX IF NOT EXISTS idx_apps_folder ON apps(folder_id);
