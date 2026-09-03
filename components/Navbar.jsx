"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SITE_CONFIG from "@/data/site-config";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getHref = (target) => {
    if (target.startsWith("/")) return target;
    if (pathname !== "/") return `/${target}`;
    return target;
  };

  const navLinks = [
    { href: "#home", label: "HOME" },
    { href: "#about", label: "ABOUT" },
    { href: "#events", label: "EVENTS" },
    { href: "#support", label: "PROGRAMMES" },
    { href: "/leads", label: "MEET LEADS" },
    { href: "#support", label: "COMMUNITY" },
    { href: "#contact", label: "CONTACT" },
  ];

  const handleLinkClick = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <header className={`site-header-tech ${scrolled ? "scrolled" : ""}`} id="siteHeader">
        <div className="nav-container-tech">
          
          {/* Left Side: Brand Logo & Menu Toggle (Matching Image 1 & Image 3) */}
          <div className="brand-group-left">
            <Link className="brand-tech" href="/">
              <div className="brand-logo-glow-wrap">
                <img 
                  src="/assets/IEDC LOGOS.png" 
                  alt="IEDC SIAS Logo" 
                  width="36" 
                  height="36" 
                  className="brand-logo-img" 
                  style={{ objectFit: "contain" }} 
                />
                <span className="brand-live-dot" title="Active Hub" />
              </div>
              <span className="brand-name-bold">IEDC SIAS</span>
            </Link>

            {/* Menu Button right next to Logo (Matching Reference) */}
            <button
              className="btn-menu-trigger"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(!drawerOpen)}
              aria-label="Toggle navigation drawer"
            >
              <span className="menu-icon-dots">••••</span>
              <span className="menu-trigger-text">MENU</span>
            </button>
          </div>

          {/* Center Links (Desktop Horizontal) */}
          <nav className="nav-desktop-links" aria-label="Main Navigation">
            {navLinks.slice(0, 5).map((link) => {
              const isRoute = link.href.startsWith("/");
              const resolvedHref = getHref(link.href);
              return isRoute ? (
                <Link key={link.label} href={resolvedHref} className="nav-item-link">
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href={resolvedHref} className="nav-item-link">
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Side: Quick Action Pill Buttons (Matching Reference) */}
          <div className="nav-right-actions">
            <a href={getHref("#contact")} className="btn-nav-apply">
              <span>WORK WITH US</span>
            </a>
          </div>

        </div>
      </header>

      {/* Cyber/Tech Slide-Out Vertical Menu Drawer (Exact Match to Image 3) */}
      <div 
        className={`drawer-backdrop ${drawerOpen ? "open" : ""}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden={!drawerOpen}
      />

      <div 
        className={`nav-cyber-drawer ${drawerOpen ? "open" : ""}`}
        role="dialog"
        aria-label="Site Navigation Drawer"
      >
        {/* Drawer Header: Close Button with Geometric Symbol */}
        <div className="drawer-header">
          <button
            className="btn-drawer-close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation"
          >
            <span className="close-symbol">⚙</span>
            <span className="close-text">CLOSE</span>
          </button>
        </div>

        <div className="drawer-divider" />

        {/* Drawer Vertical Nav Links */}
        <nav className="drawer-nav-list" aria-label="Drawer Navigation">
          {navLinks.map((link) => {
            const isRoute = link.href.startsWith("/");
            const resolvedHref = getHref(link.href);
            return isRoute ? (
              <Link 
                key={link.label} 
                href={resolvedHref} 
                className="drawer-nav-link"
                onClick={handleLinkClick}
              >
                {link.label}
              </Link>
            ) : (
              <a 
                key={link.label} 
                href={resolvedHref} 
                className="drawer-nav-link"
                onClick={handleLinkClick}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Drawer Footer Contact Info (Matching Screenshot) */}
        <div className="drawer-footer">
          <span className="drawer-footer-label">CONNECT WITH US:</span>
          <a 
            href={`mailto:${SITE_CONFIG.contact?.email || "iedc@siasindia.org"}`} 
            className="drawer-footer-email"
          >
            {SITE_CONFIG.contact?.email || "iedc@siasindia.org"}
          </a>
        </div>
      </div>
    </>
  );
}
