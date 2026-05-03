"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import landingData from "@/data/landingData.json";
import "./AboutSection.css";

export default function AboutSection() {
  const { about } = landingData;

  // Split title to accent the last word or specific word
  const titleWords = about.title.split(" ");
  const lastWord = titleWords.pop();
  const mainTitle = titleWords.join(" ");

  return (
    <section className="about-section" id="about">
      <div className="container mx-auto px-6">
        <div className="about-grid">
          
          {/* Left: Collage */}
          <motion.div 
            className="about-collage"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="collage-main">
              <Image src={about.images[0]} alt="Library Interior 1" width={600} height={800} className="collage-img" />
            </div>
            <div className="collage-side">
              <div className="collage-item">
                <Image src={about.images[1]} alt="Library Interior 2" width={400} height={300} className="collage-img" />
              </div>
              <div className="collage-item">
                <Image src={about.images[2]} alt="Library Interior 3" width={400} height={300} className="collage-img" />
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div 
            className="about-content"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="about-title">
              {mainTitle} <span>{lastWord}</span>
            </h2>
            <div className="about-desc">
              {about.description.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
