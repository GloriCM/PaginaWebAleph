-- Añade el tipo 'job' para postulaciones laborales (hojas de vida)
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
