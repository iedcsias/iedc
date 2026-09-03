"use client";

import { useState, useEffect } from "react";
import SITE_CONFIG from "@/data/site-config";
import ANNOUNCEMENTS from "@/data/announcements";

function parseDate(str) {
  if (!str) return null;
  const p = String(str).split("-");
  if (p.length !== 3) return null;
  const d = new Date(+p[0], +p[1] - 1, +p[2]);
  return isNaN(d.getTime()) ? null : d;
}

function fmtDate(d) {
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return MONTHS[d.getMonth()] + " " + d.getDate();
}

function daysUntil(d) {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((d - startOfToday) / 86400000);
}

function deadlineText(d) {
  if (!d) return null;
  const n = daysUntil(d);
  if (n < 0) return null;
  if (n === 0) return "CLOSES TODAY";
  if (n === 1) return "CLOSES TOMORROW";
  if (n <= 7) return `CLOSES IN ${n} DAYS`;
  return `CLOSES ${fmtDate(d).toUpperCase()}`;
}

export default function AnnouncementBar() {
  const [events, setEvents] = useState([]);
  const [idx, setIdx] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("iedc-annc-dismissed") === "1") {
        setDismissed(true);
        return;
      }
    } catch (e) {}

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const activeEvents = (ANNOUNCEMENTS || [])
      .filter((a) => a && a.active && a.title)
      .map((a) => ({
        ...a,
        _date: parseDate(a.date),
        _deadline: parseDate(a.deadline),
      }))
      .filter((a) => a._date && a._date >= startOfToday)
      .sort((a, b) => a._date - b._date);

    setEvents(activeEvents);
  }, []);

  useEffect(() => {
    if (events.length > 1) {
      const timer = setInterval(() => {
        setIdx((prev) => (prev + 1) % events.length);
      }, 7500);
      return () => clearInterval(timer);
    }
  }, [events]);

  if (dismissed) return null;

  const current = events.length > 0 ? events[idx] : {
    title: "Idea Fest 2026 Registration Open · KSUM Pre-Seed Grants Active",
    _date: new Date(),
    venue: "SIAS Innovation Hub",
    registrationUrl: "#contact",
  };

  const meta = current._date ? fmtDate(current._date) + (current.venue ? " · " + current.venue : "") : "";
  const dl = current._deadline ? deadlineText(current._deadline) : "ACTIVE COHORT";

  const handleClose = () => {
    try {
      sessionStorage.setItem("iedc-annc-dismissed", "1");
    } catch (e) {}
    setDismissed(true);
  };

  return (
    <div className="annc-top-bar" role="region" aria-label="News ticker announcement">
      <div className="container annc-top-inner">
        {/* Left: News ticker like Image 1 */}
        <div className="annc-left-track">
          <span className="annc-news-tag">NEWS:</span>
          <div className="annc-news-marquee">
            <span className="annc-news-text">
              {current.title} {meta ? `[ ${meta} ]` : ""}
            </span>
          </div>
          {dl && <span className="annc-status-chip">{dl}</span>}
        </div>

        {/* Right: Quick Portal links + Action pill */}
        <div className="annc-right-track">
          <div className="annc-meta-links">
            <a href="https://startupmission.kerala.gov.in" target="_blank" rel="noopener noreferrer" className="annc-sublink">
              KSUM PORTAL
            </a>
            <span className="annc-link-sep">|</span>
            <a href="#events" className="annc-sublink">
              INCUBATION HUB
            </a>
          </div>

          <a href="#contact" className="annc-pill-btn">
            WORK WITH US
          </a>

          <button
            type="button"
            className="annc-dismiss-btn"
            aria-label="Dismiss top announcement"
            onClick={handleClose}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
