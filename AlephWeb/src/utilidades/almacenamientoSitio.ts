/**
 * Almacenamiento persistente del sitio (IndexedDB + respaldo en localStorage).
 * IndexedDB aguanta imágenes en base64; localStorage suele fallar en ~5 MB.
 */

const DB_NAME = 'aleph_sitio'
const DB_VERSION = 1
const STORE = 'datos'

function abrirBase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const solicitud = indexedDB.open(DB_NAME, DB_VERSION)
    solicitud.onupgradeneeded = () => {
      solicitud.result.createObjectStore(STORE)
    }
    solicitud.onsuccess = () => resolve(solicitud.result)
    solicitud.onerror = () => reject(solicitud.error ?? new Error('No se pudo abrir IndexedDB'))
  })
}

export class ErrorAlmacenamiento extends Error {
  constructor(mensaje: string) {
    super(mensaje)
    this.name = 'ErrorAlmacenamiento'
  }
}

export async function guardarDatoSitio<T>(clave: string, valor: T): Promise<void> {
  const serializado = JSON.stringify(valor)

  try {
    localStorage.setItem(clave, serializado)
  } catch {
    /* localStorage puede fallar por tamaño; IndexedDB es el respaldo principal */
  }

  try {
    const db = await abrirBase()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put(valor, clave)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error ?? new Error('Error al escribir en IndexedDB'))
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new ErrorAlmacenamiento(
        'No hay espacio suficiente. Quita algunas imágenes grandes e intenta de nuevo.',
      )
    }
    throw new ErrorAlmacenamiento(
      error instanceof Error ? error.message : 'No se pudo guardar la información.',
    )
  }
}

export async function leerDatoSitio<T>(clave: string): Promise<T | null> {
  try {
    const db = await abrirBase()
    const desdeIdb = await new Promise<T | null>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly')
      const solicitud = tx.objectStore(STORE).get(clave)
      solicitud.onsuccess = () => resolve((solicitud.result as T | undefined) ?? null)
      solicitud.onerror = () => reject(solicitud.error)
    })
    if (desdeIdb) return desdeIdb
  } catch {
    /* fallback a localStorage */
  }

  try {
    const datos = localStorage.getItem(clave)
    return datos ? (JSON.parse(datos) as T) : null
  } catch {
    return null
  }
}

export async function eliminarDatoSitio(clave: string): Promise<void> {
  localStorage.removeItem(clave)
  try {
    const db = await abrirBase()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).delete(clave)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    /* ignorar */
  }
}
