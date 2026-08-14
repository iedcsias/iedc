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
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return "Closes " + MONTHS[d.getMonth()] + " " + d.getDate();
}

export default function EventsSection() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const list = (ANNOUNCEMENTS || [])
      .filter((a) => a && a.active && a.title)
      .map((a) => ({
        ...a,
        _date: parseDate(a.date),
        _deadline: parseDate(a.deadline),
      }))
      .filter((a) => a._date && a._date >= startOfToday)
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
              const dl = deadlineText(a._deadline);
              const metaBits = [];
              if (a.time) metaBits.push(a.time);
              if (a.venue) metaBits.push(a.venue);

              return (
                <article key={i} className="event-card in" data-reveal style={{ "--i": i % 6 }}>
                  <div className="event-datebox">
                    <span className="event-day">{dayStr}</span>
                    <span className="event-mon">{MONTHS[a._date.getMonth()]}</span>
                  </div>

                  <div className="event-body">
                    <h3>{a.title}</h3>
                    {a.description && <p className="event-desc">{a.description}</p>}
                    {metaBits.length > 0 && <p className="event-meta">{metaBits.join(" · ")}</p>}

                    <div className="event-foot">
                      {dl && <span className="event-deadline">{dl}</span>}
                      {a.registrationUrl ? (
                        <a
                          className="btn btn-volt btn-sm"
                          href={a.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Register for {a.title}
                        </a>
                      ) : (
                        <span className="chip-soon">Registration opens soon</span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
