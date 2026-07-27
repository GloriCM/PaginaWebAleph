import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { query } from '../db/pool.js'
import { config } from '../config.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {}

  if (!email || !password) {
    res.status(400).json({ error: 'Email y contraseña requeridos' })
    return
  }

  try {
    const { rows } = await query<{
      id: string
      name: string
      email: string
      password_hash: string
      role: 'admin' | 'editor'
    }>('SELECT id, name, email, password_hash, role FROM usuarios_admin WHERE email = $1 LIMIT 1', [
      String(email).toLowerCase().trim(),
    ])

    const usuario = rows[0]
    if (!usuario) {
      res.status(401).json({ error: 'Credenciales incorrectas' })
      return
    }

    if (usuario.role !== 'admin') {
      res.status(403).json({ error: 'Acceso restringido a administradores' })
      return
    }

    const valido = await bcrypt.compare(String(password), usuario.password_hash)
    if (!valido) {
      res.status(401).json({ error: 'Credenciales incorrectas' })
      return
    }

    await query('UPDATE usuarios_admin SET ultimo_login = NOW() WHERE id = $1', [usuario.id])

    const payload = {
      id: usuario.id,
      email: usuario.email,
      name: usuario.name,
      role: usuario.role,
    }

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn })

    res.json({ token, user: payload })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
})

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.usuario })
})

export default router
