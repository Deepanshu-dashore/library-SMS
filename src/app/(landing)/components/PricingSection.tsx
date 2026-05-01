"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import landingData from "@/data/landingData.json";
import "./PricingSection.css";

export default function PricingSection() {
  const { pricing } = landingData;

  const plans = [
    { 
      type: "Non-AC Seat", 
      price: "₹500", 
      duration: "/per month",
      icon: "solar:wind-bold-duotone", 
      colorClass: "text-[#417967]",
      bgClass: "bg-[#417967]/10",
      isPopular: false,
      features: [
        "Dedicated Non-AC seating",
        "High-Speed Wi-Fi",
        "RO Drinking Water",
        "Silent Study Zone",
        "Flexible Shift Timings"
      ]
    },
    { 
      type: "AC Seat", 
      price: "₹600", 
      duration: "/per month",
      icon: "solar:snowflake-bold-duotone", 
      colorClass: "text-[#ffb4a2]",
      bgClass: "bg-[#ffb4a2]/20",
      isPopular: true,
      features: [
        "Premium AC Environment",
        "High-Speed Wi-Fi",
        "RO Drinking Water",
        "Silent Study Zone",
        "Priority Seat Selection"
      ]
    }
  ];

  return (
    <section className="pricing-section-v3" id="pricing">
      <div className="container mx-auto px-6">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="pricing-title-v3">
            Our <span className="pricing-title-accent">Membership Plans</span>
          </h2>
          <p className="pricing-subtitle-v3">
            Choose a plan that fits your study schedule. We offer flexible options for both AC and Non-AC seats.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="pricing-cards-container">
            {plans.map((plan, i) => (
              <div key={i} className={`pricing-card-v3 ${plan.isPopular ? 'popular-card' : ''}`}>
                {plan.isPopular && (
                  <div className="popular-badge">Most Popular</div>
                )}
                
                <div className="pricing-card-header">
                  <div className={`pricing-icon-box ${plan.bgClass} ${plan.colorClass}`}>
                    <Icon icon={plan.icon} className="text-3xl" />
                  </div>
                  <h3 className="pricing-card-type">{plan.type}</h3>
                </div>

                <div className="pricing-card-price-box">
                  <div className="pricing-card-price">{plan.price}</div>
                  <div className="pricing-card-duration">{plan.duration}</div>
                </div>

                <ul className="pricing-features-list">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>
                      <Icon icon="solar:check-circle-bold-duotone" className={`text-xl ${plan.colorClass}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pricing-footer-v3">
            <p className="pricing-visit-note">
              For more information & slot details, visit our library.
            </p>
            <p className="pricing-slot-note">
              Kindly select your preferred study slot during the admission process for a hassle-free experience.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
