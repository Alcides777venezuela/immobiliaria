import React, { useEffect, useRef, useState } from 'react';

interface SectionDividerProps {
  id?: string;
  label?: string;
  accent?: 'lime' | 'coral' | 'white';
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  id,
  label,
  accent = 'lime',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = dividerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -20px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const accentBeamColor =
    accent === 'coral'
      ? 'from-transparent via-[#ff5a42]/70 to-transparent'
      : accent === 'lime'
      ? 'from-transparent via-[#bcff48]/70 to-transparent'
      : 'from-transparent via-white/70 to-transparent';

  const dotColor =
    accent === 'coral'
      ? 'bg-[#ff5a42]'
      : accent === 'lime'
      ? 'bg-[#bcff48]'
      : 'bg-white';

  return (
    <div
      ref={dividerRef}
      id={id}
      className="w-full relative py-5 md:py-7 flex items-center justify-center overflow-hidden z-20 pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Expanding Baseline Hairline */}
      <div
        className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out origin-center ${
          isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
        }`}
      />

      {/* Animated Traveling Luminous Beam */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] overflow-hidden">
        <div
          className={`w-1/3 h-full bg-gradient-to-r ${accentBeamColor} animate-divider-beam ${
            isVisible ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-700`}
        />
      </div>

      {/* Minimal Architectural Node Badge */}
      {label ? (
        <div
          className={`relative z-10 flex items-center gap-2 px-3.5 py-1 bg-[#080a0e]/95 border border-white/20 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-700 delay-150 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse shrink-0`} />
          <span className="text-[8.5px] font-mono tracking-[0.22em] text-white/75 uppercase whitespace-nowrap">
            {label}
          </span>
        </div>
      ) : (
        <div
          className={`relative z-10 w-2.5 h-2.5 rotate-45 border border-white/30 bg-[#080a0e] flex items-center justify-center shadow-lg transition-all duration-700 delay-150 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        >
          <div className={`w-1 h-1 ${dotColor} rounded-full animate-center-pip`} />
        </div>
      )}
    </div>
  );
};
