/* eslint-disable prettier/prettier */
// src/main/database.ts

import Database from "better-sqlite3"
import path from "path"

const dbPath =
  process.env.VITEST === "true"
    ? ":memory:"
    : path.join(require("electron").app.getPath("userData"), "app.sqlite")
const db = new Database(dbPath)

db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")

db.exec(`
  -- Fases
  CREATE TABLE IF NOT EXISTS phase (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );
  INSERT OR IGNORE INTO phase (id, name) VALUES
    (1, 'first'), (2, 'second'), (3, 'manual');

  -- Aspirantes
  CREATE TABLE IF NOT EXISTS applicant (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ci TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    grade REAL CHECK (grade BETWEEN 60 AND 100),
    gender TEXT CHECK (gender IN ('M', 'F')),
    municipality TEXT
  );

  -- Historial de fases en las que participó el aspirante
  CREATE TABLE IF NOT EXISTS applicant_phase (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    applicant_id INTEGER NOT NULL,
    phase_id INTEGER NOT NULL,
    FOREIGN KEY (applicant_id) REFERENCES applicant(id) ON DELETE CASCADE,
    FOREIGN KEY (phase_id) REFERENCES phase(id) ON DELETE CASCADE,
    UNIQUE (applicant_id, phase_id)
  );

  -- Carreras
  CREATE TABLE IF NOT EXISTS career (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    abbreviation TEXT NOT NULL,
    faculty TEXT NOT NULL
  );

  -- Ubicaciones
  CREATE TABLE IF NOT EXISTS location (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );

  -- Plazas (cada fila representa una plaza disponible en una fase específica)
  CREATE TABLE IF NOT EXISTS spot (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    career_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    phase_id INTEGER NOT NULL,
    available_quantity INTEGER NOT NULL CHECK (available_quantity >= 0),
    FOREIGN KEY (career_id) REFERENCES career(id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES location(id) ON DELETE CASCADE,
    FOREIGN KEY (phase_id) REFERENCES phase(id) ON DELETE CASCADE,
    UNIQUE (career_id, location_id, phase_id)
  );

  -- Solicitudes por fase (máximo 3 por aspirante por fase)
  CREATE TABLE IF NOT EXISTS request (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    applicant_id INTEGER NOT NULL,
    spot_id INTEGER NOT NULL,
    preference_order INTEGER CHECK (preference_order BETWEEN 1 AND 3),
    FOREIGN KEY (applicant_id) REFERENCES applicant(id) ON DELETE CASCADE,
    FOREIGN KEY (spot_id) REFERENCES spot(id) ON DELETE CASCADE,
    UNIQUE (applicant_id, spot_id)
  );

  -- Otorgamientos finales
  CREATE TABLE IF NOT EXISTS allocation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    applicant_id INTEGER NOT NULL,
    spot_id INTEGER NOT NULL,
    allocated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (applicant_id) REFERENCES applicant(id) ON DELETE CASCADE,
    FOREIGN KEY (spot_id) REFERENCES spot(id) ON DELETE CASCADE,
    UNIQUE (applicant_id)
  );

  -- Usuarios del sistema
  CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    last_name TEXT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'viewer')),
    created_at TEXT DEFAULT (datetime('now'))
  );
`)

export { db }
