/**
 * Convierte data URLs JPEG/PNG almacenadas en BD a WebP (reduce peso de la API).
 * Uso: npm run optimizar-imagenes
 */

import 'dotenv/config'
import sharp from 'sharp'
import { pool, query } from '../db/pool.js'

const CALIDAD = 82
const LADO_MAX = 1920
const TAMANO_OBJETIVO = 450_000

const RE_DATA_URL = /^data:image\/(jpeg|jpg|png);base64,(.+)$/i

function esOptimizable(valor: unknown): valor is string {
  return typeof valor === 'string' && RE_DATA_URL.test(valor)
}

async function convertirDataUrlAWebp(dataUrl: string): Promise<string | null> {
  const coincidencia = dataUrl.match(RE_DATA_URL)
  if (!coincidencia) return null

  const buffer = Buffer.from(coincidencia[2], 'base64')
  if (buffer.length <= TAMANO_OBJETIVO && dataUrl.startsWith('data:image/webp')) {
    return null
  }

  let calidad = CALIDAD
  let salida = await sharp(buffer)
    .rotate()
    .resize(LADO_MAX, LADO_MAX, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: calidad })
    .toBuffer()

  while (salida.length > TAMANO_OBJETIVO && calidad > 40) {
    calidad -= 10
    salida = await sharp(buffer)
      .rotate()
      .resize(LADO_MAX, LADO_MAX, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: calidad })
      .toBuffer()
  }

  const antes = buffer.length
  if (salida.length >= antes) return null

  return `data:image/webp;base64,${salida.toString('base64')}`
}

async function optimizarValor(valor: unknown): Promise<{ valor: unknown; cambios: number }> {
  if (esOptimizable(valor)) {
    const convertido = await convertirDataUrlAWebp(valor)
    if (convertido) return { valor: convertido, cambios: 1 }
    return { valor, cambios: 0 }
  }

  if (Array.isArray(valor)) {
    let cambios = 0
    const items = []
    for (const item of valor) {
      const r = await optimizarValor(item)
      cambios += r.cambios
      items.push(r.valor)
    }
    return { valor: items, cambios }
  }

  if (valor && typeof valor === 'object') {
    let cambios = 0
    const resultado: Record<string, unknown> = {}
    for (const [clave, hijo] of Object.entries(valor as Record<string, unknown>)) {
      const r = await optimizarValor(hijo)
      cambios += r.cambios
      resultado[clave] = r.valor
    }
    return { valor: resultado, cambios }
  }

  return { valor, cambios: 0 }
}

async function optimizarProductos() {
  const { rows } = await query<{
    id: string
    image: string | null
    gallery: unknown
  }>('SELECT id, image, gallery FROM productos')

  let total = 0
  for (const fila of rows) {
    const imagen = await optimizarValor(fila.image ?? '')
    const galeria = await optimizarValor(fila.gallery ?? [])

    if (imagen.cambios + galeria.cambios === 0) continue

    await query(
      `UPDATE productos SET image = $2, gallery = $3::jsonb, updated_at = NOW() WHERE id = $1`,
      [fila.id, imagen.valor || '', JSON.stringify(galeria.valor ?? [])],
    )
    total += imagen.cambios + galeria.cambios
    console.log(`  producto ${fila.id}: ${imagen.cambios + galeria.cambios} imagen(es)`)
  }
  return total
}

async function optimizarContenidoSitio() {
  const { rows } = await query<{ clave: string; datos: unknown }>(
    'SELECT clave, datos FROM contenido_sitio',
  )

  let total = 0
  for (const fila of rows) {
    const optimizado = await optimizarValor(fila.datos)
    if (optimizado.cambios === 0) continue

    await query(
      `UPDATE contenido_sitio SET datos = $2::jsonb, updated_at = NOW() WHERE clave = $1`,
      [fila.clave, JSON.stringify(optimizado.valor)],
    )
    total += optimizado.cambios
    console.log(`  contenido "${fila.clave}": ${optimizado.cambios} imagen(es)`)
  }
  return total
}

async function main() {
  console.log('Optimizando imágenes en PostgreSQL (JPEG/PNG → WebP)…')

  const enProductos = await optimizarProductos()
  const enContenido = await optimizarContenidoSitio()

  console.log(`Listo. ${enProductos + enContenido} imagen(es) convertida(s).`)
  await pool.end()
}

main().catch((error) => {
  console.error(error)
  void pool.end()
  process.exit(1)
})
