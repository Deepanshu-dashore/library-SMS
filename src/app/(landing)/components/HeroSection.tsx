"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import landingData from "@/data/landingData.json";
import "./HeroSection.css";

export default function HeroSection() {
  const { hero } = landingData;

  return (
    <section className="relative hero-grid-bg min-h-screen flex items-center pt-32 md:pt-20 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side Content */}
          <div className="flex flex-col space-y-8 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="hero-title-serif text-4xl md:text-6xl leading-tight text-black mb-4 mx-auto md:mx-0">
                {hero.headline.line1} <br />
                <span className="hero-green-text">{hero.headline.line2}</span>
              </h1>
              <p className="text-gray-600 text-sm md:text-lg max-w-md md:max-w-xl lg:max-w-2xl leading-relaxed font-medium mx-auto md:mx-0">
                {hero.subtext}
              </p>
            </motion.div>

            {/* App Store / Play Store Buttons */}
                <motion.div 
              className="flex flex-wrap gap-3 justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {hero.buttons.map((btn, i) => {
                const isRegister = btn.label.includes("Register");
                const topText = isRegister ? "Admission Open" : "Check Status";
                const mainText = isRegister ? "Register for Seat" : "Application Status";

                return (
                  <Link
                    key={i}
                    href={btn.href}
                    className="app-button"
                  >
                    <div className="bg-[#0f172a] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg flex items-center space-x-2 md:space-x-3 shadow-md hover:bg-black transition-all border border-gray-800">
                      <Icon 
                        icon={btn.icon} 
                        className="text-2xl md:text-3xl text-white" 
                      />
                      <div className="flex flex-col items-start justify-center">
                        <span className="text-[7px] md:text-[9px] uppercase font-medium text-gray-300 leading-none mb-0.5 md:mb-1 tracking-wider">
                          {topText}
                        </span>
                        <span className="text-[12px] md:text-[17px] font-bold leading-none tracking-tight">
                          {mainText}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </motion.div>
          </div>

          {/* Right Side Images */}
          <div className="relative flex justify-center lg:justify-end">
            <motion.div 
              className="image-frame-container"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="main-image-wrapper">
                <img 
                  src="/landing/interior/interior.png" 
                  alt="Reading Square Interior" 
                  className="main-hero-img"
                />
                
                {/* Overlapping Sub Image */}
                <motion.div 
                  className="sub-image-wrapper"
                  initial={{ opacity: 0, y: 40, x: 20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <img 
                    src="/landing/hero-sub.png" 
                    alt="Study Detail" 
                    className="sub-hero-img"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Decorative element (optional, like the green line in the reference) */}
      <div className="absolute bottom-0 right-0 w-1/4 h-1 bg-[#4a7c59] opacity-20" />
    </section>
  );
}
