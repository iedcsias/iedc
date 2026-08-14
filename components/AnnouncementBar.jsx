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
  if (n === 0) return "Closes today";
  if (n === 1) return "Closes tomorrow";
  if (n <= 7) return "Closes in " + n + " days";
  return "Closes " + fmtDate(d);
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
      }, 7000);
      return () => clearInterval(timer);
    }
  }, [events]);

  if (dismissed || !events.length) return null;

  const current = events[idx];
  const meta = fmtDate(current._date) + (current.venue ? " · " + current.venue : "");
  const dl = deadlineText(current._deadline);

  const handleClose = () => {
    try {
      sessionStorage.setItem("iedc-annc-dismissed", "1");
    } catch (e) {}
    setDismissed(true);
  };

  return (
    <div className="annc" role="region" aria-label="Announcement">
      <div className="container annc-inner">
        <p className="annc-text" aria-live="polite">
          <span className="annc-flag">Next up</span>
          <strong className="annc-title">{current.title}</strong>
          <span className="annc-meta">{meta}</span>
          {dl && <span className="annc-deadline">{dl}</span>}
        </p>

        <div className="annc-actions">
          {events.length > 1 && (
            <span className="annc-count">
              {idx + 1} / {events.length}
            </span>
          )}
          {current.registrationUrl && (
            <a
              className="annc-cta"
              href={current.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Register for ${current.title}`}
            >
              Register now →
            </a>
          )}
          <button
            type="button"
            className="annc-close"
            aria-label="Dismiss announcement"
            onClick={handleClose}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
