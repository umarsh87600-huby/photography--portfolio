import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Compass, Maximize2, ShoppingBag } from 'lucide-react';
import { Artwork } from '../data/portfolioData';
import { soundFx } from '../utils/audio';

interface LightboxModalProps {
  artwork: Artwork;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onInquire: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  artwork,
  isOpen,
  onClose,
  onNext,
  onPrev,
  onInquire,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-[#0c0c10] border border-white/10 rounded-2xl overflow-hidden flex flex-col lg:flex-row shadow-2xl">
        {/* Top-Right Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 text-zinc-400 hover:text-white bg-black/60 hover:bg-black/90 border border-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: High-Resolution Photographic Canvas Frame */}
        <div className="relative lg:w-3/5 bg-[#060608] flex items-center justify-center p-4 md:p-8 min-h-[380px] lg:min-h-[600px] border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden">
          <img
            src={artwork.imageSrc}
            alt={artwork.title}
            referrerPolicy="no-referrer"
            className="max-h-[75vh] w-auto max-w-full object-contain rounded shadow-2xl transition-transform duration-300 hover:scale-[1.01]"
          />

          {/* Navigation Arrows on image overlay */}
          <div className="absolute inset-y-0 left-3 flex items-center">
            <button
              onClick={() => {
                soundFx.playCameraTransition();
                onPrev();
              }}
              aria-label="Previous artwork"
              className="p-2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute inset-y-0 right-3 flex items-center">
            <button
              onClick={() => {
                soundFx.playCameraTransition();
                onNext();
              }}
              aria-label="Next artwork"
              className="p-2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Right Side: Curatorial Dossier & Technical EXIF */}
        <div className="lg:w-2/5 p-6 md:p-8 overflow-y-auto flex flex-col justify-between max-h-[85vh]">
          <div>
            {/* Header Series & Category (Clean unboxed text) */}
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2 uppercase tracking-wider">
              <span>{artwork.series}</span>
              <span aria-hidden="true">·</span>
              <span>{artwork.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-zinc-200">{artwork.year}</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white mb-3 font-display">
              {artwork.title}
            </h1>

            {/* Geographical Coordinates */}
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mb-6">
              <Compass className="w-3.5 h-3.5 text-zinc-300" />
              <span>{artwork.location}</span>
              <span aria-hidden="true">/</span>
              <span className="text-zinc-300">{artwork.coordinates}</span>
            </div>

            {/* Curatorial Essay / Story */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
                Curatorial Statement
              </h3>
              <p className="text-sm leading-relaxed text-zinc-300 font-sans">
                {artwork.story}
              </p>
            </div>

            {/* Technical EXIF Dossier */}
            <div className="mb-6 bg-black/40 border border-white/[0.08] rounded-xl p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 font-mono">
                Capture Specifications
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 block">Camera System</span>
                  <span className="text-zinc-200">{artwork.camera}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Optics</span>
                  <span className="text-zinc-200">{artwork.lens}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Exposure</span>
                  <span className="text-zinc-200 tabular-nums">
                    {artwork.exif.shutter} · {artwork.exif.aperture}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Sensitivity & Focal</span>
                  <span className="text-zinc-200 tabular-nums">
                    {artwork.exif.iso} · {artwork.exif.focalLength}
                  </span>
                </div>
              </div>
            </div>

            {/* Archival Print Medium & Dimensions */}
            <div className="mb-6 space-y-2 text-xs text-zinc-300">
              <div className="flex justify-between border-b border-white/[0.06] pb-2">
                <span className="text-zinc-500 font-mono">Print Medium</span>
                <span className="text-right text-zinc-200">{artwork.medium}</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.06] pb-2">
                <span className="text-zinc-500 font-mono">Physical Scale</span>
                <span className="text-zinc-200 font-mono tabular-nums">{artwork.dimensions}</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.06] pb-2">
                <span className="text-zinc-500 font-mono">Edition</span>
                <span className="text-zinc-200 font-mono">{artwork.edition}</span>
              </div>
            </div>

            {/* Chromatic Palette */}
            <div className="mb-6">
              <span className="text-xs font-mono uppercase text-zinc-500 block mb-2">
                Tonal Palette
              </span>
              <div className="flex items-center gap-2">
                {artwork.palette.map((color, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      className="w-8 h-8 rounded-md border border-white/20 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[10px] font-mono text-zinc-500">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Acquisition Call to Action */}
          <div className="pt-4 border-t border-white/10 flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onInquire();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-black bg-white hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Inquire Limited Edition Archival Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
