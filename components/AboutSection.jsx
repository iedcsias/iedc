"use client";

export default function AboutSection() {
  const pillars = [
    {
      icon: "💡",
      title: "Ideation & Prototyping",
      desc: "Hands-on guidance and makerspace tools to translate rough ideas into functional prototypes and software MVPs.",
    },
    {
      icon: "🎙️",
      title: "Founder Masterclasses",
      desc: "Regular EN-Talks, webinars, and fireside chats with seasoned startup founders and operators.",
    },
    {
      icon: "⚡",
      title: "Competitions & Hackathons",
      desc: "Pressure-testing projects in collegiate, state-level hackathons and national venture challenges.",
    },
    {
      icon: "🚀",
      title: "KSUM Incubation & Grants",
      desc: "Direct access to Kerala Startup Mission pre-seed funding, intellectual property guidance, and investor networks.",
    },
  ];

  return (
    <section className="section about-launchpad-section" id="about">
      <div className="container">
        <div className="section-head lit">
          <span className="section-node" aria-hidden="true"></span>
          <span className="section-num" aria-hidden="true">
            02
          </span>
          <h2>A place where ideas become ventures</h2>
        </div>

        <div className="about-grid-launchpad">
          <div className="about-copy-box in" data-reveal>
            <div className="about-lead-wrapper">
              <p className="lead-para">
                IEDC SIAS is the Innovation &amp; Entrepreneurship Development Centre at Safi Institute of Advanced Study — a launchpad run by students, for students, backed by Kerala Startup Mission (KSUM).
              </p>
              <p className="lead-subpara">
                We give creative minds the physical room, technological toolkits, and executive mentorship needed to turn innovative ideas into viable products and scalable ventures straight out of the campus classroom.
              </p>
            </div>

            {/* Official KSUM Collaboration Highlight Banner */}
            <div className="about-ksum-highlight">
              <div className="ksum-highlight-icon">
                <span className="ksum-crest-glow">🏛️</span>
              </div>
              <div className="ksum-highlight-text">
                <strong>Government of Kerala · KSUM Partner Node</strong>
                <p>
                  Official institutional accreditation providing direct eligibility for KSUM Innovation Grants up to ₹10 Lakhs, Young Innovators Programme (YIP), and state incubation support.
                </p>
              </div>
            </div>

            {/* 4 Pillars Grid */}
            <div className="about-pillars-grid">
              {pillars.map((item, idx) => (
                <div key={idx} className="about-pillar-card in" data-reveal style={{ "--i": idx }}>
                  <div className="pillar-top">
                    <span className="pillar-icon">{item.icon}</span>
                    <strong className="pillar-title">{item.title}</strong>
                  </div>
                  <p className="pillar-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="about-art-launchpad in" data-reveal aria-hidden="true">
            <div className="circuit-container-glow">
              <svg
                className="circuit"
                viewBox="0 0 380 440"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="cg" x1="0" y1="0" x2="380" y2="440" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#F4E63F" />
                    <stop offset="0.45" stopColor="#8DD449" />
                    <stop offset="1" stopColor="#2FA84F" />
                  </linearGradient>
                  <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <g className="circuit-paths" stroke="url(#cg)" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M190 418 V 250" />
                  <path d="M190 250 V 130 Q190 118 202 118 H 296" />
                  <path d="M190 250 Q190 238 178 238 H 96 Q84 238 84 226 V 96" />
                  <path d="M190 322 Q190 310 202 310 H 276 Q288 310 288 298 V 214" />
                  <path d="M190 178 Q190 166 178 166 H 128" />
                  <path d="M84 96 Q84 84 96 84 H 148" />
                </g>
                <g className="circuit-nodes" fill="#07130E" stroke="url(#cg)" strokeWidth="2.5">
                  <circle cx="296" cy="118" r="7" />
                  <circle cx="84" cy="96" r="7" />
                  <circle cx="288" cy="214" r="7" />
                  <circle cx="128" cy="166" r="7" />
                  <circle cx="148" cy="84" r="7" />
                </g>
                <g className="circuit-bulb" filter="url(#glow-filter)">
                  <circle cx="190" cy="418" r="14" fill="url(#cg)" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
