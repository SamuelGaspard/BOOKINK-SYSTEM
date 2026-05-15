import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../db.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'bookink-secret'
const TOKEN_EXPIRES_IN = '8h'

function createToken(user) {
  return jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN })
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant.' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
n  } catch (err) {
    return res.status(401).json({ message: 'Token invalide.' })
  }
  next()
}

router.post('/register', (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Informations manquantes.' })
  }
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
  if (existing) {
    return res.status(400).json({ message: 'Cet email est déjà utilisé.' })
  }
  const hashed = bcrypt.hashSync(password, 10)
  const result = db
    .prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)')
    .run(name, email, hashed, 'client')
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid)
  const token = createToken(user)
  res.json({ token, user: sanitizeUser(user) })
})

router.post('/login', (req, res) => {
  const { email, password } = req.body
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Email ou mot de passe invalide.' })
  }
  const token = createToken(user)
  res.json({ token, user: sanitizeUser(user) })
})

router.get('/profile', verifyToken, (req, res) => {
  const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(req.user.userId)
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur introuvable.' })
  }
  const bookings = db
    .prepare(
      'SELECT b.id, s.name AS service, b.staff, b.date, b.status FROM bookings b JOIN services s ON b.serviceId = s.id WHERE b.userId = ? ORDER BY b.date DESC',
    )
    .all(req.user.userId)
  res.json({ user, bookings })
})

router.put('/profile', verifyToken, (req, res) => {
  const { name } = req.body
  if (!name) {
    return res.status(400).json({ message: 'Le nom est requis.' })
  }
  db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name, req.user.userId)
  const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(req.user.userId)
  res.json({ user })
})

export default router
