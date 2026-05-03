"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { motion } from "framer-motion";
import landingData from "@/data/landingData.json";
import "./VisitUsSection.css";

export default function VisitUsSection() {
  const { visitUs } = landingData;

  return (
    <section className="visit-us-section" id="contact">
      <div className=" mx-auto px-10">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="contact-title-v2">
            Visit Our <span className="contact-title-accent">Library</span>
          </h2>
          <p className="contact-subtitle-v2">
            Located in the heart of Khargone, we offer the perfect silent environment for your academic success.
          </p>
        </motion.div>

        <div className="visit-grid-v2">
          {/* Info Card */}
          <motion.div 
            className="info-card-v2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="info-item-v2">
              <div className="info-icon-box-v2">
                <Icon icon="solar:map-point-bold-duotone" />
              </div>
              <div className="info-content-v2">
                <h4>Address</h4>
                <p>{visitUs.address}</p>
              </div>
            </div>

            <div className="info-item-v2">
              <div className="info-icon-box-v2">
                <Icon icon="solar:phone-calling-bold-duotone" />
              </div>
              <div className="info-content-v2">
                <h4>Phone</h4>
                <p>{visitUs.phone}</p>
              </div>
            </div>

            <div className="info-item-v2">
              <div className="info-icon-box-v2">
                <Icon icon="solar:letter-bold-duotone" />
              </div>
              <div className="info-content-v2">
                <h4>Email</h4>
                <p>{visitUs.email}</p>
              </div>
            </div>

            <div className="info-item-v2">
              <div className="info-icon-box-v2">
                <Icon icon="solar:clock-circle-bold-duotone" />
              </div>
              <div className="info-content-v2">
                <h4>Opening Hours</h4>
                <p>{visitUs.hours}</p>
              </div>
            </div>

            {/* Registration CTA in Contact Card */}
            <Link href="/registration" className="contact-register-btn">
              <Icon icon="solar:user-plus-bold" className="text-xl" />
              Register for a Seat
            </Link>
          </motion.div>

          {/* Live Map */}
          <motion.div 
            className="map-container-v2"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d474112.6787956051!2d75.00703478906249!3d21.818726000000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd885006cb43efb%3A0xcfab8628c76c044d!2sShree%20Sawariya%20Library!5e0!3m2!1sen!2sin!4v1777570541608!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full min-h-[300px]"
            ></iframe>
          </motion.div>

          {/* Exterior Image */}
          <motion.div 
            className="exterior-container-v2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Image 
              src={visitUs.exteriorImage} 
              alt="Library Exterior" 
              width={600}
              height={800}
              className="exterior-img-v2" 
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
