import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Compass,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Navigation,
  Wind,
  Layers,
  Sparkles,
  Eye,
  Sliders,
} from 'lucide-react';
import { TOTAL_TOUR_FRAMES, TOUR_ROOMS } from '../data/droneTourData';

interface GlobalDroneFlightProps {
  currentFrame: number;
  setCurrentFrame: (frame: number) => void;
  activeRoomIndex: number;
  setActiveRoomIndex: (idx: number) => void;
}

export const GlobalDroneFlight: React.FC<GlobalDroneFlightProps> = ({
  currentFrame,
  setCurrentFrame,
  activeRoomIndex,
  setActiveRoomIndex,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // State
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isVideoMode, setIsVideoMode] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [flightVelocity, setFlightVelocity] = useState<number>(0);
  const [flightDirection, setFlightDirection] = useState<'forward' | 'backward' | 'hover'>('hover');
  const [isHudCollapsed, setIsHudCollapsed] = useState<boolean>(false);

  // Smooth scroll interpolation refs (LERP engine)
  const targetProgressRef = useRef<number>(0);
  const smoothProgressRef = useRef<number>(0);
  const lastRenderedFrameRef = useRef<number>(-1);
  const velocityCalcTimerRef = useRef<number>(0);
  const autoPlayAnimRef = useRef<number | null>(null);

  // Preload all 80 WebP frames with high priority
  useEffect(() => {
    let isMounted = true;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_TOUR_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/media/tour-frames/frame_${frameNum}.webp`;
      img.onload = () => {
        if (isMounted) {
          setLoadedCount((prev) => prev + 1);
        }
      };
      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      isMounted = false;
    };
  }, []);

  // Canvas rendering function with aspect-ratio cover and high-DPI
  const renderFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const img = imagesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = width / height;

    let drawW: number;
    let drawH: number;
    let drawX: number;
    let drawY: number;

    if (canvasRatio > imgRatio) {
      drawW = width;
      drawH = width / imgRatio;
      drawX = 0;
      drawY = (height - drawH) / 2;
    } else {
      drawH = height;
      drawW = height * imgRatio;
      drawX = (width - drawW) / 2;
      drawY = 0;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // Architectural ambient contrast vignette to ensure text legibility
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.40)');
    grad.addColorStop(0.2, 'rgba(0, 0, 0, 0.18)');
    grad.addColorStop(0.8, 'rgba(0, 0, 0, 0.22)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  }, []);

  // Global scroll listener: maps entire document scroll (first section to last section and vice versa)
  useEffect(() => {
    const handleScroll = () => {
      if (isVideoMode) return;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const currentScrollTop = window.scrollY || window.pageYOffset || 0;
      const progress = Math.max(0, Math.min(1, currentScrollTop / maxScroll));

      targetProgressRef.current = progress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial sync

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVideoMode]);

  // Smooth LERP camera loop (interpolates frames smoothly both forward and backward)
  useEffect(() => {
    let animId: number;
    const LERP_FACTOR = 0.12;

    const loop = (timestamp: number) => {
      if (!isVideoMode) {
        const diff = targetProgressRef.current - smoothProgressRef.current;

        if (Math.abs(diff) > 0.0001) {
          smoothProgressRef.current += diff * LERP_FACTOR;

          if (timestamp - velocityCalcTimerRef.current > 50) {
            const speed = Math.abs(diff) * 120;
            setFlightVelocity(Math.min(18.5, parseFloat((speed * 1.5).toFixed(1))));
            setFlightDirection(
              diff > 0.0004 ? 'forward' : diff < -0.0004 ? 'backward' : 'hover'
            );
            velocityCalcTimerRef.current = timestamp;
          }
        } else {
          smoothProgressRef.current = targetProgressRef.current;
          setFlightVelocity(0);
          setFlightDirection('hover');
        }

        const continuousFrame = smoothProgressRef.current * (TOTAL_TOUR_FRAMES - 1);
        const targetFrame = Math.min(
          TOTAL_TOUR_FRAMES - 1,
          Math.max(0, Math.round(continuousFrame))
        );

        if (targetFrame !== lastRenderedFrameRef.current) {
          lastRenderedFrameRef.current = targetFrame;
          setCurrentFrame(targetFrame);
          renderFrame(targetFrame);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isVideoMode, renderFrame, setCurrentFrame]);

  // Update active room when current frame changes
  useEffect(() => {
    const newRoomIndex = TOUR_ROOMS.findIndex(
      (room) => currentFrame >= room.frameStart && currentFrame <= room.frameEnd
    );
    if (newRoomIndex !== -1 && newRoomIndex !== activeRoomIndex) {
      setActiveRoomIndex(newRoomIndex);
    }
  }, [currentFrame, activeRoomIndex, setActiveRoomIndex]);

  // Initial render when frames are loaded
  useEffect(() => {
    if (loadedCount > 0) {
      renderFrame(currentFrame);
    }
  }, [loadedCount, currentFrame, renderFrame]);

  // Auto-play flight: gently scrolls the entire page smoothly down to the bottom
  useEffect(() => {
    let autoScrollId: number | null = null;

    if (isPlaying && !isVideoMode) {
      const step = () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const current = window.scrollY || window.pageYOffset || 0;

        if (current < maxScroll - 2) {
          window.scrollBy(0, 2.5); // Cinematic smooth scroll speed
          autoScrollId = requestAnimationFrame(step);
        } else {
          setIsPlaying(false);
        }
      };

      autoScrollId = requestAnimationFrame(step);
    }

    return () => {
      if (autoScrollId) cancelAnimationFrame(autoScrollId);
    };
  }, [isPlaying, isVideoMode]);

  // Video fallback sync
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVideoMode) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isVideoMode]);

  // Scrubber change: smoothly moves page to corresponding point
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPlaying(false);
    setIsVideoMode(false);
    const newFrame = parseInt(e.target.value, 10);
    const progress = newFrame / (TOTAL_TOUR_FRAMES - 1);

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetScrollY = progress * maxScroll;

    targetProgressRef.current = progress;
    smoothProgressRef.current = progress;
    setCurrentFrame(newFrame);
    renderFrame(newFrame);

    window.scrollTo({
      top: targetScrollY,
      behavior: 'auto',
    });
  };

  // Jump to specific milestone (sections/rooms)
  const jumpToProgress = (progress: number) => {
    setIsPlaying(false);
    setIsVideoMode(false);
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetScrollY = progress * maxScroll;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  };

  const activeRoom = TOUR_ROOMS[activeRoomIndex] || TOUR_ROOMS[0];
  const progressPercent = Math.round((currentFrame / (TOTAL_TOUR_FRAMES - 1)) * 100);
  const currentAltitude = Math.round(420 + (currentFrame / TOTAL_TOUR_FRAMES) * 6);

  return (
    <>
      {/* 
        GLOBAL DRONE FLIGHT BACKGROUND CANVAS
        Fixed to the viewport. It spans from the first section (top = 0)
        to the last section (bottom = maxScroll) and vice versa!
      */}
      <div
        id="global-drone-backdrop"
        className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <canvas
          id="drone-global-canvas"
          ref={canvasRef}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isVideoMode ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* 4K Continuous Video Mode Fallback */}
        <video
          ref={videoRef}
          src="/media/drone-tour.mp4"
          playsInline
          loop
          muted={isMuted}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isVideoMode ? 'opacity-100' : 'opacity-0'
          }`}
          onTimeUpdate={() => {
            if (videoRef.current && isVideoMode) {
              const v = videoRef.current;
              const ratio = v.currentTime / v.duration;
              const frame = Math.min(
                TOTAL_TOUR_FRAMES - 1,
                Math.round(ratio * (TOTAL_TOUR_FRAMES - 1))
              );
              setCurrentFrame(frame);
            }
          }}
        />

        {/* Soft atmospheric gradient to ensure supreme contrast across all sections */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/50 pointer-events-none" />
      </div>

      {/* 
        FLOATING DRONE FLIGHT TELEMETRY & CONTROL CONSOLE
        Docked at bottom center/right. Accessible throughout all sections!
      */}
      <aside
        id="drone-flight-hud"
        className="fixed bottom-4 right-4 z-40 max-w-[95vw] sm:max-w-[460px] transition-all duration-300"
        aria-label="Consola de Telemetría de Vuelo con Dron"
      >
        <div className="backdrop-blur-xl bg-black/60 border border-white/20 rounded-[10px] shadow-2xl p-3 text-white">
          {/* Header row: Toggle minimize, Compass & Frame */}
          <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] bg-[#bcff48]/20 text-[#bcff48] text-[10px] font-mono font-bold tracking-wider uppercase border border-[#bcff48]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#bcff48] animate-pulse" />
                Dron en Vuelo
              </span>
              <span className="text-[10px] font-mono text-white/80 uppercase hidden sm:inline">
                {activeRoom.stepNumber}. {activeRoom.title.split('&')[0].trim()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#bcff48] font-bold">
                {String(currentFrame + 1).padStart(2, '0')}/{TOTAL_TOUR_FRAMES}
              </span>
              <button
                onClick={() => setIsHudCollapsed(!isHudCollapsed)}
                className="p-1 rounded-[4px] hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                title={isHudCollapsed ? 'Expandir telemetría' : 'Minimizar telemetría'}
                aria-label={isHudCollapsed ? 'Expandir' : 'Minimizar'}
              >
                {isHudCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {!isHudCollapsed && (
            <div className="pt-2.5 space-y-2.5">
              {/* Telemetry gauges */}
              <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
                <div className="bg-white/[0.07] rounded-[4px] py-1 px-1.5 border border-white/10">
                  <div className="text-[8.5px] text-white/50 uppercase">Rumbo</div>
                  <div className="text-[11px] font-bold text-white truncate flex items-center justify-center gap-1">
                    <Compass className="w-2.5 h-2.5 text-[#bcff48]" />
                    {activeRoom.orientation.split(' ')[0]}
                  </div>
                </div>

                <div className="bg-white/[0.07] rounded-[4px] py-1 px-1.5 border border-white/10">
                  <div className="text-[8.5px] text-white/50 uppercase">Altitud</div>
                  <div className="text-[11px] font-bold text-white">+{currentAltitude}m</div>
                </div>

                <div className="bg-white/[0.07] rounded-[4px] py-1 px-1.5 border border-white/10">
                  <div className="text-[8.5px] text-white/50 uppercase">Estado</div>
                  <div className="text-[11px] font-bold text-[#bcff48]">
                    {flightDirection === 'forward'
                      ? 'Avanzando'
                      : flightDirection === 'backward'
                      ? 'Retroceso'
                      : 'Cámara fija'}
                  </div>
                </div>
              </div>

              {/* Scrubber slider */}
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-[9.5px] font-mono text-white/50 shrink-0">0%</span>
                <input
                  id="global-drone-scrubber"
                  type="range"
                  min="0"
                  max={TOTAL_TOUR_FRAMES - 1}
                  value={currentFrame}
                  onChange={handleScrubberChange}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#bcff48]"
                  aria-label="Control deslizante del recorrido con dron"
                />
                <span className="text-[9.5px] font-mono text-[#bcff48] font-bold shrink-0">
                  {progressPercent}%
                </span>
              </div>

              {/* Controls bar: Auto flight, reset, video mode, quick milestones */}
              <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-white/10 text-[10.5px]">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setIsPlaying(!isPlaying);
                      setIsVideoMode(false);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#f7f7f2] text-[#080a0e] font-semibold hover:bg-white transition-all shadow-sm cursor-pointer"
                    aria-label={isPlaying ? 'Pausar auto-vuelo' : 'Iniciar auto-vuelo'}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-2.5 h-2.5 fill-current" />
                        <span>Pausar</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>Auto Vuelo</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => jumpToProgress(0)}
                    className="p-1 rounded-[4px] hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/15"
                    title="Volver al inicio (Sección 1)"
                    aria-label="Volver al inicio"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>

                {/* Quick jump pills */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => jumpToProgress(0)}
                    className={`px-1.5 py-0.5 rounded-[3px] text-[9.5px] font-mono transition-colors ${
                      currentFrame < 15
                        ? 'bg-white/20 text-[#bcff48] font-bold'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                    title="Ir a Inicio"
                  >
                    Inicio
                  </button>
                  <button
                    onClick={() => jumpToProgress(0.28)}
                    className={`px-1.5 py-0.5 rounded-[3px] text-[9.5px] font-mono transition-colors ${
                      currentFrame >= 15 && currentFrame < 38
                        ? 'bg-white/20 text-[#bcff48] font-bold'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                    title="Ir a Atrio"
                  >
                    Atrio
                  </button>
                  <button
                    onClick={() => jumpToProgress(0.55)}
                    className={`px-1.5 py-0.5 rounded-[3px] text-[9.5px] font-mono transition-colors ${
                      currentFrame >= 38 && currentFrame < 62
                        ? 'bg-white/20 text-[#bcff48] font-bold'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                    title="Ir a Suite"
                  >
                    Suite
                  </button>
                  <button
                    onClick={() => jumpToProgress(0.95)}
                    className={`px-1.5 py-0.5 rounded-[3px] text-[9.5px] font-mono transition-colors ${
                      currentFrame >= 62
                        ? 'bg-white/20 text-[#bcff48] font-bold'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                    title="Ir a Terraza / Contacto"
                  >
                    Terraza
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
