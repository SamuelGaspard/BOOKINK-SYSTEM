import Database from 'better-sqlite3'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import bcrypt from 'bcryptjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'bookink.db')
const db = new Database(dbPath)

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      duration TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      serviceId INTEGER NOT NULL,
      staff TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(serviceId) REFERENCES services(id)
    );
  `)

  const admin = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@bookink.local')
  if (!admin) {
    const hashed = bcrypt.hashSync('admin123', 10)
    db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
      'Admin Bookink',
      'admin@bookink.local',
      hashed,
      'admin',
    )
  }

  const client = db.prepare('SELECT id FROM users WHERE email = ?').get('client@bookink.local')
  if (!client) {
    const hashed = bcrypt.hashSync('client123', 10)
    db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
      'Client Bookink',
      'client@bookink.local',
      hashed,
      'client',
    )
  }

  const serviceCount = db.prepare('SELECT COUNT(*) AS count FROM services').get().count
  if (serviceCount === 0) {
    const insert = db.prepare('INSERT INTO services (name, duration, price, description) VALUES (?, ?, ?, ?)')
    insert.run('Consultation bien-être', '45 min', 45, 'Entretien personnalisé pour définir votre programme de soin.')
    insert.run('Massage relaxant', '60 min', 65, 'Massage détente pour évacuer le stress et améliorer le confort.')
    insert.run('Coaching personnel', '30 min', 35, 'Accompagnement expert pour organiser votre planning santé.')
  }
}

export { db }
