/* eslint-disable prettier/prettier */
// src/main/database.ts

import Database from "better-sqlite3"
import path from "path"
import { app } from "electron"

// Database path
const dbPath = path.join(app.getPath("userData"), "app.sqlite")
const db = new Database(dbPath)

// Enable WAL and foreign keys
db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")

// Create tables and insert initial data
db.exec(`
  -- Phase table
  CREATE TABLE IF NOT EXISTS phase (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  INSERT OR IGNORE INTO phase (id, name) VALUES
    (1, 'First'),
    (2, 'Second'),
    (3, 'Third');

  -- Student table
  CREATE TABLE IF NOT EXISTS student (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ci TEXT UNIQUE,
    name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    grade REAL CHECK (grade BETWEEN 0 AND 100),
    age INTEGER CHECK (age > 0),
    gender TEXT CHECK (gender IN ('M', 'F')),
    municipality TEXT
  );

  -- Career table
  CREATE TABLE IF NOT EXISTS career (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    abbreviation TEXT NOT NULL,
    faculty TEXT NOT NULL
  );

  -- Location table
  CREATE TABLE IF NOT EXISTS location (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );

  -- Spot table (career + location combination)
  CREATE TABLE IF NOT EXISTS spot (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    career_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    available_quantity INTEGER CHECK (available_quantity >= 0),
    FOREIGN KEY (career_id) REFERENCES career(id),
    FOREIGN KEY (location_id) REFERENCES location(id),
    UNIQUE (career_id, location_id)
  );

  -- Request table (up to 3 per student per phase)
  CREATE TABLE IF NOT EXISTS request (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_ci TEXT NOT NULL,
    spot_id INTEGER NOT NULL,
    preference_order INTEGER CHECK (preference_order BETWEEN 1 AND 3),
    phase_id INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (student_ci) REFERENCES student(ci),
    FOREIGN KEY (spot_id) REFERENCES spot(id),
    FOREIGN KEY (phase_id) REFERENCES phase(id),
    UNIQUE (student_ci, preference_order, phase_id)
  );

  -- Assignment table
  CREATE TABLE IF NOT EXISTS assignment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_ci TEXT NOT NULL,
    spot_id INTEGER NOT NULL,
    phase_id INTEGER NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_ci) REFERENCES student(ci),
    FOREIGN KEY (spot_id) REFERENCES spot(id),
    FOREIGN KEY (phase_id) REFERENCES phase(id),
    UNIQUE (student_ci)
  );

  -- User table
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
