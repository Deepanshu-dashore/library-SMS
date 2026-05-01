"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import landingData from "@/data/landingData.json";
import "../legal.css";

const privacyData = [
  {
    title: "Information Collection",
    content: "We may collect personal information that you provide directly to us, including your name, contact number, email address, ID proof details, and educational background during registration."
  },
  {
    title: "Use of Information",
    content: "The information we collect is used to process your library registration, manage seat allocations, send important updates, ensure security, and improve our facilities and services."
  },
  {
    title: "Disclosure of Information",
    content: "We do not sell, trade, or otherwise transfer your personal information to outside parties. This does not include trusted third parties who assist us in operating our system, so long as those parties agree to keep this information confidential."
  },
  {
    title: "Security",
    content: "We implement a variety of security measures, including 24/7 CCTV surveillance, to maintain the safety of your personal information. Your data is stored in secure systems accessible only by authorized personnel."
  },
  {
    title: "Links to Other Websites",
    content: "Our website or portal may contain links to other websites. Please note that we have no control over the privacy practices of these external sites and encourage you to read their privacy policies."
  },
  {
    title: "Children's Privacy",
    content: "Our services are primarily designed for students preparing for competitive exams. We do not knowingly collect personal information from children under the age of 13 without parental consent."
  },
  {
    title: "Updates to this Privacy Policy",
    content: "We may update this Privacy Policy from time to time. Any significant changes will be communicated to members via the contact information provided during registration."
  },
  {
    title: "Contact Us",
    content: `If you have any questions regarding this Privacy Policy, please contact us at ${landingData.visitUs.email} or ${landingData.visitUs.phone}. You can also visit us at: ${landingData.visitUs.address}.`
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

export default function PrivacyPolicy() {
  return (
    <div className="legal-page-wrapper">
      <div className="legal-container">
        <Link href="/" className="back-btn-legal">
          <Icon icon="solar:arrow-left-bold" /> Back to Home
        </Link>
        
        <div className="legal-header">
          <h1 className="legal-title"><span className="accent">Privacy</span> Policy</h1>
          <p className="legal-subtitle">
            This policy details how we collect, use, and protect your personal information when you visit our website.
          </p>
        </div>

        <div className="accordion-grid">
          {privacyData.map((item, index) => (
            <AccordionItem key={index} title={item.title} content={item.content} />
          ))}
        </div>
      </div>
    </div>
  );
}
