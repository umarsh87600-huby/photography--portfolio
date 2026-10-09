import React from 'react';
import { X, Award, MapPin, Mail, ExternalLink } from 'lucide-react';
import { ARTIST_PROFILE } from '../data/portfolioData';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInquiry: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onOpenInquiry,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0c0c10] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/30">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
              Curatorial Profile
            </span>
            <h2 className="text-lg font-bold tracking-tight text-white font-display">
              {ARTIST_PROFILE.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close profile modal"
            className="p-1.5 text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Subtitle & Base */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400">
            <span className="text-zinc-200">{ARTIST_PROFILE.discipline}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-zinc-400">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              {ARTIST_PROFILE.location}
            </span>
          </div>

          {/* Artist Statement */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Artist Statement & Spatial Philosophy
            </h3>
            <p className="text-sm leading-relaxed text-zinc-300">
              {ARTIST_PROFILE.bio}
            </p>
            <p className="text-sm leading-relaxed text-zinc-400">
              &quot;Photography for me is an architectural act. By placing medium-format sensors against raw monoliths, nocturnal downpours, and quiet studios, we compress hundreds of tons of matter and hours of stillness into optical light waves. The 3D pavilion gives collectors the spatial pacing required to experience physical photography in the digital realm.&quot;
            </p>
          </div>

          {/* Selected Solo & Institutional Exhibitions */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
              Selected Institutional Exhibitions
            </h3>
            <div className="border border-white/10 rounded-xl overflow-hidden divide-y divide-white/[0.06] bg-black/20 text-xs">
              {ARTIST_PROFILE.exhibitions.map((ex, i) => (
                <div key={i} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-zinc-400 tabular-nums">{ex.year}</span>
                    <span className="text-zinc-200 font-medium">{ex.show}</span>
                  </div>
                  <span className="text-zinc-400 font-mono">
                    {ex.venue}, {ex.city}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Honors & Recognitions */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Honors & Distinctions
            </h3>
            <ul className="space-y-2 text-xs text-zinc-300">
              {ARTIST_PROFILE.awards.map((award, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                  <span>{award}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Gallery Representation & Studio Inquiry */}
          <div className="p-4 bg-black/40 border border-white/[0.08] rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 text-xs">
              <div className="text-zinc-500 font-mono uppercase text-[10px]">Representation</div>
              <div className="text-zinc-200">{ARTIST_PROFILE.contact.representation}</div>
              <div className="text-zinc-400 flex items-center gap-1.5 pt-1">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                <span>{ARTIST_PROFILE.contact.email}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenInquiry();
              }}
              className="px-4 py-2 text-xs font-semibold text-black bg-white hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Acquire Exhibition Works
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
