/**
 * Hero original de inicio — diseño editorial en dos columnas.
 * Se conserva intacto para poder revertir el experimento industrial.
 */

import { Boton } from '../interfaz/Boton'
import imagenHero from '../../activos/prensa-heidelberg.png'

export function HeroInicioEditorial() {
  return (
    <section className="hero-editorial">
      <div className="container">
        <div className="hero-editorial__grid">
          <div className="hero-editorial__texto">
            <h1>
              Dominando el <em>Arte del Color</em>
            </h1>
            <p>
              Somos una empresa colombiana especializada en artes gráficas, desarrollo de
              empaques. Combinamos tecnología de punta con un equipo creativo
              para entregar productos que destacan.
              Donde la fluidez creativa se encuentra con la precisión técnica. No solo imprimimos;
              traducimos tu visión en experiencias táctiles sobre superficies premium.
            </p>
            <Boton to="/galeria" variant="gradient">
              Nuestro portafolio →
            </Boton>
          </div>

          <div className="hero-editorial__visual">
            <div className="hero-editorial__forma">
              <img src={imagenHero} alt="Prensa offset Heidelberg Speedmaster en Aleph Impresores" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
