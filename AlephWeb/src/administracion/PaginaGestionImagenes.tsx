/**
 * @file PaginaGestionImagenes.tsx
 * @description Módulo de gestión centralizada de imágenes del sitio web.
 * Agrupa imágenes de productos, galería y noticias en una cuadrícula visual (RF-021).
 * @module administracion/PaginaGestionImagenes
 */

import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { productos } from '../datos/productos'
import { proyectosGaleria, noticias } from '../datos/contenido'

/**
 * Colección unificada de todas las imágenes referenciadas en el sitio.
 * Incluye imagen principal y galería de cada producto, proyectos de galería y noticias.
 */
const todasLasImagenes = [
  ...productos.flatMap((p) => [
    { src: p.image, label: p.name },
    ...p.gallery.map((g, i) => ({ src: g, label: `${p.name} ${i + 1}` })),
  ]),
  ...proyectosGaleria.map((g) => ({ src: g.image, label: g.name })),
  ...noticias.map((n) => ({ src: n.image, label: n.title })),
]

/**
 * Vista de cuadrícula con todas las imágenes del sitio y su etiqueta descriptiva.
 */
export function PaginaGestionImagenes() {
  return (
    <>
      <MetaPagina title="Admin - Imágenes" />
      <h1>Gestión de imágenes</h1>
      <p className="admin-subtitle">Administrar imágenes del sitio web (RF-021)</p>

      <div className="admin-images-grid">
        {todasLasImagenes.map((img, i) => (
          <div key={i} className="admin-image-card">
            <img src={img.src} alt={img.label} />
            <span>{img.label}</span>
          </div>
        ))}
      </div>
    </>
  )
}
