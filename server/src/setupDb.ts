/**
 * Configura/migra aleph_web y crea usuario admin.
 * Uso: npm run setup-db
 */
import 'dotenv/config'
import bcrypt from 'bcrypt'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { pool, query } from './db/pool.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function ejecutarSqlArchivo(rutaRelativa: string) {
  const ruta = path.resolve(__dirname, '../../database', rutaRelativa)
  if (!fs.existsSync(ruta)) return
  const sql = fs.readFileSync(ruta, 'utf8')
  await pool.query(sql)
  console.log(`OK: ${rutaRelativa}`)
}

async function asegurarAdmin() {
  const email = 'admin@aleph.com'
  const hash = await bcrypt.hash('admin123', 10)
  const { rows } = await query('SELECT id FROM usuarios_admin WHERE email = $1', [email])

  if (rows.length) {
    await query(
      `UPDATE usuarios_admin SET password_hash = $2, role = 'admin' WHERE email = $1`,
      [email, hash],
    )
    console.log('Admin actualizado: admin@aleph.com / admin123')
  } else {
    await query(
      `INSERT INTO usuarios_admin (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'admin')`,
      ['Administrador', email, hash],
    )
    console.log('Admin creado: admin@aleph.com / admin123')
  }
}

async function resumen() {
  const tablas = ['productos', 'categorias', 'solicitudes', 'usuarios_admin', 'contenido_sitio']
  for (const tabla of tablas) {
    try {
      const { rows } = await query<{ count: string }>(`SELECT COUNT(*)::text AS count FROM ${tabla}`)
      console.log(`  ${tabla}: ${rows[0]?.count ?? '0'} registros`)
    } catch {
      console.log(`  ${tabla}: (no disponible)`)
    }
  }
}

async function main() {
  console.log('Conectando a PostgreSQL…')
  await query('SELECT 1')
  console.log('Conexión OK')

  await ejecutarSqlArchivo('005_migracion_api.sql')

  try {
    await ejecutarSqlArchivo('003_datos_iniciales.sql')
  } catch (error) {
    console.warn('Datos iniciales (puede que ya existan):', (error as Error).message)
  }

  await asegurarAdmin()
  console.log('\nResumen:')
  await resumen()
  await pool.end()
}

main().catch((error) => {
  console.error('Error en setup:', error.message)
  process.exit(1)
})
