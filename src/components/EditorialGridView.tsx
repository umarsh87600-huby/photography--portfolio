import React from 'react';
import { Artwork, PORTFOLIO_WORKS } from '../data/portfolioData';
import { Maximize2, ShoppingBag } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface EditorialGridViewProps {
  onSelectArtwork: (index: number) => void;
  onOpenLightbox: (artwork: Artwork) => void;
  onOpenInquiry: (artwork: Artwork) => void;
  onBackTo3D: () => void;
  activeCategory: string;
}

export const EditorialGridView: React.FC<EditorialGridViewProps> = ({
  onSelectArtwork,
  onOpenLightbox,
  onOpenInquiry,
  onBackTo3D,
  activeCategory,
}) => {
  const filteredWorks =
    activeCategory === 'All Works'
      ? PORTFOLIO_WORKS
      : PORTFOLIO_WORKS.filter((w) => w.category === activeCategory);

  return (
    <div className="fixed inset-0 z-20 pt-20 pb-16 px-6 md:px-12 overflow-y-auto bg-[#070709] text-zinc-200">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-white/10 pb-6 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 block mb-1">
              Archival Portfolio Index
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-display">
              Curated Photographic Series
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-400">
              {filteredWorks.length} Exhibition Plates
            </span>
            <button
              onClick={onBackTo3D}
              className="px-4 py-2 text-xs font-mono font-semibold text-black bg-white hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
            >
              Enter 3D Spatial Pavilion
            </button>
          </div>
        </div>

        {/* Dynamic Bento / Editorial Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorks.map((work) => {
            const originalIndex = PORTFOLIO_WORKS.findIndex((w) => w.id === work.id);
            return (
              <div
                key={work.id}
                className="group relative bg-[#0e0e13] border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-white/25 transition-all duration-300"
              >
                {/* Image Container with aspect ratio */}
                <div
                  onClick={() => {
                    soundFx.playShutter();
                    onSelectArtwork(originalIndex);
                    onBackTo3D();
                  }}
                  className="relative overflow-hidden cursor-pointer aspect-4/3 bg-black/60"
                >
                  <img
                    src={work.imageSrc}
                    alt={work.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-2.5 py-1 text-[10px] font-mono bg-black/75 text-white rounded-md border border-white/20">
                      View in 3D
                    </span>
                  </div>
                </div>

                {/* Card Editorial Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Unboxed Metadata (NO PILLS) */}
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
                      <span>{work.series}</span>
                      <span aria-hidden="true">·</span>
                      <span>{work.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-zinc-300 font-semibold">{work.year}</span>
                    </div>

                    <h2 className="text-lg font-bold text-white tracking-tight font-display mb-2">
                      {work.title}
                    </h2>

                    {/* Camera and EXIF */}
                    <div className="text-xs font-mono text-zinc-400 mb-3 tabular-nums">
                      {work.camera} · {work.exif.focalLength} · {work.exif.aperture}
                    </div>

                    <p className="text-xs text-zinc-300 line-clamp-2 mb-4 leading-relaxed">
                      {work.story}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        soundFx.playShutter();
                        onOpenLightbox(work);
                      }}
                      className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white py-1.5 px-2 rounded-lg hover:bg-white/[0.05] transition-colors cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>

                    <button
                      onClick={() => onOpenInquiry(work)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-black bg-white hover:bg-zinc-200 py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Acquire</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
