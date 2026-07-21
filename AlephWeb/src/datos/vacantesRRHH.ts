/**
 * @file vacantesRRHH.ts
 * @description Banner de vacantes gestionado por Recursos Humanos.
 */

import { eliminarDatoSitio, guardarDatoSitio, leerDatoSitio } from '../utilidades/almacenamientoSitio'

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
  if (cacheBanner) return cacheBanner
  try {
    const datos = localStorage.getItem(CLAVE_BANNER)
    return datos ? { ...bannerPorDefecto, ...JSON.parse(datos) } : { ...bannerPorDefecto }
  } catch {
    return { ...bannerPorDefecto }
  }
}

export async function cargarBannerVacantes(): Promise<BannerVacantesRRHH> {
  const guardado = await leerDatoSitio<Partial<BannerVacantesRRHH>>(CLAVE_BANNER)
  const banner = guardado ? { ...bannerPorDefecto, ...guardado } : { ...bannerPorDefecto }
  cacheBanner = banner
  return banner
}

export async function guardarBannerVacantes(parcial: Partial<BannerVacantesRRHH>): Promise<BannerVacantesRRHH> {
  const actual = obtenerBannerVacantes()
  const actualizado: BannerVacantesRRHH = {
    ...actual,
    ...parcial,
    updatedAt: new Date().toISOString(),
  }
  await guardarDatoSitio(CLAVE_BANNER, actualizado)
  cacheBanner = actualizado
  window.dispatchEvent(new Event(EVENTO_BANNER_VACANTES))
  return actualizado
}

export async function restablecerBannerVacantes(): Promise<BannerVacantesRRHH> {
  await eliminarDatoSitio(CLAVE_BANNER)
  const original = { ...bannerPorDefecto }
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
