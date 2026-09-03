"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ANNOUNCEMENTS from "@/data/announcements";
import ShaderButton from "@/components/ShaderButton";

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tickerIdx, setTickerIdx] = useState(0);
  const menuTimeoutRef = useRef(null);

  const handleMenuEnter = () => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setMenuOpen(true);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setMenuOpen(false);
    }, 200);
  };

  // Page-in
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Cycle news ticker
  const activeAnn = ANNOUNCEMENTS.filter((a) => a.active);
  useEffect(() => {
    if (activeAnn.length < 2) return;
    const id = setInterval(() => {
      setTickerIdx((i) => (i + 1) % activeAnn.length);
    }, 4000);
    return () => clearInterval(id);
  }, [activeAnn.length]);

  const currentNews = activeAnn[tickerIdx] ?? activeAnn[0];

  return (
    <section className="hero-uc" id="home" aria-label="Hero Section">

      {/* ── Hero Campus Background Image ────────────────────── */}
      <img
        className="hero-uc-bg-img"
        src="/assets/safi-wide.jpg"
        alt="SAFI Campus Background"
        aria-hidden="true"
      />

      {/* ── Overlays ──────────────────────────────────────────── */}
      <div className="hero-uc-overlay"        aria-hidden="true" />
      <div className="hero-uc-overlay-bottom" aria-hidden="true" />
      <div className="hero-uc-overlay-left"   aria-hidden="true" />

      {/* ═══════════════════════════════════════════════════════
          TOP HEADER — LAYER 1: News ticker strip
      ═══════════════════════════════════════════════════════ */}
      <div className={`uc-news-strip ${loaded ? "uc-visible" : ""}`}>
        {/* Left: rotating news */}
        <div className="uc-news-left">
          <span className="uc-news-label">NEWS</span>
          <span className="uc-news-sep" aria-hidden="true">·</span>
          <span className="uc-news-text" key={tickerIdx}>
            {currentNews?.title ?? "IEDC SIAS 2026–27 Programmes Now Open"}
          </span>
        </div>

        {/* Right: portal links */}
        <div className="uc-news-right">
          <a
            href="https://ksum.kerala.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="uc-portal-link"
            id="ksumPortalLink"
          >
            KSUM PORTAL
          </a>
          <span className="uc-portal-divider" aria-hidden="true">|</span>
          <a
            href="/2025"
            className="uc-portal-link"
            id="oldWebsiteLink"
          >
            IEDC 2025 WEBSITE
          </a>
        </div>
      </div>

      {/* ══ NAV BAR — Logo + Menu left | IEDCSIAS centred ══ */}
      <div className={`uc-nav-bar ${loaded ? "uc-visible" : ""}`}>

        {/* Left: IEDC logo & Menu button */}
        <div className="uc-nav-left">
          <Link href="/" className="uc-logo-link" aria-label="IEDC SIAS Home">
            <img
              src="/assets/images/iedc-logo-new.png"
              alt="IEDC SIAS Logo"
              className="uc-logo-img"
            />
          </Link>

          <div 
            className="uc-menu-wrapper"
            onMouseEnter={handleMenuEnter}
            onMouseLeave={handleMenuLeave}
          >
            <button
              className={`uc-menu-btn ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-label="Toggle navigation"
              id="heroMenuBtn"
            >
              <span className="uc-menu-dots" aria-hidden="true">••••</span>
              <span className="uc-menu-label">MENU</span>
            </button>

            {/* ── Dropdown Menu (Anchored to button) ── */}
            {menuOpen && (
              <nav className="uc-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                <button
                  className="uc-dropdown-close"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="2" fill="currentColor"/>
                    <circle cx="12" cy="5" r="2" fill="currentColor"/>
                    <circle cx="12" cy="19" r="2" fill="currentColor"/>
                    <circle cx="5" cy="12" r="2" fill="currentColor"/>
                    <circle cx="19" cy="12" r="2" fill="currentColor"/>
                  </svg>
                  <span className="close-text">CLOSE</span>
                </button>
                <ul className="uc-dropdown-list">
                  {[
                    { label: "ABOUT US",    href: "#about" },
                    { label: "MEET LEADS",  href: "/leads" },
                    { label: "EVENTS",      href: "#events" },
                    { label: "CONTACT",     href: "#contact" },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        className="uc-dropdown-link"
                        onClick={() => setMenuOpen(false)}
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="uc-dropdown-footer">
                  <span className="footer-label">CONNECT WITH US:</span>
                  <a href="mailto:iedc@siasindia.org" className="footer-email">iedc@siasindia.org</a>
                </div>
              </nav>
            )}
          </div>
        </div>

        {/* Absolute centre: wordmark */}
        <Link href="/" className="uc-brand-word-center" aria-label="IEDC SIAS Home">
          IEDCSIAS
        </Link>

      </div>

      {/* Old sidebar menu block removed - now integrated in nav as a dropdown */}

      {/* ═══════════════════════════════════════════════════════
          HERO CONTENT
      ═══════════════════════════════════════════════════════ */}

      {/* ── Left Column Stats (Under Logo) ── */}
      <div className={`hero-uc-left-stats ${loaded ? "uc-visible" : ""}`}>
        <div className="hero-uc-stat-item">
          <span className="uc-stat-num">
            15<span className="uc-stat-plus">+</span>
          </span>
          <span className="uc-stat-label">Startups Incubated</span>
        </div>
        <div className="hero-uc-stat-item">
          <span className="uc-stat-num">
            500<span className="uc-stat-plus">+</span>
          </span>
          <span className="uc-stat-label">Active Members</span>
        </div>
        <div className="hero-uc-stat-item">
          <span className="uc-stat-num">
            40<span className="uc-stat-plus">+</span>
          </span>
          <span className="uc-stat-label">Workshops Conducted</span>
        </div>
      </div>

      {/* Top-right: Mission paragraph */}
      <div className={`hero-uc-top-right ${loaded ? "uc-visible" : ""}`}>
        <p className="hero-uc-mission">
          We empower students to build impactful technology ventures.
          Growing fast across Kerala, IEDC SIAS is looking for driven
          innovators who value impact and accountability.
        </p>
        <div className="hero-uc-ksum-tag">
          <span className="ksum-pulse-dot" aria-hidden="true" />
          Kerala Startup Mission (KSUM) Accredited
        </div>
      </div>

      {/* Bottom zone: headline LEFT ← → CTA RIGHT */}
      <div className={`hero-uc-bottom-zone ${loaded ? "uc-visible" : ""}`}>
        <div className="hero-uc-headline-wrap">
          <h1 className="hero-uc-headline">
            <span className="hero-uc-line line-1">IGNITING IDEAS.</span>
            <span className="hero-uc-line line-2">
              EMPOWERING<span className="hero-uc-line-accent"> ENTREPRENEURS</span>
            </span>
          </h1>
          <div className="hero-uc-scroll-cue" aria-hidden="true">
            <span className="scroll-cue-line" />
            <span className="scroll-cue-label">SCROLL</span>
          </div>
        </div>

        <div className="hero-uc-bottom-right">
          <ShaderButton
            text="SUBMIT YOUR IDEA"
            href="#contact"
            id="heroSubmitIdeaBtn"
          />
          <a href="#about" className="btn-uc-secondary" id="heroAboutBtn">
            Explore Programmes
          </a>
        </div>
      </div>

    </section>
  );
}
