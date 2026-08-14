"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getHref = (target) => {
    if (target.startsWith("/")) return target;
    if (pathname !== "/") return `/${target}`;
    return target;
  };

  const leftLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About Us" },
    { href: "#academics", label: "Academics" },
  ];

  const rightLinks = [
    { href: "#support", label: "Support" },
    { href: "/leads", label: "Meet Leads" },
    { href: "#contact", label: "Contact" },
  ];

  const renderLink = (link, isMobile = false) => {
    const isRoute = link.href.startsWith("/");
    const resolvedHref = getHref(link.href);

    if (isRoute) {
      return (
        <Link 
          key={link.href} 
          href={resolvedHref} 
          className={isMobile ? "" : "nav-item-link"}
          onClick={() => isMobile && setMenuOpen(false)}
        >
          {link.label}
        </Link>
      );
    }

    return (
      <a 
        key={link.href} 
        href={resolvedHref} 
        className={isMobile ? "" : "nav-item-link"}
        onClick={() => isMobile && setMenuOpen(false)}
      >
        {link.label}
      </a>
    );
  };

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`} id="siteHeader">
      <div className="nav-container">
        
        {/* Mobile Logo Brand */}
        <Link className="brand-mobile" href="/">
          <img src="/assets/IEDC LOGOS.png" alt="IEDC Logo" width="34" height="34" className="brand-logo-img" style={{ objectFit: "contain" }} />
          <span className="brand-title">IEDC SIAS</span>
        </Link>

        {/* Left Side Links (Desktop) */}
        <div className="nav-left">
          {leftLinks.map((link) => renderLink(link))}
        </div>

        {/* Center Branding (Desktop) */}
        <Link className="brand-center" href="/">
          <img src="/assets/IEDC LOGOS.png" alt="IEDC Logo" width="34" height="34" className="brand-logo-img" style={{ objectFit: "contain" }} />
          <div className="brand-text-center">
            <span className="brand-title">IEDC SIAS</span>
          </div>
        </Link>

        {/* Right Side Links & CTA (Desktop) */}
        <div className="nav-right">
          {rightLinks.map((link) => renderLink(link))}
          <a href={getHref("#apply")} className="btn-cta-mockup">
            Apply Now
            <svg className="cta-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="nav-toggle"
          id="navToggle"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className="nav-toggle-box" aria-hidden="true">
            <span className="nav-toggle-line"></span>
            <span className="nav-toggle-line"></span>
          </span>
        </button>

        {/* Mobile Dropdown Menu */}
        <div className={`nav-menu-mobile ${menuOpen ? "open" : ""}`} id="navMenuMobile">
          <ul className="mobile-nav-links">
            {[...leftLinks, ...rightLinks].map((link) => (
              <li key={link.href}>
                {renderLink(link, true)}
              </li>
            ))}
            <li>
              <a href={getHref("#apply")} className="btn-mobile-apply" onClick={() => setMenuOpen(false)}>
                Apply Now
              </a>
            </li>
          </ul>
        </div>

      </div>
    </header>
  );
}
