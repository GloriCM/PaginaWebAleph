import type { ReactNode } from 'react'

interface PropiedadesSeccionPagina {
  children: ReactNode
  className?: string
  panelClassName?: string
  id?: string
}

/** Sección con tarjeta vidrio oscuro (mismo estilo que inicio). */
export function SeccionPagina({
  children,
  className = '',
  panelClassName = '',
  id,
}: PropiedadesSeccionPagina) {
  return (
    <section id={id} className={`section pagina-seccion ${className}`.trim()}>
      <div className="container">
        <div className={`panel-vidrio pagina-seccion__panel ${panelClassName}`.trim()}>
          {children}
        </div>
      </div>
    </section>
  )
}
