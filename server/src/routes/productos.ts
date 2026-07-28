import { Router } from 'express'
import { query } from '../db/pool.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { mapProducto, mapProductoResumen, slugify } from '../utils/helpers.js'

const router = Router()

async function obtenerPorSlug(slug: string) {
  const { rows } = await query(
    `SELECT id, name, slug, category_id, short_description, description, image,
            gallery, materials, finishes, applications
     FROM productos
     WHERE slug = $1 AND activo = TRUE
     LIMIT 1`,
    [slug],
  )
  return rows[0] ?? null
}

router.get('/', async (_req, res) => {
  try {
    const { rows } = await query(
      `SELECT id, name, slug, category_id, short_description, description, image,
              gallery, materials, finishes, applications
       FROM productos
       WHERE activo = TRUE
       ORDER BY name ASC`,
    )
    res.json(rows.map((fila) => mapProductoResumen(fila as Parameters<typeof mapProductoResumen>[0])))
  } catch (error) {
    console.error('Productos GET error:', error)
    res.status(500).json({ error: 'No se pudieron cargar los productos' })
  }
})

router.get('/admin/todos', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const { rows } = await query(
      `SELECT id, name, slug, category_id, short_description, description, image,
              gallery, materials, finishes, applications
       FROM productos
       ORDER BY name ASC`,
    )
    res.json(rows.map((fila) => mapProducto(fila as Parameters<typeof mapProducto>[0])))
  } catch (error) {
    console.error('Productos admin GET error:', error)
    res.status(500).json({ error: 'No se pudieron cargar los productos' })
  }
})

router.get('/:slug', async (req, res) => {
  try {
    const fila = await obtenerPorSlug(req.params.slug)
    if (!fila) {
      res.status(404).json({ error: 'Producto no encontrado' })
      return
    }
    res.json(mapProducto(fila as Parameters<typeof mapProducto>[0]))
  } catch (error) {
    console.error('Producto GET error:', error)
    res.status(500).json({ error: 'No se pudo cargar el producto' })
  }
})

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const body = req.body ?? {}
  const name = String(body.name ?? '').trim()
  if (!name) {
    res.status(400).json({ error: 'El nombre es obligatorio' })
    return
  }

  const id = body.id ? String(body.id) : `prod-${Date.now()}`
  const slug = String(body.slug ?? slugify(name)).trim() || slugify(name)

  try {
    const { rows } = await query(
      `INSERT INTO productos (
         id, name, slug, category_id, short_description, description, image,
         gallery, materials, finishes, applications
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9::text[],$10::text[],$11::text[])
       RETURNING id, name, slug, category_id, short_description, description, image,
                 gallery, materials, finishes, applications`,
      [
        id,
        name,
        slug,
        String(body.categoryId ?? 'plegadizas'),
        String(body.shortDescription ?? ''),
        String(body.description ?? ''),
        String(body.image ?? ''),
        JSON.stringify(body.gallery ?? []),
        body.materials ?? [],
        body.finishes ?? [],
        body.applications ?? [],
      ],
    )
    res.status(201).json(mapProducto(rows[0] as Parameters<typeof mapProducto>[0]))
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      res.status(409).json({ error: 'Ya existe un producto con ese slug' })
      return
    }
    console.error('Producto POST error:', error)
    res.status(500).json({ error: 'No se pudo crear el producto' })
  }
})

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const body = req.body ?? {}
  const name = String(body.name ?? '').trim()
  if (!name) {
    res.status(400).json({ error: 'El nombre es obligatorio' })
    return
  }

  const slug = String(body.slug ?? slugify(name)).trim() || slugify(name)

  try {
    const { rows } = await query(
      `UPDATE productos SET
         name = $2,
         slug = $3,
         category_id = $4,
         short_description = $5,
         description = $6,
         image = $7,
         gallery = $8::jsonb,
         materials = $9::text[],
         finishes = $10::text[],
         applications = $11::text[],
         updated_at = NOW()
       WHERE id = $1
       RETURNING id, name, slug, category_id, short_description, description, image,
                 gallery, materials, finishes, applications`,
      [
        req.params.id,
        name,
        slug,
        String(body.categoryId ?? 'plegadizas'),
        String(body.shortDescription ?? ''),
        String(body.description ?? ''),
        String(body.image ?? ''),
        JSON.stringify(body.gallery ?? []),
        body.materials ?? [],
        body.finishes ?? [],
        body.applications ?? [],
      ],
    )

    if (!rows[0]) {
      res.status(404).json({ error: 'Producto no encontrado' })
      return
    }

    res.json(mapProducto(rows[0] as Parameters<typeof mapProducto>[0]))
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      res.status(409).json({ error: 'Ya existe un producto con ese slug' })
      return
    }
    console.error('Producto PUT error:', error)
    res.status(500).json({ error: 'No se pudo actualizar el producto' })
  }
})

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { rowCount } = await query('DELETE FROM productos WHERE id = $1', [req.params.id])
    if (!rowCount) {
      res.status(404).json({ error: 'Producto no encontrado' })
      return
    }
    res.status(204).end()
  } catch (error) {
    console.error('Producto DELETE error:', error)
    res.status(500).json({ error: 'No se pudo eliminar el producto' })
  }
})

export default router
