/**
 * @file PaginaGestionInicio.tsx
 * @description Panel para editar todas las secciones visibles de la página de inicio.
 */

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { AlertaCambiosSinGuardar } from './componentes/AlertaCambiosSinGuardar'
import { CampoImagenAdmin } from './componentes/CampoImagenAdmin'
import { categorias } from '../datos/categorias'
import {
  cargarContenidoInicioDesdeApi,
  crearMarcaVacia,
  EVENTO_CONTENIDO_INICIO,
  guardarContenidoInicio,
  obtenerContenidoInicio,
  restablecerContenidoInicio,
  type ContenidoInicio,
  type MetricaHero,
  type ValorEmpresa,
} from '../datos/contenidoInicio'
import { snapshotFormulario, useFormularioSinGuardar } from '../hooks/useFormularioSinGuardar'
import type { Cliente, Testimonio } from '../tipos/indice'

type SeccionAdmin =
  | 'seo'
  | 'hero'
  | 'sobre'
  | 'especialidades'
  | 'marcas'
  | 'testimonios'
  | 'cta'
  | 'contacto'

const SECCIONES: { id: SeccionAdmin; label: string }[] = [
  { id: 'seo', label: 'SEO' },
  { id: 'hero', label: 'Hero' },
  { id: 'sobre', label: 'Sobre nosotros' },
  { id: 'especialidades', label: 'Especialidades' },
  { id: 'marcas', label: 'Marcas' },
  { id: 'testimonios', label: 'Testimonios' },
  { id: 'cta', label: 'CTA cotización' },
  { id: 'contacto', label: 'Contacto' },
]

function CampoTexto({
  label,
  value,
  onChange,
  multiline = false,
  required = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  required?: boolean
}) {
  return (
    <label className="admin-vacantes-field">
      {label}
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} required={required} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} required={required} />
      )}
    </label>
  )
}

function CampoEnlace({
  label,
  value,
  onChange,
}: {
  label: string
  value: { texto: string; enlace: string }
  onChange: (v: { texto: string; enlace: string }) => void
}) {
  return (
    <fieldset className="admin-inicio-enlace">
      <legend>{label}</legend>
      <CampoTexto label="Texto del botón" value={value.texto} onChange={(texto) => onChange({ ...value, texto })} />
      <CampoTexto label="Enlace (ruta)" value={value.enlace} onChange={(enlace) => onChange({ ...value, enlace })} />
    </fieldset>
  )
}

export function PaginaGestionInicio() {
  const lineaBaseRef = useRef('')
  const [contenido, setContenido] = useState<ContenidoInicio>(() => obtenerContenidoInicio())
  const [seccion, setSeccion] = useState<SeccionAdmin>('hero')
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState<'ok' | 'error' | ''>('')
  const [sincronizando, setSincronizando] = useState(true)

  const hayCambios = useMemo(() => {
    if (sincronizando) return false
    return snapshotFormulario({ ...contenido, updatedAt: null }) !== lineaBaseRef.current
  }, [contenido, sincronizando])

  const { confirmarSiHayCambios } = useFormularioSinGuardar(hayCambios)

  useEffect(() => {
    let activo = true
    setSincronizando(true)

    cargarContenidoInicioDesdeApi()
      .then((datos) => {
        if (activo) {
          setContenido(datos)
          lineaBaseRef.current = snapshotFormulario({ ...datos, updatedAt: null })
        }
      })
      .finally(() => {
        if (activo) setSincronizando(false)
      })

    function sincronizar() {
      setContenido(obtenerContenidoInicio())
    }

    window.addEventListener(EVENTO_CONTENIDO_INICIO, sincronizar)
    return () => {
      activo = false
      window.removeEventListener(EVENTO_CONTENIDO_INICIO, sincronizar)
    }
  }, [])

  async function manejarGuardar(e: FormEvent) {
    e.preventDefault()
    setGuardando(true)
    setMensaje('')
    setTipoMensaje('')
    try {
      const guardado = await guardarContenidoInicio(contenido)
      setContenido(guardado)
      lineaBaseRef.current = snapshotFormulario({ ...guardado, updatedAt: null })
      setMensaje('Cambios guardados correctamente. Ya puedes verlos en la portada.')
      setTipoMensaje('ok')
    } catch (error) {
      setMensaje(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar. Si subiste imágenes muy pesadas, quita alguna e intenta de nuevo.',
      )
      setTipoMensaje('error')
    } finally {
      setGuardando(false)
    }
  }

  async function manejarRestablecer() {
    if (!confirmarSiHayCambios()) return
    if (!window.confirm('¿Restablecer todo el contenido de inicio a los valores originales?')) return
    const original = await restablecerContenidoInicio()
    setContenido(original)
    lineaBaseRef.current = snapshotFormulario({ ...original, updatedAt: null })
    setMensaje('Contenido restablecido.')
    setTipoMensaje('ok')
  }

  function actualizarMetrica(indice: number, campo: keyof MetricaHero, valor: string) {
    setContenido((prev) => {
      const metricas = [...prev.sobreNosotros.metricas]
      metricas[indice] = { ...metricas[indice], [campo]: valor }
      return { ...prev, sobreNosotros: { ...prev.sobreNosotros, metricas } }
    })
  }

  function actualizarValor(indice: number, parcial: Partial<ValorEmpresa>) {
    setContenido((prev) => {
      const valores = [...prev.sobreNosotros.valores]
      valores[indice] = { ...valores[indice], ...parcial }
      return { ...prev, sobreNosotros: { ...prev.sobreNosotros, valores } }
    })
  }

  function agregarValor() {
    setContenido((prev) => ({
      ...prev,
      sobreNosotros: {
        ...prev.sobreNosotros,
        valores: [...prev.sobreNosotros.valores, { title: 'Nuevo valor', description: '' }],
      },
    }))
  }

  function quitarValor(indice: number) {
    setContenido((prev) => ({
      ...prev,
      sobreNosotros: {
        ...prev.sobreNosotros,
        valores: prev.sobreNosotros.valores.filter((_, i) => i !== indice),
      },
    }))
  }

  function alternarCategoria(id: string) {
    setContenido((prev) => {
      const ids = prev.especialidades.categoriaIds.includes(id)
        ? prev.especialidades.categoriaIds.filter((c) => c !== id)
        : [...prev.especialidades.categoriaIds, id]
      return { ...prev, especialidades: { ...prev.especialidades, categoriaIds: ids } }
    })
  }

  function alternarMarcaVisible(id: string) {
    setContenido((prev) => {
      const ids = prev.marcasClientes.clienteIds.includes(id)
        ? prev.marcasClientes.clienteIds.filter((c) => c !== id)
        : [...prev.marcasClientes.clienteIds, id]
      return { ...prev, marcasClientes: { ...prev.marcasClientes, clienteIds: ids } }
    })
  }

  function actualizarMarca(indice: number, parcial: Partial<Cliente>) {
    setContenido((prev) => {
      const items = [...prev.marcasClientes.items]
      items[indice] = { ...items[indice], ...parcial }
      return { ...prev, marcasClientes: { ...prev.marcasClientes, items } }
    })
  }

  function agregarMarca() {
    const nueva = crearMarcaVacia()
    setContenido((prev) => ({
      ...prev,
      marcasClientes: {
        ...prev.marcasClientes,
        items: [...prev.marcasClientes.items, nueva],
        clienteIds: [...prev.marcasClientes.clienteIds, nueva.id],
      },
    }))
  }

  function eliminarMarca(indice: number) {
    const marca = contenido.marcasClientes.items[indice]
    if (!marca) return
    if (!window.confirm(`¿Eliminar la marca «${marca.name}»?`)) return

    setContenido((prev) => {
      const { [marca.id]: _logo, ...logosRestantes } = prev.marcasClientes.logos
      return {
        ...prev,
        marcasClientes: {
          ...prev.marcasClientes,
          items: prev.marcasClientes.items.filter((_, i) => i !== indice),
          clienteIds: prev.marcasClientes.clienteIds.filter((id) => id !== marca.id),
          logos: logosRestantes,
        },
      }
    })
  }

  function actualizarTestimonio(indice: number, parcial: Partial<Testimonio>) {
    setContenido((prev) => {
      const items = [...prev.testimonios.items]
      items[indice] = { ...items[indice], ...parcial }
      return { ...prev, testimonios: { ...prev.testimonios, items } }
    })
  }

  function agregarTestimonio() {
    setContenido((prev) => ({
      ...prev,
      testimonios: {
        ...prev.testimonios,
        items: [
          ...prev.testimonios.items,
          {
            id: `admin-${Date.now()}`,
            name: 'Nuevo cliente',
            company: '',
            role: '',
            content: 'Escribe el testimonio aquí…',
            rating: 5,
          },
        ],
      },
    }))
  }

  function quitarTestimonio(indice: number) {
    setContenido((prev) => ({
      ...prev,
      testimonios: {
        ...prev.testimonios,
        items: prev.testimonios.items.filter((_, i) => i !== indice),
      },
    }))
  }

  return (
    <>
      <MetaPagina title="Admin - Página de inicio" />
      <div className="admin-inicio-header">
        <div>
          <h1>Página de inicio</h1>
          <p className="admin-subtitle">
            Edita textos e imágenes de cada sección visible en{' '}
            <a href="/" target="_blank" rel="noreferrer">
              la portada
            </a>
            . Pulsa «Publicar cambios» al final del formulario para guardar en la base de datos.
          </p>
          {sincronizando && (
            <p className="admin-subtitle admin-subtitle--sync">Sincronizando con la base de datos…</p>
          )}
        </div>
        <button type="button" className="admin-inicio-reset" onClick={manejarRestablecer}>
          Restablecer todo
        </button>
      </div>

      <nav className="admin-inicio-tabs" aria-label="Secciones de inicio">
        {SECCIONES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`admin-inicio-tab${seccion === s.id ? ' is-active' : ''}`}
            onClick={() => setSeccion(s.id)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      <form className="admin-inicio-form" onSubmit={manejarGuardar}>
        <AlertaCambiosSinGuardar visible={hayCambios} etiquetaGuardar="Publicar cambios" />
        {seccion === 'seo' && (
          <section className="admin-section">
            <h2>SEO de la portada</h2>
            <CampoTexto
              label="Título de la página"
              value={contenido.seo.titulo}
              onChange={(titulo) => setContenido((p) => ({ ...p, seo: { ...p.seo, titulo } }))}
              required
            />
            <CampoTexto
              label="Meta descripción"
              value={contenido.seo.descripcion}
              onChange={(descripcion) => setContenido((p) => ({ ...p, seo: { ...p.seo, descripcion } }))}
              multiline
              required
            />
          </section>
        )}

        {seccion === 'hero' && (
          <section className="admin-section">
            <h2>Hero principal</h2>
            <CampoTexto
              label="Línea 1 del título"
              value={contenido.hero.linea1}
              onChange={(linea1) => setContenido((p) => ({ ...p, hero: { ...p.hero, linea1 } }))}
            />
            <CampoTexto
              label="Línea 2 del título (cursiva)"
              value={contenido.hero.linea2}
              onChange={(linea2) => setContenido((p) => ({ ...p, hero: { ...p.hero, linea2 } }))}
            />
            <CampoTexto
              label="Párrafo"
              value={contenido.hero.parrafo}
              onChange={(parrafo) => setContenido((p) => ({ ...p, hero: { ...p.hero, parrafo } }))}
              multiline
            />
            <CampoImagenAdmin
              etiqueta="Imagen de fondo (opcional)"
              nota="Si no subes imagen, se usa la foto de la prensa Heidelberg por defecto."
              valor={contenido.hero.fondoImagen}
              onChange={(fondoImagen) => setContenido((p) => ({ ...p, hero: { ...p.hero, fondoImagen } }))}
            />
            <CampoEnlace
              label="Botón portafolio"
              value={contenido.hero.botonPortafolio}
              onChange={(botonPortafolio) => setContenido((p) => ({ ...p, hero: { ...p.hero, botonPortafolio } }))}
            />
            <CampoEnlace
              label="Botón cotizar"
              value={contenido.hero.botonCotizar}
              onChange={(botonCotizar) => setContenido((p) => ({ ...p, hero: { ...p.hero, botonCotizar } }))}
            />
            <CampoEnlace
              label="Botón trabaja con nosotros"
              value={contenido.hero.botonTrabaja}
              onChange={(botonTrabaja) => setContenido((p) => ({ ...p, hero: { ...p.hero, botonTrabaja } }))}
            />
          </section>
        )}

        {seccion === 'sobre' && (
          <section className="admin-section">
            <h2>Sobre nosotros</h2>
            <CampoTexto
              label="Título de sección (portada)"
              value={contenido.sobreNosotros.titulo}
              onChange={(titulo) =>
                setContenido((p) => ({ ...p, sobreNosotros: { ...p.sobreNosotros, titulo } }))
              }
            />
            <p className="admin-note">
              Los cambios de esta pestaña se reflejan en la portada y en la página{' '}
              <strong>/nosotros</strong>.
            </p>
            <CampoTexto
              label="Título historia (/nosotros)"
              value={contenido.sobreNosotros.historiaTitulo}
              onChange={(historiaTitulo) =>
                setContenido((p) => ({ ...p, sobreNosotros: { ...p.sobreNosotros, historiaTitulo } }))
              }
            />
            <CampoTexto
              label="Texto historia"
              value={contenido.sobreNosotros.historia}
              onChange={(historia) =>
                setContenido((p) => ({ ...p, sobreNosotros: { ...p.sobreNosotros, historia } }))
              }
              multiline
            />
            <CampoTexto
              label="Título misión"
              value={contenido.sobreNosotros.misionTitulo}
              onChange={(misionTitulo) =>
                setContenido((p) => ({ ...p, sobreNosotros: { ...p.sobreNosotros, misionTitulo } }))
              }
            />
            <CampoTexto
              label="Texto misión"
              value={contenido.sobreNosotros.mision}
              onChange={(mision) =>
                setContenido((p) => ({ ...p, sobreNosotros: { ...p.sobreNosotros, mision } }))
              }
              multiline
            />
            <CampoTexto
              label="Título visión"
              value={contenido.sobreNosotros.visionTitulo}
              onChange={(visionTitulo) =>
                setContenido((p) => ({ ...p, sobreNosotros: { ...p.sobreNosotros, visionTitulo } }))
              }
            />
            <CampoTexto
              label="Texto visión"
              value={contenido.sobreNosotros.vision}
              onChange={(vision) =>
                setContenido((p) => ({ ...p, sobreNosotros: { ...p.sobreNosotros, vision } }))
              }
              multiline
            />
            <CampoImagenAdmin
              etiqueta="Imagen lateral (opcional)"
              valor={contenido.sobreNosotros.imagen}
              onChange={(imagen) =>
                setContenido((p) => ({ ...p, sobreNosotros: { ...p.sobreNosotros, imagen } }))
              }
            />
            <CampoEnlace
              label="Botón"
              value={contenido.sobreNosotros.boton}
              onChange={(boton) =>
                setContenido((p) => ({ ...p, sobreNosotros: { ...p.sobreNosotros, boton } }))
              }
            />
            <h3 className="admin-inicio-subtitulo">Valores (/nosotros)</h3>
            <CampoTexto
              label="Título de valores"
              value={contenido.sobreNosotros.valoresTitulo}
              onChange={(valoresTitulo) =>
                setContenido((p) => ({ ...p, sobreNosotros: { ...p.sobreNosotros, valoresTitulo } }))
              }
            />
            {contenido.sobreNosotros.valores.map((valor, i) => (
              <div key={i} className="admin-inicio-tarjeta">
                <div className="admin-inicio-tarjeta__header">
                  <strong>Valor {i + 1}</strong>
                  <button type="button" className="admin-inicio-quitar" onClick={() => quitarValor(i)}>
                    Eliminar
                  </button>
                </div>
                <CampoTexto
                  label="Título"
                  value={valor.title}
                  onChange={(title) => actualizarValor(i, { title })}
                />
                <CampoTexto
                  label="Descripción"
                  value={valor.description}
                  onChange={(description) => actualizarValor(i, { description })}
                  multiline
                />
              </div>
            ))}
            <button type="button" className="admin-inicio-agregar" onClick={agregarValor}>
              + Agregar valor
            </button>
            <h3 className="admin-inicio-subtitulo">Experiencia / métricas</h3>
            <CampoTexto
              label="Título experiencia (/nosotros)"
              value={contenido.sobreNosotros.experienciaTitulo}
              onChange={(experienciaTitulo) =>
                setContenido((p) => ({ ...p, sobreNosotros: { ...p.sobreNosotros, experienciaTitulo } }))
              }
            />
            <CampoTexto
              label="Subtítulo experiencia"
              value={contenido.sobreNosotros.experienciaSubtitulo}
              onChange={(experienciaSubtitulo) =>
                setContenido((p) => ({ ...p, sobreNosotros: { ...p.sobreNosotros, experienciaSubtitulo } }))
              }
            />
            {contenido.sobreNosotros.metricas.map((m, i) => (
              <div key={i} className="admin-inicio-fila">
                <CampoTexto label="Número" value={m.metric} onChange={(v) => actualizarMetrica(i, 'metric', v)} />
                <CampoTexto label="Etiqueta" value={m.label} onChange={(v) => actualizarMetrica(i, 'label', v)} />
              </div>
            ))}
          </section>
        )}

        {seccion === 'especialidades' && (
          <section className="admin-section">
            <h2>Especialidades</h2>
            <CampoTexto
              label="Título"
              value={contenido.especialidades.titulo}
              onChange={(titulo) =>
                setContenido((p) => ({ ...p, especialidades: { ...p.especialidades, titulo } }))
              }
            />
            <p className="admin-note">Selecciona las categorías a mostrar:</p>
            <div className="admin-inicio-checklist">
              {categorias.map((cat) => (
                <label key={cat.id} className="admin-vacantes-check">
                  <input
                    type="checkbox"
                    checked={contenido.especialidades.categoriaIds.includes(cat.id)}
                    onChange={() => alternarCategoria(cat.id)}
                  />
                  {cat.icon} {cat.name}
                </label>
              ))}
            </div>
            {contenido.especialidades.categoriaIds.map((id) => {
              const cat = categorias.find((c) => c.id === id)
              if (!cat) return null
              return (
                <CampoImagenAdmin
                  key={id}
                  etiqueta={`Imagen para ${cat.name} (opcional)`}
                  nota="Si no hay imagen, se muestra el ícono de la categoría."
                  valor={contenido.especialidades.imagenes[id] ?? null}
                  onChange={(img) =>
                    setContenido((p) => ({
                      ...p,
                      especialidades: {
                        ...p.especialidades,
                        imagenes: { ...p.especialidades.imagenes, [id]: img },
                      },
                    }))
                  }
                />
              )
            })}
            <CampoEnlace
              label="Enlace ver todo"
              value={contenido.especialidades.enlaceVerTodo}
              onChange={(enlaceVerTodo) =>
                setContenido((p) => ({ ...p, especialidades: { ...p.especialidades, enlaceVerTodo } }))
              }
            />
          </section>
        )}

        {seccion === 'marcas' && (
          <section className="admin-section">
            <h2>Marcas con las que hemos trabajado</h2>
            <p className="admin-note">
              Las marcas también aparecen en <strong>/clientes</strong> (enlace «Ver todos»).
            </p>
            <CampoTexto
              label="Título"
              value={contenido.marcasClientes.titulo}
              onChange={(titulo) =>
                setContenido((p) => ({
                  ...p,
                  marcasClientes: { ...p.marcasClientes, titulo },
                }))
              }
            />
            <CampoTexto
              label="Subtítulo"
              value={contenido.marcasClientes.subtitulo}
              onChange={(subtitulo) =>
                setContenido((p) => ({
                  ...p,
                  marcasClientes: { ...p.marcasClientes, subtitulo },
                }))
              }
            />
            <CampoEnlace
              label="Enlace «Ver todos»"
              value={contenido.marcasClientes.enlaceVerTodo}
              onChange={(enlaceVerTodo) =>
                setContenido((p) => ({
                  ...p,
                  marcasClientes: { ...p.marcasClientes, enlaceVerTodo },
                }))
              }
            />

            <p className="admin-note admin-inicio-subtitulo">
              Administra el catálogo de marcas. Marca la casilla «Mostrar en inicio» para incluirla en el
              carrusel de la portada.
            </p>

            {contenido.marcasClientes.items.map((marca, i) => (
              <div key={marca.id} className="admin-inicio-tarjeta">
                <div className="admin-inicio-tarjeta__header">
                  <strong>Marca {i + 1}</strong>
                  <button type="button" className="admin-inicio-quitar" onClick={() => eliminarMarca(i)}>
                    Eliminar
                  </button>
                </div>

                <label className="admin-vacantes-check">
                  <input
                    type="checkbox"
                    checked={contenido.marcasClientes.clienteIds.includes(marca.id)}
                    onChange={() => alternarMarcaVisible(marca.id)}
                  />
                  Mostrar en inicio
                </label>

                <CampoTexto
                  label="Nombre de la marca"
                  value={marca.name}
                  onChange={(name) => actualizarMarca(i, { name })}
                  required
                />
                <CampoTexto
                  label="Sector / industria"
                  value={marca.industry}
                  onChange={(industry) => actualizarMarca(i, { industry })}
                />
                <CampoImagenAdmin
                  etiqueta="Logo de la marca"
                  nota="Sube el logotipo en PNG, JPG o WebP. Se recomienda fondo transparente."
                  valor={marca.logo || null}
                  previewClassName="admin-inicio-preview-img admin-inicio-preview-img--logo"
                  onChange={(logo) => actualizarMarca(i, { logo: logo ?? '' })}
                />
              </div>
            ))}

            <button type="button" className="admin-inicio-agregar" onClick={agregarMarca}>
              + Agregar marca
            </button>
          </section>
        )}

        {seccion === 'testimonios' && (
          <section className="admin-section">
            <h2>Testimonios</h2>
            <CampoTexto
              label="Título"
              value={contenido.testimonios.titulo}
              onChange={(titulo) =>
                setContenido((p) => ({ ...p, testimonios: { ...p.testimonios, titulo } }))
              }
            />
            <CampoTexto
              label="Subtítulo"
              value={contenido.testimonios.subtitulo}
              onChange={(subtitulo) =>
                setContenido((p) => ({ ...p, testimonios: { ...p.testimonios, subtitulo } }))
              }
            />
            {contenido.testimonios.items.map((t, i) => (
              <div key={t.id} className="admin-inicio-tarjeta">
                <div className="admin-inicio-tarjeta__header">
                  <strong>Testimonio {i + 1}</strong>
                  <button type="button" className="admin-inicio-quitar" onClick={() => quitarTestimonio(i)}>
                    Eliminar
                  </button>
                </div>
                <CampoTexto label="Nombre" value={t.name} onChange={(name) => actualizarTestimonio(i, { name })} />
                <CampoTexto
                  label="Empresa"
                  value={t.company ?? ''}
                  onChange={(company) => actualizarTestimonio(i, { company })}
                />
                <CampoTexto
                  label="Cargo"
                  value={t.role ?? ''}
                  onChange={(role) => actualizarTestimonio(i, { role })}
                />
                <CampoTexto
                  label="Comentario"
                  value={t.content}
                  onChange={(content) => actualizarTestimonio(i, { content })}
                  multiline
                />
                <label className="admin-vacantes-field">
                  Valoración (1–5)
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={t.rating}
                    onChange={(e) => actualizarTestimonio(i, { rating: Number(e.target.value) })}
                  />
                </label>
              </div>
            ))}
            <button type="button" className="admin-inicio-agregar" onClick={agregarTestimonio}>
              + Agregar testimonio
            </button>
          </section>
        )}

        {seccion === 'cta' && (
          <section className="admin-section">
            <h2>CTA cotización</h2>
            <CampoTexto
              label="Título"
              value={contenido.ctaCotizacion.titulo}
              onChange={(titulo) =>
                setContenido((p) => ({ ...p, ctaCotizacion: { ...p.ctaCotizacion, titulo } }))
              }
            />
            <CampoTexto
              label="Párrafo"
              value={contenido.ctaCotizacion.parrafo}
              onChange={(parrafo) =>
                setContenido((p) => ({ ...p, ctaCotizacion: { ...p.ctaCotizacion, parrafo } }))
              }
              multiline
            />
            <CampoImagenAdmin
              etiqueta="Imagen de fondo (opcional)"
              valor={contenido.ctaCotizacion.imagenFondo}
              onChange={(imagenFondo) =>
                setContenido((p) => ({ ...p, ctaCotizacion: { ...p.ctaCotizacion, imagenFondo } }))
              }
            />
            <CampoEnlace
              label="Botón"
              value={contenido.ctaCotizacion.boton}
              onChange={(boton) =>
                setContenido((p) => ({ ...p, ctaCotizacion: { ...p.ctaCotizacion, boton } }))
              }
            />
          </section>
        )}

        {seccion === 'contacto' && (
          <section className="admin-section">
            <h2>Contacto</h2>
            <p className="admin-note">
              Se muestra en la portada, en <strong>/contacto</strong> y en el pie de página.
            </p>
            <CampoTexto
              label="Título"
              value={contenido.contacto.titulo}
              onChange={(titulo) =>
                setContenido((p) => ({ ...p, contacto: { ...p.contacto, titulo } }))
              }
            />
            <CampoTexto
              label="Dirección"
              value={contenido.contacto.direccion}
              onChange={(direccion) =>
                setContenido((p) => ({
                  ...p,
                  contacto: { ...p.contacto, direccion, mapEmbedUrl: '' },
                }))
              }
              multiline
            />
            <p className="admin-note">
              El mapa se genera automáticamente a partir de la dirección.
            </p>
            <CampoTexto
              label="Teléfono"
              value={contenido.contacto.telefono}
              onChange={(telefono) =>
                setContenido((p) => ({ ...p, contacto: { ...p.contacto, telefono } }))
              }
            />
            <CampoTexto
              label="Email"
              value={contenido.contacto.email}
              onChange={(email) =>
                setContenido((p) => ({ ...p, contacto: { ...p.contacto, email } }))
              }
            />
            <CampoEnlace
              label="Botón"
              value={contenido.contacto.boton}
              onChange={(boton) =>
                setContenido((p) => ({ ...p, contacto: { ...p.contacto, boton } }))
              }
            />
          </section>
        )}

        <div className="admin-inicio-acciones">
          <button type="submit" className="btn btn--gradient" disabled={guardando}>
            {guardando ? 'Publicando…' : 'Publicar cambios'}
          </button>
          {mensaje && (
            <p
              className={`admin-vacantes-msg${tipoMensaje === 'error' ? ' admin-vacantes-msg--error' : ''}`}
              role="alert"
            >
              {mensaje}
            </p>
          )}
        </div>
      </form>
    </>
  )
}
