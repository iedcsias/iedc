"use client";

import { useState, useEffect } from "react";
import ANNOUNCEMENTS from "@/data/announcements";
import SITE_CONFIG from "@/data/site-config";

function parseDate(str) {
  if (!str) return null;
  const p = String(str).split("-");
  if (p.length !== 3) return null;
  const d = new Date(+p[0], +p[1] - 1, +p[2]);
  return isNaN(d.getTime()) ? null : d;
}

function deadlineText(d) {
  if (!d) return null;
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const n = Math.round((d - startOfToday) / 86400000);
  if (n < 0) return null;
  if (n === 0) return "Closes today";
  if (n === 1) return "Closes tomorrow";
  if (n <= 7) return "Closes in " + n + " days";
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return "Closes " + MONTHS[d.getMonth()] + " " + d.getDate();
}

export default function EventsSection() {
  const [events, setEvents] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (index) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const list = (ANNOUNCEMENTS || [])
      .filter((a) => a && a.active && a.title)
      .map((a) => ({
        ...a,
        _date: parseDate(a.date) || new Date(),
        _deadline: parseDate(a.deadline),
      }))
      .sort((a, b) => a._date - b._date);

    setEvents(list);
  }, []);

  const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  return (
    <section className="section" id="events">
      <div className="container">
        <div className="section-head lit">
          <span className="section-node" aria-hidden="true"></span>
          <span className="section-num" aria-hidden="true">
            01
          </span>
          <h2>Upcoming events</h2>
        </div>

        <div className="events-grid" id="eventsGrid">
          {events.length === 0 ? (
            <div className="empty-state in" data-reveal>
              <span className="empty-node"></span>
              <h3>Nothing on the calendar — yet</h3>
              <p>
                New events are announced on Instagram first, then land here with registration links.
              </p>
              <a
                className="btn btn-ghost btn-sm"
                href={SITE_CONFIG.contact.instagram || "https://instagram.com/iedc.sias"}
                target="_blank"
                rel="noopener noreferrer"
              >
                Follow {SITE_CONFIG.contact.instagramHandle || "@iedc.sias"}
              </a>
            </div>
          ) : (
            events.map((a, i) => {
              const day = a._date.getDate();
              const dayStr = day < 10 ? "0" + day : day;
              const monthStr = MONTHS[a._date.getMonth()];
              const yearStr = a._date.getFullYear();
              const dl = deadlineText(a._deadline);
              const isFlipped = !!flippedCards[i];

              return (
                <div 
                  key={i} 
                  className={`event-flip-card in ${isFlipped ? "flipped" : ""}`}
                  data-reveal 
                  style={{ "--i": i % 6 }}
                  onClick={() => toggleFlip(i)}
                >
                  <div className="flip-card-content">
                    {/* RESTING STATE: Rotating neon glowing border + Date / Title */}
                    <div className="flip-card-back">
                      <div className="flip-card-back-content">
                        <div className="flip-date-badge">
                          <span className="flip-date-day">{dayStr}</span>
                          <span className="flip-date-mon">{monthStr}</span>
                          <span className="flip-date-year">{yearStr}</span>
                        </div>
                        
                        <div className="flip-event-info">
                          <div className="flip-event-tag">IEDC SIAS EVENT</div>
                          <h3 className="flip-event-title">{a.title}</h3>
                        </div>

                        <div className="flip-hint-pill">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                          <span>Hover / Tap for details</span>
                        </div>
                      </div>
                    </div>

                    {/* FLIPPED STATE: Floating glowing spheres + Description + CTA */}
                    <div className="flip-card-front">
                      <div className="floating-glow-bg">
                        <div className="glow-circle" id="circle1"></div>
                        <div className="glow-circle" id="circleBottom"></div>
                        <div className="glow-circle" id="circleRight"></div>
                      </div>

                      <div className="flip-front-content">
                        <div className="flip-top-row">
                          <small className="flip-category-badge">
                            {dl ? dl : "Upcoming Event"}
                          </small>
                          {a.time && <span className="flip-venue-tag">{a.time}</span>}
                        </div>

                        <div className="flip-description-card">
                          <h4 className="flip-desc-title">{a.title}</h4>
                          {a.description && (
                            <p className="flip-desc-text">{a.description}</p>
                          )}

                          {a.venue && (
                            <div className="flip-meta-row">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8dd449" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                              </svg>
                              <span>{a.venue}</span>
                            </div>
                          )}

                          <div className="flip-card-actions" onClick={(e) => e.stopPropagation()}>
                            {a.registrationUrl ? (
                              <a
                                className="btn btn-volt btn-sm flip-reg-btn"
                                href={a.registrationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Register Now
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="5" y1="12" x2="19" y2="12"></line>
                                  <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                              </a>
                            ) : (
                              <span className="chip-soon flip-chip-soon">Registration opens soon</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
