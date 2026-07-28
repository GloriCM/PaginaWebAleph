/**
 * Cliente HTTP para la API de Aleph Web.
 */

import type { Producto, SolicitudCliente, UsuarioAdministrador } from '../tipos/indice'

const BASE_URL = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '')
export const CLAVE_SESION = '_aleph_k'
export const CLAVE_USUARIO = '_aleph_u'

export class ErrorApi extends Error {
  status: number

  constructor(mensaje: string, status: number) {
    super(mensaje)
    this.name = 'ErrorApi'
    this.status = status
  }
}

function obtenerToken() {
  return sessionStorage.getItem(CLAVE_SESION)
}

export function guardarSesion(token: string, user: UsuarioAdministrador) {
  sessionStorage.setItem(CLAVE_SESION, token)
  sessionStorage.setItem(CLAVE_USUARIO, JSON.stringify(user))
  sessionStorage.setItem('aleph_admin', 'true')
}

export function obtenerUsuarioSesion(): UsuarioAdministrador | null {
  try {
    const raw = sessionStorage.getItem(CLAVE_USUARIO)
    return raw ? (JSON.parse(raw) as UsuarioAdministrador) : null
  } catch {
    return null
  }
}

export function cerrarSesionAdmin() {
  sessionStorage.removeItem(CLAVE_SESION)
  sessionStorage.removeItem(CLAVE_USUARIO)
  sessionStorage.removeItem('aleph_admin')
}

export function haySesionAdmin() {
  return Boolean(obtenerToken())
}

async function solicitud<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
  const headers = new Headers(opciones.headers)
  if (!headers.has('Content-Type') && opciones.body) {
    headers.set('Content-Type', 'application/json')
  }

  const token = obtenerToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const respuesta = await fetch(`${BASE_URL}${ruta}`, { ...opciones, headers })

  if (respuesta.status === 204) {
    return undefined as T
  }

  const datos = await respuesta.json().catch(() => ({}))

  if (!respuesta.ok) {
    throw new ErrorApi(datos.error ?? 'Error en la solicitud', respuesta.status)
  }

  return datos as T
}

export async function verificarApiDisponible(timeoutMs = 5000) {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    const datos = await solicitud<{ ok: boolean; db: boolean }>('/health', {
      signal: controller.signal,
    })
    clearTimeout(timer)
    return datos.ok && datos.db
  } catch {
    return false
  }
}

export async function loginAdmin(email: string, password: string) {
  const datos = await solicitud<{ token: string; user: UsuarioAdministrador }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  guardarSesion(datos.token, datos.user)
  return datos
}

export async function verificarSesionAdmin() {
  if (!haySesionAdmin()) return null
  try {
    const datos = await solicitud<{ user: UsuarioAdministrador }>('/auth/me')
    return datos.user
  } catch {
    cerrarSesionAdmin()
    return null
  }
}

export async function obtenerProductosApi(): Promise<Producto[]> {
  return solicitud<Producto[]>('/productos')
}

export async function obtenerProductosAdminApi(): Promise<Producto[]> {
  return solicitud<Producto[]>('/productos/admin/todos')
}

export async function crearProductoApi(producto: Producto): Promise<Producto> {
  return solicitud<Producto>('/productos', {
    method: 'POST',
    body: JSON.stringify(producto),
  })
}

export async function actualizarProductoApi(producto: Producto): Promise<Producto> {
  return solicitud<Producto>(`/productos/${producto.id}`, {
    method: 'PUT',
    body: JSON.stringify(producto),
  })
}

export async function eliminarProductoApi(id: string): Promise<void> {
  await solicitud<void>(`/productos/${id}`, { method: 'DELETE' })
}

export async function enviarSolicitudApi(
  solicitudDatos: Omit<SolicitudCliente, 'id' | 'createdAt'>,
): Promise<SolicitudCliente> {
  return solicitud<SolicitudCliente>('/solicitudes', {
    method: 'POST',
    body: JSON.stringify(solicitudDatos),
  })
}

export async function obtenerSolicitudesApi(): Promise<SolicitudCliente[]> {
  return solicitud<SolicitudCliente[]>('/solicitudes')
}

export async function obtenerContenidoInicioApi(): Promise<unknown | null> {
  const datos = await solicitud<{ datos: unknown | null }>('/contenido/inicio')
  return datos.datos
}

export async function guardarContenidoInicioApi(contenido: unknown): Promise<void> {
  await solicitud('/contenido/inicio', {
    method: 'PUT',
    body: JSON.stringify({ datos: contenido }),
  })
}

export async function obtenerBannerVacantesApi(): Promise<unknown | null> {
  const datos = await solicitud<{ datos: unknown | null }>('/contenido/vacantes')
  return datos.datos
}

export async function guardarBannerVacantesApi(banner: unknown): Promise<void> {
  await solicitud('/contenido/vacantes', {
    method: 'PUT',
    body: JSON.stringify({ datos: banner }),
  })
}

export async function obtenerContenidoEditorialApi(): Promise<unknown | null> {
  const datos = await solicitud<{ datos: unknown | null }>('/contenido/editorial')
  return datos.datos
}

export async function guardarContenidoEditorialApi(contenido: unknown): Promise<void> {
  await solicitud('/contenido/editorial', {
    method: 'PUT',
    body: JSON.stringify({ datos: contenido }),
  })
}

export async function obtenerComentariosApi() {
  return solicitud<
    Array<{
      id: string
      name: string
      company: string
      role: string
      content: string
      rating: number
      createdAt: string
    }>
  >('/comentarios')
}

export async function crearComentarioApi(datos: {
  name: string
  company: string
  role: string
  content: string
  rating: number
}) {
  return solicitud<{
    id: string
    name: string
    company: string
    role: string
    content: string
    rating: number
    createdAt: string
  }>('/comentarios', {
    method: 'POST',
    body: JSON.stringify(datos),
  })
}
