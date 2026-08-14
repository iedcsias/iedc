"use client";

import { useState } from "react";

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      id: "faq1",
      question: "What is IEDC?",
      answer:
        "The Innovation and Entrepreneurship Development Centre (IEDC) is an initiative that transforms young people into technological entrepreneurs and innovative leaders. IEDC SIAS believes in a culture beyond textbooks: we back innovative ideas early and support students until those ideas become solid projects — a platform to pursue ideas and businesses from the very first stage.",
    },
    {
      id: "faq2",
      question: "What is KSUM?",
      answer: (
        <>
          <p>
            The Kerala Startup Mission (KSUM) is the Government of Kerala's nodal agency for promoting entrepreneurship, and the implementing body of the Kerala Technology Startup Policy. Founded in 2006, it builds the infrastructure and ecosystem that technology startups need to grow.
          </p>
          <p>
            Today that ecosystem counts 2,900+ registered startups, 10&nbsp;lakh+ sq.&nbsp;ft. of incubation space, 40+ incubators and 300+ innovation centres across Kerala — including this one. For student founders, KSUM means real support across the whole startup life cycle: incubation, mentorship, government schemes, funding and expansion opportunities.
          </p>
        </>
      ),
    },
    {
      id: "faq3",
      question: "What is a startup?",
      answer:
        "A startup is a company in the first stages of operation, founded by one or more entrepreneurs to build a product or service they believe people want.",
    },
    {
      id: "faq4",
      question: "How does IEDC SIAS help me?",
      answer:
        "We give you what a first-time founder actually needs: venues and tools to prototype, workshops and webinars to build skills, EN-Talks to learn from real founders, competitions to test your idea — and access to KSUM's startup ecosystem when you're ready to take it further.",
    },
  ];

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="section-head lit">
          <span className="section-node" aria-hidden="true"></span>
          <span className="section-num" aria-hidden="true">
            07
          </span>
          <h2>Any questions? Answered.</h2>
        </div>

        <div className="faq-list">
          {faqs.map((item, idx) => (
            <div key={item.id} className="faq-item in" data-reveal>
              <h3>
                <button
                  className="faq-btn"
                  aria-expanded={openIdx === idx}
                  aria-controls={item.id}
                  onClick={() => toggle(idx)}
                >
                  {item.question}
                  <span className="faq-icon" aria-hidden="true"></span>
                </button>
              </h3>
              <div
                className={`faq-panel ${openIdx === idx ? "open" : ""}`}
                id={item.id}
                role="region"
              >
                <div className="faq-body">
                  {typeof item.answer === "string" ? <p>{item.answer}</p> : item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
