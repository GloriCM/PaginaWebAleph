/**
 * @file PaginaContacto.tsx
 * @description Página de contacto con información, mapa y formulario.
 * @module paginas/PaginaContacto
 */

import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { TituloSeccion, Boton } from '../componentes/interfaz/Boton'
import { MapaEmbed } from '../componentes/interfaz/MapaEmbed'
import { SeccionPagina } from '../componentes/interfaz/SeccionPagina'
import { guardarSolicitud } from '../datos/solicitudes'
import { useContenidoInicio } from '../hooks/useContenidoInicio'
import { resolverUrlMapa } from '../utilidades/mapaEmbed'

const formularioInicial = {
  name: '',
  company: '',
  role: '',
  email: '',
  phone: '',
  city: '',
  message: '',
}

export function PaginaContacto() {
  const { contacto } = useContenidoInicio()
  const mapEmbedUrl = resolverUrlMapa(contacto.direccion, contacto.mapEmbedUrl)
  const [form, setForm] = useState(formularioInicial)
  const [submitted, setSubmitted] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState('')

  function manejarCambio(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    setEnviando(true)
    setErrorEnvio('')

    try {
      await guardarSolicitud({ ...form, type: 'contact' })
      setSubmitted(true)
      setForm(formularioInicial)
    } catch (err) {
      setErrorEnvio(err instanceof Error ? err.message : 'No se pudo enviar el mensaje')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <MetaPagina title="Contacto" description="Envíanos tu mensaje y te responderemos pronto." />

      {submitted ? (
        <SeccionPagina
          className="pagina-seccion--hero pagina-seccion--contacto pagina-seccion--formulario-exito"
          panelClassName="pagina-seccion__panel--formulario"
        >
          <div className="formulario-exito" role="status">
            <div className="formulario-exito__icono" aria-hidden="true">✓</div>
            <h2 className="formulario-exito__titulo">¡Mensaje enviado!</h2>
            <p className="formulario-exito__texto">
              Recibimos tu consulta. El equipo de Aleph te contactará a la brevedad.
            </p>
            <div className="formulario-exito__acciones">
              <Boton variant="gradient" onClick={() => setSubmitted(false)}>
                Enviar otro mensaje
              </Boton>
              <Boton to="/" variant="outline">
                Ir al inicio
              </Boton>
            </div>
          </div>
        </SeccionPagina>
      ) : (
        <>
          <SeccionPagina className="pagina-seccion--hero pagina-seccion--contacto">
            <h1 className="pagina-seccion__titulo">{contacto.titulo}</h1>
            <p className="pagina-seccion__texto">
              Escríbenos o visítanos. Estamos listos para ayudarte con tu próximo proyecto.
            </p>
            <p className="pagina-seccion__texto pagina-seccion__texto--secundario">
              ¿Buscas empleo?{' '}
              <Link to="/trabaja-con-nosotros">Trabaja con nosotros</Link>
            </p>
          </SeccionPagina>

          <SeccionPagina panelClassName="contact-page">
            <div className="contact-page__info">
              <TituloSeccion title="Información de contacto" />
              <ul className="contact-list">
                <li><strong>Dirección:</strong> {contacto.direccion}</li>
                <li><strong>Teléfono:</strong> <a href={`tel:${contacto.telefono}`}>{contacto.telefono}</a></li>
                <li><strong>Email:</strong> <a href={`mailto:${contacto.email}`}>{contacto.email}</a></li>
              </ul>
              <MapaEmbed
                title="Ubicación de Aleph Impresores"
                src={mapEmbedUrl}
                className="map-embed map-embed--interno"
              />
            </div>

            <div className="contact-page__form">
              <TituloSeccion title="Envíanos un mensaje" />
              <form className="form form--contacto" onSubmit={manejarEnvio}>
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
              <div className="form__row">
                <label>
                  Cargo
                  <input name="role" value={form.role} onChange={manejarCambio} />
                </label>
                <label>
                  Correo *
                  <input name="email" type="email" required value={form.email} onChange={manejarCambio} />
                </label>
              </div>
              <div className="form__row">
                <label>
                  Teléfono *
                  <input name="phone" type="tel" required value={form.phone} onChange={manejarCambio} />
                </label>
                <label>
                  Ciudad *
                  <input name="city" required value={form.city} onChange={manejarCambio} />
                </label>
              </div>
              <label>
                Mensaje *
                <textarea name="message" required rows={5} value={form.message} onChange={manejarCambio} />
              </label>
              {errorEnvio && <p className="form__error">{errorEnvio}</p>}
              <Boton type="submit" className="form--contacto__enviar" disabled={enviando}>
                {enviando ? 'Enviando…' : 'Enviar mensaje'}
              </Boton>
            </form>
            </div>
          </SeccionPagina>
        </>
      )}
    </>
  )
}
