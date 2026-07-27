/**

 * @file PaginaGestionImagenes.tsx

 * @description Vista previa de imágenes del sitio con accesos directos para editarlas.

 */



import { Link } from 'react-router-dom'

import { MetaPagina } from '../componentes/interfaz/MetaPagina'

import { RUTA_GESTION } from '../config/accesoAdmin'

import { useProductos } from '../hooks/useProductos'
import { useContenidoEditorial } from '../hooks/useContenidoEditorial'

const G = RUTA_GESTION

export function PaginaGestionImagenes() {
  const productos = useProductos()
  const { galeria: proyectosGaleria, noticias, certificaciones } = useContenidoEditorial()

  const todasLasImagenes = [
    ...productos.flatMap((p) => [
      { src: p.image, label: p.name, editarEn: `${G}/productos` as const },
      ...p.gallery.map((g, i) => ({
        src: g,
        label: `${p.name} ${i + 1}`,
        editarEn: `${G}/productos` as const,
      })),
    ]),
    ...proyectosGaleria.map((g) => ({
      src: g.image,
      label: g.name,
      editarEn: `${G}/contenido` as const,
    })),
    ...noticias.map((n) => ({
      src: n.image,
      label: n.title,
      editarEn: `${G}/contenido` as const,
    })),
    ...certificaciones.map((c) => ({
      src: c.image,
      label: c.name,
      editarEn: `${G}/contenido` as const,
    })),
  ]



  return (

    <>

      <MetaPagina title="Admin - Imágenes" />

      <h1>Gestión de imágenes</h1>

      <p className="admin-subtitle">

        Esta pantalla es solo una vista previa. Para cambiar imágenes, usa los módulos de edición:

      </p>



      <div className="admin-images-actions">

        <Link to={`${G}/inicio`} className="btn btn--primary">

          Editar imágenes de inicio

        </Link>

        <Link to={`${G}/productos`} className="btn btn--ghost">

          Editar imágenes de productos

        </Link>

        <Link to={`${G}/contenido`} className="btn btn--ghost">
          Editar contenido editorial
        </Link>

      </div>



      <div className="admin-images-grid">

        {todasLasImagenes.map((img, i) => (

          <div key={i} className="admin-image-card">

            <img src={img.src} alt={img.label} />

            <span>{img.label}</span>

            <Link to={img.editarEn} className="admin-image-card__edit">

              Editar en panel →

            </Link>

          </div>

        ))}

      </div>

    </>

  )

}


