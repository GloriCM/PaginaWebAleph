/**
 * Logo vectorial de Aleph Impresores (texto + puntos CMYK).
 * Nítido en cualquier resolución, sin depender del PNG comprimido.
 */

interface LogoAlephProps {
  className?: string
  /** `claro` = texto "aleph" blanco para fondos oscuros */
  variant?: 'default' | 'claro'
}

export function LogoAleph({ className = '', variant = 'default' }: LogoAlephProps) {
  return (
    <span
      className={`logo-aleph logo-aleph--${variant}${className ? ` ${className}` : ''}`}
    >
      <span className="logo-aleph__marca">aleph</span>
      <span className="logo-aleph__fila">
        <span className="logo-aleph__tag">impresores</span>
        <span className="logo-aleph__cmyk" aria-hidden="true">
          <i className="logo-aleph__punto logo-aleph__punto--c" />
          <i className="logo-aleph__punto logo-aleph__punto--m" />
          <i className="logo-aleph__punto logo-aleph__punto--y" />
          <i className="logo-aleph__punto logo-aleph__punto--k" />
        </span>
      </span>
    </span>
  )
}
