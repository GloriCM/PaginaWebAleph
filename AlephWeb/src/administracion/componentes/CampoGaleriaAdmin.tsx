/**
 * Campo para agregar y quitar varias imágenes en el panel admin.
 */

import type { ChangeEvent } from 'react'
import { archivoABase64 } from '../../datos/contenidoInicio'

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
  async function manejarAgregar(e: ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0]
    if (!archivo) return
    if (!archivo.type.startsWith('image/')) return
    const dataUrl = await archivoABase64(archivo)
    onChange([...imagenes, dataUrl])
    e.target.value = ''
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
        <input type="file" accept="image/*" onChange={manejarAgregar} />
        <span>+ Agregar imagen a la galería</span>
      </label>
    </div>
  )
}
