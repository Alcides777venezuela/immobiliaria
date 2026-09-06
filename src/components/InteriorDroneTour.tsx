import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Layers,
  ChevronRight,
  Check,
  Maximize2,
  Navigation,
  Wind,
  Info,
  ArrowDownRight,
} from 'lucide-react';
import { TOUR_ROOMS, TOTAL_TOUR_FRAMES } from '../data/droneTourData';

interface InteriorDroneTourProps {
  currentFrame: number;
  activeRoomIndex: number;
  onSelectRoom: (idx: number) => void;
}

export const InteriorDroneTour: React.FC<InteriorDroneTourProps> = ({
  currentFrame,
  activeRoomIndex,
  onSelectRoom,
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<number>(0);
  const activeRoom = TOUR_ROOMS[activeRoomIndex] || TOUR_ROOMS[0];

  return (
    <section
      id="tour-interior"
      className="portfolio-section w-full flex flex-col justify-between border-t border-white/10 relative overflow-hidden"
      aria-label="Recorrido Interior con Dron - Estancias de Autor"
    >
      <div className="w-full max-w-[1400px] mx-auto flex flex-col justify-between h-full relative z-10">
        {/* Section Header */}
        <header className="mb-8 md:mb-10">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <div className="inline-flex items-center gap-2 text-[#bcff48] text-[10px] md:text-[11px] tracking-[0.18em] uppercase font-semibold portfolio-copy text-edge-dark-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#bcff48] animate-pulse" aria-hidden="true" />
              Recorrido Inmersivo / Vuelo Interior Continuo
            </div>

            {/* Room Milestone Tabs */}
            <nav
              className="flex items-center gap-1.5 p-1 rounded-[6px] bg-transparent border border-white/20"
              aria-label="Estancias del tour"
            >
              {TOUR_ROOMS.map((room, idx) => {
                const isActive = activeRoomIndex === idx;
                return (
                  <button
                    key={room.id}
                    id={`tour-nav-room-${room.id}`}
                    onClick={() => onSelectRoom(idx)}
                    className={`px-3 py-1.5 rounded-[4px] text-[11px] md:text-[12px] font-medium tracking-[0.06em] transition-all flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-[#f7f7f2] text-[#080a0e] shadow-lg font-bold scale-[1.02]'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                    aria-pressed={isActive}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? 'bg-[#ff5a42]' : 'bg-white/40'
                      }`}
                    />
                    <span>
                      {room.stepNumber}. {room.title.split('&')[0].trim()}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h2 className="section-heading text-[#f7f7f2] m-0 p-0 max-w-[850px] text-edge-dark">
              Vuelo de autor /<br />
              <span><em>tres estancias en cantiléver.</em></span>
            </h2>
            <p className="portfolio-copy text-[#f7f7f2]/85 text-[11.5px] md:text-[12px] font-normal leading-[1.65] max-w-[380px] m-0 text-edge-dark-sm">
              El vuelo del dron progresa fluidamente con su desplazamiento vertical a lo largo de toda la página. Cada sección sincroniza la óptica de la cámara con la materialidad de la arquitectura.
            </p>
          </div>
        </header>

        {/* Active Architectural Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-4">
          {/* Left Column: Architectural Overview & Specs */}
          <div className="lg:col-span-7 bg-transparent border border-white/20 rounded-[12px] p-6 sm:p-8">
            {/* Room Badge */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[11px] font-mono text-[#ff5a42] font-bold tracking-widest uppercase bg-transparent px-2.5 py-1 rounded-[4px] border border-[#ff5a42]/60 text-edge-dark-sm">
                ESTANCIA {activeRoom.stepNumber} DE 03
              </span>
              <span className="text-white/40">|</span>
              <span className="text-[11px] font-mono text-[#bcff48] uppercase tracking-wider text-edge-dark-sm">
                Superficie: {activeRoom.area}
              </span>
              <span className="text-white/40">|</span>
              <span className="text-[11px] font-mono text-white/80 uppercase text-edge-dark-sm">
                {activeRoom.orientation}
              </span>
            </div>

            {/* Room Title */}
            <h3 className="text-[26px] sm:text-[32px] font-bold tracking-tight text-white leading-tight mb-2 text-edge-dark">
              {activeRoom.title}
            </h3>

            {/* Subtitle */}
            <p className="text-[13px] md:text-[14px] text-[#bcff48] font-medium tracking-[0.02em] mb-4 text-edge-dark">
              {activeRoom.subtitle}
            </p>

            {/* Description */}
            <p className="text-[12.5px] md:text-[13.5px] text-white/90 leading-[1.7] mb-6 font-normal text-edge-dark-sm">
              {activeRoom.description}
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
              {activeRoom.highlights.map((highlight, hIdx) => (
                <div
                  key={hIdx}
                  className="flex items-start gap-2.5 p-2.5 rounded-[6px] bg-transparent border border-white/20 text-[11.5px] text-white/95 text-edge-dark-sm hover:border-white/40 transition-all"
                >
                  <Check className="w-3.5 h-3.5 text-[#bcff48] shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>

            {/* Materiality Palette */}
            <div className="border-t border-white/20 pt-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-white/80 text-edge-dark-sm">
                  Paleta de Materiales & Acabados Nobles
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {activeRoom.materials.map((mat, mIdx) => (
                  <span
                    key={mIdx}
                    className="text-[10.5px] px-2.5 py-1 rounded-[4px] bg-transparent text-white border border-white/20 font-medium text-edge-dark-sm"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Hotspots & Drone Optics */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Interactive Hotspots Card */}
            <div className="bg-transparent border border-white/20 rounded-[12px] p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#bcff48] font-semibold flex items-center gap-1.5 text-edge-dark-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  Detalles Técnicos & Puntos Clave
                </span>
                <span className="text-[10px] font-mono text-white/70 text-edge-dark-sm">
                  3 Hotspots Registrados
                </span>
              </div>

              <div className="space-y-2.5">
                {activeRoom.hotspots.map((hs, sIdx) => {
                  const isSelected = selectedHotspot === sIdx;
                  return (
                    <button
                      key={sIdx}
                      onClick={() => setSelectedHotspot(sIdx)}
                      className={`w-full p-3.5 rounded-[8px] text-left transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-transparent border-[#bcff48] text-white shadow-md'
                          : 'bg-transparent border-white/20 text-white/90 hover:text-white hover:border-white/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-[12px] text-[#f7f7f2] text-edge-dark-sm">
                          {hs.label}
                        </span>
                        <ChevronRight
                          className={`w-3.5 h-3.5 transition-transform ${
                            isSelected ? 'text-[#bcff48] translate-x-0.5' : 'text-white/50'
                          }`}
                        />
                      </div>
                      <p className="text-[11px] text-white/80 leading-[1.55] m-0 text-edge-dark-sm">
                        {hs.detail}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Action Fly Pill */}
            <div className="bg-transparent border border-white/20 rounded-[12px] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold text-white text-edge-dark-sm">
                  Exploración Continua por Scroll
                </div>
                <div className="text-[10px] text-white/75 text-edge-dark-sm">
                  Deslice hacia arriba o hacia abajo para mover el dron en el espacio
                </div>
              </div>

              <button
                onClick={() => onSelectRoom(activeRoomIndex)}
                className="px-4 py-2 rounded-[6px] bg-[#bcff48] text-[#080a0e] font-bold text-[10.5px] uppercase tracking-[0.08em] hover:bg-white transition-all shadow-md shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <span>Sincronizar Cámara</span>
                <ArrowDownRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Baseline */}
        <footer className="mt-8 pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#f7f7f2]/70 portfolio-copy text-edge-dark-sm">
          <span>CINEMATOGRAFÍA AÉREA DE ULTRA ALTA DEFINICIÓN</span>
          <span>SINCRONIZACIÓN MILIMÉTRICA CON ESTRUCTURA ARQUITECTÓNICA</span>
        </footer>
      </div>
    </section>
  );
};
