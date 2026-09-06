import { TourRoom } from '../types';

export const TOTAL_TOUR_FRAMES = 80;

export const TOUR_ROOMS: TourRoom[] = [
  {
    id: 'atrio-salon',
    stepNumber: '01',
    title: 'Atrio & Gran Salón en Cantiléver',
    subtitle: 'Espacio de recepción continuo y ventanales suspendidos sobre el valle',
    frameStart: 0,
    frameEnd: 27,
    altitude: '+420 m',
    orientation: 'Sur-Suroeste',
    area: '210 m²',
    description:
      'El vuelo del dron penetra por la galería de acceso de doble altura, desvelando una transición fluida donde el hormigón blanco arquitectónico dialoga con paños de vidrio de 6,2 metros sin marcos perceptibles. El salón principal parece flotar sin apoyos sobre la pendiente natural.',
    highlights: [
      'Techos de 6,20 m de altura libre',
      'Hormigón blanco visto encofrado a tablilla',
      'Suelo radiante en piedra caliza Campaspero',
      'Chimenea lineal integrada de combustión limpia',
    ],
    materials: ['Caliza de Campaspero', 'Vidrio laminado Climalit', 'Roble ahumado natural'],
    hotspots: [
      {
        label: 'Ventanales Schüco',
        detail: 'Guías ocultas en el pavimento para apertura total sin resaltes ni interrupciones visuales.',
      },
      {
        label: 'Aislamiento Triple',
        detail: 'Coeficiente térmico Passivhaus Uw 0.65 W/m²K para máxima estabilidad climática.',
      },
      {
        label: 'Luz Cenital',
        detail: 'Lucernarios bioclimáticos motorizados con filtros UV dinámicos y sensor de lluvia.',
      },
    ],
  },
  {
    id: 'master-suite',
    stepNumber: '02',
    title: 'Master Suite & Mirador 360°',
    subtitle: 'Cámara privada en voladizo con núcleo de bienestar integrado',
    frameStart: 28,
    frameEnd: 54,
    altitude: '+426 m',
    orientation: 'Oeste (Puesta de Sol)',
    area: '145 m²',
    description:
      'Avanzando hacia el ala privada de la residencia, la cámara planea por la suite principal suspendida. Una escultura habitacional con chimenea de bioetanol suspendida, vestidor oculto de nogal y una bañera monolítica tallada en travertino romano enfrentada directamente al mar de nubes.',
    highlights: [
      'Mirador envolvente de 270° con vista al crepúsculo',
      'Bañera monolítica exenta en mármol Travertino',
      'Cama King suspendida con iluminación rasante cálida',
      'Domótica circadiana programable Lutron HomeWorks',
    ],
    materials: ['Travertino Romano Apomazado', 'Nogal Canaletto', 'Acero Corten satinado'],
    hotspots: [
      {
        label: 'Bañera Escultural',
        detail: 'Pieza única de 1.800 kg tallada artesanalmente de un solo bloque de cantera italiana.',
      },
      {
        label: 'Privacidad Acústica',
        detail: 'Atenuación acústica R48 con forjado desacoplado para un silencio absoluto.',
      },
      {
        label: 'Spa Integrado',
        detail: 'Cabina de vapor y sauna finlandesa revestida de cedro rojo aromático.',
      },
    ],
  },
  {
    id: 'terraza-infinity',
    stepNumber: '03',
    title: 'Terraza Volada & Piscina Infinita',
    subtitle: 'Vuelo de 18 metros sobre el vacío con lámina de agua de fondo de cristal',
    frameStart: 55,
    frameEnd: 79,
    altitude: '+422 m',
    orientation: 'Noroeste / Horizonte abierto',
    area: '260 m² de deck',
    description:
      'El clímax de la secuencia atraviesa los cerramientos plegables hacia la gran terraza en cantiléver. Una plataforma de madera de teca birmana que desafía la gravedad con piscina infinity de agua marina, cocina exterior con barbacoa teppanyaki y muelle certificado para aterrizaje de drones de transporte y taxis aéreos eVTOL.',
    highlights: [
      'Voladizo estructural de 18 m en acero pretensado',
      'Piscina infinity climatizada con fondo de vidrio estructural',
      'Deck en teca marina tratada con aceites biológicos',
      'Área de amarre certificada para movilidad aérea eVTOL',
    ],
    materials: ['Teca de Birmania', 'Hormigón de ultra-altas prestaciones (UHPC)', 'Vidrio estructural multilaminar'],
    hotspots: [
      {
        label: 'Fondo de Cristal',
        detail: 'Lámina de 65 mm transitada que permite contemplar el abismo y el valle bajo el agua.',
      },
      {
        label: 'Geotermia Profunda',
        detail: 'Agua marina a 28°C constante y climatización radiante durante las cuatro estaciones.',
      },
      {
        label: 'Helipuerto eVTOL',
        detail: 'Plataforma con balizamiento aeroportuario y recarga inductiva ultrarrápida de 150 kW.',
      },
    ],
  },
];
