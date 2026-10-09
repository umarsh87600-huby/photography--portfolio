import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ThreeCanvas, ViewLayoutMode, LensFocalMode } from './components/ThreeCanvas';
import { Navigation } from './components/Navigation';
import { ArtworkHUD } from './components/ArtworkHUD';
import { CameraControlsHUD } from './components/CameraControlsHUD';
import { LightboxModal } from './components/LightboxModal';
import { PrintInquiryModal } from './components/PrintInquiryModal';
import { AboutModal } from './components/AboutModal';
import { EditorialGridView } from './components/EditorialGridView';
import { PORTFOLIO_WORKS, Artwork } from './data/portfolioData';
import { soundFx } from './utils/audio';

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [layoutMode, setLayoutMode] = useState<ViewLayoutMode>('pavilion');
  const [focalMode, setFocalMode] = useState<LensFocalMode>('50mm');
  const [isInspecting, setIsInspecting] = useState(false);
  const [isTouring, setIsTouring] = useState(false);
  const [is2DView, setIs2DView] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Works');
  const [isMuted, setIsMuted] = useState(false);

  // Modals state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [inquiryArtwork, setInquiryArtwork] = useState<Artwork>(PORTFOLIO_WORKS[0]);

  const activeArtwork = PORTFOLIO_WORKS[activeIndex] || PORTFOLIO_WORKS[0];
  const tourIntervalRef = useRef<number | null>(null);

  // Next / Prev handlers with camera transition
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % PORTFOLIO_WORKS.length);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + PORTFOLIO_WORKS.length) % PORTFOLIO_WORKS.length);
  }, []);

  const handleSelectArtwork = useCallback((index: number) => {
    setActiveIndex(index);
    setIsInspecting(true);
  }, []);

  // Category filter selection: shifts camera directly to the first piece in that category
  const handleSelectCategory = (category: string) => {
    setActiveCategory(category);
    if (category !== 'All Works') {
      const foundIdx = PORTFOLIO_WORKS.findIndex((w) => w.category === category);
      if (foundIdx !== -1) {
        setActiveIndex(foundIdx);
      }
    }
  };

  // Automated Tour loop
  useEffect(() => {
    if (isTouring) {
      tourIntervalRef.current = window.setInterval(() => {
        setActiveIndex((prev) => {
          const next = (prev + 1) % PORTFOLIO_WORKS.length;
          soundFx.playCameraTransition();
          return next;
        });
      }, 7000);
    } else {
      if (tourIntervalRef.current) {
        clearInterval(tourIntervalRef.current);
        tourIntervalRef.current = null;
      }
    }

    return () => {
      if (tourIntervalRef.current) {
        clearInterval(tourIntervalRef.current);
      }
    };
  }, [isTouring]);

  // Global Keyboard shortcuts for physical camera feeling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input form or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'ArrowRight') {
        soundFx.playCameraTransition();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        soundFx.playCameraTransition();
        handlePrev();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsTouring((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsInspecting(false);
        setIsLightboxOpen(false);
        setIsInquiryOpen(false);
        setIsAboutOpen(false);
      } else if (e.key === '1') {
        soundFx.playCameraTransition();
        setFocalMode('24mm');
      } else if (e.key === '2') {
        soundFx.playCameraTransition();
        setFocalMode('50mm');
      } else if (e.key === '3') {
        soundFx.playCameraTransition();
        setFocalMode('85mm');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#070709] select-none">
      {/* 1. Universal Top Navigation Contract */}
      <Navigation
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenInquiry={() => {
          setInquiryArtwork(activeArtwork);
          setIsInquiryOpen(true);
        }}
        onSelectCategory={handleSelectCategory}
        activeCategory={activeCategory}
        isTouring={isTouring}
        onToggleTour={() => setIsTouring((prev) => !prev)}
        is2DView={is2DView}
        onToggle2DView={() => setIs2DView((prev) => !prev)}
        isMuted={isMuted}
        onToggleMute={() => {
          const muted = soundFx.toggleMute();
          setIsMuted(muted);
        }}
      />

      {/* 2. 3D WebGL Canvas Layer */}
      <div className={`w-full h-full transition-opacity duration-500 ${is2DView ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <ThreeCanvas
          activeIndex={activeIndex}
          onSelectArtwork={handleSelectArtwork}
          layoutMode={layoutMode}
          focalMode={focalMode}
          isInspecting={isInspecting}
          onExitInspection={() => setIsInspecting(false)}
        />
      </div>

      {/* 3. Interactive Camera HUD (Top Left Floating) */}
      {!is2DView && (
        <CameraControlsHUD
          layoutMode={layoutMode}
          onChangeLayout={(mode) => {
            setLayoutMode(mode);
            setIsInspecting(false);
          }}
          focalMode={focalMode}
          onChangeFocal={setFocalMode}
          isTouring={isTouring}
          onToggleTour={() => setIsTouring((prev) => !prev)}
          isInspecting={isInspecting}
          onToggleInspect={() => setIsInspecting((prev) => !prev)}
        />
      )}

      {/* 4. Curatorial Artwork & Carousel HUD (Bottom Floating) */}
      {!is2DView && (
        <ArtworkHUD
          activeArtwork={activeArtwork}
          activeIndex={activeIndex}
          totalWorks={PORTFOLIO_WORKS.length}
          onNext={handleNext}
          onPrev={handlePrev}
          onSelectIndex={(idx) => {
            setActiveIndex(idx);
            setIsInspecting(true);
          }}
          onOpenLightbox={() => setIsLightboxOpen(true)}
          onOpenInquiry={() => {
            setInquiryArtwork(activeArtwork);
            setIsInquiryOpen(true);
          }}
        />
      )}

      {/* 5. 2D Editorial Hybrid Gallery View */}
      {is2DView && (
        <EditorialGridView
          onSelectArtwork={(idx) => {
            setActiveIndex(idx);
            setIsInspecting(true);
          }}
          onOpenLightbox={(art) => {
            setActiveIndex(PORTFOLIO_WORKS.findIndex((w) => w.id === art.id));
            setIsLightboxOpen(true);
          }}
          onOpenInquiry={(art) => {
            setInquiryArtwork(art);
            setIsInquiryOpen(true);
          }}
          onBackTo3D={() => setIs2DView(false)}
          activeCategory={activeCategory}
        />
      )}

      {/* 6. Curatorial Lightbox Modal */}
      <LightboxModal
        artwork={activeArtwork}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onNext={handleNext}
        onPrev={handlePrev}
        onInquire={() => {
          setIsLightboxOpen(false);
          setInquiryArtwork(activeArtwork);
          setIsInquiryOpen(true);
        }}
      />

      {/* 7. Limited Edition Print Acquisition Modal */}
      <PrintInquiryModal
        initialArtwork={inquiryArtwork}
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
      />

      {/* 8. Artist Profile & Curatorial Notes Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onOpenInquiry={() => {
          setIsAboutOpen(false);
          setInquiryArtwork(activeArtwork);
          setIsInquiryOpen(true);
        }}
      />
    </main>
  );
}
