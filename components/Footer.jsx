import Link from "next/link";
import SITE_CONFIG from "@/data/site-config";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/assets/IEDC LOGOS.png" alt="IEDC Logo" width="56" height="56" loading="lazy" style={{ objectFit: "contain" }} />
            <p className="footer-line">Student-run. Future-obsessed.</p>
            <p className="footer-muted">
              Innovation &amp; Entrepreneurship Development Centre,<br />
              Safi Institute of Advanced Study, Vazhayoor.
            </p>
          </div>
          <nav className="footer-col" aria-label="Site sections">
            <h3>Explore</h3>
            <a href="#about">About</a>
            <a href="#events">Events</a>
            <a href="#programmes">Programmes</a>
            <a href="#team">Team</a>
            <a href="#gallery">Gallery</a>
          </nav>
          <nav className="footer-col" aria-label="Academic years">
            <h3>Years</h3>
            <Link href="/">2026–27</Link>
            <Link href="/2025-26">2025–26</Link>
          </nav>
          <div className="footer-col">
            <h3>Contact</h3>
            <a href={`mailto:${SITE_CONFIG.contact.email}`}>{SITE_CONFIG.contact.email}</a>
            <a href={`tel:${SITE_CONFIG.contact.phone.replace(/\s+/g, "")}`}>{SITE_CONFIG.contact.phone}</a>
            <a href={SITE_CONFIG.contact.instagram} target="_blank" rel="noopener noreferrer">
              {SITE_CONFIG.contact.instagramHandle}
            </a>
          </div>
        </div>
        <div className="footer-base">
          <p>
            © <span id="footerYear">{new Date().getFullYear()}</span> IEDC SIAS · Backed by Kerala Startup Mission
          </p>
          <p className="footer-muted">Built and maintained by the IEDC SIAS web team</p>
        </div>
      </div>
    </footer>
  );
}
