import React, { useState } from 'react';
import { X, Check, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { Artwork, PORTFOLIO_WORKS } from '../data/portfolioData';
import { soundFx } from '../utils/audio';

interface PrintInquiryModalProps {
  initialArtwork: Artwork;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintInquiryModal: React.FC<PrintInquiryModalProps> = ({
  initialArtwork,
  isOpen,
  onClose,
}) => {
  const [selectedArtworkId, setSelectedArtworkId] = useState(initialArtwork.id);
  const [selectedSize, setSelectedSize] = useState<'medium' | 'large' | 'collector'>('large');
  const [selectedFrame, setSelectedFrame] = useState<'oak' | 'black-alum' | 'float-acrylic'>('black-alum');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [destination, setDestination] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryRefNumber, setInquiryRefNumber] = useState('');

  if (!isOpen) return null;

  const currentArtwork =
    PORTFOLIO_WORKS.find((w) => w.id === selectedArtworkId) || initialArtwork;

  const sizePricing = {
    medium: { label: 'Medium — 60 × 80 cm (24 × 31 in)', price: 2800 },
    large: { label: 'Large — 90 × 120 cm (35 × 47 in)', price: 4400 },
    collector: { label: 'Grand Collector — 120 × 160 cm (47 × 63 in)', price: 6800 },
  };

  const frameOptions = {
    'black-alum': { label: 'Matte Black Anodized Aluminium', surcharge: 450 },
    oak: { label: 'Solid European Natural Oak', surcharge: 650 },
    'float-acrylic': { label: 'Museum Float with Anti-Reflective Tru-Vue Acrylic', surcharge: 900 },
  };

  const totalPrice =
    sizePricing[selectedSize].price + frameOptions[selectedFrame].surcharge;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    soundFx.playShutter();

    // Simulated network roundtrip with confirmation code
    setTimeout(() => {
      setIsSubmitting(false);
      setInquirySuccess(true);
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      setInquiryRefNumber(`KV-INQ-${new Date().getFullYear()}-${randomSuffix}`);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0c0c10] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/30">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
              Studio Archival Press
            </span>
            <h2 className="text-lg font-bold tracking-tight text-white font-display">
              Limited Edition Print Acquisition
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close acquisition form"
            className="p-1.5 text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto">
          {inquirySuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                Archival Print Dossier Registered
              </h3>
              <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="text-white font-medium">{fullName || 'Collector'}</span>.
                Studio Kaien Vance has logged your acquisition request for{' '}
                <span className="text-white font-medium">{currentArtwork.title}</span>. A gallery
                director will reach out within 24 hours with certificate of authenticity details and
                insured white-glove transport arrangements.
              </p>

              <div className="bg-black/50 border border-white/10 p-4 rounded-xl max-w-xs mx-auto font-mono text-xs text-zinc-300">
                <span className="text-zinc-500 block text-[10px] mb-1">REFERENCE PROTOCOL</span>
                <span className="text-white font-bold text-sm tracking-widest">{inquiryRefNumber}</span>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    setInquirySuccess(false);
                    onClose();
                  }}
                  className="px-6 py-2.5 text-xs font-semibold text-black bg-white hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
                >
                  Return to Exhibition
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Artwork Selection & Mini Preview */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 bg-black/40 border border-white/[0.08] rounded-xl">
                <img
                  src={currentArtwork.imageSrc}
                  alt={currentArtwork.title}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 object-cover rounded-lg border border-white/15"
                />
                <div className="flex-1 w-full">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                    Selected Photograph
                  </label>
                  <select
                    value={selectedArtworkId}
                    onChange={(e) => setSelectedArtworkId(e.target.value)}
                    className="w-full bg-[#141419] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white/40 cursor-pointer font-sans"
                  >
                    {PORTFOLIO_WORKS.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.title} ({w.series}, {w.year})
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-zinc-400 font-mono">
                    <span>{currentArtwork.medium}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-zinc-200">{currentArtwork.edition}</span>
                  </div>
                </div>
              </div>

              {/* Physical Dimension Choice */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-2">
                  1. Print Scale & Substrate
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {(Object.keys(sizePricing) as Array<keyof typeof sizePricing>).map((key) => {
                    const item = sizePricing[key];
                    const isSelected = selectedSize === key;
                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setSelectedSize(key)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white/10 border-white text-white'
                            : 'bg-black/30 border-white/10 text-zinc-400 hover:border-white/25 hover:text-zinc-200'
                        }`}
                      >
                        <div className="text-xs font-semibold mb-1">{item.label}</div>
                        <div className="text-sm font-mono font-bold text-white tabular-nums">
                          €{item.price.toLocaleString()}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Framing Options */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-2">
                  2. Museum Framing Specification
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {(Object.keys(frameOptions) as Array<keyof typeof frameOptions>).map((key) => {
                    const item = frameOptions[key];
                    const isSelected = selectedFrame === key;
                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setSelectedFrame(key)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white/10 border-white text-white'
                            : 'bg-black/30 border-white/10 text-zinc-400 hover:border-white/25 hover:text-zinc-200'
                        }`}
                      >
                        <div className="text-xs font-semibold mb-1">{item.label}</div>
                        <div className="text-xs font-mono text-zinc-400 tabular-nums">
                          +€{item.surcharge.toLocaleString()}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Collector Details Inputs */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-2">
                  3. Collector & Delivery Information
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    required
                    placeholder="Full Name / Representative"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#121216] border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Direct Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#121216] border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City, Country of Delivery"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-[#121216] border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
                  />
                  <input
                    type="text"
                    placeholder="Special Installation / Exhibition Note (Optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#121216] border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              {/* Trust markers */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-t border-b border-white/[0.08] text-[11px] text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Hand-Signed Holographic Certificate of Authenticity
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-zinc-300" />
                  Insured Custom Wooden Crate Freight Worldwide
                </span>
              </div>

              {/* Total Price & Submit */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                    Total Estimated Valuation
                  </span>
                  <div className="text-xl font-bold font-mono text-white tabular-nums">
                    €{totalPrice.toLocaleString()} <span className="text-xs text-zinc-400 font-sans">EUR</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 text-xs font-semibold text-black bg-white hover:bg-zinc-200 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Transmitting Request...' : 'Submit Acquisition Inquiry'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
