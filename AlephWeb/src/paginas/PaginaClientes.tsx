/**
 * @file PaginaClientes.tsx
 * @description Página que exhibe el portafolio de clientes y marcas que confían
 * en los servicios de Aleph Impresores, organizados por sector industrial.
 * Implementa el requisito funcional RF-012 (página de clientes).
 * @module paginas/PaginaClientes
 */

import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { TituloSeccion } from '../componentes/interfaz/Boton'
import { clientes } from '../datos/contenido'

/**
 * Renderiza la cuadrícula de logotipos de clientes con su sector industrial.
 * @returns Elemento JSX con el listado de empresas cliente.
 */
export function PaginaClientes() {
  return (
    <>
      <MetaPagina
        title="Clientes"
        description="Empresas que confían en Aleph Impresores para sus soluciones gráficas."
      />

      <section className="page-hero">
        <div className="container">
          <h1>Nuestros clientes</h1>
          <p>Marcas líderes que han confiado en nosotros.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <TituloSeccion title="Empresas que confían en nosotros" />
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
