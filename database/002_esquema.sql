-- Esquema principal Aleph Web
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
  CREATE TYPE tipo_solicitud AS ENUM ('contact', 'quote', 'job');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS categorias (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(16),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  orden INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS productos (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category_id VARCHAR(50) NOT NULL REFERENCES categorias(id),
  short_description TEXT,
  description TEXT,
  image TEXT,
  gallery JSONB NOT NULL DEFAULT '[]',
  materials JSONB NOT NULL DEFAULT '[]',
  finishes JSONB NOT NULL DEFAULT '[]',
  applications JSONB NOT NULL DEFAULT '[]',
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS solicitudes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type tipo_solicitud NOT NULL,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  role VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  city VARCHAR(100),
  message TEXT,
  quote_data JSONB,
  job_data JSONB,
  leido BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usuarios_admin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'admin',
  ultimo_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contenido_sitio (
  clave VARCHAR(100) PRIMARY KEY,
  datos JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_productos_category ON productos(category_id);
CREATE INDEX IF NOT EXISTS idx_productos_slug ON productos(slug);
CREATE INDEX IF NOT EXISTS idx_solicitudes_created ON solicitudes(created_at DESC);
