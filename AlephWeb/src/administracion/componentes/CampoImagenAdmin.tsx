/**
 * Campo reutilizable para subir/quitar imágenes en el panel admin.
 */

import { useState, type ChangeEvent } from 'react'
import { archivoAImagenWebp } from '../../utilidades/optimizarImagen'

interface PropiedadesCampoImagenAdmin {
  etiqueta: string
  valor: string | null
  onChange: (valor: string | null) => void
  nota?: string
  previewClassName?: string
}

export function CampoImagenAdmin({
  etiqueta,
  valor,
  onChange,
  nota,
  previewClassName = 'admin-inicio-preview-img',
}: PropiedadesCampoImagenAdmin) {
  const [optimizando, setOptimizando] = useState(false)
  const [error, setError] = useState('')

  async function manejarArchivo(e: ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0]
    if (!archivo) return
    if (!archivo.type.startsWith('image/')) return

    setOptimizando(true)
    setError('')

    try {
      const dataUrl = await archivoAImagenWebp(archivo)
      onChange(dataUrl)
    } catch {
      setError('No se pudo optimizar la imagen. Intenta con JPG o PNG.')
    } finally {
      setOptimizando(false)
      e.target.value = ''
    }
  }

  return (
    <div className="admin-inicio-campo-imagen">
      <span className="admin-inicio-campo-imagen__etiqueta">{etiqueta}</span>
      {nota && <p className="admin-note" style={{ margin: '0.35rem 0 0.5rem' }}>{nota}</p>}
      <label className="admin-vacantes-upload">
        <input type="file" accept="image/*" onChange={manejarArchivo} disabled={optimizando} />
        <span>{optimizando ? 'Optimizando a WebP…' : valor ? 'Cambiar imagen' : 'Subir imagen'}</span>
      </label>
      {error && <p className="form__error">{error}</p>}
      {valor && (
        <>
          <img src={valor} alt="" className={previewClassName} />
          <button type="button" className="admin-vacantes-quitar" onClick={() => onChange(null)}>
            Quitar imagen
          </button>
        </>
      )}
    </div>
  )
}
