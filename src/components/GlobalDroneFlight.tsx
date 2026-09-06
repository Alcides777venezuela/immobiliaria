import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [isVideoMode] = useState<boolean>(false);

  // Smooth scroll interpolation refs (LERP engine)
  const targetProgressRef = useRef<number>(0);
  const smoothProgressRef = useRef<number>(0);
  const lastRenderedFrameRef = useRef<number>(-1);

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
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
    grad.addColorStop(0.2, 'rgba(0, 0, 0, 0.15)');
    grad.addColorStop(0.8, 'rgba(0, 0, 0, 0.20)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.50)');
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

    const loop = () => {
      if (!isVideoMode) {
        const diff = targetProgressRef.current - smoothProgressRef.current;

        if (Math.abs(diff) > 0.0001) {
          smoothProgressRef.current += diff * LERP_FACTOR;
        } else {
          smoothProgressRef.current = targetProgressRef.current;
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

  return (
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
        muted
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isVideoMode ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Soft atmospheric gradient to ensure supreme contrast across all sections */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/45 pointer-events-none" />
    </div>
  );
};
