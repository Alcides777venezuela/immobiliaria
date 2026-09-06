import { Property, RealEstateService, OfficeLocation } from '../types';

export const PROPERTIES_DATA: Property[] = [
  {
    id: 'prop-01',
    reference: 'AER-PLA-01',
    title: 'Villa Calanque Blanche',
    category: 'playa',
    categoryLabel: 'Casa de Playa & Costa',
    location: "Cap d'Antibes / Saint-Tropez",
    country: 'Francia',
    price: '24.800.000 €',
    status: 'VENTA EXCLUSIVA',
    accent: '#bcff48',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    specs: {
      builtArea: '920 m²',
      plotArea: '4.500 m²',
      bedrooms: 6,
      bathrooms: 7,
      amenities: [
        'Acceso directo a cala privada',
        'Piscina infinita volada sobre el mar',
        'Amarre náutico privado de 24m',
        'Helipuerto certificado',
        'Pabellón independiente para invitados',
      ],
    },
    summary: 'Residencia en cantiléver de piedra caliza blanca con piscina infinita volada sobre el Mediterráneo.',
    editorial:
      'Diseñada en perfecta comunión con los acantilados de la Costa Azul, Villa Calanque Blanche ofrece una experiencia sensorial irrepetible. Grandes ventanales motorizados de suelo a techo desdibujan la frontera entre los salones interiores y las terrazas de teca sobre el mar. Dispone de circuito de spa subterráneo con baño turco, cava climatizada para 1.200 botellas y garaje subterráneo para 6 vehículos de alta gama.',
  },
  {
    id: 'prop-02',
    reference: 'AER-CAM-02',
    title: "Tenuta dell'Olivo Storico",
    category: 'campo',
    categoryLabel: 'Casa de Campo & Viñedos',
    location: "Val d'Orcia, Toscana",
    country: 'Italia',
    price: '17.500.000 €',
    status: 'RESERVA SINGULAR',
    accent: '#ff5a42',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    specs: {
      builtArea: '1.350 m²',
      plotArea: '32 hectáreas',
      bedrooms: 8,
      bathrooms: 9,
      amenities: [
        'Viñedo propio con producción DOCG',
        'Olivos centenarios y almazara privada',
        'Caballerizas e instalaciones ecuestres',
        'Bodega de cata abovedada del siglo XVII',
        'Piscina climatizada entre cipreses',
      ],
    },
    summary: 'Restauración magistral del siglo XVII con instalaciones ecuestres y producción vinícola propia en colinas toscanas.',
    editorial:
      "Una joya del patrimonio rural italiano protegida por la UNESCO. La tenuta combina la sobriedad arquitectónica toscana original con un confort contemporáneo de vanguardia. La vivienda señorial principal se complementa con dos casas de invitados, almazara ecológica en funcionamiento y pabellón de cata privado. Geotermia profunda y paneles fotovoltaicos mimetizados garantizan autosuficiencia neta cero.",
  },
  {
    id: 'prop-03',
    reference: 'AER-PEN-03',
    title: 'The Crown Horizon Penthouse',
    category: 'penthouse',
    categoryLabel: 'Penthouse & Ático Urbano',
    location: "Billionaires' Row, Manhattan",
    country: 'Estados Unidos',
    price: '36.500.000 $',
    status: 'OFF-MARKET PRIVADO',
    accent: '#bcff48',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    specs: {
      builtArea: '780 m²',
      plotArea: '180 m² terrazas',
      bedrooms: 5,
      bathrooms: 6,
      amenities: [
        'Vistas panorámicas 360° a Central Park',
        'Doble altura de 7 metros en gran salón',
        'Ascensor biométrico privado directo',
        'Piscina privada climatizada en azotea',
        'Conserjería White-Glove 24 horas',
      ],
    },
    summary: 'Triplex en la cima de Manhattan con vistas directas e ininterrumpidas a Central Park y terrazas privadas de 360°.',
    editorial:
      'Un santuario en las alturas sobre el skyline neoyorquino. Sus tres niveles coronan una de las torres más prestigiosas del mundo, con revestimientos en mármol Calacatta Borghini, ebanistería a medida en roble ahumado y una terraza solárium privada con piscina de vidrio suspendida en el vacío. Seguridad biométrica de máxima categoría para diplomáticos y personalidades de alto perfil.',
  },
  {
    id: 'prop-04',
    reference: 'AER-PLA-04',
    title: 'Villa Miramar Paradiso',
    category: 'playa',
    categoryLabel: 'Casa de Playa & Acantilado',
    location: 'Costa Esmeralda, Cerdeña',
    country: 'Italia',
    price: '19.200.000 €',
    status: 'NUEVA ADQUISICIÓN',
    accent: '#ff5a42',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    specs: {
      builtArea: '840 m²',
      plotArea: '3.800 m²',
      bedrooms: 5,
      bathrooms: 6,
      amenities: [
        'Mirador volado sobre aguas turquesas',
        'Jardín de flora sarda autóctona',
        'Infinity pool de agua salada',
        'Muelle privado para lancha rápida',
        'Cava de puros y salón de cine acristalado',
      ],
    },
    summary: 'Arquitectura bioclimática integrada en granito rosa y mar turquesa frente al archipiélago de La Maddalena.',
    editorial:
      'Ubicada en una península privada de acceso restringido en Cerdeña, esta villa redefine el concepto de refugio mediterráneo. Construida con piedra de granito local pulida a mano y maderas de teca recicladas, dispone de senderos privados directos al mar, pabellón de yoga sobre el agua y sistema de iluminación circadian con tecnología suiza.',
  },
];

export const SERVICES_DATA: RealEstateService[] = [
  {
    id: 'serv-01',
    number: '01',
    tag: 'MANDATO CONFIDENCIAL',
    title: 'Adquisición Off-Market & Búsqueda Privada',
    subtitle: 'Acceso a la cartera silenciosa de inmuebles no listados',
    description:
      'Más del 60% de las transacciones de residencias singulares y trofeos arquitectónicos se cierran sin salir al mercado público. Nuestro equipo actúa bajo mandato exclusivo representando los intereses del comprador ante propietarios privados, casas nobiliarias y family offices.',
    benefits: [
      'Acceso estricto a propiedades fuera del radar comercial',
      'Negociación confidencial mandatario a mandatario',
      'Protección absoluta de identidad en cada fase',
    ],
    accent: '#bcff48',
  },
  {
    id: 'serv-02',
    number: '02',
    tag: 'ESTRUCTURACIÓN TRANSFRONTERIZA',
    title: 'Consultoría Legal, Fiscal & Urbanística',
    subtitle: 'Seguridad jurídica en transacciones patrimoniales complejas',
    description:
      'Coordinamos a los mejores despachos fiscales y notariales en cada jurisdicción. Evaluamos tratados de doble imposición, estructuras societarias patrimoniales (Holdings, Socimis, Trusts), programas de residencia por inversión (Golden Visa) y auditorías técnicas exhaustivas (Due Diligence).',
    benefits: [
      'Due Diligence legal y urbanística sin fisuras',
      'Optimización fiscal internacional y transmisión sucesoria',
      'Gestión integral de visados de residencia e inversores',
    ],
    accent: '#ff5a42',
  },
  {
    id: 'serv-03',
    number: '03',
    tag: 'MAXIMIZACIÓN PATRIMONIAL',
    title: 'Gestión Patrimonial & Alquileres de Colección',
    subtitle: 'Preservación de valor y rentabilidad en activos de ultra lujo',
    description:
      'Para propietarios que desean optimizar el rendimiento de sus residencias secundarias sin comprometer su conservación. Gestionamos estancias de alta temporada para clientela internacional verificada con conserjería 24/7 y cobertura de seguro patrimonial todo riesgo.',
    benefits: [
      'Rendimientos netos optimizados en temporadas clave',
      'Mantenimiento preventivo con gestores in-situ 365 días',
      'Filtrado y verificación estricta de inquilinos VIP',
    ],
    accent: '#bcff48',
  },
  {
    id: 'serv-04',
    number: '04',
    tag: 'PROYECTOS & ARQUITECTURA',
    title: 'Project Management & Interiorismo de Autor',
    subtitle: 'Transformación de fincas y villas con las mejores firmas globales',
    description:
      'Acompañamos desde la concepción hasta la entrega de llaves en rehabilitaciones integrales, ampliaciones de señoríos históricos o dotación de alta tecnología domótica. Colaboramos con los estudios de arquitectura e interiorismo más reputados de Milán, París y Londres.',
    benefits: [
      'Dirección técnica facultativa y control presupuestario',
      'Selección de materiales nobles y certificación energética A+',
      'Entrega llave en mano con paisajismo maduro consolidado',
    ],
    accent: '#ff5a42',
  },
];

export const AGENCY_STATS = [
  { value: '+1.450 M €', label: 'Volumen Transaccionado' },
  { value: '100%', label: 'Discreción & Cláusula NDA' },
  { value: '4 Plazas', label: 'Oficinas Privadas Activas' },
  { value: '3.8 Semanas', label: 'Tiempo Medio Off-Market' },
];

export const OFFICE_LOCATIONS: OfficeLocation[] = [
  {
    city: 'Ginebra',
    role: 'Sede Central & Banca Privada',
    address: 'Rue du Rhône 42, 1204 Genève',
    phone: '+41 22 819 9000',
    email: 'geneve@aeria-realestate.com',
    schedule: 'Lunes a Viernes 09:00 - 19:00 CET',
  },
  {
    city: 'Madrid',
    role: 'Despacho Ibérico & Latam',
    address: 'Calle de Serrano 68, Barrio de Salamanca',
    phone: '+34 91 420 8800',
    email: 'madrid@aeria-realestate.com',
    schedule: 'Lunes a Viernes 09:30 - 19:30 CET',
  },
  {
    city: 'Miami',
    role: 'Américas & Caribe',
    address: '1200 Brickell Avenue, Penthouse 2400',
    phone: '+1 305 780 4400',
    email: 'miami@aeria-realestate.com',
    schedule: 'Lunes a Viernes 09:00 - 18:00 EST',
  },
  {
    city: 'Costa del Sol',
    role: 'Oficina Costera & Náutica',
    address: 'Puerto Banús Marina 12, Marbella',
    phone: '+34 95 290 3200',
    email: 'marbella@aeria-realestate.com',
    schedule: 'Lunes a Sábado 10:00 - 20:00 CET',
  },
];
