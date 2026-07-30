/**
 * Convierte imágenes subidas en el admin a WebP comprimido (menor peso en BD y API).
 */

import imageCompression from 'browser-image-compression'

const TAMANO_MAX_BYTES = 450_000
const LADO_MAX_PX = 1920
const CALIDAD_WEBP = 0.82

const TIPOS_SIN_CONVERTIR = new Set(['image/svg+xml', 'image/gif'])

function leerComoDataUrl(archivo: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader()
    lector.onload = () => resolve(String(lector.result))
    lector.onerror = () => reject(new Error('No se pudo leer la imagen optimizada'))
    lector.readAsDataURL(archivo)
  })
}

/**
 * Comprime y convierte una imagen a WebP en el navegador antes de guardarla.
 * SVG y GIF se dejan tal cual (vector / animación).
 */
export async function archivoAImagenWebp(archivo: File): Promise<string> {
  if (!archivo.type.startsWith('image/')) {
    throw new Error('El archivo debe ser una imagen')
  }

  if (TIPOS_SIN_CONVERTIR.has(archivo.type)) {
    return leerComoDataUrl(archivo)
  }

  if (archivo.type === 'image/webp' && archivo.size <= TAMANO_MAX_BYTES) {
    return leerComoDataUrl(archivo)
  }

  const comprimido = await imageCompression(archivo, {
    maxSizeMB: TAMANO_MAX_BYTES / (1024 * 1024),
    maxWidthOrHeight: LADO_MAX_PX,
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: CALIDAD_WEBP,
    alwaysKeepResolution: false,
  })

  return leerComoDataUrl(comprimido)
}
