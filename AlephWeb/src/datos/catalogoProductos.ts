/**
 * Catálogo de productos editable (IndexedDB + defaults).
 */

import type { Producto } from '../tipos/indice'
import { productosIniciales } from './productos'
import { establecerCacheProductos, obtenerCacheProductos } from './cacheProductos'
import { eliminarDatoSitio, guardarDatoSitio, leerDatoSitio } from '../utilidades/almacenamientoSitio'

export const CLAVE_CATALOGO_PRODUCTOS = 'aleph_catalogo_productos'
export const EVENTO_CATALOGO_PRODUCTOS = 'aleph:catalogo-productos-actualizado'

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
  const guardado = await leerDatoSitio<Producto[]>(CLAVE_CATALOGO_PRODUCTOS)
  const productos = guardado?.length ? guardado : productosIniciales.map((p) => ({ ...p }))
  establecerCacheProductos(productos)
  return productos
}

async function persistirProductos(productos: Producto[]): Promise<Producto[]> {
  await guardarDatoSitio(CLAVE_CATALOGO_PRODUCTOS, productos)
  establecerCacheProductos(productos)
  window.dispatchEvent(new Event(EVENTO_CATALOGO_PRODUCTOS))
  return productos
}

export async function guardarProducto(producto: Producto): Promise<Producto> {
  const lista = [...obtenerProductos()]
  const indice = lista.findIndex((p) => p.id === producto.id)

  const normalizado: Producto = {
    ...producto,
    slug: producto.slug.trim() || crearSlugProducto(producto.name, producto.id),
    gallery: producto.gallery ?? [],
    materials: producto.materials ?? [],
    finishes: producto.finishes ?? [],
    applications: producto.applications ?? [],
  }

  if (indice >= 0) {
    lista[indice] = normalizado
  } else {
    lista.push(normalizado)
  }

  await persistirProductos(lista)
  return normalizado
}

export async function crearProducto(
  datos: Omit<Producto, 'id' | 'slug'> & { slug?: string },
): Promise<Producto> {
  const id = `prod-${Date.now()}`
  const slug = datos.slug?.trim() || crearSlugProducto(datos.name)

  return guardarProducto({
    ...datos,
    id,
    slug,
    gallery: datos.gallery ?? [],
    materials: datos.materials ?? [],
    finishes: datos.finishes ?? [],
    applications: datos.applications ?? [],
  })
}

export async function eliminarProducto(id: string): Promise<void> {
  const lista = obtenerProductos().filter((p) => p.id !== id)
  await persistirProductos(lista)
}

export async function restablecerCatalogoProductos(): Promise<Producto[]> {
  await eliminarDatoSitio(CLAVE_CATALOGO_PRODUCTOS)
  const originales = productosIniciales.map((p) => ({ ...p }))
  establecerCacheProductos(originales)
  window.dispatchEvent(new Event(EVENTO_CATALOGO_PRODUCTOS))
  return originales
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
