import { Router } from 'express'
import { query } from '../db/pool.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const { rows } = await query<{
      id: string
      name: string
      slug: string
      description: string | null
      icon: string | null
    }>(
      `SELECT id, name, slug, description, icon
       FROM categorias
       WHERE activo = TRUE
       ORDER BY orden ASC, name ASC`,
    )

    res.json(
      rows.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description ?? '',
        icon: c.icon ?? '',
      })),
    )
  } catch (error) {
    console.error('Categorías error:', error)
    res.status(500).json({ error: 'No se pudieron cargar las categorías' })
  }
})

export default router
