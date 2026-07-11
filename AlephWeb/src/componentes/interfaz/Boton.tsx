/**
 * @file Boton.tsx
 * @description Componentes de botón reutilizables y título de sección con identidad CMYK.
 * @module componentes/interfaz/Boton
 */

import { Link } from 'react-router-dom'
import type { ReactNode, ButtonHTMLAttributes } from 'react'

/** Variantes visuales disponibles para el botón. */
type VarianteBoton = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient'

/** Propiedades del componente Boton. */
interface PropiedadesBoton extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Estilo visual del botón. */
  variant?: VarianteBoton
  /** Si se define, renderiza un enlace de React Router en lugar de button. */
  to?: string
  children: ReactNode
}

/**
 * Botón reutilizable que puede actuar como enlace interno o botón HTML.
 * @param props - Propiedades del botón incluyendo variante y destino opcional.
 */
export function Boton({
  variant = 'primary',
  to,
  children,
  className = '',
  ...props
}: PropiedadesBoton) {
  const clases = `btn btn--${variant} ${className}`.trim()

  if (to) {
    return (
      <Link to={to} className={clases}>
        {children}
      </Link>
    )
  }

  return (
    <button className={clases} {...props}>
      {children}
    </button>
  )
}

/** Propiedades del título de sección. */
interface PropiedadesTituloSeccion {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

/**
 * Título de sección con subtítulo opcional y puntos de color CMYK.
 * Refuerza la identidad visual de la marca en cada bloque de contenido.
 */
export function TituloSeccion({ title, subtitle, align = 'center' }: PropiedadesTituloSeccion) {
  return (
    <div className={`section-title section-title--${align}`}>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
      <div className="section-title__dots" aria-hidden="true">
        <span className="dot dot--c" />
        <span className="dot dot--m" />
        <span className="dot dot--y" />
        <span className="dot dot--k" />
      </div>
    </div>
  )
}
