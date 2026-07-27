import { Router } from 'express'
import { query } from '../db/pool.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { enviarCorreoPostulacionRRHH } from '../services/emailPostulacion.js'
import {
  enviarCorreoContactoCliente,
  enviarCorreoCotizacionCliente,
} from '../services/emailSolicitudCliente.js'
import { mapSolicitud } from '../utils/helpers.js'

const router = Router()

router.post('/', async (req, res) => {
  const body = req.body ?? {}
  const type = body.type

  if (!['contact', 'quote', 'job'].includes(type)) {
    res.status(400).json({ error: 'Tipo de solicitud inválido' })
    return
  }

  if (!body.name || !body.email) {
    res.status(400).json({ error: 'Nombre y email son obligatorios' })
    return
  }

  try {
    const { rows } = await query(
      `INSERT INTO solicitudes (
         type, name, company, role, email, phone, city, message, quote_data, job_data
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb)
       RETURNING id, type, name, company, role, email, phone, city, message,
                 quote_data, job_data, created_at`,
      [
        type,
        String(body.name).trim(),
        body.company ? String(body.company) : null,
        body.role ? String(body.role) : null,
        String(body.email).trim().toLowerCase(),
        body.phone ? String(body.phone) : null,
        body.city ? String(body.city) : null,
        body.message ? String(body.message) : null,
        body.quoteData ? JSON.stringify(body.quoteData) : null,
        body.jobData ? JSON.stringify(body.jobData) : null,
      ],
    )

    const datosCorreo = {
      name: String(body.name).trim(),
      email: String(body.email).trim().toLowerCase(),
      phone: body.phone ? String(body.phone) : null,
      city: body.city ? String(body.city) : null,
      company: body.company ? String(body.company) : null,
      role: body.role ? String(body.role) : null,
      message: body.message ? String(body.message) : null,
    }

    if (type === 'job') {
      try {
        await enviarCorreoPostulacionRRHH({
          ...datosCorreo,
          jobData: body.jobData ?? null,
        })
      } catch (error) {
        console.error('Error enviando correo de postulación RRHH:', error)
      }
    } else if (type === 'contact') {
      try {
        await enviarCorreoContactoCliente(datosCorreo)
      } catch (error) {
        console.error('Error enviando correo de contacto:', error)
      }
    } else if (type === 'quote') {
      try {
        await enviarCorreoCotizacionCliente({
          ...datosCorreo,
          quoteData: body.quoteData ?? null,
        })
      } catch (error) {
        console.error('Error enviando correo de cotización:', error)
      }
    }

    res.status(201).json(mapSolicitud(rows[0] as Parameters<typeof mapSolicitud>[0]))
  } catch (error) {
    console.error('Solicitud POST error:', error)
    res.status(500).json({ error: 'No se pudo registrar la solicitud' })
  }
})

router.get('/', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const { rows } = await query(
      `SELECT id, type, name, company, role, email, phone, city, message,
              quote_data, job_data, created_at
       FROM solicitudes
       ORDER BY created_at DESC`,
    )
    res.json(rows.map((fila) => mapSolicitud(fila as Parameters<typeof mapSolicitud>[0])))
  } catch (error) {
    console.error('Solicitudes GET error:', error)
    res.status(500).json({ error: 'No se pudieron cargar las solicitudes' })
  }
})

export default router
