export default function AboutSection() {
  return (
    <section className="section" id="about">
      <div className="container">
        <div className="section-head lit">
          <span className="section-node" aria-hidden="true"></span>
          <span className="section-num" aria-hidden="true">
            02
          </span>
          <h2>A place where ideas become ventures</h2>
        </div>

        <div className="about-grid">
          <div className="about-copy in" data-reveal>
            <p className="lead-para">
              IEDC SIAS is the Innovation &amp; Entrepreneurship Development Centre at Safi Institute of Advanced Study — a launchpad run by students, for students, backed by Kerala Startup Mission.
            </p>
            <p>
              We give creative students the room, tools and mentorship to turn innovative ideas into prototypes of viable products and services — and we promote technology-based ventures straight out of the classroom, with access to everything a first-time founder needs.
            </p>

            <ul className="about-list">
              <li className="in" data-reveal>
                <strong>Workshops &amp; bootcamps</strong>
                <span>Hands-on skills, from ideation to working prototype.</span>
              </li>
              <li className="in" data-reveal>
                <strong>EN-Talks &amp; webinars</strong>
                <span>Founders and operators sharing how it actually went.</span>
              </li>
              <li className="in" data-reveal>
                <strong>Competitions</strong>
                <span>Pressure-test your idea against real deadlines.</span>
              </li>
              <li className="in" data-reveal>
                <strong>Startup routes</strong>
                <span>Incubation and funding pathways through KSUM.</span>
              </li>
            </ul>
          </div>

          <div className="about-art in" data-reveal aria-hidden="true">
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
              <g className="circuit-bulb">
                <circle cx="190" cy="418" r="14" fill="url(#cg)" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
