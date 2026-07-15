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
    'Suministrar a nuestros clientes material de empaque, pensando siempre en la excelencia; cumpliendo con los más altos estándares de calidad, basados en las Buenas Prácticas de Manufactura usadas nacional e internacionalmente, siempre apoyados por el capital intelectual de un grupo selecto de colaboradores especialistas en la materia.',
  vision:
    'Ser reconocidos en América como la mejor Empresa de producción en Artes Gráficas, siendo la opción número 1, para realizar empaques a las mejores marcas de reconocimiento mundial.',
  values: [
    {
      title: 'Compromiso social',
      description:
        'Nuestros valores con compromiso social se basan en la transparencia de nuestros actos, la responsabilidad con el medio ambiente y el ser humano.',
    },
    {
      title: 'Cuidado mutuo',
      description:
        'En nuestro grupo vivimos la frase “CUIDAR LA EMPRESA, PARA QUE LA EMPRESA NOS CUIDE”.',
    },
    {
      title: 'Excelencia y cumplimiento',
      description:
        'Con los clientes, el valor de la excelencia y el cumplimiento.',
    },
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
