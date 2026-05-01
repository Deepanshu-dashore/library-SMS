"use client";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import landingData from "@/data/landingData.json";
import "./GallerySection.css";

export default function GallerySection() {
  const { gallery } = landingData;
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const nextImg = () => {
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % gallery.images.length);
    }
  };

  const prevImg = () => {
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + gallery.images.length) % gallery.images.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === "ArrowRight") nextImg();
      if (e.key === "ArrowLeft") prevImg();
      if (e.key === "Escape") setSelectedIdx(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdx]);

  return (
    <section className="gallery-section-v3 hero-grid-bg" id="gallery">
      <div className="container mx-auto px-6">
        
        {/* Section Heading matching Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="gallery-title-v2">
            Our <span className="gallery-title-accent">Library Environment</span>
          </h2>
          <p className="gallery-subtitle-v2">
            Take a visual tour of our premium, quiet, and facility-rich study spaces designed for your success.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="gallery-grid-v3">
          {gallery.images.map((src, i) => (
            <motion.div
              key={i}
              className="gallery-item-v3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => setSelectedIdx(i)}
            >
              <img src={src} alt={`Gallery ${i + 1}`} className="gallery-img-v3" />
              <div className="gallery-overlay-v3">
                <Icon icon="solar:magnifer-zoom-in-linear" className="gallery-icon-v3" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Zoom Modal */}
      <AnimatePresence mode="wait">
        {selectedIdx !== null && (
          <motion.div 
            className="zoom-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIdx(null)}
          >
            <button 
              className="zoom-modal__nav zoom-modal__nav--left"
              onClick={(e) => { e.stopPropagation(); prevImg(); }}
            >
              <Icon icon="solar:alt-arrow-left-linear" />
            </button>

            <motion.div 
              key={selectedIdx}
              className="zoom-modal__content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="zoom-modal__close"
                onClick={() => setSelectedIdx(null)}
              >
                <Icon icon="solar:close-circle-linear" />
              </button>
              <img src={gallery.images[selectedIdx]} alt="Zoomed" className="zoom-modal__img" />
              <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium">
                {selectedIdx + 1} / {gallery.images.length}
              </div>
            </motion.div>

            <button 
              className="zoom-modal__nav zoom-modal__nav--right"
              onClick={(e) => { e.stopPropagation(); nextImg(); }}
            >
              <Icon icon="solar:alt-arrow-right-linear" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
