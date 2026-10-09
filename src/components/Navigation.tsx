import React from 'react';
import { Volume2, VolumeX, Grid, Box } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface NavigationProps {
  onOpenAbout: () => void;
  onOpenInquiry: () => void;
  onSelectCategory: (category: string) => void;
  activeCategory: string;
  isTouring: boolean;
  onToggleTour: () => void;
  is2DView: boolean;
  onToggle2DView: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenAbout,
  onOpenInquiry,
  onSelectCategory,
  activeCategory,
  isTouring,
  onToggleTour,
  is2DView,
  onToggle2DView,
  isMuted,
  onToggleMute,
}) => {
  const categories = ['All Works', 'Architecture', 'Portraiture', 'Landscape', 'Street', 'Fine Art'];

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 px-6 md:px-10 flex items-center justify-between border-b border-white/[0.07] bg-[#070709]/75 backdrop-blur-md">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onSelectCategory('All Works');
        }}
        className="text-lg md:text-xl font-bold tracking-[0.2em] text-white uppercase hover:text-zinc-300 transition-colors font-display"
      >
        KAIEN VANCE
      </a>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden lg:flex items-center gap-7 text-xs font-medium tracking-wider text-zinc-400">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                soundFx.playCameraTransition();
                onSelectCategory(cat);
              }}
              className={`transition-colors hover:text-white cursor-pointer relative py-1 ${
                isActive ? 'text-white font-semibold' : ''
              }`}
            >
              {cat}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white rounded-full" />
              )}
            </button>
          );
        })}
        <button
          onClick={onOpenAbout}
          className="hover:text-white transition-colors cursor-pointer text-zinc-400"
        >
          Curatorial Notes
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-3">
        {/* Spatial 3D / 2D Editorial Switcher */}
        <button
          onClick={onToggle2DView}
          title={is2DView ? 'Switch to 3D Spatial Pavilion' : 'Switch to 2D Editorial Gallery'}
          className="p-2 text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 rounded-lg transition-colors cursor-pointer"
        >
          {is2DView ? <Box className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
        </button>

        {/* Shutter Audio Toggle */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Camera Shutter' : 'Mute Camera Shutter'}
          className="p-2 text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 rounded-lg transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Primary Action Button: Acquisition Inquiry */}
        <button
          onClick={onOpenInquiry}
          className="px-4 py-2 text-xs font-semibold tracking-wider text-black bg-white hover:bg-zinc-200 rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer shadow-sm"
        >
          Acquire Prints
        </button>
      </div>
    </header>
  );
};
