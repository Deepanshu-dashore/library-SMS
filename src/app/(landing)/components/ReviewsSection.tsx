"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import landingData from "@/data/landingData.json";
import "./ReviewsSection.css";

export default function ReviewsSection() {
  const { reviews } = landingData;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-advance reviews
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.items.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [reviews.items.length, isPaused]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.items.length) % reviews.items.length);
  };

  // Get current reviews to display (3 cards logic)
  const getCurrentReviews = () => {
    if (isMobile) {
      return [{ ...reviews.items[currentIndex], originalIdx: currentIndex }];
    }
    const result = [];
    const prevIndex = (currentIndex - 1 + reviews.items.length) % reviews.items.length;
    const nextIndex = (currentIndex + 1) % reviews.items.length;
    
    result.push({ ...reviews.items[prevIndex], originalIdx: prevIndex, pos: 'left' });
    result.push({ ...reviews.items[currentIndex], originalIdx: currentIndex, pos: 'center' });
    result.push({ ...reviews.items[nextIndex], originalIdx: nextIndex, pos: 'right' });
    
    return result;
  };

  return (
    <section id="reviews" className="reviews-section-v3 hero-grid-bg">
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-2"
        >
          <h2 className="reviews-title-v2">
            Our <span className="reviews-title-accent">Student Reviews</span>
          </h2>
          <p className="reviews-subtitle-v2">
            See what our satisfied students have to say about their experience at Shree Sawariya Library.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div
          className="relative max-w-7xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-30 bg-white hover:bg-[#417967] text-gray-800 hover:text-white rounded-full p-4 shadow-xl transition-all duration-300 border border-gray-100"
          >
            <Icon icon="solar:arrow-left-line-duotone" className="text-2xl" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-30 bg-white hover:bg-[#417967] text-gray-800 hover:text-white rounded-full p-4 shadow-xl transition-all duration-300 border border-gray-100"
          >
            <Icon icon="solar:arrow-right-line-duotone" className="text-2xl" />
          </button>

          {/* Carousel Slides */}
          <div className="flex items-center justify-center gap-4 lg:gap-8 py-10">
            {getCurrentReviews().map((rev, idx) => {
              const isCenter = isMobile ? true : idx === 1;
              return (
                <motion.div
                  key={`${rev.originalIdx}-${idx}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: isCenter ? 1 : 0.6,
                    scale: isCenter ? 1.1 : 0.9,
                    zIndex: isCenter ? 20 : 10,
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`review-card-v3 ${isCenter ? 'active-card-v3' : ''}`}
                >

                  {/* Quote Icon */}
                  <div className={`absolute right-2 top-2 ${isCenter ? "text-[#417967]" : "text-gray-200"}`}>
                    <Icon icon="ph:quotes-fill" className="text-2xl" />
                  </div>

                  {/* Review Text */}
                  <div className="mb-2">
                    <p className={`text-gray-600 leading-relaxed ${isCenter ? 'text-base' : 'text-sm line-clamp-4'}`}>
                      "{rev.text}"
                    </p>
                  </div>
                   {/* Stars */}
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(5)].map((_, j) => (
                      <Icon key={j} icon="solar:star-bold" className={isCenter ? "text-sm" : "text-xs"} />
                    ))}
                  </div>

                  {/* Bottom Info */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                        <img src={rev.avatar||"/sawariyaLogo.png"} alt={rev.name} className="w-full h-full object-cover" />
                    {/* <img src="/sawariyaLogo.png" alt="Library Logo" className="h-6 opacity-30 grayscale" /> */}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 leading-tight">{rev.name}</h4>
                        <p className="text-xs text-gray-400">{rev.role}</p>
                      </div>
                    </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${currentIndex === index
                  ? 'bg-[#417967] w-8'
                  : 'bg-gray-200 hover:bg-gray-300 w-2'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
