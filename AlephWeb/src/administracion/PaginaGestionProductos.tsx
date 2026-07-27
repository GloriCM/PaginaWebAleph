/**
 * @file PaginaGestionProductos.tsx
 * @description CRUD de productos del portafolio en el panel administrativo (RF-020).
 */

import { useMemo, useRef, useState, type FormEvent } from 'react'
import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { AlertaCambiosSinGuardar } from './componentes/AlertaCambiosSinGuardar'
import { CampoImagenAdmin } from './componentes/CampoImagenAdmin'
import { CampoGaleriaAdmin } from './componentes/CampoGaleriaAdmin'
import { snapshotFormulario, useFormularioSinGuardar } from '../hooks/useFormularioSinGuardar'
import { categorias } from '../datos/categorias'
import {
  crearProducto,
  crearSlugProducto,
  eliminarProducto,
  guardarProducto,
  joinListaAdmin,
  parseListaAdmin,
  productoVacio,
} from '../datos/catalogoProductos'
import { useProductos } from '../hooks/useProductos'
import type { Producto } from '../tipos/indice'

type ModoFormulario = 'lista' | 'crear' | 'editar'

function snapshotProductoForm(
  formulario: Producto,
  materialesTexto: string,
  acabadosTexto: string,
  aplicacionesTexto: string,
) {
  return snapshotFormulario({
    name: formulario.name,
    slug: formulario.slug,
    categoryId: formulario.categoryId,
    shortDescription: formulario.shortDescription,
    description: formulario.description,
    image: formulario.image,
    gallery: formulario.gallery,
    materialesTexto,
    acabadosTexto,
    aplicacionesTexto,
  })
}

export function PaginaGestionProductos() {
  const productos = useProductos()
  const lineaBaseRef = useRef('')
  const [modo, setModo] = useState<ModoFormulario>('lista')
  const [formulario, setFormulario] = useState<Producto>(() => productoVacio())
  const [materialesTexto, setMaterialesTexto] = useState('')
  const [acabadosTexto, setAcabadosTexto] = useState('')
  const [aplicacionesTexto, setAplicacionesTexto] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const hayCambios = useMemo(() => {
    if (modo === 'lista') return false
    return (
      snapshotProductoForm(formulario, materialesTexto, acabadosTexto, aplicacionesTexto) !==
      lineaBaseRef.current
    )
  }, [modo, formulario, materialesTexto, acabadosTexto, aplicacionesTexto])

  const { confirmarSiHayCambios } = useFormularioSinGuardar(hayCambios)

  function abrirCrear() {
    const vacio = productoVacio(categorias[0]?.id ?? 'plegadizas')
    lineaBaseRef.current = snapshotProductoForm(vacio, '', '', '')
    setFormulario(vacio)
    setMaterialesTexto('')
    setAcabadosTexto('')
    setAplicacionesTexto('')
    setMensaje('')
    setModo('crear')
  }

  function abrirEditar(producto: Producto) {
    const materials = joinListaAdmin(producto.materials)
    const finishes = joinListaAdmin(producto.finishes)
    const applications = joinListaAdmin(producto.applications)
    lineaBaseRef.current = snapshotProductoForm({ ...producto }, materials, finishes, applications)
    setFormulario({ ...producto })
    setMaterialesTexto(materials)
    setAcabadosTexto(finishes)
    setAplicacionesTexto(applications)
    setMensaje('')
    setModo('editar')
  }

  function cancelarFormulario() {
    if (!confirmarSiHayCambios()) return
    setModo('lista')
    setMensaje('')
  }

  async function manejarEliminar(producto: Producto) {
    const confirmar = window.confirm(`¿Eliminar «${producto.name}»? Esta acción no se puede deshacer.`)
    if (!confirmar) return

    try {
      await eliminarProducto(producto.id)
      if (modo !== 'lista' && formulario.id === producto.id) cancelarFormulario()
      setMensaje('Producto eliminado.')
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo eliminar el producto.')
    }
  }

  async function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    setGuardando(true)
    setMensaje('')

    const datosBase = {
      name: formulario.name.trim(),
      categoryId: formulario.categoryId,
      shortDescription: formulario.shortDescription.trim(),
      description: formulario.description.trim(),
      image: formulario.image.trim(),
      gallery: formulario.gallery,
      materials: parseListaAdmin(materialesTexto),
      finishes: parseListaAdmin(acabadosTexto),
      applications: parseListaAdmin(aplicacionesTexto),
    }

    if (!datosBase.name) {
      setMensaje('El nombre del producto es obligatorio.')
      setGuardando(false)
      return
    }

    if (!datosBase.image) {
      setMensaje('Sube una imagen principal para el producto.')
      setGuardando(false)
      return
    }

    try {
      if (modo === 'crear') {
        const slug = formulario.slug.trim() || crearSlugProducto(datosBase.name)
        await crearProducto({ ...datosBase, slug })
        setMensaje('Producto creado correctamente.')
      } else {
        const slug = formulario.slug.trim() || crearSlugProducto(datosBase.name, formulario.id)
        await guardarProducto({ ...formulario, ...datosBase, slug })
        setMensaje('Producto actualizado.')
      }
      setModo('lista')
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo guardar el producto.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <>
      <MetaPagina title="Admin - Productos" />
      <div className="admin-header-row">
        <div>
          <h1>Gestión de productos</h1>
          <p className="admin-subtitle">Crear, modificar y eliminar productos del portafolio (RF-020)</p>
        </div>
        {modo === 'lista' && (
          <button type="button" className="btn btn--primary" onClick={abrirCrear}>
            + Nuevo producto
          </button>
        )}
      </div>

      {mensaje && <p className="admin-vacantes-msg">{mensaje}</p>}

      {modo === 'lista' ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => {
              const categoria = categorias.find((c) => c.id === producto.categoryId)
              return (
                <tr key={producto.id}>
                  <td>
                    <div className="admin-table__product">
                      <img src={producto.image} alt="" width="48" height="32" />
                      {producto.name}
                    </div>
                  </td>
                  <td>{categoria?.name}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={() => abrirEditar(producto)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={() => manejarEliminar(producto)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : (
        <form className="admin-inicio-form admin-productos-form" onSubmit={manejarEnvio}>
          <AlertaCambiosSinGuardar
            visible={hayCambios}
            etiquetaGuardar={modo === 'crear' ? 'Crear producto' : 'Guardar cambios'}
          />
          <div className="admin-header-row" style={{ marginBottom: '1rem' }}>
            <h2 style={{ margin: 0 }}>{modo === 'crear' ? 'Nuevo producto' : 'Editar producto'}</h2>
            <button type="button" className="btn btn--ghost" onClick={cancelarFormulario}>
              Volver al listado
            </button>
          </div>

          <section className="admin-section">
            <h2>Información básica</h2>
            <label className="admin-vacantes-field">
              Nombre
              <input
                value={formulario.name}
                onChange={(e) => {
                  const name = e.target.value
                  setFormulario((prev) => ({
                    ...prev,
                    name,
                    slug: modo === 'crear' ? crearSlugProducto(name) : prev.slug,
                  }))
                }}
                required
              />
            </label>
            <label className="admin-vacantes-field">
              Slug (URL)
              <input
                value={formulario.slug}
                onChange={(e) => setFormulario((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="caja-plegadiza-retail"
              />
            </label>
            <label className="admin-vacantes-field">
              Categoría
              <select
                value={formulario.categoryId}
                onChange={(e) => setFormulario((prev) => ({ ...prev, categoryId: e.target.value }))}
              >
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-vacantes-field">
              Descripción corta
              <textarea
                value={formulario.shortDescription}
                onChange={(e) => setFormulario((prev) => ({ ...prev, shortDescription: e.target.value }))}
                rows={2}
                required
              />
            </label>
            <label className="admin-vacantes-field">
              Descripción completa
              <textarea
                value={formulario.description}
                onChange={(e) => setFormulario((prev) => ({ ...prev, description: e.target.value }))}
                rows={5}
                required
              />
            </label>
          </section>

          <section className="admin-section">
            <h2>Imagen principal</h2>
            <CampoImagenAdmin
              etiqueta="Imagen del producto"
              valor={formulario.image || null}
              onChange={(img) => setFormulario((prev) => ({ ...prev, image: img ?? '' }))}
              nota="Recomendado: 600×400 px o similar (JPG, PNG, WebP)."
            />
          </section>

          <section className="admin-section">
            <h2>Galería adicional</h2>
            <CampoGaleriaAdmin
              etiqueta="Imágenes extra del producto"
              imagenes={formulario.gallery}
              onChange={(gallery) => setFormulario((prev) => ({ ...prev, gallery }))}
              nota="Opcional. Puedes subir varias fotos (vistas, detalles, acabados, etc.)."
            />
          </section>

          <section className="admin-section">
            <h2>Especificaciones</h2>
            <label className="admin-vacantes-field">
              Materiales (separados por coma)
              <input value={materialesTexto} onChange={(e) => setMaterialesTexto(e.target.value)} />
            </label>
            <label className="admin-vacantes-field">
              Acabados (separados por coma)
              <input value={acabadosTexto} onChange={(e) => setAcabadosTexto(e.target.value)} />
            </label>
            <label className="admin-vacantes-field">
              Aplicaciones (separadas por coma)
              <input value={aplicacionesTexto} onChange={(e) => setAplicacionesTexto(e.target.value)} />
            </label>
          </section>

          <button type="submit" className="btn btn--gradient" disabled={guardando}>
            {guardando ? 'Guardando…' : modo === 'crear' ? 'Crear producto' : 'Guardar cambios'}
          </button>
        </form>
      )}
    </>
  )
}
