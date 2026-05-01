"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import landingData from "@/data/landingData.json";
import "../legal.css";

const termsData = [
  {
    title: "Membership & Admission",
    content: "By registering with Shree Sawariya Library, you agree to abide by all rules. Membership is personal and non-transferable. A valid ID proof is mandatory, and admission is subject to seat availability."
  },
  {
    title: "Library Rules & Conduct",
    content: "Strict silence must be maintained. Phones must be on silent. Keep your desk clean, and eating is only permitted in the designated break area. Only water bottles are allowed at study desks."
  },
  {
    title: "Fees & Refund Policy",
    content: "Subscription fees must be paid in advance. Fees are non-refundable once the membership period has started. Late payments may result in the loss of your assigned seat."
  },
  {
    title: "Security & Personal Property",
    content: "While we provide 24/7 CCTV surveillance, members are responsible for their own belongings. The library management is not responsible for any loss or damage to personal property."
  },
  {
    title: "Use of Facilities",
    content: "Facilities like AC and High-speed WiFi are for study purposes. Misuse of WiFi (e.g., illegal downloads) or tampering with library equipment will lead to immediate cancellation of membership."
  },
  {
    title: "Termination of Membership",
    content: "The management reserves the right to terminate the membership of any individual who violates library rules, behaves inappropriately, or fails to pay fees on time."
  },
  {
    title: "Modifications to Terms",
    content: "Shree Sawariya Library reserves the right to modify these terms and conditions at any time. Members will be notified of significant changes."
  },
  {
    title: "Contact & Support",
    content: `For any issues or questions regarding these terms, please contact our administration desk at ${landingData.visitUs.email} or call us at ${landingData.visitUs.phone}. Our address: ${landingData.visitUs.address}.`
  }
];

function AccordionItem({ title, content }: { title: string, content: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion-item">
      <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        <Icon icon="solar:arrow-right-linear" className={`accordion-icon ${isOpen ? 'open' : ''}`} width="20" />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="accordion-content"
          >
            <div className="accordion-content-inner">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TermsAndConditions() {
  return (
    <div className="legal-page-wrapper">
      <div className="legal-container">
        <Link href="/" className="back-btn-legal">
          <Icon icon="solar:arrow-left-bold" /> Back to Home
        </Link>
        
        <div className="legal-header">
          <h1 className="legal-title"><span className="accent">Terms &</span> Conditions</h1>
          <p className="legal-subtitle">
            These terms detail the rules, regulations, and guidelines for using the library facilities.
          </p>
        </div>

        <div className="accordion-grid">
          {termsData.map((item, index) => (
            <AccordionItem key={index} title={item.title} content={item.content} />
          ))}
        </div>
      </div>
    </div>
  );
}
