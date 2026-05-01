"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import landingData from "@/data/landingData.json";
import "./FacilitiesSection.css";

export default function FacilitiesSection() {
  const { facilities } = landingData;

  return (
    <section className="facilities-section-dark" id="facilities">
      <div className="container mx-auto px-6">
        
        {/* Section Heading */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="facilities-title-v3">
            Premium <span className="facilities-title-accent">Facilities</span>
          </h2>
          <p className="facilities-subtitle-v3">
            We provide a comprehensive range of amenities designed to create the perfect focused study environment for every student.
          </p>
        </motion.div>

        {/* Facilities Grid */}
        <div className="facilities-grid-custom">
          {facilities.items.map((f: any, i: number) => (
            <motion.div
              key={f.label}
              className="facility-item-custom"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className={`facility-icon-box ${f.hasBorder ? 'has-border' : ''}`}>
                {f.image ? (
                  <img 
                    src={f.image} 
                    alt={f.label} 
                    className="facility-icon-image"
                  />
                ) : (
                  <Icon icon={f.icon} className="facility-icon-image p-2" />
                )}
              </div>
              <h3 className="facility-name-serif">{f.label}</h3>
              <p className="facility-desc-sans">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
