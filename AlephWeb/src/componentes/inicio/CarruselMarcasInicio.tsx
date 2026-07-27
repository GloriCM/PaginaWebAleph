/**
 * Carrusel infinito horizontal de logos de marcas/clientes.
 */

import type { CSSProperties } from 'react'
import type { Cliente } from '../../tipos/indice'

interface PropiedadesCarruselMarcas {
  marcas: Cliente[]
  /** @deprecated Los logos van en cada marca.logo */
  logos?: Record<string, string | null>
}

export function CarruselMarcasInicio({ marcas, logos = {} }: PropiedadesCarruselMarcas) {
  if (marcas.length === 0) return null

  const pista = [...marcas, ...marcas, ...marcas]

  return (
    <div className="marcas-carrusel" aria-label="Marcas con las que hemos trabajado">
      <div className="marcas-carrusel__viewport">
        <div
          className="marcas-carrusel__pista"
          style={{ '--marcas-bloques': 3 } as CSSProperties}
        >
          {pista.map((marca, i) => {
            const logo = logos[marca.id] ?? marca.logo
            if (!logo) return null
            return (
              <div key={`${marca.id}-${i}`} className="marca-logo">
                <img src={logo} alt={marca.name} loading="eager" decoding="async" />
                <span className="marca-logo__nombre">{marca.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
