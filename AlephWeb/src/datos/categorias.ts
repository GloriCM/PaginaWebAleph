/**
 * @file categorias.ts
 * @description Catálogo de categorías de productos (RF-004).
 * @module datos/categorias
 */

import type { Categoria } from '../tipos/indice'

/** Listado de categorías del portafolio de productos. */
export const categorias: Categoria[] = [
  {
    id: 'plegadizas',
    name: 'Plegadizas',
    slug: 'plegadizas',
    description: 'Cajas y empaques plegables para retail y consumo masivo.',
    icon: '📦',
  },
  {
    id: 'bolsas',
    name: 'Bolsas',
    slug: 'bolsas',
    description: 'Bolsas impresas de papel y materiales especiales.',
    icon: '🛍️',
  },
  {
    id: 'exhibidores',
    name: 'Exhibidores',
    slug: 'exhibidores',
    description: 'Displays y exhibidores para punto de venta.',
    icon: '🏪',
  },
  {
    id: 'bandejas',
    name: 'Bandejas',
    slug: 'bandejas',
    description: 'Bandejas para alimentos y productos delicados.',
    icon: '🍱',
  },
  {
    id: 'vasos',
    name: 'Vasos',
    slug: 'vasos',
    description: 'Vasos impresos para bebidas y promociones.',
    icon: '🥤',
  },
  {
    id: 'empaques-especiales',
    name: 'Empaques especiales',
    slug: 'empaques-especiales',
    description: 'Soluciones personalizadas para necesidades únicas.',
    icon: '🎁',
  },
  {
    id: 'material-pop',
    name: 'Material POP',
    slug: 'material-pop',
    description: 'Material publicitario en punto de venta.',
    icon: '📢',
  },
  {
    id: 'otros',
    name: 'Otros productos',
    slug: 'otros',
    description: 'Folders, etiquetas, calendarios y más.',
    icon: '📋',
  },
]
