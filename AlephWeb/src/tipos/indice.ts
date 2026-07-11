/**
 * @file indice.ts
 * @description Definiciones de tipos TypeScript para todo el aplicativo web de Aleph Impresores.
 * Centraliza las interfaces utilizadas en datos, formularios y componentes.
 * @module tipos
 */

/** Categoría de productos del portafolio (RF-004). */
export interface Categoria {
  /** Identificador único de la categoría. */
  id: string
  /** Nombre visible de la categoría. */
  name: string
  /** Slug para URLs amigables. */
  slug: string
  /** Descripción breve de la categoría. */
  description: string
  /** Emoji o icono representativo. */
  icon: string
}

/** Producto del portafolio comercial (RF-003, RF-005). */
export interface Producto {
  id: string
  name: string
  slug: string
  /** ID de la categoría a la que pertenece. */
  categoryId: string
  shortDescription: string
  description: string
  image: string
  /** Galería de imágenes adicionales. */
  gallery: string[]
  materials: string[]
  finishes: string[]
  applications: string[]
}

/** Proyecto de la galería de trabajos realizados (RF-009). */
export interface ProyectoGaleria {
  id: string
  name: string
  productType: string
  client?: string
  description: string
  image: string
}

/** Artículo de noticias o novedades (RF-010). */
export interface Noticia {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  date: string
}

/** Cliente o empresa atendida (RF-012). */
export interface Cliente {
  id: string
  name: string
  logo: string
  industry: string
}

/** Certificación de calidad (RF-011). */
export interface Certificacion {
  id: string
  name: string
  issuer: string
  year: string
  description: string
  image: string
}

/** Testimonio de un cliente (RF-013). */
export interface Testimonio {
  id: string
  name: string
  company: string
  role: string
  content: string
  rating: number
}

/** Datos del formulario de contacto (RF-006). */
export interface DatosFormularioContacto {
  name: string
  company: string
  role: string
  email: string
  phone: string
  city: string
  message: string
}

/** Datos del formulario de cotización (RF-007). */
export interface DatosFormularioCotizacion {
  product: string
  quantity: string
  width: string
  length: string
  material: string
  notes: string
  file?: File | null
}

/** Solicitud de contacto o cotización almacenada (RF-008). */
export interface SolicitudCliente extends DatosFormularioContacto {
  id: string
  type: 'contact' | 'quote'
  createdAt: string
  quoteData?: Omit<DatosFormularioCotizacion, 'file'>
}

/** Usuario del panel administrativo (RF-022). */
export interface UsuarioAdministrador {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor'
}
