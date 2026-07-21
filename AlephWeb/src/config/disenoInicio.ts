/**
 * Rutas y helpers del diseño industrial (fondo prensa + tarjetas vidrio oscuro).
 */

export const HERO_INICIO_VARIANTE = 'industrial' as const

export type HeroInicioVariante = 'editorial' | 'industrial'

/** Rutas públicas que comparten el diseño de la página de inicio. */
export const RUTAS_DISENO_INDUSTRIAL = [
  '/',
  '/nosotros',
  '/servicios',
  '/productos',
  '/contacto',
  '/cotizacion',
  '/trabaja-con-nosotros',
] as const

export function esHeroIndustrial() {
  return HERO_INICIO_VARIANTE === 'industrial'
}

export function esRutaDisenoIndustrial(pathname: string) {
  if (!esHeroIndustrial()) return false

  return RUTAS_DISENO_INDUSTRIAL.some(
    (ruta) => pathname === ruta || (ruta !== '/' && pathname.startsWith(`${ruta}/`)),
  )
}
