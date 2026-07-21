/**
 * Ruta oculta del panel de gestión. No enlazar en la UI pública.
 * Acceso: 5 clics rápidos en el logo o en © del footer, atajo Alt+Shift+G, o URL directa.
 */

const segmento = (import.meta.env.VITE_RUTA_GESTION ?? 'aleph-cmyk-gestion-7k2m').replace(/^\/+/, '')

/** Ruta absoluta del panel (debe iniciar con /). */
export const RUTA_GESTION = `/${segmento}`

export const RUTA_ACCESO = `${RUTA_GESTION}/acceso`

export const CLICS_ACCESO = 5
export const VENTANA_CLICS_MS = 2500
