import express from 'express'
import jwt from 'jsonwebtoken'
import { db } from '../db.js'

const router = express.Router()

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant.' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bookink-secret')
    req.user = decoded
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide.' })
  }
  next()
}

function verifyAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès interdit.' })
  }
  next()
}

router.get('/services', (req, res) => {
  const services = db.prepare('SELECT * FROM services').all()
  res.json({ services })
})

router.post('/bookings', verifyToken, (req, res) => {
  const { serviceId, staff, date } = req.body
  if (!serviceId || !staff || !date) {
    return res.status(400).json({ message: 'Données de réservation manquantes.' })
  }
  db.prepare('INSERT INTO bookings (userId, serviceId, staff, date, status) VALUES (?, ?, ?, ?, ?)').run(
    req.user.userId,
    serviceId,
    staff,
    date,
    'Confirmé',
  )
  const booking = db
    .prepare(
      'SELECT b.id, s.name AS service, b.staff, b.date, b.status FROM bookings b JOIN services s ON b.serviceId = s.id WHERE b.userId = ? ORDER BY b.date DESC LIMIT 1',
    )
    .get(req.user.userId)
  res.json({ booking })
})

router.get('/bookings', verifyToken, (req, res) => {
  const bookings = db
    .prepare(
      'SELECT b.id, s.name AS service, b.staff, b.date, b.status FROM bookings b JOIN services s ON b.serviceId = s.id WHERE b.userId = ? ORDER BY b.date DESC',
    )
    .all(req.user.userId)
  res.json({ bookings })
})

router.get('/appointments', verifyToken, verifyAdmin, (req, res) => {
  const appointments = db
    .prepare(
      'SELECT b.id, s.name AS title, b.date, b.staff FROM bookings b JOIN services s ON b.serviceId = s.id ORDER BY b.date ASC',
    )
    .all()
  res.json({ appointments })
})

router.get('/users', verifyToken, verifyAdmin, (req, res) => {
  const users = db.prepare('SELECT id, name, email, role FROM users').all()
  res.json({ users })
})

export default router
