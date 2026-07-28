import express from 'express'
import cors from 'cors'
import compression from 'compression'
import { config } from './config.js'
import { pool } from './db/pool.js'
import { aplicarMigracionesDb } from './db/migraciones.js'
import authRouter from './routes/auth.js'
import categoriasRouter from './routes/categorias.js'
import productosRouter from './routes/productos.js'
import solicitudesRouter from './routes/solicitudes.js'
import comentariosRouter from './routes/comentarios.js'
import contenidoRouter from './routes/contenido.js'

const app = express()

app.use(compression())
app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true,
  }),
)

app.use(express.json({ limit: '50mb' }))

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ ok: true, db: true })
  } catch {
    res.status(503).json({ ok: false, db: false })
  }
})

app.use('/api/auth', authRouter)
app.use('/api/categorias', categoriasRouter)
app.use('/api/productos', productosRouter)
app.use('/api/solicitudes', solicitudesRouter)
app.use('/api/contenido', contenidoRouter)
app.use('/api/comentarios', comentariosRouter)

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

async function iniciar() {
  try {
    await aplicarMigracionesDb()
  } catch (error) {
    console.error('Error aplicando migraciones de BD:', error)
  }

  app.listen(config.port, () => {
    console.log(`API Aleph escuchando en http://localhost:${config.port}`)
  })
}

void iniciar()
