import React, { useEffect } from 'react';
import { Property } from '../types';
import { X, MapPin, Maximize2, Bed, Bath, FileText, Calendar, CheckCircle2 } from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onScheduleVisit: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onScheduleVisit,
}) => {
  const [dossierSent, setDossierSent] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!property) return null;

  return (
    <div
      id="property-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md modal-backdrop overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="property-modal-title"
    >
      <div
        id="property-modal-card"
        className="relative w-full max-w-3xl rounded-[8px] bg-[#121418] border border-white/15 text-[#f7f7f2] shadow-2xl modal-content overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="property-modal-close-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bcff48]"
          aria-label="Cerrar detalles de la propiedad"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Image within Modal */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#0c0d10]">
          <img
            src={property.imageUrl}
            alt={property.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121418] via-transparent to-black/40" />

          {/* Badges on image */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span
              className="text-[9px] tracking-[0.14em] uppercase font-bold px-2.5 py-1 rounded-[4px] bg-black/80 backdrop-blur-xs border border-white/15"
              style={{ color: property.accent }}
            >
              {property.status}
            </span>
            <span className="text-[9px] tracking-[0.12em] uppercase font-semibold px-2 py-1 rounded-[4px] bg-black/60 text-white/80 border border-white/10">
              {property.reference}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <div className="text-[10px] tracking-[0.16em] uppercase text-[#f7f7f2]/70 font-semibold mb-1">
                {property.categoryLabel}
              </div>
              <h3 id="property-modal-title" className="text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-tight m-0">
                {property.title}
              </h3>
            </div>
            <div className="text-right">
              <div className="text-[9px] tracking-[0.14em] uppercase text-[#f7f7f2]/50 font-medium">PRECIO PRIVADO</div>
              <div className="text-[18px] sm:text-[22px] font-bold tracking-tight text-[#bcff48]">
                {property.price}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Quick Specs Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 rounded-[6px] bg-[#181a20] border border-white/10 text-[11px]">
            <div className="flex items-center gap-2 text-[#f7f7f2]/70">
              <MapPin className="w-3.5 h-3.5 text-[#bcff48] shrink-0" />
              <span className="truncate">{property.location}</span>
            </div>
            <div className="flex items-center gap-2 text-[#f7f7f2]/70">
              <Maximize2 className="w-3.5 h-3.5 text-[#bcff48] shrink-0" />
              <span>{property.specs.builtArea}</span>
            </div>
            <div className="flex items-center gap-2 text-[#f7f7f2]/70">
              <Bed className="w-3.5 h-3.5 text-[#bcff48] shrink-0" />
              <span>{property.specs.bedrooms} Suites</span>
            </div>
            <div className="flex items-center gap-2 text-[#f7f7f2]/70">
              <Bath className="w-3.5 h-3.5 text-[#bcff48] shrink-0" />
              <span>{property.specs.bathrooms} Baños</span>
            </div>
          </div>

          {/* Editorial / Description */}
          <div>
            <h4 className="text-[12px] font-bold tracking-[0.14em] uppercase text-[#f7f7f2] mb-2">
              Memoria Descriptiva & Arquitectura
            </h4>
            <p className="text-[12px] text-[#f7f7f2]/75 leading-[1.7] m-0 font-normal">
              {property.editorial}
            </p>
          </div>

          {/* Key Amenities */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#f7f7f2]/70 mb-3">
              Equipamiento Singular & Comodidades
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11.5px] text-[#f7f7f2]/80">
              {property.specs.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#bcff48] shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[10px] tracking-[0.14em] uppercase text-[#f7f7f2]/50 font-medium">
              OPERACIÓN ASISTIDA POR SENIOR BROKER
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                id="property-modal-dossier-btn"
                type="button"
                onClick={() => {
                  setDossierSent(true);
                  setTimeout(() => setDossierSent(false), 4000);
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-[5px] bg-[#1a1d24] hover:bg-[#232731] border border-white/15 text-[#f7f7f2] text-[10px] tracking-[0.1em] uppercase font-semibold transition-colors cursor-pointer"
              >
                {dossierSent ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-[#bcff48]" />
                    <span className="text-[#bcff48]">Dossier Solicitado</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3 h-3" />
                    <span>Dossier PDF</span>
                  </>
                )}
              </button>
              <button
                id="property-modal-visit-btn"
                type="button"
                onClick={() => {
                  onScheduleVisit(property);
                  onClose();
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-[5px] bg-white hover:bg-[#f2f8fc] text-[#0a1824] text-[10px] tracking-[0.1em] uppercase font-semibold transition-colors cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
              >
                <Calendar className="w-3 h-3" />
                <span>Agendar Visita</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
