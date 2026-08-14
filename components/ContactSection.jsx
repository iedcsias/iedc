"use client";

import { useState } from "react";
import SITE_CONFIG from "@/data/site-config";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [note, setNote] = useState(
    "Sending opens your email app, addressed to iedc@siasindia.org."
  );
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (formData.name.trim().length < 2) {
      errs.name = "Please tell us your name.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "That email doesn't look right — check for typos.";
    }
    if (formData.phone.trim() && !/^[+\d][\d\s()-]{6,}$/.test(formData.phone.trim())) {
      errs.phone = "Use digits (and +, spaces) — or leave it empty.";
    }
    if (formData.message.trim().length < 10) {
      errs.message = "A few more words help us reply usefully.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const to = SITE_CONFIG.contact.email || "iedc@siasindia.org";
    const subject = `Message from ${formData.name} — iedcsias.github.io`;
    const body = `${formData.message}\n\n— ${formData.name}\nEmail: ${formData.email}${
      formData.phone ? "\nPhone: " + formData.phone : ""
    }`;

    window.location.href = `mailto:${to}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    setNote(
      `Your email app should open now — hit send there and we'll reply to ${formData.email}.`
    );
    setIsSuccess(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="section-head lit">
          <span className="section-node" aria-hidden="true"></span>
          <span className="section-num" aria-hidden="true">
            08
          </span>
          <h2>Let's talk</h2>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <p className="section-sub in" data-reveal>
              Got an idea, a question, or a collaboration in mind? We love hearing from students, mentors and partners.
            </p>

            <div className="info-block in" data-reveal>
              <h3>Find us</h3>
              <p>
                Safi Institute of Advanced Study (SIAS)<br />
                Rasia Nagar, Vazhayoor East<br />
                Kerala 673633
              </p>
            </div>
            <div className="info-block in" data-reveal>
              <h3>Write or call</h3>
              <p>
                <a href={`mailto:${SITE_CONFIG.contact.email}`}>{SITE_CONFIG.contact.email}</a><br />
                <a href={`tel:${SITE_CONFIG.contact.phone.replace(/\s+/g, "")}`}>{SITE_CONFIG.contact.phone}</a>
              </p>
            </div>
            <div className="info-block in" data-reveal>
              <h3>Follow the work</h3>
              <p>
                <a href={SITE_CONFIG.contact.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram — {SITE_CONFIG.contact.instagramHandle}
                </a>
              </p>
            </div>
          </div>

          <form className="contact-form in" id="contactForm" noValidate data-reveal onSubmit={handleSubmit}>
            <h3>Send us a message</h3>

            <div className="field">
              <label htmlFor="cfName">Full name</label>
              <input
                type="text"
                id="cfName"
                name="name"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>

            <div className="field">
              <label htmlFor="cfEmail">Email</label>
              <input
                type="email"
                id="cfEmail"
                name="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            <div className="field">
              <label htmlFor="cfPhone">
                Phone <span className="optional">(optional)</span>
              </label>
              <input
                type="tel"
                id="cfPhone"
                name="phone"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                aria-invalid={errors.phone ? "true" : "false"}
              />
              {errors.phone && <p className="field-error">{errors.phone}</p>}
            </div>

            <div className="field">
              <label htmlFor="cfMessage">Message</label>
              <textarea
                id="cfMessage"
                name="message"
                rows="4"
                required
                value={formData.message}
                onChange={handleChange}
                aria-invalid={errors.message ? "true" : "false"}
              ></textarea>
              {errors.message && <p className="field-error">{errors.message}</p>}
            </div>

            <button type="submit" className="btn btn-volt">
              Send message
            </button>
            <p className={`form-note ${isSuccess ? "is-success" : ""}`} id="formNote">
              {note}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
