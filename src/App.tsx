import React, { useEffect, useRef, useState } from 'react';
import {
  MapPin,
  Maximize2,
  Bed,
  Bath,
  ArrowUpRight,
  ShieldCheck,
  Compass,
  TrendingUp,
  Layers,
  Phone,
  Mail,
  Clock,
  Sparkles,
  CheckCircle2,
  Send,
  SlidersHorizontal,
} from 'lucide-react';
import { Property, PropertyCategory, AdvisoryInquiry } from './types';
import {
  PROPERTIES_DATA,
  SERVICES_DATA,
  AGENCY_STATS,
  OFFICE_LOCATIONS,
} from './data/realEstateData';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { InteriorDroneTour } from './components/InteriorDroneTour';
import { GlobalDroneFlight } from './components/GlobalDroneFlight';
import { TOTAL_TOUR_FRAMES, TOUR_ROOMS } from './data/droneTourData';

export default function App() {
  const heroRef = useRef<HTMLElement>(null);
  const propiedadesRef = useRef<HTMLElement>(null);
  const asesoriaRef = useRef<HTMLElement>(null);
  const contactoRef = useRef<HTMLElement>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isPropiedadesVisible, setIsPropiedadesVisible] = useState(false);
  const [isAsesoriaVisible, setIsAsesoriaVisible] = useState(false);
  const [isContactoVisible, setIsContactoVisible] = useState(false);

  // Drone flight state synchronized across the whole website
  const [droneFrame, setDroneFrame] = useState<number>(0);
  const [activeRoomIndex, setActiveRoomIndex] = useState<number>(0);

  const handleSelectRoom = (idx: number) => {
    const room = TOUR_ROOMS[idx];
    if (!room) return;
    const targetFrame = room.frameStart + 2;
    const progress = targetFrame / (TOTAL_TOUR_FRAMES - 1);
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: progress * maxScroll,
      behavior: 'smooth',
    });
  };

  // Property filtering and modal states
  const [activeCategory, setActiveCategory] = useState<PropertyCategory>('todas');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Advisory Inquiry Form State
  const [inquiryForm, setInquiryForm] = useState<AdvisoryInquiry>({
    intent: 'comprar',
    name: '',
    email: '',
    phone: '',
    propertyType: 'Casa de Playa',
    budgetRange: '5M € - 15M €',
    notes: '',
  });
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryReference, setInquiryReference] = useState('');

  useEffect(() => {
    // Check user preference for reduced motion
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionMediaQuery.matches);
    if (motionMediaQuery.matches) {
      setIsPropiedadesVisible(true);
      setIsAsesoriaVisible(true);
      setIsContactoVisible(true);
    }

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) {
        setIsPropiedadesVisible(true);
        setIsAsesoriaVisible(true);
        setIsContactoVisible(true);
      }
    };

    if (motionMediaQuery.addEventListener) {
      motionMediaQuery.addEventListener('change', handleMotionChange);
    } else {
      motionMediaQuery.addListener(handleMotionChange);
    }

    // IntersectionObserver for Section entrance animations (opacity + 18px ascent, 0.8s)
    if (!motionMediaQuery.matches) {
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (entry.target === propiedadesRef.current) setIsPropiedadesVisible(true);
              if (entry.target === asesoriaRef.current) setIsAsesoriaVisible(true);
              if (entry.target === contactoRef.current) setIsContactoVisible(true);
            }
          });
        },
        { threshold: 0.1 }
      );

      if (propiedadesRef.current) sectionObserver.observe(propiedadesRef.current);
      if (asesoriaRef.current) sectionObserver.observe(asesoriaRef.current);
      if (contactoRef.current) sectionObserver.observe(contactoRef.current);

      return () => {
        sectionObserver.disconnect();
        if (motionMediaQuery.removeEventListener) {
          motionMediaQuery.removeEventListener('change', handleMotionChange);
        } else {
          motionMediaQuery.removeListener(handleMotionChange);
        }
      };
    }

    return () => {
      if (motionMediaQuery.removeEventListener) {
        motionMediaQuery.removeEventListener('change', handleMotionChange);
      } else {
        motionMediaQuery.removeListener(handleMotionChange);
      }
    };
  }, []);

  const filteredProperties = PROPERTIES_DATA.filter((prop) => {
    if (activeCategory === 'todas') return true;
    return prop.category === activeCategory;
  });

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inquiryForm.name.trim() && inquiryForm.email.trim()) {
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      setInquiryReference(`AER-2026-${randomCode}`);
      setInquirySubmitted(true);
    }
  };

  const handleScheduleVisitFromModal = (property: Property) => {
    setInquiryForm((prev) => ({
      ...prev,
      intent: 'comprar',
      propertyType: property.categoryLabel,
      notes: `Solicito coordinar visita privada para ${property.title} (${property.reference}).`,
    }));
    // Smooth scroll to contact section
    const contactEl = document.getElementById('contacto');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'serv-01':
        return <Compass className="w-4 h-4 text-[#bcff48]" />;
      case 'serv-02':
        return <ShieldCheck className="w-4 h-4 text-[#ff5a42]" />;
      case 'serv-03':
        return <TrendingUp className="w-4 h-4 text-[#bcff48]" />;
      case 'serv-04':
        return <Layers className="w-4 h-4 text-[#ff5a42]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#bcff48]" />;
    }
  };

  return (
    <main className="w-full min-h-[100svh] overflow-x-hidden bg-transparent text-[#f7f7f2] relative">
      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onScheduleVisit={handleScheduleVisitFromModal}
      />

      {/* 
        GLOBAL DRONE FLIGHT BACKGROUND CANVAS & TELEMETRY HUD 
        Controls drone flight from Section 1 (Hero) to Section 5 (Contacto) and vice versa!
      */}
      <GlobalDroneFlight
        currentFrame={droneFrame}
        setCurrentFrame={setDroneFrame}
        activeRoomIndex={activeRoomIndex}
        setActiveRoomIndex={setActiveRoomIndex}
      />

      {/* Hero Section */}
      <section
        id="hero-section"
        ref={heroRef}
        className="hero-container"
        aria-label="AERIA - Inmobiliaria Internacional de Casas de Lujo"
      >
        {/* .hero-edge gradient layer between video/image and text */}
        <div id="hero-edge-overlay" className="hero-edge" aria-hidden="true" />

        {/* Header / Brand & Navigation */}
        <header
          id="hero-top-bar"
          className="relative z-20 w-full max-w-[1400px] mx-auto pt-7 md:pt-9 px-6 md:px-12 flex items-center justify-between anim-nav"
        >
          <a
            id="hero-brand-link"
            href="#hero-section"
            className="section-brand text-white font-medium text-[16px] md:text-[17px] tracking-[0.24em] uppercase transition-opacity hover:opacity-85 hero-text-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-[4px]"
            aria-label="Aeria - Casas de Lujo"
          >
            AERIA
          </a>

          <nav id="hero-main-nav" className="hero-nav flex items-center gap-7 md:gap-9" aria-label="Navegación principal">
            <a
              id="nav-link-propiedades"
              href="#propiedades"
              className="section-nav text-white/90 text-[12px] md:text-[13px] tracking-[0.14em] uppercase font-medium hover:text-white transition-colors hero-text-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-[4px] py-1 px-1.5"
            >
              Propiedades
            </a>
            <a
              id="nav-link-tour-interior"
              href="#tour-interior"
              className="section-nav text-white/90 text-[12px] md:text-[13px] tracking-[0.14em] uppercase font-medium hover:text-white transition-colors hero-text-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-[4px] py-1 px-1.5 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#bcff48] animate-pulse" />
              Tour Dron
            </a>
            <a
              id="nav-link-asesoria"
              href="#asesoria"
              className="section-nav text-white/90 text-[12px] md:text-[13px] tracking-[0.14em] uppercase font-medium hover:text-white transition-colors hero-text-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-[4px] py-1 px-1.5"
            >
              Asesoría
            </a>
            <a
              id="nav-link-contacto"
              href="#contacto"
              className="section-nav text-white/90 text-[12px] md:text-[13px] tracking-[0.14em] uppercase font-medium hover:text-white transition-colors hero-text-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-[4px] py-1 px-1.5"
            >
              Contacto
            </a>
          </nav>
        </header>

        {/* Hero Content: Centered at 110px top on desktop, max width 900px */}
        <div id="hero-content-wrapper" className="hero-content-desktop">
          <div className="flex flex-col items-center justify-center">
            {/* H1 Title: White with subtle soft shadow (25% reduced scale) */}
            <h1 id="hero-main-title" className="section-title hero-title anim-title m-0 p-0 text-center tracking-tight text-white">
              Casas de autor en
              <span className="block mt-[-2px] md:mt-[-4px]">
                <em>lugares increíbles.</em>
              </span>
            </h1>

            {/* Subtitle: Single line on desktop */}
            <p
              id="hero-copy-text"
              className="section-copy anim-copy hero-subtitle text-[11.5px] sm:text-[12px] md:text-[12.75px] leading-[1.6] max-w-full md:whitespace-nowrap mx-auto mt-4 md:mt-5 font-normal text-center tracking-[0.02em] px-3"
            >
              Villas privadas concebidas en los paisajes más extraordinarios del planeta.
            </p>

            {/* Action buttons (25% reduced scale) */}
            <div className="anim-action mt-6 md:mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                id="hero-cta-button"
                href="#propiedades"
                className="section-btn group inline-flex items-center justify-center bg-white text-[#0a1824] hover:bg-[#f2f8fc] active:bg-[#e2eef6] transition-all duration-200 px-5 py-2.5 rounded-[5px] text-[10px] tracking-[0.1em] uppercase font-semibold shadow-[0_4px_20px_rgba(0,0,0,0.45)] hover:shadow-[0_6px_26px_rgba(0,0,0,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              >
                <span>Descubrir Colección</span>
              </a>
              <a
                id="hero-tour-button"
                href="#tour-interior"
                className="section-btn group inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/25 transition-all duration-200 px-4 py-2.5 rounded-[5px] text-[10px] tracking-[0.1em] uppercase font-semibold backdrop-blur-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-[#bcff48]" />
                <span>Tour Interior Dron</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom subtle baseline stats */}
        <footer
          id="hero-bottom-footer"
          className="relative z-20 w-full max-w-[1400px] mx-auto pb-7 md:pb-8 px-6 md:px-12 flex items-center justify-between anim-footer"
        >
          <div className="w-full flex items-center justify-between pt-4 border-t border-white/20 text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-white/80 font-medium section-footer hero-text-shadow">
            <span id="hero-stat-ubicacion" className="inline-flex items-center">
              COLECCIÓN PRIVADA INTERNACIONAL
            </span>
            <span id="hero-stat-latitud" className="inline-flex items-center">
              GINEBRA · MADRID · MIAMI
            </span>
          </div>
        </footer>
      </section>

      {/* SECCIÓN 2: Propiedades & Casas de Lujo en Venta */}
      <section
        id="propiedades"
        ref={propiedadesRef}
        className="portfolio-section w-full flex flex-col justify-between border-t border-white/10"
        aria-label="Propiedades y Casas de Lujo en Venta"
      >
        <div
          className={`w-full max-w-[1400px] mx-auto flex flex-col justify-between h-full portfolio-reveal ${
            isPropiedadesVisible ? 'is-visible' : ''
          }`}
        >
          {/* Header */}
          <header className="mb-8 md:mb-10">
            <div className="flex items-center gap-2 text-[#bcff48] text-[10px] md:text-[11px] tracking-[0.18em] uppercase font-semibold mb-3 portfolio-copy">
              <span className="w-1.5 h-1.5 rounded-full bg-[#bcff48] animate-pulse" aria-hidden="true" />
              Catálogo Inmobiliario / Colección 2026
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <h2 className="section-heading text-[#f7f7f2] m-0 p-0 max-w-[850px]">
                Residencias singulares /<br />
                <span><em>costas, campos y cielos.</em></span>
              </h2>
              <p className="portfolio-copy text-[#f7f7f2]/65 text-[11px] md:text-[11.5px] font-normal leading-[1.65] max-w-[360px] m-0">
                Selección de villas frente al mar, fincas toscanas centenarias y penthouses en capitales globales. Comercialización privada con reserva de identidad.
              </p>
            </div>

            {/* Filter Pills with subtle transitions */}
            <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
              <div className="flex items-center gap-1.5 text-[10px] tracking-[0.14em] uppercase text-[#f7f7f2]/40 mr-2 font-medium">
                <SlidersHorizontal className="w-3 h-3" />
                <span>Tipología:</span>
              </div>

              {[
                { key: 'todas', label: 'Todas las Propiedades', count: 4 },
                { key: 'playa', label: 'Casas de Playa & Costa', count: 2 },
                { key: 'campo', label: 'Casas de Campo & Viñedos', count: 1 },
                { key: 'penthouse', label: 'Penthouses Urbanos', count: 1 },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveCategory(tab.key as PropertyCategory)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[4px] text-[10px] tracking-[0.08em] uppercase font-medium transition-all duration-200 cursor-pointer ${
                    activeCategory === tab.key
                      ? 'bg-white text-[#0a0c10] shadow-[0_2px_12px_rgba(255,255,255,0.2)] font-semibold'
                      : 'bg-black/40 hover:bg-black/60 text-[#f7f7f2]/70 border border-white/10 backdrop-blur-xs'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                      activeCategory === tab.key
                        ? 'bg-[#0a0c10]/15 text-[#0a0c10]'
                        : 'bg-white/10 text-[#f7f7f2]/50'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </header>

          {/* Properties Grid: 4 columns desktop, 2 columns mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px] w-full">
            {filteredProperties.map((property) => (
              <article
                key={property.id}
                id={`property-card-${property.id}`}
                onClick={() => setSelectedProperty(property)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedProperty(property);
                  }
                }}
                tabIndex={0}
                className="property-card group flex flex-col cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bcff48] rounded-[8px] p-1 bg-black/50 backdrop-blur-md border border-white/15 hover:border-white/30 hover:bg-black/65 shadow-xl transition-all"
                aria-label={`Ver detalles de ${property.title}`}
              >
                {/* Image Container with subtle zoom effect */}
                <div className="property-image-container">
                  <img
                    src={property.imageUrl}
                    alt={property.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="property-img w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Status badge */}
                  <div
                    className="absolute top-3 right-3 text-[9px] tracking-[0.14em] uppercase font-semibold px-2 py-0.5 rounded-[4px] bg-[#0c0e12]/85 backdrop-blur-xs border border-white/15"
                    style={{ color: property.accent }}
                  >
                    {property.status}
                  </div>

                  {/* Location badge on image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] text-white">
                    <div className="flex items-center gap-1.5 truncate bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-[3px] border border-white/10">
                      <MapPin className="w-3 h-3 text-[#bcff48] shrink-0" />
                      <span className="truncate">{property.location}</span>
                    </div>
                  </div>
                </div>

                {/* Information Under Image */}
                <div className="pt-3 px-1 pb-1 flex flex-col gap-1 portfolio-copy">
                  <div className="flex items-center justify-between text-[10px] tracking-[0.16em] uppercase">
                    <span className="font-bold text-[#f7f7f2]/50">
                      {property.categoryLabel}
                    </span>
                    <span className="font-mono text-[#bcff48] font-bold">
                      {property.price}
                    </span>
                  </div>

                  <h3 className="text-[14px] md:text-[15px] font-bold text-[#f7f7f2] tracking-tight leading-snug group-hover:text-white transition-colors m-0 flex items-center justify-between">
                    <span>{property.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#bcff48] shrink-0" />
                  </h3>

                  <p className="text-[11px] text-[#f7f7f2]/60 font-normal leading-relaxed m-0 line-clamp-2">
                    {property.summary}
                  </p>

                  {/* Key specs row */}
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#f7f7f2]/60">
                    <span className="flex items-center gap-1">
                      <Maximize2 className="w-2.5 h-2.5 text-[#bcff48]" />
                      {property.specs.builtArea}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bed className="w-2.5 h-2.5 text-[#bcff48]" />
                      {property.specs.bedrooms} Suites
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-2.5 h-2.5 text-[#bcff48]" />
                      {property.specs.bathrooms} Baños
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Environmental parameters footer */}
          <footer className="mt-10 md:mt-12 pt-4 border-t border-[#f7f7f2]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#f7f7f2]/50 portfolio-copy">
            <span>RESIDENCIAS PRIVADAS EN VENTA</span>
            <span>AUDITORÍA Y CERTIFICACIÓN A+ GARANTIZADA</span>
          </footer>
        </div>
      </section>

      {/* SECCIÓN 3: Experiencia Inmersiva de Vuelo Interior con Dron (3 Estancias Arquitectónicas) */}
      <InteriorDroneTour
        currentFrame={droneFrame}
        activeRoomIndex={activeRoomIndex}
        onSelectRoom={handleSelectRoom}
      />

      {/* SECCIÓN 4: Asesoría en Bienes Raíces Internacionales */}
      <section
        id="asesoria"
        ref={asesoriaRef}
        className="portfolio-section w-full flex flex-col justify-between border-t border-white/10"
        aria-label="Servicios de Asesoría en Bienes Raíces"
      >
        <div
          className={`w-full max-w-[1400px] mx-auto flex flex-col justify-between h-full portfolio-reveal ${
            isAsesoriaVisible ? 'is-visible' : ''
          }`}
        >
          {/* Header */}
          <header className="mb-10 md:mb-12">
            <div className="flex items-center gap-2 text-[#ff5a42] text-[10px] md:text-[11px] tracking-[0.18em] uppercase font-semibold mb-3 portfolio-copy">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a42] animate-pulse" aria-hidden="true" />
              Brokerage & Family Office / Red Internacional
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <h2 className="section-heading text-[#f7f7f2] m-0 p-0 max-w-[850px]">
                Asesoría patrimonial /<br />
                <span><em>bienes raíces transfronterizos.</em></span>
              </h2>
              <p className="portfolio-copy text-[#f7f7f2]/65 text-[11px] md:text-[11.5px] font-normal leading-[1.65] max-w-[360px] m-0">
                Acompañamiento integral para compradores privados, fondos soberanos y family offices en la estructuración, adquisición y gestión de activos de alta gama.
              </p>
            </div>
          </header>

          {/* 4 Advisory Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[12px] w-full mb-10">
            {SERVICES_DATA.map((service) => (
              <div
                key={service.id}
                id={`service-${service.id}`}
                className="service-card flex flex-col justify-between p-6 rounded-[8px] border border-white/15 bg-black/50 backdrop-blur-md hover:bg-black/65 shadow-xl transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-7 h-7 rounded-[4px] bg-white/5 border border-white/10 flex items-center justify-center">
                      {getServiceIcon(service.id)}
                    </div>
                    <span className="text-[9px] tracking-[0.14em] uppercase font-mono font-bold px-2 py-0.5 rounded-[3px] bg-white/5 text-[#f7f7f2]/60">
                      {service.number}
                    </span>
                  </div>

                  <div
                    className="text-[9px] tracking-[0.14em] uppercase font-semibold mb-1"
                    style={{ color: service.accent }}
                  >
                    {service.tag}
                  </div>

                  <h3 className="text-[15px] md:text-[16px] font-bold text-[#f7f7f2] tracking-tight leading-snug mb-2">
                    {service.title}
                  </h3>

                  <p className="text-[11px] text-[#f7f7f2]/60 leading-[1.6] font-normal mb-4">
                    {service.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-1.5">
                  {service.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[10px] text-[#f7f7f2]/75">
                      <span className="w-1 h-1 rounded-full bg-[#bcff48] mt-1.5 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Real Estate Trust Statistics Banner */}
          <div className="w-full p-5 md:p-6 rounded-[8px] bg-gradient-to-r from-black/60 via-black/45 to-black/60 backdrop-blur-md border border-white/15 shadow-xl grid grid-cols-2 lg:grid-cols-4 gap-6">
            {AGENCY_STATS.map((stat, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-[20px] md:text-[24px] font-bold tracking-tight text-white font-mono">
                  {stat.value}
                </span>
                <span className="text-[10px] tracking-[0.12em] uppercase text-[#f7f7f2]/50 mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom baseline */}
          <footer className="mt-10 md:mt-12 pt-4 border-t border-[#f7f7f2]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#f7f7f2]/50 portfolio-copy">
            <span>MIEMBROS DE LA ASOCIACIÓN INTERNACIONAL DE BROKERS DE LUJO</span>
            <span>MANDATOS REGULADOS BAJO SECRETO PROFESIONAL</span>
          </footer>
        </div>
      </section>

      {/* SECCIÓN 5: Asesoría Privada & Contáctanos */}
      <section
        id="contacto"
        ref={contactoRef}
        className="portfolio-section w-full flex flex-col justify-between border-t border-white/10"
        aria-label="Contacto y Asesoría Privada"
      >
        <div
          className={`w-full max-w-[1400px] mx-auto flex flex-col justify-between h-full portfolio-reveal ${
            isContactoVisible ? 'is-visible' : ''
          }`}
        >
          {/* Header */}
          <header className="mb-10 md:mb-12">
            <div className="flex items-center gap-2 text-[#bcff48] text-[10px] md:text-[11px] tracking-[0.18em] uppercase font-semibold mb-3 portfolio-copy">
              <span className="w-1.5 h-1.5 rounded-full bg-[#bcff48] animate-pulse" aria-hidden="true" />
              Atención Personalizada / Despacho Privado
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <h2 className="section-heading text-[#f7f7f2] m-0 p-0 max-w-[850px]">
                Inicie su búsqueda /<br />
                <span><em>o comercialice su propiedad.</em></span>
              </h2>
              <p className="portfolio-copy text-[#f7f7f2]/65 text-[11px] md:text-[11.5px] font-normal leading-[1.65] max-w-[360px] m-0">
                Coordinamos reuniones privadas en nuestras oficinas de Ginebra, Madrid o Miami, así como visitas guiadas in-situ o por transporte aéreo privado.
              </p>
            </div>
          </header>

          {/* Contact Layout: Interactive Form + Offices Directory */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            {/* Form Column (7 cols) */}
            <div className="lg:col-span-7 bg-black/55 backdrop-blur-md p-6 md:p-8 rounded-[8px] border border-white/15 shadow-2xl">
              <div className="mb-6">
                <div className="text-[10px] tracking-[0.16em] uppercase text-[#bcff48] font-semibold mb-1">
                  Mandato de Asesoría Inmobiliaria
                </div>
                <h3 className="text-[17px] md:text-[19px] font-bold text-white tracking-tight">
                  Formulario de Contacto Confidencial
                </h3>
              </div>

              {inquirySubmitted ? (
                <div
                  id="inquiry-success-box"
                  className="p-6 rounded-[6px] bg-[#122316] border border-[#bcff48]/30 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2 text-[#bcff48] text-[14px] font-bold">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>Solicitud de Asesoría Registrada con Éxito</span>
                  </div>
                  <p className="text-[11.5px] text-[#f7f7f2]/80 leading-relaxed m-0">
                    Su expediente confidencial ha sido asignado al código{' '}
                    <strong className="text-white font-mono">{inquiryReference}</strong>. Un Senior Managing Partner de nuestra división de bienes raíces le contactará en menos de 12 horas laborables.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setInquirySubmitted(false);
                      setInquiryForm({
                        intent: 'comprar',
                        name: '',
                        email: '',
                        phone: '',
                        propertyType: 'Casa de Playa',
                        budgetRange: '5M € - 15M €',
                        notes: '',
                      });
                    }}
                    className="self-start mt-2 text-[10px] uppercase tracking-[0.12em] font-semibold text-[#bcff48] underline cursor-pointer hover:opacity-80"
                  >
                    Enviar otra consulta
                  </button>
                </div>
              ) : (
                <form id="advisory-inquiry-form" onSubmit={handleInquirySubmit} className="space-y-4">
                  {/* Intent selector pills */}
                  <div>
                    <label className="block text-[10px] tracking-[0.12em] uppercase text-[#f7f7f2]/60 font-medium mb-2">
                      Finalidad de la Consulta
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'comprar', label: 'Deseo Comprar' },
                        { id: 'vender', label: 'Deseo Vender' },
                        { id: 'patrimonio', label: 'Gestión / Rentas' },
                        { id: 'off-market', label: 'Off-Market Privado' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            setInquiryForm((prev) => ({
                              ...prev,
                              intent: item.id as AdvisoryInquiry['intent'],
                            }))
                          }
                          className={`px-2.5 py-2 rounded-[4px] text-[10px] tracking-[0.06em] font-medium transition-colors text-center cursor-pointer ${
                            inquiryForm.intent === item.id
                              ? 'bg-white text-[#0a0c10] font-semibold shadow-xs'
                              : 'bg-[#181b22] text-[#f7f7f2]/60 hover:bg-[#20242e] border border-white/5'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="inquiry-name"
                        className="block text-[10px] tracking-[0.12em] uppercase text-[#f7f7f2]/60 font-medium mb-1.5"
                      >
                        Nombre y Apellidos *
                      </label>
                      <input
                        id="inquiry-name"
                        type="text"
                        required
                        value={inquiryForm.name}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                        placeholder="Ej. Carlos de Borbón"
                        className="w-full px-3.5 py-2.5 rounded-[5px] bg-[#171a21] border border-white/15 text-[#f7f7f2] placeholder-[#f7f7f2]/30 text-[11px] focus:outline-none focus:border-[#bcff48] focus:ring-1 focus:ring-[#bcff48] transition-colors"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="inquiry-email"
                        className="block text-[10px] tracking-[0.12em] uppercase text-[#f7f7f2]/60 font-medium mb-1.5"
                      >
                        Correo Electrónico Privado *
                      </label>
                      <input
                        id="inquiry-email"
                        type="email"
                        required
                        value={inquiryForm.email}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                        placeholder="contacto@patrimonio.com"
                        className="w-full px-3.5 py-2.5 rounded-[5px] bg-[#171a21] border border-white/15 text-[#f7f7f2] placeholder-[#f7f7f2]/30 text-[11px] focus:outline-none focus:border-[#bcff48] focus:ring-1 focus:ring-[#bcff48] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone and Property Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="inquiry-phone"
                        className="block text-[10px] tracking-[0.12em] uppercase text-[#f7f7f2]/60 font-medium mb-1.5"
                      >
                        Teléfono / WhatsApp (con prefijo)
                      </label>
                      <input
                        id="inquiry-phone"
                        type="tel"
                        value={inquiryForm.phone}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                        placeholder="+34 600 000 000"
                        className="w-full px-3.5 py-2.5 rounded-[5px] bg-[#171a21] border border-white/15 text-[#f7f7f2] placeholder-[#f7f7f2]/30 text-[11px] focus:outline-none focus:border-[#bcff48] focus:ring-1 focus:ring-[#bcff48] transition-colors"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="inquiry-property-type"
                        className="block text-[10px] tracking-[0.12em] uppercase text-[#f7f7f2]/60 font-medium mb-1.5"
                      >
                        Tipología de Interés
                      </label>
                      <select
                        id="inquiry-property-type"
                        value={inquiryForm.propertyType}
                        onChange={(e) =>
                          setInquiryForm({ ...inquiryForm, propertyType: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-[5px] bg-[#171a21] border border-white/15 text-[#f7f7f2] text-[11px] focus:outline-none focus:border-[#bcff48] focus:ring-1 focus:ring-[#bcff48] transition-colors"
                      >
                        <option value="Casa de Playa">Casa de Playa & Costa</option>
                        <option value="Casa de Campo">Casa de Campo & Finca</option>
                        <option value="Penthouse Urbano">Penthouse & Ático Urbano</option>
                        <option value="Retiro de Montaña">Retiro Alpino / Montaña</option>
                        <option value="Isla Privada">Isla Privada</option>
                      </select>
                    </div>
                  </div>

                  {/* Budget range */}
                  <div>
                    <label
                      htmlFor="inquiry-budget"
                      className="block text-[10px] tracking-[0.12em] uppercase text-[#f7f7f2]/60 font-medium mb-1.5"
                    >
                      Rango de Inversión Estimado
                    </label>
                    <select
                      id="inquiry-budget"
                      value={inquiryForm.budgetRange}
                      onChange={(e) =>
                        setInquiryForm({ ...inquiryForm, budgetRange: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-[5px] bg-[#171a21] border border-white/15 text-[#f7f7f2] text-[11px] focus:outline-none focus:border-[#bcff48] focus:ring-1 focus:ring-[#bcff48] transition-colors"
                    >
                      <option value="< 5M €">&lt; 5.000.000 €</option>
                      <option value="5M € - 15M €">5.000.000 € - 15.000.000 €</option>
                      <option value="15M € - 30M €">15.000.000 € - 30.000.000 €</option>
                      <option value="> 30M €">&gt; 30.000.000 € (Ultra High-End)</option>
                    </select>
                  </div>

                  {/* Notes */}
                  <div>
                    <label
                      htmlFor="inquiry-notes"
                      className="block text-[10px] tracking-[0.12em] uppercase text-[#f7f7f2]/60 font-medium mb-1.5"
                    >
                      Requerimientos Específicos / Ubicaciones Deseadas
                    </label>
                    <textarea
                      id="inquiry-notes"
                      rows={3}
                      value={inquiryForm.notes}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, notes: e.target.value })}
                      placeholder="Describa el perfil de la residencia, preferencias geográficas, metros de parcela o exigencias de privacidad..."
                      className="w-full px-3.5 py-2.5 rounded-[5px] bg-[#171a21] border border-white/15 text-[#f7f7f2] placeholder-[#f7f7f2]/30 text-[11px] focus:outline-none focus:border-[#bcff48] focus:ring-1 focus:ring-[#bcff48] transition-colors"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[9px] tracking-[0.12em] uppercase text-[#f7f7f2]/40">
                      DATOS PROTEGIDOS POR LEY SUIZA DE CONFIDENCIALIDAD
                    </span>
                    <button
                      id="inquiry-submit-btn"
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[5px] bg-white text-[#0a1824] hover:bg-[#f2f8fc] active:bg-[#e2eef6] transition-all text-[10px] tracking-[0.1em] uppercase font-semibold cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
                    >
                      <Send className="w-3 h-3" />
                      <span>Coordinar Asesoría</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Offices & Global Presence Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
              <div className="text-[10px] tracking-[0.16em] uppercase text-[#ff5a42] font-semibold mb-1">
                Presencia y Despachos Privados
              </div>

              {OFFICE_LOCATIONS.map((office, idx) => (
                <div
                  key={idx}
                  id={`office-${idx}`}
                  className="p-4 rounded-[6px] bg-black/50 backdrop-blur-md border border-white/15 flex flex-col gap-1.5 hover:border-white/30 hover:bg-black/65 transition-colors shadow-lg"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-white tracking-wide">{office.city}</span>
                    <span className="text-[9px] tracking-[0.12em] uppercase text-[#bcff48] font-mono">
                      {office.role}
                    </span>
                  </div>
                  <div className="text-[10.5px] text-[#f7f7f2]/70 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#f7f7f2]/40 shrink-0" />
                    <span>{office.address}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-[#f7f7f2]/60">
                    <a
                      href={`tel:${office.phone.replace(/\s+/g, '')}`}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <Phone className="w-2.5 h-2.5 text-[#bcff48]" />
                      <span>{office.phone}</span>
                    </a>
                    <div className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-[#f7f7f2]/40" />
                      <span>{office.schedule}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Global Footer */}
          <footer className="mt-10 pt-6 border-t border-[#f7f7f2]/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] md:text-[11px] tracking-[0.16em] uppercase text-[#f7f7f2]/40 portfolio-copy">
            <div className="flex items-center gap-4">
              <span className="font-bold text-[#f7f7f2]/80">AERIA PRIVATE REAL ESTATE</span>
              <span>© 2026 TODOS LOS DERECHOS RESERVADOS</span>
            </div>
            <div className="flex items-center gap-6">
              <span>Ginebra</span>
              <span>·</span>
              <span>Madrid</span>
              <span>·</span>
              <span>Miami</span>
              <span>·</span>
              <span>Marbella</span>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
