/**
 * Campo para agregar y quitar varias imágenes en el panel admin.
 */

import { useState, type ChangeEvent } from 'react'
import { archivoAImagenWebp } from '../../utilidades/optimizarImagen'

interface PropiedadesCampoGaleriaAdmin {
  etiqueta: string
  imagenes: string[]
  onChange: (imagenes: string[]) => void
  nota?: string
}

export function CampoGaleriaAdmin({
  etiqueta,
  imagenes,
  onChange,
  nota,
}: PropiedadesCampoGaleriaAdmin) {
  const [optimizando, setOptimizando] = useState(false)
  const [error, setError] = useState('')

  async function manejarAgregar(e: ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0]
    if (!archivo) return
    if (!archivo.type.startsWith('image/')) return

    setOptimizando(true)
    setError('')

    try {
      const dataUrl = await archivoAImagenWebp(archivo)
      onChange([...imagenes, dataUrl])
    } catch {
      setError('No se pudo optimizar la imagen. Intenta con JPG o PNG.')
    } finally {
      setOptimizando(false)
      e.target.value = ''
    }
  }

  function quitar(indice: number) {
    onChange(imagenes.filter((_, i) => i !== indice))
  }

  return (
    <div className="admin-galeria-campo">
      <span className="admin-inicio-campo-imagen__etiqueta">{etiqueta}</span>
      {nota && <p className="admin-note" style={{ margin: '0.35rem 0 0.75rem' }}>{nota}</p>}

      {imagenes.length > 0 && (
        <div className="admin-galeria-campo__grid">
          {imagenes.map((img, i) => (
            <div key={`${i}-${img.slice(0, 24)}`} className="admin-galeria-campo__item">
              <img src={img} alt={`Imagen ${i + 1}`} />
              <button type="button" className="admin-vacantes-quitar" onClick={() => quitar(i)}>
                Quitar
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="admin-vacantes-upload">
        <input type="file" accept="image/*" onChange={manejarAgregar} disabled={optimizando} />
        <span>{optimizando ? 'Optimizando a WebP…' : '+ Agregar imagen a la galería'}</span>
      </label>
      {error && <p className="form__error">{error}</p>}
    </div>
  )
}
