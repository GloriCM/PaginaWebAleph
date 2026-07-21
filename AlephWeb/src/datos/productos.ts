/**
 * @file productos.ts
 * @description Portafolio de productos de Aleph Impresores (RF-003, RF-005).
 * @module datos/productos
 */

import type { Producto } from '../tipos/indice'

/**
 * Genera una imagen placeholder SVG codificada en data URI.
 * @param color - Color de fondo en hexadecimal.
 * @param text - Texto a mostrar en la imagen.
 */
const generarImagenPlaceholder = (color: string, text: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <rect fill="${color}" width="600" height="400"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-family="sans-serif" font-size="24" font-weight="bold">${text}</text>
    </svg>`,
  )}`

/** Catálogo inicial de productos (solo lectura — usar obtenerProductos() en runtime). */
export const productosIniciales: Producto[] = [
  {
    id: '1',
    name: 'Caja plegadiza retail',
    slug: 'caja-plegadiza-retail',
    categoryId: 'plegadizas',
    shortDescription: 'Caja plegadiza de cartulina para exhibición en góndola.',
    description:
      'Caja plegadiza diseñada para maximizar la visibilidad del producto en punto de venta. Estructura resistente con impresión offset de alta definición y acabados que realzan la marca.',
    image: generarImagenPlaceholder('#E4007C', 'Plegadiza'),
    gallery: [
      generarImagenPlaceholder('#E4007C', 'Vista 1'),
      generarImagenPlaceholder('#00AEEF', 'Vista 2'),
      generarImagenPlaceholder('#FFD600', 'Vista 3'),
    ],
    materials: ['Cartulina SBS 300g', 'Cartulina kraft', 'Cartón corrugado'],
    finishes: ['Barniz UV spot', 'Laminado mate', 'Troquelado'],
    applications: ['Alimentos', 'Cosmética', 'Retail'],
  },
  {
    id: '2',
    name: 'Bolsa kraft impresa',
    slug: 'bolsa-kraft-impresa',
    categoryId: 'bolsas',
    shortDescription: 'Bolsa de papel kraft con impresión a todo color.',
    description:
      'Bolsa ecológica de papel kraft con asas reforzadas. Ideal para tiendas boutique, eventos corporativos y campañas promocionales.',
    image: generarImagenPlaceholder('#00AEEF', 'Bolsa'),
    gallery: [generarImagenPlaceholder('#00AEEF', 'Bolsa 1'), generarImagenPlaceholder('#E4007C', 'Bolsa 2')],
    materials: ['Papel kraft 120g', 'Papel couché'],
    finishes: ['Impresión flexo', 'Asa twisted'],
    applications: ['Retail', 'Eventos', 'Regalos corporativos'],
  },
  {
    id: '3',
    name: 'Exhibidor de piso',
    slug: 'exhibidor-de-piso',
    categoryId: 'exhibidores',
    shortDescription: 'Display de cartón corrugado para punto de venta.',
    description:
      'Exhibidor de piso de alta resistencia con diseño personalizado. Maximiza el espacio en tienda y aumenta la rotación del producto.',
    image: generarImagenPlaceholder('#FFD600', 'Exhibidor'),
    gallery: [
      generarImagenPlaceholder('#FFD600', 'Exhibidor 1'),
      generarImagenPlaceholder('#1a1a1a', 'Exhibidor 2'),
    ],
    materials: ['Cartón corrugado doble pared', 'Cartulina'],
    finishes: ['Impresión directa', 'Barniz protector'],
    applications: ['Supermercados', 'Farmacias', 'Tiendas especializadas'],
  },
  {
    id: '4',
    name: 'Bandeja para alimentos',
    slug: 'bandeja-alimentos',
    categoryId: 'bandejas',
    shortDescription: 'Bandeja termoformada con tapa impresa.',
    description:
      'Bandeja diseñada para alimentos listos para consumir. Cumple normativas de contacto alimentario y mantiene la frescura del producto.',
    image: generarImagenPlaceholder('#4CAF50', 'Bandeja'),
    gallery: [generarImagenPlaceholder('#4CAF50', 'Bandeja 1')],
    materials: ['PET reciclable', 'Cartulina food grade'],
    finishes: ['Termoformado', 'Impresión flexo'],
    applications: ['Alimentos preparados', 'Panadería', 'Catering'],
  },
  {
    id: '5',
    name: 'Vaso promocional',
    slug: 'vaso-promocional',
    categoryId: 'vasos',
    shortDescription: 'Vaso impreso para campañas y eventos.',
    description:
      'Vaso de papel o plástico con impresión personalizada. Perfecto para activaciones de marca, ferias y puntos de venta.',
    image: generarImagenPlaceholder('#9C27B0', 'Vaso'),
    gallery: [generarImagenPlaceholder('#9C27B0', 'Vaso 1')],
    materials: ['Papel PE', 'PET'],
    finishes: ['Impresión offset', 'Barniz interior'],
    applications: ['Bebidas', 'Eventos', 'Promociones'],
  },
  {
    id: '6',
    name: 'Empaque premium',
    slug: 'empaque-premium',
    categoryId: 'empaques-especiales',
    shortDescription: 'Empaque de lujo con acabados especiales.',
    description:
      'Solución de empaque premium con repujado, foil y barnices selectivos. Diseñado para productos de alta gama que requieren una presentación excepcional.',
    image: generarImagenPlaceholder('#1a1a1a', 'Premium'),
    gallery: [
      generarImagenPlaceholder('#1a1a1a', 'Premium 1'),
      generarImagenPlaceholder('#E4007C', 'Premium 2'),
    ],
    materials: ['Cartulina premium', 'Papel texturizado'],
    finishes: ['Foil stamping', 'Repujado', 'Barniz UV'],
    applications: ['Cosmética', 'Licores', 'Joyería'],
  },
  {
    id: '7',
    name: 'Stopper de góndola',
    slug: 'stopper-gondola',
    categoryId: 'material-pop',
    shortDescription: 'Material POP para destacar productos en anaquel.',
    description:
      'Stopper de cartulina con diseño llamativo para captar la atención del consumidor en el punto de venta.',
    image: generarImagenPlaceholder('#FF5722', 'POP'),
    gallery: [generarImagenPlaceholder('#FF5722', 'POP 1')],
    materials: ['Cartulina 14pt', 'PVC'],
    finishes: ['Barniz UV', 'Troquelado especial'],
    applications: ['Retail', 'Farmacia', 'Supermercados'],
  },
  {
    id: '8',
    name: 'Folder corporativo',
    slug: 'folder-corporativo',
    categoryId: 'otros',
    shortDescription: 'Folder institucional con bolsillo interior.',
    description:
      'Folder corporativo con impresión a todo color, ideal para presentaciones comerciales y material institucional.',
    image: generarImagenPlaceholder('#607D8B', 'Folder'),
    gallery: [generarImagenPlaceholder('#607D8B', 'Folder 1')],
    materials: ['Cartulina couché 300g'],
    finishes: ['Laminado mate', 'Barniz UV'],
    applications: ['Corporativo', 'Institucional', 'Eventos'],
  },
]

export {
  obtenerProductos,
  obtenerProductoPorSlug,
  obtenerProductosPorCategoria,
} from './catalogoProductos'
