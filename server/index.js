import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { initDb } from './db.js'
import authRoutes from './routes/auth.js'
import apiRoutes from './routes/api.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

initDb()
app.use('/api/auth', authRoutes)
app.use('/api', apiRoutes)

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
