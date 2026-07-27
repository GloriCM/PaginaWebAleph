/**
 * Rutas y helpers del diseño industrial (fondo prensa + tarjetas vidrio oscuro).
 */

export const HERO_INICIO_VARIANTE = 'industrial' as const

export type HeroInicioVariante = 'editorial' | 'industrial'

export function esHeroIndustrial() {
  return HERO_INICIO_VARIANTE === 'industrial'
}

/** Todas las vistas del layout público comparten fondo Ken Burns y tarjetas vidrio oscuro. */
export function esRutaDisenoIndustrial(_pathname: string) {
  return esHeroIndustrial()
}
