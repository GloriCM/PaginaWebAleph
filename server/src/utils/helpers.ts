export function slugify(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

interface FilaProducto {
  id: string
  name: string
  slug: string
  category_id: string
  short_description: string | null
  description: string | null
  image: string | null
  gallery?: string[] | null
  materials?: string[] | null
  finishes?: string[] | null
  applications?: string[] | null
}

function normalizarLista(valor: unknown): string[] {
  if (Array.isArray(valor)) return valor.map(String)
  return []
}

export function mapProducto(fila: FilaProducto) {
  return {
    id: String(fila.id),
    name: fila.name,
    slug: fila.slug,
    categoryId: fila.category_id,
    shortDescription: fila.short_description ?? '',
    description: fila.description ?? '',
    image: fila.image ?? '',
    gallery: normalizarLista(fila.gallery),
    materials: normalizarLista(fila.materials),
    finishes: normalizarLista(fila.finishes),
    applications: normalizarLista(fila.applications),
  }
}

/** Versión ligera para listados públicos (sin galería ni descripción larga). */
export function mapProductoResumen(fila: FilaProducto) {
  return {
    id: String(fila.id),
    name: fila.name,
    slug: fila.slug,
    categoryId: fila.category_id,
    shortDescription: fila.short_description ?? '',
    description: '',
    image: fila.image ?? '',
    gallery: [] as string[],
    materials: [] as string[],
    finishes: [] as string[],
    applications: [] as string[],
  }
}

interface FilaSolicitud {
  id: string
  type: 'contact' | 'quote' | 'job'
  name: string
  company: string | null
  role: string | null
  email: string
  phone: string | null
  city: string | null
  message: string | null
  quote_data: Record<string, unknown> | null
  job_data: Record<string, unknown> | null
  created_at: string | Date
}

export function mapSolicitud(fila: FilaSolicitud) {
  return {
    id: fila.id,
    type: fila.type,
    name: fila.name,
    company: fila.company ?? '',
    role: fila.role ?? '',
    email: fila.email,
    phone: fila.phone ?? '',
    city: fila.city ?? '',
    message: fila.message ?? '',
    quoteData: fila.quote_data ?? undefined,
    jobData: fila.job_data ?? undefined,
    createdAt: new Date(fila.created_at).toISOString(),
  }
}
