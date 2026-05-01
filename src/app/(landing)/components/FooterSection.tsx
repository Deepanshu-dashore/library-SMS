"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import landingData from "@/data/landingData.json";
import "./FooterSection.css";
import Image from "next/image";

export default function FooterSection() {
  const { footer, navbar, visitUs } = landingData;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer-v2">
      <div className="container mx-auto px-6">
        <div className="footer-grid-v2">
          {/* Brand Column */}
          <div className="footer-column-v2 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="footer-logo-v2 mb-3 justify-center md:justify-start w-full">
              <div className="w-22 h-16 overflow-hidden flex items-center justify-center text-white">
                <Image src="/sawariyaLogo.png" alt="Logo" width={100} height={100} className="h-22 w-22" />
              </div>
              <div className="footer-logo-text-v2 -ml-3 text-left">
                <h3>Shree Sawariya Library</h3>
                <span>Best Library for Competitive Exams</span>
              </div>
            </div>
            <p className="text-white/90 text-sm leading-relaxed max-w-[300px] lg:max-w-[550px] mx-auto md:mx-0">
              {footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-column-v2 flex flex-col items-center md:items-end text-center md:text-right mt-8 md:mt-0">
            <h4>Quick Links</h4>
            <div className="footer-links-v2 flex flex-row flex-wrap justify-center md:justify-end gap-3 md:gap-4 mt-2">
              {navbar.links.map((item) => (
                <Link key={item.label} href={item.href} className="footer-link-v2">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom-v2">
          <p>© {new Date().getFullYear()} Shree Sawariya Library. All Rights Reserved.</p>
          <div className="flex gap-6">
            {footer.bottomLinks.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      <button onClick={scrollToTop} className="footer-scroll-top-v2" title="Scroll to Top">
        <Icon icon="solar:alt-arrow-up-bold" />
      </button>
    </footer>
  );
}
