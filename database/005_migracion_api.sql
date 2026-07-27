-- Migraciones para integrar API actual con aleph_web existente
CREATE TABLE IF NOT EXISTS contenido_sitio (
  clave VARCHAR(100) PRIMARY KEY,
  datos JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Columnas JSON en productos (si venían del esquema antiguo con producto_galeria)
ALTER TABLE productos ADD COLUMN IF NOT EXISTS gallery JSONB NOT NULL DEFAULT '[]';
ALTER TABLE productos ADD COLUMN IF NOT EXISTS materials JSONB NOT NULL DEFAULT '[]';
ALTER TABLE productos ADD COLUMN IF NOT EXISTS finishes JSONB NOT NULL DEFAULT '[]';
ALTER TABLE productos ADD COLUMN IF NOT EXISTS applications JSONB NOT NULL DEFAULT '[]';
ALTER TABLE productos ADD COLUMN IF NOT EXISTS short_description TEXT;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS category_id VARCHAR(50);
ALTER TABLE productos ADD COLUMN IF NOT EXISTS activo BOOLEAN NOT NULL DEFAULT TRUE;

-- job_data / quote_data en solicitudes
ALTER TABLE solicitudes ADD COLUMN IF NOT EXISTS quote_data JSONB;
ALTER TABLE solicitudes ADD COLUMN IF NOT EXISTS job_data JSONB;
ALTER TABLE solicitudes ADD COLUMN IF NOT EXISTS leido BOOLEAN NOT NULL DEFAULT FALSE;
