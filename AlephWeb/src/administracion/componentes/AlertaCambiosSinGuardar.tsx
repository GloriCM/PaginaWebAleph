/**
 * Banner visible cuando el formulario admin tiene cambios pendientes de guardar.
 */

interface PropiedadesAlertaCambiosSinGuardar {
  visible: boolean
  etiquetaGuardar?: string
}

export function AlertaCambiosSinGuardar({
  visible,
  etiquetaGuardar = 'Guardar cambios',
}: PropiedadesAlertaCambiosSinGuardar) {
  if (!visible) return null

  return (
    <div className="admin-alerta-cambios" role="status">
      <strong>Cambios sin guardar.</strong> Pulsa «{etiquetaGuardar}» antes de salir de esta
      página, o se perderán las imágenes y textos que acabas de editar.
    </div>
  )
}
