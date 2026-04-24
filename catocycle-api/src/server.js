const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const express = require('express')
const cors = require('cors')
const multer = require('multer')
require('dotenv').config()

const { initDatabase, getPool } = require('./db')
const { seedIfEmpty } = require('./seed')

const app = express()
const port = Number(process.env.PORT || 3000)
const uploadDir = process.env.UPLOAD_DIR || 'uploads'
const uploadPath = path.resolve(process.cwd(), uploadDir)
const sessionTtlHours = Number(process.env.ADMIN_SESSION_TTL_HOURS || 24)

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadPath),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg'
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
    cb(null, safeName)
  }
})

const upload = multer({ storage })

app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use('/uploads', express.static(uploadPath))

function hashPassword(password) {
  return crypto.createHash('sha256').update(String(password)).digest('hex')
}

function createSessionToken() {
  return crypto.randomBytes(48).toString('hex')
}

function getBearerToken(req) {
  const authHeader = req.headers.authorization || ''
  if (!authHeader.startsWith('Bearer ')) return ''
  return authHeader.slice(7).trim()
}

async function requireAdmin(req, res, next) {
  const token = getBearerToken(req)
  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  const [rows] = await getPool().query(
    `SELECT s.id, s.admin_id, a.username
     FROM admin_sessions s
     INNER JOIN admins a ON a.id = s.admin_id
     WHERE s.token = ? AND s.expires_at > NOW()
     LIMIT 1`,
    [token]
  )

  if (!rows.length) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  req.admin = {
    id: Number(rows[0].admin_id),
    username: rows[0].username,
    token
  }
  return next()
}

function parseJsonArray(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  if (Buffer.isBuffer(raw)) raw = raw.toString('utf8')
  if (typeof raw === 'object') {
    // mysql2 can sometimes return JSON columns as an object-like wrapper
    if (raw && raw.type === 'Buffer' && Array.isArray(raw.data)) {
      raw = Buffer.from(raw.data).toString('utf8')
    } else {
      return raw
    }
  }
  try {
    return JSON.parse(raw)
  } catch (_) {
    return []
  }
}

function toActivity(row) {
  return {
    id: Number(row.id),
    title: row.title,
    time: row.time || '',
    people: row.people || '',
    desc: row.desc || '',
    photos: parseJsonArray(row.photos)
  }
}

function toPerson(row) {
  return {
    id: Number(row.id),
    name: row.name,
    personality: row.personality || '',
    skills: row.skills || '',
    contact: row.contact || '',
    photos: parseJsonArray(row.photos)
  }
}

function toItem(row) {
  return {
    id: Number(row.id),
    name: row.name,
    time: row.time || '',
    description: row.description || '',
    image: row.image || ''
  }
}

function tryRemoveUploadFiles(paths) {
  const list = Array.isArray(paths) ? paths : [paths]
  list
    .filter((p) => typeof p === 'string' && p.startsWith('/uploads/'))
    .map((p) => p.replace('/uploads/', ''))
    .forEach((filename) => {
      const full = path.join(uploadPath, filename)
      fs.promises.unlink(full).catch(() => {})
    })
}

app.get('/api/health', (_, res) => {
  res.json({ ok: true })
})

app.post('/api/auth/login', async (req, res) => {
  const { username = '', password = '' } = req.body || {}
  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码不能为空' })
  }

  const [admins] = await getPool().query(
    'SELECT id, username, password_hash FROM admins WHERE username = ? LIMIT 1',
    [username]
  )
  if (!admins.length) {
    return res.status(401).json({ message: '账号或密码错误' })
  }

  const admin = admins[0]
  if (hashPassword(password) !== admin.password_hash) {
    return res.status(401).json({ message: '账号或密码错误' })
  }

  const token = createSessionToken()
  await getPool().query('DELETE FROM admin_sessions WHERE admin_id = ?', [admin.id])
  await getPool().query(
    'INSERT INTO admin_sessions (admin_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? HOUR))',
    [admin.id, token, sessionTtlHours]
  )

  return res.json({
    token,
    admin: { username: admin.username },
    expiresInHours: sessionTtlHours
  })
})

app.get('/api/auth/me', requireAdmin, (req, res) => {
  res.json({ username: req.admin.username })
})

app.post('/api/auth/logout', requireAdmin, async (req, res) => {
  await getPool().query('DELETE FROM admin_sessions WHERE token = ?', [req.admin.token])
  res.status(204).end()
})

app.post('/api/upload', requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' })
  }
  return res.json({
    path: `/uploads/${req.file.filename}`,
    filename: req.file.filename
  })
})

app.get('/api/activities', async (_, res) => {
  const [rows] = await getPool().query(
    'SELECT id, title, time, people, `desc`, CAST(photos AS CHAR(10000) CHARACTER SET utf8mb4) AS photos FROM activities ORDER BY id DESC'
  )
  res.json(rows.map(toActivity))
})

app.post('/api/activities', requireAdmin, async (req, res) => {
  const { title, time = '', people = '', desc = '', photos = [] } = req.body
  const [result] = await getPool().query(
    'INSERT INTO activities (title, time, people, `desc`, photos) VALUES (?, ?, ?, ?, ?)',
    [title, time, people, desc, JSON.stringify(photos)]
  )
  const [rows] = await getPool().query(
    'SELECT id, title, time, people, `desc`, CAST(photos AS CHAR(10000) CHARACTER SET utf8mb4) AS photos FROM activities WHERE id = ?',
    [result.insertId]
  )
  res.status(201).json(toActivity(rows[0]))
})

app.put('/api/activities/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id)
  const { title, time = '', people = '', desc = '', photos = [] } = req.body
  await getPool().query(
    'UPDATE activities SET title = ?, time = ?, people = ?, `desc` = ?, photos = ? WHERE id = ?',
    [title, time, people, desc, JSON.stringify(photos), id]
  )
  const [rows] = await getPool().query(
    'SELECT id, title, time, people, `desc`, CAST(photos AS CHAR(10000) CHARACTER SET utf8mb4) AS photos FROM activities WHERE id = ?',
    [id]
  )
  if (!rows.length) return res.status(404).json({ message: 'Not found' })
  res.json(toActivity(rows[0]))
})

app.delete('/api/activities/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id)
  const [rows] = await getPool().query(
    'SELECT CAST(photos AS CHAR(10000) CHARACTER SET utf8mb4) AS photos FROM activities WHERE id = ?',
    [id]
  )
  if (rows.length) {
    const photos = parseJsonArray(rows[0].photos)
    tryRemoveUploadFiles(photos)
  }
  await getPool().query('DELETE FROM activities WHERE id = ?', [id])
  res.status(204).end()
})

app.get('/api/people', async (_, res) => {
  const [rows] = await getPool().query(
    'SELECT id, name, personality, skills, contact, CAST(photos AS CHAR(10000) CHARACTER SET utf8mb4) AS photos FROM people ORDER BY id DESC'
  )
  res.json(rows.map(toPerson))
})

app.post('/api/people', requireAdmin, async (req, res) => {
  const { name, personality = '', skills = '', contact = '', photos = [] } = req.body
  const [result] = await getPool().query(
    'INSERT INTO people (name, personality, skills, contact, photos) VALUES (?, ?, ?, ?, ?)',
    [name, personality, skills, contact, JSON.stringify(photos)]
  )
  const [rows] = await getPool().query(
    'SELECT id, name, personality, skills, contact, CAST(photos AS CHAR(10000) CHARACTER SET utf8mb4) AS photos FROM people WHERE id = ?',
    [result.insertId]
  )
  res.status(201).json(toPerson(rows[0]))
})

app.put('/api/people/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id)
  const { name, personality = '', skills = '', contact = '', photos = [] } = req.body
  await getPool().query(
    'UPDATE people SET name = ?, personality = ?, skills = ?, contact = ?, photos = ? WHERE id = ?',
    [name, personality, skills, contact, JSON.stringify(photos), id]
  )
  const [rows] = await getPool().query(
    'SELECT id, name, personality, skills, contact, CAST(photos AS CHAR(10000) CHARACTER SET utf8mb4) AS photos FROM people WHERE id = ?',
    [id]
  )
  if (!rows.length) return res.status(404).json({ message: 'Not found' })
  res.json(toPerson(rows[0]))
})

app.delete('/api/people/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id)
  const [rows] = await getPool().query(
    'SELECT CAST(photos AS CHAR(10000) CHARACTER SET utf8mb4) AS photos FROM people WHERE id = ?',
    [id]
  )
  if (rows.length) {
    const photos = parseJsonArray(rows[0].photos)
    tryRemoveUploadFiles(photos)
  }
  await getPool().query('DELETE FROM people WHERE id = ?', [id])
  res.status(204).end()
})

app.get('/api/items', async (_, res) => {
  const [rows] = await getPool().query('SELECT * FROM items ORDER BY id DESC')
  res.json(rows.map(toItem))
})

app.get('/api/items/:id', async (req, res) => {
  const id = Number(req.params.id)
  const [rows] = await getPool().query('SELECT * FROM items WHERE id = ?', [id])
  if (!rows.length) return res.status(404).json({ message: 'Not found' })
  res.json(toItem(rows[0]))
})

app.post('/api/items', requireAdmin, async (req, res) => {
  const { name, time = '', description = '', image = '' } = req.body
  const [result] = await getPool().query(
    'INSERT INTO items (name, time, description, image) VALUES (?, ?, ?, ?)',
    [name, time, description, image]
  )
  const [rows] = await getPool().query('SELECT * FROM items WHERE id = ?', [result.insertId])
  res.status(201).json(toItem(rows[0]))
})

app.put('/api/items/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id)
  const { name, time = '', description = '', image = '' } = req.body
  await getPool().query(
    'UPDATE items SET name = ?, time = ?, description = ?, image = ? WHERE id = ?',
    [name, time, description, image, id]
  )
  const [rows] = await getPool().query('SELECT * FROM items WHERE id = ?', [id])
  if (!rows.length) return res.status(404).json({ message: 'Not found' })
  res.json(toItem(rows[0]))
})

app.delete('/api/items/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id)
  const [rows] = await getPool().query('SELECT image FROM items WHERE id = ?', [id])
  if (rows.length) {
    tryRemoveUploadFiles(rows[0].image)
  }
  await getPool().query('DELETE FROM items WHERE id = ?', [id])
  res.status(204).end()
})

async function bootstrap() {
  await initDatabase()
  await seedIfEmpty()
  app.listen(port, () => {
    console.log(`catocycle-api listening on http://localhost:${port}`)
  })
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
