/**
 * @file PaginaProductos.tsx
 * @description Página de portafolio de productos con búsqueda y filtrado.
 * @module paginas/PaginaProductos
 */

import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { TituloSeccion } from '../componentes/interfaz/Boton'
import { SeccionPagina } from '../componentes/interfaz/SeccionPagina'
import { TarjetaProducto } from '../componentes/interfaz/TarjetaProducto'
import { useBusquedaProductos } from '../hooks/useBusquedaProductos'
import { categorias } from '../datos/categorias'

export function PaginaProductos() {
  const [searchParams] = useSearchParams()
  const categoriaInicial = searchParams.get('categoria') ?? ''
  const { consulta, setConsulta, categoria, setCategoria, resultados } = useBusquedaProductos(categoriaInicial)

  useEffect(() => {
    if (categoriaInicial) setCategoria(categoriaInicial)
  }, [categoriaInicial, setCategoria])

  return (
    <>
      <MetaPagina
        title="Productos"
        description="Portafolio completo de productos: plegadizas, bolsas, exhibidores, empaques y material POP."
      />

      <SeccionPagina className="pagina-seccion--hero">
        <h1 className="pagina-seccion__titulo">Portafolio de productos</h1>
        <p className="pagina-seccion__texto">
          Explora nuestras soluciones organizadas por categoría.
        </p>
      </SeccionPagina>

      <SeccionPagina>
        <div className="search-bar">
          <input
            type="search"
            placeholder="Buscar por nombre o categoría..."
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            aria-label="Buscar productos"
          />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            aria-label="Filtrar por categoría"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <TituloSeccion
          title={`${resultados.length} producto${resultados.length !== 1 ? 's' : ''} encontrado${resultados.length !== 1 ? 's' : ''}`}
        />

        {resultados.length > 0 ? (
          <div className="grid grid--3">
            {resultados.map((product) => (
              <TarjetaProducto key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="empty-state">No se encontraron productos con los criterios seleccionados.</p>
        )}
      </SeccionPagina>
    </>
  )
}
