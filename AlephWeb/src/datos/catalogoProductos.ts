/**
 * Catálogo de productos — API PostgreSQL con caché local de respaldo.
 */

import type { Producto } from '../tipos/indice'
import { productosIniciales } from './productos'
import { establecerCacheProductos, obtenerCacheProductos } from './cacheProductos'
import {
  actualizarProductoApi,
  crearProductoApi,
  eliminarProductoApi,
  haySesionAdmin,
  obtenerProductoPorSlugApi,
  obtenerProductosAdminApi,
  obtenerProductosApi,
  verificarApiDisponible,
} from '../servicios/api'

export const CLAVE_CATALOGO_PRODUCTOS = 'aleph_catalogo_productos'
export const EVENTO_CATALOGO_PRODUCTOS = 'aleph:catalogo-productos-actualizado'

function notificarCambio(productos: Producto[]) {
  establecerCacheProductos(productos)
  window.dispatchEvent(new Event(EVENTO_CATALOGO_PRODUCTOS))
}

export function obtenerProductos(): Producto[] {
  return obtenerCacheProductos() ?? productosIniciales.map((p) => ({ ...p }))
}

export function obtenerProductoPorSlug(slug: string) {
  return obtenerProductos().find((p) => p.slug === slug)
}

export function obtenerProductosPorCategoria(categoryId: string) {
  return obtenerProductos().filter((p) => p.categoryId === categoryId)
}

export function crearSlugProducto(nombre: string, idExcluir?: string): string {
  let base = nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  if (!base) base = `producto-${Date.now()}`

  const existentes = obtenerProductos().filter((p) => p.id !== idExcluir).map((p) => p.slug)
  if (!existentes.includes(base)) return base

  let i = 2
  while (existentes.includes(`${base}-${i}`)) i += 1
  return `${base}-${i}`
}

export async function cargarCatalogoProductos(): Promise<Producto[]> {
  try {
    const productos = haySesionAdmin()
      ? await obtenerProductosAdminApi()
      : await obtenerProductosApi()
    notificarCambio(productos)
    return productos
  } catch (error) {
    console.warn('No se pudo cargar productos desde API:', error)
  }

  notificarCambio(productosIniciales.map((p) => ({ ...p })))
  return obtenerProductos()
}

export async function cargarProductoPorSlug(slug: string): Promise<Producto | null> {
  const enCache = obtenerProductoPorSlug(slug)
  if (enCache?.gallery?.length || enCache?.description?.trim()) {
    return enCache
  }

  try {
    const producto = await obtenerProductoPorSlugApi(slug)
    const actuales = obtenerProductos()
    const indice = actuales.findIndex((p) => p.slug === slug)
    const actualizados =
      indice >= 0
        ? actuales.map((p, i) => (i === indice ? producto : p))
        : [...actuales, producto]
    notificarCambio(actualizados)
    return producto
  } catch (error) {
    console.warn(`No se pudo cargar producto "${slug}" desde API:`, error)
    return enCache ?? null
  }
}

export async function guardarProducto(producto: Producto): Promise<Producto> {
  const normalizado: Producto = {
    ...producto,
    slug: producto.slug.trim() || crearSlugProducto(producto.name, producto.id),
    gallery: producto.gallery ?? [],
    materials: producto.materials ?? [],
    finishes: producto.finishes ?? [],
    applications: producto.applications ?? [],
  }

  if (!haySesionAdmin()) {
    throw new Error('Sesión expirada. Cierra sesión e ingresa de nuevo al panel.')
  }

  if (!(await verificarApiDisponible())) {
    throw new Error('La API no está disponible. Inicia el servidor en server/ (npm run dev).')
  }

  const guardado = await actualizarProductoApi(normalizado)
  await cargarCatalogoProductos()
  return guardado
}

export async function crearProducto(
  datos: Omit<Producto, 'id' | 'slug'> & { slug?: string },
): Promise<Producto> {
  const id = `prod-${Date.now()}`
  const slug = datos.slug?.trim() || crearSlugProducto(datos.name)
  const producto: Producto = {
    ...datos,
    id,
    slug,
    gallery: datos.gallery ?? [],
    materials: datos.materials ?? [],
    finishes: datos.finishes ?? [],
    applications: datos.applications ?? [],
  }

  if (!haySesionAdmin()) {
    throw new Error('Sesión expirada. Cierra sesión e ingresa de nuevo al panel.')
  }

  if (!(await verificarApiDisponible())) {
    throw new Error('La API no está disponible. Inicia el servidor en server/ (npm run dev).')
  }

  const creado = await crearProductoApi(producto)
  await cargarCatalogoProductos()
  return creado
}

export async function eliminarProducto(id: string): Promise<void> {
  if (!haySesionAdmin()) {
    throw new Error('Sesión expirada. Cierra sesión e ingresa de nuevo al panel.')
  }

  if (!(await verificarApiDisponible())) {
    throw new Error('La API no está disponible. Inicia el servidor en server/ (npm run dev).')
  }

  await eliminarProductoApi(id)
  await cargarCatalogoProductos()
}

export async function restablecerCatalogoProductos(): Promise<Producto[]> {
  return cargarCatalogoProductos()
}

export function productoVacio(categoryId = 'plegadizas'): Producto {
  return {
    id: '',
    name: '',
    slug: '',
    categoryId,
    shortDescription: '',
    description: '',
    image: '',
    gallery: [],
    materials: [],
    finishes: [],
    applications: [],
  }
}

export function parseListaAdmin(valor: string): string[] {
  return valor
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function joinListaAdmin(lista: string[]): string {
  return lista.join(', ')
}

/** Imagen principal + galería sin duplicados. */
export function imagenesProducto(imagenPrincipal: string, galeria: string[]): string[] {
  const extras = galeria.filter((img) => img && img !== imagenPrincipal)
  return imagenPrincipal ? [imagenPrincipal, ...extras] : extras
}
