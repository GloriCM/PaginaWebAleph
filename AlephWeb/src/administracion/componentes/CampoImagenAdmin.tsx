/**
 * Campo reutilizable para subir/quitar imágenes en el panel admin.
 */

import type { ChangeEvent } from 'react'
import { archivoABase64 } from '../../datos/contenidoInicio'

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
  async function manejarArchivo(e: ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0]
    if (!archivo) return
    if (!archivo.type.startsWith('image/')) return
    const dataUrl = await archivoABase64(archivo)
    onChange(dataUrl)
    e.target.value = ''
  }

  return (
    <div className="admin-inicio-campo-imagen">
      <span className="admin-inicio-campo-imagen__etiqueta">{etiqueta}</span>
      {nota && <p className="admin-note" style={{ margin: '0.35rem 0 0.5rem' }}>{nota}</p>}
      <label className="admin-vacantes-upload">
        <input type="file" accept="image/*" onChange={manejarArchivo} />
        <span>{valor ? 'Cambiar imagen' : 'Subir imagen'}</span>
      </label>
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
