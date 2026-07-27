/**
 * @file PaginaClientes.tsx
 * @description Marcas/clientes editables desde el panel admin.
 * @module paginas/PaginaClientes
 */

import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { TituloSeccion } from '../componentes/interfaz/Boton'
import { obtenerMarcasCatalogo } from '../datos/contenidoInicio'
import { useContenidoInicio } from '../hooks/useContenidoInicio'

export function PaginaClientes() {
  const contenido = useContenidoInicio()
  const { marcasClientes } = contenido
  const clientes = obtenerMarcasCatalogo(contenido)

  return (
    <>
      <MetaPagina
        title="Clientes"
        description="Empresas que confían en Aleph Impresores para sus soluciones gráficas."
      />

      <section className="page-hero">
        <div className="container">
          <h1>{marcasClientes.titulo}</h1>
          <p>{marcasClientes.subtitulo}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <TituloSeccion title={marcasClientes.titulo} subtitle={marcasClientes.subtitulo} />
          <div className="clients-grid">
            {clientes.map((client) => (
              <div key={client.id} className="client-logo">
                <img src={client.logo} alt={client.name} loading="lazy" />
                <span>{client.industry}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
