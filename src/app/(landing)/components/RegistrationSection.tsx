"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import landingData from "@/data/landingData.json";

export default function RegistrationSection() {
  const { registration } = landingData;
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    course: "",
    time: "",
    address: "",
  });

  const handleCheckStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    router.push(`/registration`);
  };

  const handleQuickRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Name and Phone are required");
      return;
    }
    router.push("/registration");
    toast.success("Redirecting to full registration form...");
  };

  return (
    <section className="reg-section" id="check-status">
      <div className="landing-container reg-section__grid">
        {/* Left Illustration */}
        <div className="reg-section__illus">
          <div className="reg-section__illus-card">
            <div className="reg-section__illus-avatar">
              <Icon icon="solar:user-bold-duotone" className="reg-section__illus-icon" />
            </div>
            <div className="reg-section__illus-stats">
              <div className="reg-section__stat">
                <span className="reg-section__stat-num">2,500+</span>
                <span className="reg-section__stat-label">Students Enrolled</span>
              </div>
              <div className="reg-section__stat">
                <span className="reg-section__stat-num">98%</span>
                <span className="reg-section__stat-label">Satisfaction Rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <motion.div
          className="reg-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="reg-card__header">
            <div className="reg-card__header-icon">
              <Icon icon="solar:document-add-bold-duotone" />
            </div>
            <div>
              <h2 className="reg-card__title">{registration.title}</h2>
              <p className="reg-card__subtitle">{registration.subtitle}</p>
            </div>
          </div>

          <form onSubmit={handleQuickRegister} className="reg-card__form">
            <div className="reg-input-wrap">
              <Icon icon="solar:user-bold" className="reg-input-icon" />
              <input
                type="text"
                placeholder="Full Name"
                className="reg-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="reg-input-wrap">
              <Icon icon="solar:phone-bold" className="reg-input-icon" />
              <input
                type="tel"
                placeholder="Phone Number"
                className="reg-input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="reg-input-wrap">
              <Icon icon="solar:book-bold" className="reg-input-icon" />
              <select
                className="reg-input reg-select"
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
              >
                <option value="">Select Course</option>
                {registration.courses.map((c: string) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <Icon icon="solar:alt-arrow-down-bold" className="reg-input-arrow" />
            </div>
            <div className="reg-input-wrap">
              <Icon icon="solar:clock-bold" className="reg-input-icon" />
              <select
                className="reg-input reg-select"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              >
                <option value="">Preferred Time</option>
                {registration.timeSlots.map((t: string) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <Icon icon="solar:alt-arrow-down-bold" className="reg-input-arrow" />
            </div>
            <div className="reg-input-wrap">
              <Icon icon="solar:map-point-bold" className="reg-input-icon" />
              <input
                type="text"
                placeholder="Address"
                className="reg-input"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <button type="submit" className="landing-btn landing-btn--primary reg-card__submit">
              Register Now →
            </button>
          </form>
        </motion.div>

        {/* Check Status */}
        <motion.div
          className="status-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="reg-card__header">
            <div className="reg-card__header-icon reg-card__header-icon--green">
              <Icon icon="solar:magnifer-bold-duotone" />
            </div>
            <div>
              <h2 className="reg-card__title">{registration.checkStatusTitle}</h2>
              <p className="reg-card__subtitle">{registration.checkStatusSubtitle}</p>
            </div>
          </div>

          <form onSubmit={handleCheckStatus} className="status-card__form">
            <div className="status-input-row">
              <div className="status-prefix">
                <Icon icon="twemoji:flag-india" />
                <span>+91</span>
              </div>
              <input
                type="tel"
                placeholder="Enter Phone Number"
                className="reg-input status-phone-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <button type="submit" className="landing-btn landing-btn--dark status-check-btn">
                Check Status
              </button>
            </div>
          </form>

          <div className="how-it-works">
            <p className="how-it-works__label">How it works?</p>
            <div className="how-it-works__steps">
              {registration.steps.map((s: any) => (
                <div key={s.title} className="how-step">
                  <div
                    className="how-step__icon"
                    style={{ background: `${s.color}18`, color: s.color }}
                  >
                    <Icon icon={s.icon} />
                  </div>
                  <div>
                    <p className="how-step__title">{s.title}</p>
                    <p className="how-step__desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
