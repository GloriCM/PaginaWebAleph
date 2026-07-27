import { Router } from 'express'
import { query } from '../db/pool.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

async function leerClave(clave: string) {
  const { rows } = await query<{ datos: unknown }>(
    'SELECT datos FROM contenido_sitio WHERE clave = $1 LIMIT 1',
    [clave],
  )
  return rows[0]?.datos ?? null
}

async function guardarClave(clave: string, datos: unknown) {
  await query(
    `INSERT INTO contenido_sitio (clave, datos, updated_at)
     VALUES ($1, $2::jsonb, NOW())
     ON CONFLICT (clave) DO UPDATE SET datos = EXCLUDED.datos, updated_at = NOW()`,
    [clave, JSON.stringify(datos)],
  )
}

router.get('/inicio', async (_req, res) => {
  try {
    const datos = await leerClave('contenido_inicio')
    res.json({ datos })
  } catch (error) {
    console.error('Contenido inicio GET error:', error)
    res.status(500).json({ error: 'No se pudo cargar el contenido de inicio' })
  }
})

router.put('/inicio', requireAuth, requireAdmin, async (req, res) => {
  try {
    const datos = req.body?.datos ?? req.body
    if (!datos || typeof datos !== 'object') {
      res.status(400).json({ error: 'Datos inválidos' })
      return
    }
    await guardarClave('contenido_inicio', datos)
    res.json({ ok: true, datos })
  } catch (error) {
    console.error('Contenido inicio PUT error:', error)
    res.status(500).json({ error: 'No se pudo guardar el contenido de inicio' })
  }
})

router.get('/vacantes', async (_req, res) => {
  try {
    const datos = await leerClave('banner_vacantes')
    res.json({ datos })
  } catch (error) {
    console.error('Vacantes GET error:', error)
    res.status(500).json({ error: 'No se pudo cargar el banner de vacantes' })
  }
})

router.put('/vacantes', requireAuth, requireAdmin, async (req, res) => {
  try {
    const datos = req.body?.datos ?? req.body
    if (!datos || typeof datos !== 'object') {
      res.status(400).json({ error: 'Datos inválidos' })
      return
    }
    await guardarClave('banner_vacantes', datos)
    res.json({ ok: true, datos })
  } catch (error) {
    console.error('Vacantes PUT error:', error)
    res.status(500).json({ error: 'No se pudo guardar el banner de vacantes' })
  }
})

router.get('/editorial', async (_req, res) => {
  try {
    const datos = await leerClave('contenido_editorial')
    res.json({ datos })
  } catch (error) {
    console.error('Contenido editorial GET error:', error)
    res.status(500).json({ error: 'No se pudo cargar el contenido editorial' })
  }
})

router.put('/editorial', requireAuth, requireAdmin, async (req, res) => {
  try {
    const datos = req.body?.datos ?? req.body
    if (!datos || typeof datos !== 'object') {
      res.status(400).json({ error: 'Datos inválidos' })
      return
    }
    await guardarClave('contenido_editorial', datos)
    res.json({ ok: true, datos })
  } catch (error) {
    console.error('Contenido editorial PUT error:', error)
    res.status(500).json({ error: 'No se pudo guardar el contenido editorial' })
  }
})

export default router
