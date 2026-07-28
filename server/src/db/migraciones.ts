import { query } from './pool.js'

/** Aplica migraciones ligeras necesarias para la API actual. */
export async function aplicarMigracionesDb() {
  await query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_enum e
        JOIN pg_type t ON e.enumtypid = t.oid
        WHERE t.typname = 'tipo_solicitud' AND e.enumlabel = 'job'
      ) THEN
        ALTER TYPE tipo_solicitud ADD VALUE 'job';
      END IF;
    END $$;
  `)

  await query(`ALTER TABLE solicitudes ADD COLUMN IF NOT EXISTS quote_data JSONB`)
  await query(`ALTER TABLE solicitudes ADD COLUMN IF NOT EXISTS job_data JSONB`)
  await query(`ALTER TABLE solicitudes ADD COLUMN IF NOT EXISTS leido BOOLEAN NOT NULL DEFAULT FALSE`)

  await query(`
    CREATE TABLE IF NOT EXISTS comentarios_clientes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      company VARCHAR(255),
      role VARCHAR(255),
      content TEXT NOT NULL,
      rating INT NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
  await query(`
    CREATE INDEX IF NOT EXISTS idx_comentarios_clientes_created
    ON comentarios_clientes(created_at DESC)
  `)
}
