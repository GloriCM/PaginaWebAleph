/**
 * @file SeccionComentarios.tsx
 * @description Testimonios en filas con estrellas y formulario para dejar comentario.
 * @module componentes/interfaz/SeccionComentarios
 */

import { useState, useEffect, type FormEvent } from 'react'
import { TituloSeccion, Boton } from './Boton'
import { guardarComentario, obtenerComentarios } from '../../datos/comentarios'
import { useContenidoInicio } from '../../hooks/useContenidoInicio'
import type { Testimonio } from '../../tipos/indice'

const formularioInicial = {
  name: '',
  company: '',
  role: '',
  content: '',
  rating: 5,
}

const mensajesValoracion: Record<number, string> = {
  1: 'Malo',
  2: 'Regular',
  3: 'Bueno',
  4: 'Muy bueno',
  5: '¡Excelente!',
}

/**
 * Renderiza estrellas según la valoración (1–5).
 */
function Estrellas({ valor }: { valor: number }) {
  const llenas = Math.min(5, Math.max(0, Math.round(valor)))
  return (
    <span className="comentario-estrellas" aria-label={`${llenas} de 5 estrellas`}>
      {'★'.repeat(llenas)}
      <span className="comentario-estrellas__vacias">{'★'.repeat(5 - llenas)}</span>
    </span>
  )
}

/**
 * Lista de opiniones con rating y formulario para publicar un nuevo comentario.
 */
export function SeccionComentarios() {
  const { testimonios: configTestimonios } = useContenidoInicio()
  const [comentarios, setComentarios] = useState<Testimonio[]>(() => [
    ...configTestimonios.items,
    ...obtenerComentarios(),
  ])
  const [form, setForm] = useState(formularioInicial)
  const [enviado, setEnviado] = useState(false)

  useEffect(() => {
    setComentarios([...configTestimonios.items, ...obtenerComentarios()])
  }, [configTestimonios.items])

  function manejarCambio(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    const nuevo = guardarComentario(form)
    setComentarios((prev) => [...prev, nuevo])
    setForm(formularioInicial)
    setEnviado(true)
  }

  return (
    <section className="section seccion-comentarios">
      <div className="container">
        <div className="panel-vidrio seccion-comentarios__envoltorio">
          <TituloSeccion
            title={configTestimonios.titulo}
            subtitle={configTestimonios.subtitulo}
          />

          <div className="seccion-comentarios__lista">
            {comentarios.map((t) => (
              <article key={t.id} className="comentario-fila">
                <Estrellas valor={t.rating} />
                <p>"{t.content}"</p>
                <div className="comentario-fila__autor">
                  <strong>{t.name}</strong>
                  <span>{[t.role, t.company].filter(Boolean).join(', ')}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="seccion-comentarios__panel">
            <h3 className="seccion-comentarios__titulo-form">Deja tu comentario</h3>

            {enviado ? (
              <div className="form-success form-success--premium" role="status">
                <div className="form-success__dots" aria-hidden="true">
                  <span className="dot dot--c" />
                  <span className="dot dot--m" />
                  <span className="dot dot--y" />
                  <span className="dot dot--k" />
                </div>
                <h3>¡Gracias por tu comentario!</h3>
                <p>Tu opinión ya aparece en la lista. Nos ayuda a seguir mejorando.</p>
                <div className="form-success__acciones">
                  <Boton onClick={() => setEnviado(false)} className="form--contacto__enviar">
                    Escribir otro
                  </Boton>
                </div>
              </div>
            ) : (
              <form className="form form--contacto form--comentario" onSubmit={manejarEnvio}>
                <div className="form__row">
                  <label>
                    Nombre *
                    <input name="name" required value={form.name} onChange={manejarCambio} />
                  </label>
                  <label>
                    Empresa
                    <input name="company" value={form.company} onChange={manejarCambio} />
                  </label>
                </div>
                <label>
                  Cargo
                  <input name="role" value={form.role} onChange={manejarCambio} />
                </label>
                <fieldset className="comentario-rating comentario-rating--v8">
                  <legend>Valoración *</legend>
                  <div className="comentario-rating__estrellas" role="radiogroup" aria-label="Valoración">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`comentario-rating__estrella ${form.rating >= n ? 'is-active' : ''}`}
                        aria-label={`${n} estrella${n > 1 ? 's' : ''}`}
                        aria-checked={form.rating === n}
                        role="radio"
                        onClick={() => setForm((prev) => ({ ...prev, rating: n }))}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <p className="comentario-rating__mensaje" aria-live="polite">
                    {mensajesValoracion[form.rating]}
                  </p>
                </fieldset>
                <label>
                  Comentario *
                  <textarea
                    name="content"
                    required
                    rows={4}
                    value={form.content}
                    onChange={manejarCambio}
                    placeholder="Cuéntanos tu experiencia con Aleph Impresores…"
                  />
                </label>
                <div className="seccion-comentarios__enviar">
                  <Boton type="submit" className="form--contacto__enviar">
                    Publicar comentario
                  </Boton>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
