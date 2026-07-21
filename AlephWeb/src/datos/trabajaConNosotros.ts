/**
 * @file trabajaConNosotros.ts
 * @description Contenido de la sección «Trabaja con nosotros».
 */

export const areasTrabajo = [
  {
    id: 'produccion',
    name: 'Producción',
    description: 'Operación de prensas, control de color y acabados en línea.',
    icon: '⚙️',
  },
  {
    id: 'preprensa',
    name: 'Preprensa y diseño',
    description: 'Arte final, pruebas de color y preparación de archivos para impresión.',
    icon: '🎨',
  },
  {
    id: 'ventas',
    name: 'Ventas y cotización',
    description: 'Asesoría comercial, seguimiento de clientes y desarrollo de negocio.',
    icon: '🤝',
  },
  {
    id: 'logistica',
    name: 'Logística',
    description: 'Despacho, inventario y coordinación de entregas a nivel nacional.',
    icon: '📦',
  },
] as const

export const pasosSeleccion = [
  'Envías tu hoja de vida',
  'Revisamos tu perfil',
  'Entrevista con el equipo',
  'Te damos la bienvenida',
] as const
