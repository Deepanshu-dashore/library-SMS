"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import landingData from "@/data/landingData.json";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { navbar } = landingData;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("Home");

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-lg py-3 border-b border-gray-100 shadow-lg"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-17 h-12 overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform">
              <Image
                src="/sawariyaLogo.png"
                alt="Library Logo"
                width={100}
                height={100}
                className="h-22 w-22 object-contain"
              />
            </div>
            <div className="flex flex-col -ml-2">
              <span className={`text-xl font-semibold font-barlow leading-none tracking-tight transition-colors ${scrolled ? 'text-black' : 'text-black'}`}>{navbar.logo.title}</span>
              <span className="text-xs font-medium text-[#4a7c59] leading-none mt-1">{navbar.logo.subtitle}</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navbar.links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setActive(l.label)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                  active === l.label
                    ? "text-[#4a7c59] bg-[#4a7c59]/5"
                    : "text-gray-600 hover:text-black hover:bg-gray-100"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <Link
              href={navbar.cta.href}
              className="hidden md:flex items-center space-x-2 bg-[#155440] text-white px-5 py-2.5 rounded-md font-medium text-sm hover:bg-[#4a7c59] transition-colors shadow-lg"
            >
              <span>{navbar.cta.label}</span>
            </Link>

            {/* Mobile Toggle Button */}
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center text-black bg-gray-100 rounded-xl border border-gray-200 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <Icon
                icon={mobileOpen ? "line-md:close-small" : "solar:list-bold-duotone"}
                className="text-2xl"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[1001] bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer Panel */}
            <motion.div
              className="fixed top-0 right-0 z-[1002] h-full w-[300px] bg-white shadow-2xl flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-gray-900 leading-none">{navbar.logo.title}</span>
                  <span className="text-xs font-medium text-[#4a7c59] mt-1">{navbar.logo.subtitle}</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  aria-label="Close menu"
                >
                  <Icon icon="line-md:close-small" className="text-2xl" />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex flex-col px-4 py-6 gap-1 flex-grow">
                {navbar.links.map((l, i) => (
                  <motion.div
                    key={l.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => {
                        setActive(l.label);
                        setMobileOpen(false);
                      }}
                      className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        active === l.label
                          ? "text-[#155440] bg-[#155440]/8"
                          : "text-gray-700 hover:text-black hover:bg-gray-50"
                      }`}
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Drawer Footer CTA */}
              <div className="px-6 pb-8">
                <Link
                  href={navbar.cta.href}
                  onClick={() => setMobileOpen(false)}
                  className="block w-full bg-[#155440] text-white py-3.5 rounded-xl font-bold text-center text-sm hover:bg-[#4a7c59] transition-colors shadow-lg"
                >
                  {navbar.cta.label}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
