/**
 * @file MetaPagina.tsx
 * @description Actualiza dinámicamente el título y la meta descripción de cada página (RNF-006).
 * @module componentes/interfaz/MetaPagina
 */

import { useEffect } from 'react'

/** Propiedades del componente de metadatos SEO. */
interface PropiedadesMetaPagina {
  /** Título de la página. */
  title: string
  /** Descripción para motores de búsqueda. */
  description?: string
}

/**
 * Componente invisible que sincroniza el título del documento y la meta descripción.
 * Se monta al inicio de cada página del sitio público.
 */
export function MetaPagina({ title, description }: PropiedadesMetaPagina) {
  useEffect(() => {
    document.title = title.includes('Aleph') ? title : `${title} | Aleph Impresores`
    if (description) {
      const meta = document.querySelector('meta[name="description"]')
      if (meta) meta.setAttribute('content', description)
    }
  }, [title, description])

  return null
}
