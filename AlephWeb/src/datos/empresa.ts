/**
 * @file empresa.ts
 * @description Información corporativa de Aleph Impresores (RF-002).
 * Incluye historia, misión, visión, valores, industrias y servicios.
 * @module datos/empresa
 */

/** Información institucional y ventajas competitivas de la empresa. */
export const informacionEmpresa = {
  summary:
    'Somos una empresa colombiana especializada en artes gráficas, desarrollo de empaques y soluciones de material POP. Combinamos tecnología de punta con un equipo creativo para entregar productos que destacan en el punto de venta.',
  history:
    'Fundada hace más de dos décadas, Aleph Impresores nació con la visión de ofrecer soluciones gráficas integrales a marcas que buscan diferenciarse. Desde nuestros inicios como taller de impresión, hemos evolucionado hasta convertirnos en un aliado estratégico para empresas de consumo masivo, retail y sector farmacéutico.',
  mission:
    'Crear soluciones gráficas innovadoras que potencien la presencia de marca de nuestros clientes, garantizando calidad, cumplimiento y sostenibilidad en cada proyecto.',
  vision:
    'Ser reconocidos como el referente en artes gráficas y empaques en Colombia y Latinoamérica, liderando la transformación del sector con procesos responsables y diseño de alto impacto.',
  values: [
    { title: 'Calidad', description: 'Excelencia en cada detalle de impresión y acabado.' },
    { title: 'Innovación', description: 'Búsqueda constante de nuevas técnicas y materiales.' },
    { title: 'Compromiso', description: 'Cumplimiento de plazos y expectativas del cliente.' },
    { title: 'Sostenibilidad', description: 'Procesos responsables con el medio ambiente.' },
    { title: 'Trabajo en equipo', description: 'Colaboración entre áreas para mejores resultados.' },
  ],
  experience: [
    { metric: '20+', label: 'Años de experiencia' },
    { metric: '500+', label: 'Clientes satisfechos' },
    { metric: '1M+', label: 'Productos entregados' },
    { metric: '50+', label: 'Colaboradores expertos' },
  ],
  competitiveAdvantages: [
    'Tecnología de impresión offset y digital de última generación',
    'Equipo de diseño gráfico y estructural especializado',
    'Capacidad de producción para grandes volúmenes',
    'Asesoría personalizada desde la idea hasta la entrega',
    'Certificaciones de calidad y procesos estandarizados',
  ],
}

/** Sectores industriales que la empresa atiende. */
export const industrias = [
  {
    name: 'Alimentos y bebidas',
    description: 'Empaques que preservan, protegen y venden en góndola.',
    icon: '🍽️',
  },
  {
    name: 'Farmacéutico',
    description: 'Soluciones que cumplen normativas y garantizan trazabilidad.',
    icon: '💊',
  },
  {
    name: 'Cosmética y cuidado personal',
    description: 'Packaging premium que comunica la esencia de la marca.',
    icon: '✨',
  },
  {
    name: 'Retail y supermercados',
    description: 'Exhibidores y material POP de alto impacto visual.',
    icon: '🛒',
  },
  {
    name: 'Tecnología y electrodomésticos',
    description: 'Empaques resistentes con presentación profesional.',
    icon: '📱',
  },
  {
    name: 'Sector institucional',
    description: 'Material corporativo, folders y papelería especializada.',
    icon: '🏢',
  },
]

/** Servicios gráficos y de producción ofrecidos. */
export const servicios = [
  {
    name: 'Diseño gráfico',
    description: 'Creación y adaptación de artes para impresión y empaque.',
  },
  {
    name: 'Diseño estructural',
    description: 'Desarrollo de troqueles y estructuras de empaque a medida.',
  },
  {
    name: 'Impresión offset',
    description: 'Alta calidad para grandes tirajes con colores precisos.',
  },
  {
    name: 'Impresión digital',
    description: 'Producción ágil para tirajes cortos y personalizados.',
  },
  {
    name: 'Acabados especiales',
    description: 'Barniz UV, laminado, troquelado, repujado y más.',
  },
  {
    name: 'Logística y distribución',
    description: 'Entrega puntual a nivel nacional.',
  },
]
