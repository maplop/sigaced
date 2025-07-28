/* eslint-disable prettier/prettier */
// src/main/database.ts

import Database from "better-sqlite3"
import path from "path"
import { app } from "electron"

const dbPath = path.join(app.getPath("userData"), "app.sqlite")
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
    (1, 'First'), (2, 'Second'), (3, 'Third');

  -- Estudiantes
  CREATE TABLE IF NOT EXISTS student (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ci TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    grade REAL CHECK (grade BETWEEN 0 AND 100),
    age INTEGER CHECK (age > 0),
    gender TEXT CHECK (gender IN ('M', 'F')),
    municipality TEXT,
    assigned_phase_id INTEGER REFERENCES phase(id),
    phases_participated INTEGER DEFAULT 0,
    current_phase_id INTEGER NOT NULL DEFAULT 1 REFERENCES phase(id)
  );

  -- Historial de fases en las que participó el estudiante
  CREATE TABLE IF NOT EXISTS student_phase (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    phase_id INTEGER NOT NULL,
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (phase_id) REFERENCES phase(id),
    UNIQUE (student_id, phase_id)
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

  -- Plazas base (carrera + sede)
  CREATE TABLE IF NOT EXISTS spot (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    career_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    FOREIGN KEY (career_id) REFERENCES career(id),
    FOREIGN KEY (location_id) REFERENCES location(id),
    UNIQUE (career_id, location_id)
  );

  -- Cantidad por fase (solo se inserta manualmente en fase 1)
  CREATE TABLE IF NOT EXISTS spot_phase (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spot_id INTEGER NOT NULL,
    phase_id INTEGER NOT NULL,
    available_quantity INTEGER CHECK (available_quantity >= 0),
    FOREIGN KEY (spot_id) REFERENCES spot(id),
    FOREIGN KEY (phase_id) REFERENCES phase(id),
    UNIQUE (spot_id, phase_id)
  );

  -- Solicitudes por fase (máximo 3 por estudiante por fase)
  CREATE TABLE IF NOT EXISTS request (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    spot_phase_id INTEGER NOT NULL,
    preference_order INTEGER CHECK (preference_order BETWEEN 1 AND 3),
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (spot_phase_id) REFERENCES spot_phase(id),
    UNIQUE (student_id, preference_order, spot_phase_id)
  );

  -- Asignaciones finales
  CREATE TABLE IF NOT EXISTS assignment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    spot_phase_id INTEGER NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (spot_phase_id) REFERENCES spot_phase(id),
    UNIQUE (student_id)
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
