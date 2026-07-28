/**
 * @file SeccionComentarios.tsx
 * @description Testimonios en filas con estrellas y formulario para dejar comentario.
 */

import { useState, useEffect, type FormEvent } from 'react'
import { TituloSeccion, Boton } from './Boton'
import { guardarComentario, cargarComentariosPublicos } from '../../datos/comentarios'
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

function Estrellas({ valor }: { valor: number }) {
  const llenas = Math.min(5, Math.max(0, Math.round(valor)))
  return (
    <span className="comentario-estrellas" aria-label={`${llenas} de 5 estrellas`}>
      {'★'.repeat(llenas)}
      <span className="comentario-estrellas__vacias">{'★'.repeat(5 - llenas)}</span>
    </span>
  )
}

function combinarComentarios(curados: Testimonio[], publicos: Testimonio[]): Testimonio[] {
  const ids = new Set(curados.map((t) => t.id))
  return [...curados, ...publicos.filter((t) => !ids.has(t.id))]
}

export function SeccionComentarios() {
  const { testimonios: configTestimonios } = useContenidoInicio()
  const [comentarios, setComentarios] = useState<Testimonio[]>(() => [...configTestimonios.items])
  const [form, setForm] = useState(formularioInicial)
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState('')

  useEffect(() => {
    let activo = true

    void cargarComentariosPublicos().then((publicos) => {
      if (!activo) return
      setComentarios(combinarComentarios(configTestimonios.items, publicos))
    })

    return () => {
      activo = false
    }
  }, [configTestimonios.items])

  function manejarCambio(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    setEnviando(true)
    setErrorEnvio('')

    try {
      const nuevo = await guardarComentario(form)
      setComentarios((prev) => combinarComentarios(prev, [nuevo]))
      setForm(formularioInicial)
      setEnviado(true)
    } catch (err) {
      setErrorEnvio(err instanceof Error ? err.message : 'No se pudo publicar el comentario')
    } finally {
      setEnviando(false)
    }
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
                <p>Tu opinión ya aparece en la lista y la verán todos los visitantes.</p>
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
                {errorEnvio && <p className="form__error">{errorEnvio}</p>}
                <div className="seccion-comentarios__enviar">
                  <Boton type="submit" className="form--contacto__enviar" disabled={enviando}>
                    {enviando ? 'Publicando…' : 'Publicar comentario'}
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
