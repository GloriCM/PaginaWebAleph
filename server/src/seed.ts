import bcrypt from 'bcrypt'
import { pool, query } from './db/pool.js'

async function seedAdmin() {
  const email = 'admin@aleph.com'
  const { rows } = await query('SELECT id FROM usuarios_admin WHERE email = $1', [email])
  if (rows.length) return

  const hash = await bcrypt.hash('admin123', 10)
  await query(
    `INSERT INTO usuarios_admin (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'admin')`,
    ['Administrador', email, hash],
  )
  console.log('Usuario admin creado: admin@aleph.com / admin123')
}

async function main() {
  await seedAdmin()
  await pool.end()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
