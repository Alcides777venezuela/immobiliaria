import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  MapPin,
  Maximize,
  Bed,
  Bath,
  Eye,
  Sparkles,
} from 'lucide-react';
import { Property } from '../types';

interface PropertyLightboxProps {
  property: Property | null;
  properties: Property[];
  onClose: () => void;
  onNavigate: (property: Property) => void;
}

export const PropertyLightbox: React.FC<PropertyLightboxProps> = ({
  property,
  properties,
  onClose,
  onNavigate,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [showSpecs, setShowSpecs] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset zoom and pan when changing property
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsImageLoaded(false);
  }, [property?.id]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!property) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [property, properties, zoom]);

  // Calculate current index
  const currentIndex = property ? properties.findIndex((p) => p.id === property.id) : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(properties[currentIndex - 1]);
    } else if (properties.length > 0) {
      onNavigate(properties[properties.length - 1]);
    }
  }, [currentIndex, properties, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < properties.length - 1) {
      onNavigate(properties[currentIndex + 1]);
    } else if (properties.length > 0) {
      onNavigate(properties[0]);
    }
  }, [currentIndex, properties, onNavigate]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3.5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Mouse drag handlers for panning when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Double-click to zoom toggle
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (zoom === 1) {
      setZoom(2.2);
    } else {
      handleResetZoom();
    }
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  if (!property) return null;

  // Ultra-high resolution image URL
  const highResUrl = property.imageUrl
    .replace('w=1200', 'w=2560')
    .replace('q=80', 'q=95');

  return (
    <div
      ref={containerRef}
      id="property-lightbox-modal"
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#06080b]/95 backdrop-blur-xl text-white select-none overflow-hidden animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label={`Visor de alta resolución: ${property.title}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Header Bar */}
      <header className="relative z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-black/50 border-b border-white/10 backdrop-blur-md">
        {/* Left: Property Info Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-white/[0.08] border border-white/15 text-[10px] font-mono tracking-widest uppercase text-[#bcff48]">
            <Sparkles className="w-3 h-3" />
            <span>OPTICAL INSPECTOR · ULTRA-HD</span>
          </div>
          <span className="hidden sm:inline text-white/30">|</span>
          <div className="hidden sm:flex items-center gap-2 text-[12px] font-medium text-white/90">
            <span className="font-bold tracking-tight text-white">{property.title}</span>
            <span className="text-white/40 font-mono text-[11px]">({property.reference})</span>
          </div>
        </div>

        {/* Center: Zoom Ratio Pill */}
        <div className="flex items-center gap-1 bg-black/60 border border-white/15 px-2.5 py-1 rounded-full text-[11px] font-mono text-white/80">
          <span className="text-[#bcff48] font-bold">{Math.round(zoom * 100)}%</span>
          <span className="text-white/40">·</span>
          <span>{zoom > 1 ? 'Arrastre para explorar' : 'Doble clic para ampliar'}</span>
        </div>

        {/* Right: Controls & Close */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 p-1 bg-black/50 rounded-[6px] border border-white/10">
            <button
              id="lightbox-zoom-out"
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className="p-1.5 rounded-[4px] hover:bg-white/15 text-white/80 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              title="Reducir zoom (-)"
              aria-label="Reducir zoom"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              id="lightbox-zoom-reset"
              onClick={handleResetZoom}
              className="px-2 py-1 text-[10px] font-mono rounded-[4px] hover:bg-white/15 text-white/80 hover:text-white transition-all cursor-pointer"
              title="Restablecer vista (100%)"
              aria-label="Restablecer zoom a 100%"
            >
              1:1
            </button>
            <button
              id="lightbox-zoom-in"
              onClick={handleZoomIn}
              disabled={zoom >= 3.5}
              className="p-1.5 rounded-[4px] hover:bg-white/15 text-white/80 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              title="Aumentar zoom (+)"
              aria-label="Aumentar zoom"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Toggle Specs */}
          <button
            id="lightbox-toggle-specs"
            onClick={() => setShowSpecs((prev) => !prev)}
            className={`p-2 rounded-[6px] border transition-all cursor-pointer ${
              showSpecs
                ? 'bg-[#bcff48]/15 border-[#bcff48]/40 text-[#bcff48]'
                : 'bg-black/50 border-white/15 text-white/70 hover:text-white'
            }`}
            title="Mostrar/Ocultar detalles arquitectónicos"
            aria-label="Mostrar u ocultar detalles"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Fullscreen Button */}
          <button
            id="lightbox-fullscreen-btn"
            onClick={toggleFullscreen}
            className="p-2 rounded-[6px] bg-black/50 hover:bg-white/15 border border-white/15 text-white/80 hover:text-white transition-all cursor-pointer"
            title="Pantalla completa"
            aria-label="Alternar pantalla completa"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close Button */}
          <button
            id="lightbox-close-btn"
            onClick={onClose}
            className="p-2 rounded-[6px] bg-[#ff5a42]/20 hover:bg-[#ff5a42]/35 border border-[#ff5a42]/40 text-white transition-all cursor-pointer ml-1"
            title="Cerrar visor (Esc)"
            aria-label="Cerrar visor de imagen"
          >
            <X className="w-4 h-4 text-[#ff5a42]" />
          </button>
        </div>
      </header>

      {/* Main Image Stage */}
      <main
        className="relative flex-1 flex items-center justify-center overflow-hidden cursor-default"
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
      >
        {/* Navigation Arrows */}
        <button
          id="lightbox-prev-btn"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white/80 hover:text-white transition-all hover:scale-105 shadow-xl cursor-pointer"
          title="Propiedad anterior (Flecha Izquierda)"
          aria-label="Propiedad anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          id="lightbox-next-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white/80 hover:text-white transition-all hover:scale-105 shadow-xl cursor-pointer"
          title="Siguiente propiedad (Flecha Derecha)"
          aria-label="Siguiente propiedad"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Loading Spinner Indicator */}
        {!isImageLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/40">
            <div className="w-8 h-8 border-2 border-white/20 border-t-[#bcff48] rounded-full animate-spin mb-3" />
            <span className="text-[11px] font-mono tracking-widest text-white/70 uppercase">
              Cargando Fotografía Arquitectónica en Alta Definición...
            </span>
          </div>
        )}

        {/* Interactive Image Container */}
        <div
          className={`relative max-w-full max-h-full flex items-center justify-center transition-transform ${
            isDragging ? 'cursor-grabbing duration-0' : zoom > 1 ? 'cursor-grab duration-150' : 'cursor-zoom-in duration-200'
          }`}
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          <img
            ref={imageRef}
            id="lightbox-target-image"
            src={highResUrl}
            alt={property.title}
            referrerPolicy="no-referrer"
            onLoad={() => setIsImageLoaded(true)}
            className="max-h-[82vh] max-w-[94vw] object-contain rounded-[4px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10"
            draggable={false}
          />
        </div>

        {/* Floating Architectural Telemetry Bar (Collapsible) */}
        {showSpecs && (
          <aside
            id="lightbox-specs-card"
            className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-30 p-4 rounded-[8px] bg-black/80 border border-white/15 backdrop-blur-xl shadow-2xl animate-slideUp text-edge-dark-sm"
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <span
                className="text-[9px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-[3px] border"
                style={{
                  color: property.accent,
                  borderColor: `${property.accent}40`,
                  backgroundColor: `${property.accent}15`,
                }}
              >
                {property.status}
              </span>
              <span className="text-[12px] font-mono font-bold text-[#bcff48]">
                {property.price}
              </span>
            </div>

            <h4 className="text-[15px] font-bold text-white tracking-tight leading-snug mb-1">
              {property.title}
            </h4>

            <div className="flex items-center gap-1.5 text-[11px] text-white/70 mb-2.5">
              <MapPin className="w-3 h-3 text-[#bcff48] shrink-0" />
              <span>{property.location}, {property.country}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/10 text-[10.5px] text-white/80 font-mono mb-2">
              <div className="flex items-center gap-1">
                <Maximize className="w-3 h-3 text-[#bcff48]" />
                <span>{property.specs.builtArea}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bed className="w-3 h-3 text-[#bcff48]" />
                <span>{property.specs.bedrooms} Suites</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="w-3 h-3 text-[#bcff48]" />
                <span>{property.specs.bathrooms} Baños</span>
              </div>
            </div>

            <p className="text-[11px] text-white/75 leading-[1.5] m-0 line-clamp-2">
              {property.summary}
            </p>
          </aside>
        )}
      </main>

      {/* Bottom Thumbnail Strip */}
      <footer className="relative z-30 px-4 py-2.5 bg-black/60 border-t border-white/10 backdrop-blur-md flex items-center justify-between">
        <div className="text-[10px] font-mono text-white/50 tracking-wider">
          RESIDENCIA {currentIndex + 1} DE {properties.length}
        </div>

        {/* Thumbnail Selector */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 px-2 max-w-[70vw]">
          {properties.map((p, idx) => {
            const isSelected = p.id === property.id;
            return (
              <button
                key={p.id}
                id={`lightbox-thumb-${p.id}`}
                onClick={() => onNavigate(p)}
                className={`relative w-12 h-8 rounded-[3px] overflow-hidden border transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'border-[#bcff48] ring-1 ring-[#bcff48] scale-105'
                    : 'border-white/20 opacity-50 hover:opacity-100 hover:border-white/50'
                }`}
                aria-label={`Ver ${p.title}`}
              >
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>

        <div className="text-[10px] font-mono text-white/50 tracking-wider hidden sm:block">
          ZOOM INTERACTIVO · 1X A 3.5X
        </div>
      </footer>
    </div>
  );
};
