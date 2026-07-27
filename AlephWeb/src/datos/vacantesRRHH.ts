/**
 * @file vacantesRRHH.ts
 * @description Banner de vacantes gestionado vía API.
 */

import {
  guardarBannerVacantesApi,
  haySesionAdmin,
  obtenerBannerVacantesApi,
  verificarApiDisponible,
} from '../servicios/api'

export interface BannerVacantesRRHH {
  imageDataUrl: string | null
  titulo: string
  subtitulo: string
  activo: boolean
  updatedAt: string | null
}

export const CLAVE_BANNER = 'aleph_banner_vacantes'
export const EVENTO_BANNER_VACANTES = 'aleph:banner-vacantes-actualizado'

const bannerPorDefecto: BannerVacantesRRHH = {
  imageDataUrl: null,
  titulo: '¡Estamos contratando!',
  subtitulo: 'Únete al equipo de Aleph Impresores',
  activo: false,
  updatedAt: null,
}

let cacheBanner: BannerVacantesRRHH | null = null

export function establecerCacheBannerVacantes(banner: BannerVacantesRRHH) {
  cacheBanner = banner
}

export function obtenerBannerVacantes(): BannerVacantesRRHH {
  return cacheBanner ?? { ...bannerPorDefecto }
}

export async function cargarBannerVacantes(): Promise<BannerVacantesRRHH> {
  if (await verificarApiDisponible()) {
    try {
      const remoto = await obtenerBannerVacantesApi()
      if (remoto && typeof remoto === 'object') {
        const banner = { ...bannerPorDefecto, ...(remoto as Partial<BannerVacantesRRHH>) }
        cacheBanner = banner
        return banner
      }
    } catch (error) {
      console.warn('No se pudo cargar banner vacantes desde API:', error)
    }
  }

  cacheBanner = { ...bannerPorDefecto }
  return cacheBanner
}

export async function guardarBannerVacantes(parcial: Partial<BannerVacantesRRHH>): Promise<BannerVacantesRRHH> {
  const actual = obtenerBannerVacantes()
  const actualizado: BannerVacantesRRHH = {
    ...actual,
    ...parcial,
    updatedAt: new Date().toISOString(),
  }

  if (!haySesionAdmin()) {
    throw new Error('Sesión expirada. Cierra sesión e ingresa de nuevo al panel.')
  }

  try {
    await guardarBannerVacantesApi(actualizado)
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'No se pudo guardar el banner.')
  }

  cacheBanner = actualizado
  window.dispatchEvent(new Event(EVENTO_BANNER_VACANTES))
  return actualizado
}

export async function restablecerBannerVacantes(): Promise<BannerVacantesRRHH> {
  const original = { ...bannerPorDefecto }
  if (haySesionAdmin() && (await verificarApiDisponible())) {
    await guardarBannerVacantesApi(original)
  }
  cacheBanner = original
  window.dispatchEvent(new Event(EVENTO_BANNER_VACANTES))
  return original
}

export function archivoABase64(archivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader()
    lector.onload = () => resolve(String(lector.result))
    lector.onerror = () => reject(new Error('No se pudo leer el archivo'))
    lector.readAsDataURL(archivo)
  })
}
