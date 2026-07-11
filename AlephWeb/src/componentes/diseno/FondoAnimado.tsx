/**
 * @file FondoAnimado.tsx
 * @description Fondo con malla CMYK, partículas y puntos de registro orbitando.
 * @module componentes/diseno/FondoAnimado
 */

/**
 * Capa decorativa animada detrás del contenido público.
 */
export function FondoAnimado() {
  return (
    <div className="fondo-animado" aria-hidden="true">
      <div className="fondo-animado__base" />
      <div className="fondo-animado__malla" />

      <span className="fondo-animado__blob fondo-animado__blob--c" />
      <span className="fondo-animado__blob fondo-animado__blob--m" />
      <span className="fondo-animado__blob fondo-animado__blob--y" />

      <div className="fondo-animado__destellos">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className={`fondo-animado__destello fondo-animado__destello--${i + 1}`} />
        ))}
      </div>

      <div className="fondo-animado__anillo fondo-animado__anillo--1" />
      <div className="fondo-animado__anillo fondo-animado__anillo--2" />

      <div className="fondo-animado__orbita fondo-animado__orbita--1">
        <span className="fondo-animado__punto fondo-animado__punto--c" />
        <span className="fondo-animado__punto fondo-animado__punto--m" />
        <span className="fondo-animado__punto fondo-animado__punto--y" />
        <span className="fondo-animado__punto fondo-animado__punto--k" />
      </div>

      <div className="fondo-animado__orbita fondo-animado__orbita--2">
        <span className="fondo-animado__punto fondo-animado__punto--c" />
        <span className="fondo-animado__punto fondo-animado__punto--m" />
        <span className="fondo-animado__punto fondo-animado__punto--y" />
        <span className="fondo-animado__punto fondo-animado__punto--k" />
      </div>
    </div>
  )
}
