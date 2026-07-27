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
}
