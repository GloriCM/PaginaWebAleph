import { lazy, type ComponentType } from 'react'

/** Carga diferida de páginas con export nombrado. */
export function lazyPagina(
  factory: () => Promise<Record<string, unknown>>,
  nombre: string,
) {
  return lazy(() =>
    factory().then((modulo) => ({
      default: modulo[nombre] as ComponentType,
    })),
  )
}
