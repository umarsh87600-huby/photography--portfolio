import React from 'react';
import { ChevronLeft, ChevronRight, Info, ShoppingBag } from 'lucide-react';
import { Artwork, PORTFOLIO_WORKS } from '../data/portfolioData';
import { soundFx } from '../utils/audio';

interface ArtworkHUDProps {
  activeArtwork: Artwork;
  activeIndex: number;
  totalWorks: number;
  onNext: () => void;
  onPrev: () => void;
  onSelectIndex: (index: number) => void;
  onOpenLightbox: () => void;
  onOpenInquiry: () => void;
}

export const ArtworkHUD: React.FC<ArtworkHUDProps> = ({
  activeArtwork,
  activeIndex,
  totalWorks,
  onNext,
  onPrev,
  onSelectIndex,
  onOpenLightbox,
  onOpenInquiry,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none">
      {/* Primary Curatorial Metadata Bar (Floating Desktop Card) */}
      <div className="max-w-7xl mx-auto px-6 pb-6 flex flex-col md:flex-row items-end justify-between gap-6">
        {/* Left: Active Artwork Title, Curatorial Kicker & Clean Unboxed Metadata */}
        <div className="pointer-events-auto bg-[#0b0b0e]/85 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6 max-w-xl w-full shadow-2xl">
          {/* Curatorial series & year (NO PILLS - Clean unboxed text) */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
            <span>{activeArtwork.series}</span>
            <span aria-hidden="true">·</span>
            <span>{activeArtwork.category}</span>
            <span aria-hidden="true">·</span>
            <span className="text-zinc-300 font-semibold">{activeArtwork.year}</span>
          </div>

          {/* Title */}
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2 font-display text-balance">
            {activeArtwork.title}
          </h2>

          {/* EXIF Metadata (Clean Unboxed Monospace String with separators) */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-zinc-300 mb-3 tabular-nums">
            <span className="text-zinc-100 font-semibold">{activeArtwork.camera}</span>
            <span aria-hidden="true" className="text-zinc-600">/</span>
            <span>{activeArtwork.exif.focalLength}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>{activeArtwork.exif.aperture}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>{activeArtwork.exif.shutter}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>{activeArtwork.exif.iso}</span>
          </div>

          {/* Location & Color Palette Row */}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.08] text-xs text-zinc-400">
            <div className="truncate max-w-[280px]">
              <span className="text-zinc-300">{activeArtwork.location}</span>
            </div>

            {/* Chromatic Palette Swatches */}
            <div className="flex items-center gap-1.5 shrink-0" title="Extracted Chromatic Palette">
              {activeArtwork.palette.map((hex, i) => (
                <div
                  key={i}
                  className="w-3.5 h-3.5 rounded-sm border border-white/20 shadow-inner"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>

          {/* Direct Actions: Story/Details and Acquisition */}
          <div className="flex items-center gap-2.5 mt-4">
            <button
              onClick={() => {
                soundFx.playShutter();
                onOpenLightbox();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-white bg-white/[0.07] hover:bg-white/[0.14] border border-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-zinc-300" />
              <span>Curatorial File</span>
            </button>

            <button
              onClick={onOpenInquiry}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-black bg-white hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Print Inquiry</span>
            </button>
          </div>
        </div>

        {/* Right: Step-Through Carousel & Thumbnail Selector */}
        <div className="pointer-events-auto bg-[#0b0b0e]/85 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-2xl flex items-center gap-3">
          {/* Prev Artwork */}
          <button
            onClick={() => {
              soundFx.playCameraTransition();
              onPrev();
            }}
            aria-label="Previous photograph"
            className="p-2 text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.09] rounded-lg transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Thumbnails Row */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {PORTFOLIO_WORKS.map((work, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={work.id}
                  onClick={() => {
                    soundFx.playCameraTransition();
                    onSelectIndex(index);
                  }}
                  title={work.title}
                  className={`group relative w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden border transition-all duration-200 cursor-pointer shrink-0 ${
                    isActive
                      ? 'border-white scale-105 shadow-md shadow-white/10 ring-1 ring-white/50'
                      : 'border-white/15 opacity-55 hover:opacity-100 hover:border-white/40'
                  }`}
                >
                  <img
                    src={work.imageSrc}
                    alt={work.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  <span className="absolute bottom-1 right-1 text-[9px] font-mono text-white/90 bg-black/60 px-1 rounded">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Next Artwork */}
          <button
            onClick={() => {
              soundFx.playCameraTransition();
              onNext();
            }}
            aria-label="Next photograph"
            className="p-2 text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.09] rounded-lg transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
