import React from 'react';
import { Play, Pause, Compass, Maximize2, Camera, Layers, Eye } from 'lucide-react';
import { ViewLayoutMode, LensFocalMode } from './ThreeCanvas';
import { soundFx } from '../utils/audio';

interface CameraControlsHUDProps {
  layoutMode: ViewLayoutMode;
  onChangeLayout: (mode: ViewLayoutMode) => void;
  focalMode: LensFocalMode;
  onChangeFocal: (mode: LensFocalMode) => void;
  isTouring: boolean;
  onToggleTour: () => void;
  isInspecting: boolean;
  onToggleInspect: () => void;
}

export const CameraControlsHUD: React.FC<CameraControlsHUDProps> = ({
  layoutMode,
  onChangeLayout,
  focalMode,
  onChangeFocal,
  isTouring,
  onToggleTour,
  isInspecting,
  onToggleInspect,
}) => {
  return (
    <div className="fixed top-20 left-6 z-20 flex flex-col gap-3 pointer-events-auto">
      {/* 3D Exhibition Layout Modes */}
      <div className="bg-[#0b0b0e]/80 backdrop-blur-md border border-white/10 p-1.5 rounded-xl shadow-xl flex items-center gap-1">
        <button
          onClick={() => {
            soundFx.playCameraTransition();
            onChangeLayout('pavilion');
          }}
          title="Curated Pavilion Exhibition"
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer ${
            layoutMode === 'pavilion'
              ? 'bg-white text-black font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Pavilion</span>
        </button>

        <button
          onClick={() => {
            soundFx.playCameraTransition();
            onChangeLayout('ribbon');
          }}
          title="Floating Spatial Helix"
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer ${
            layoutMode === 'ribbon'
              ? 'bg-white text-black font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Ribbon</span>
        </button>

        <button
          onClick={() => {
            soundFx.playCameraTransition();
            onChangeLayout('aerial');
          }}
          title="Aerial God's Eye Flight"
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer ${
            layoutMode === 'aerial'
              ? 'bg-white text-black font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Aerial</span>
        </button>
      </div>

      {/* Lens Optics Simulator & Camera Dynamics */}
      <div className="bg-[#0b0b0e]/80 backdrop-blur-md border border-white/10 p-2 rounded-xl shadow-xl flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-1">
            <Camera className="w-3 h-3 text-zinc-300" />
            Optics Simulation
          </span>
          <span className="text-[10px] font-mono text-zinc-400">FOV</span>
        </div>

        <div className="grid grid-cols-3 gap-1 p-0.5 bg-black/40 rounded-lg border border-white/[0.05]">
          {(['24mm', '50mm', '85mm'] as LensFocalMode[]).map((lens) => (
            <button
              key={lens}
              onClick={() => {
                soundFx.playCameraTransition();
                onChangeFocal(lens);
              }}
              className={`py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
                focalMode === lens
                  ? 'bg-white text-black font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {lens}
            </button>
          ))}
        </div>

        {/* Action Controls: Inspect in 3D & Cinematic Tour */}
        <div className="pt-1 flex items-center gap-1.5 border-t border-white/[0.07]">
          <button
            onClick={() => {
              soundFx.playShutter();
              onToggleInspect();
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
              isInspecting
                ? 'bg-white text-black border-white'
                : 'bg-white/[0.04] text-zinc-300 border-white/10 hover:border-white/30 hover:text-white'
            }`}
          >
            <Maximize2 className="w-3 h-3" />
            <span className="font-mono text-[11px]">{isInspecting ? 'Focus Lock' : 'Inspect'}</span>
          </button>

          <button
            onClick={() => {
              soundFx.playCameraTransition();
              onToggleTour();
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
              isTouring
                ? 'bg-amber-400 text-black border-amber-300 font-semibold'
                : 'bg-white/[0.04] text-zinc-300 border-white/10 hover:border-white/30 hover:text-white'
            }`}
          >
            {isTouring ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
            <span className="font-mono text-[11px]">{isTouring ? 'Touring' : 'Auto Tour'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
