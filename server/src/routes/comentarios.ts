import { Router } from 'express'
import { query } from '../db/pool.js'

const router = Router()

interface FilaComentario {
  id: string
  name: string
  company: string | null
  role: string | null
  content: string
  rating: number
  created_at: Date
}

function mapComentario(fila: FilaComentario) {
  return {
    id: fila.id,
    name: fila.name,
    company: fila.company ?? '',
    role: fila.role ?? '',
    content: fila.content,
    rating: fila.rating,
    createdAt: fila.created_at.toISOString(),
  }
}

router.get('/', async (_req, res) => {
  try {
    const { rows } = await query<FilaComentario>(
      `SELECT id, name, company, role, content, rating, created_at
       FROM comentarios_clientes
       ORDER BY created_at DESC`,
    )
    res.json(rows.map(mapComentario))
  } catch (error) {
    console.error('Comentarios GET error:', error)
    res.status(500).json({ error: 'No se pudieron cargar los comentarios' })
  }
})

router.post('/', async (req, res) => {
  const body = req.body ?? {}
  const name = String(body.name ?? '').trim()
  const content = String(body.content ?? '').trim()

  if (!name || !content) {
    res.status(400).json({ error: 'Nombre y comentario son obligatorios' })
    return
  }

  const rating = Math.min(5, Math.max(1, Math.round(Number(body.rating) || 5)))
  const company = body.company ? String(body.company).trim() : ''
  const role = body.role ? String(body.role).trim() : ''

  try {
    const { rows } = await query<FilaComentario>(
      `INSERT INTO comentarios_clientes (name, company, role, content, rating)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, company, role, content, rating, created_at`,
      [name, company || null, role || null, content, rating],
    )
    res.status(201).json(mapComentario(rows[0]))
  } catch (error) {
    console.error('Comentarios POST error:', error)
    res.status(500).json({ error: 'No se pudo publicar el comentario' })
  }
})

export default router
