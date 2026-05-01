"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import "./RegistrationCTA.css";

export default function RegistrationCTA() {
  return (
    <section className="cta-section-v3">
      <motion.div 
        className="cta-full-v3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        {/* Decorative Background Icon */}
        <div className="absolute left-10 -bottom-20 opacity-10">
          <Icon icon="solar:book-bookmark-bold" className="text-[400px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <h2 className="cta-title-v3 text-nowrap">
            Ready to secure your <br className="hidden md:block" /> perfect study spot?
          </h2>
          <p className="cta-subtitle-v3">
            Join Shree Sawariya Library today. Whether you prefer the convenience of online registration or want to experience our environment in person, we're here to help you succeed.
          </p>

          <div className="cta-buttons-v3">
            <Link href="/registration" className="cta-btn-primary">
              <Icon icon="solar:user-plus-bold" className="text-xl" />
              Register Online
            </Link>
            <Link href="#contact" className="cta-btn-secondary">
              <Icon icon="solar:map-point-wave-bold" className="text-xl" />
              Visit Our Library
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
