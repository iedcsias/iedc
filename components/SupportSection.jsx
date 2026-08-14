export default function SupportSection() {
  const supports = [
    {
      title: "Objective",
      desc: "To foster an entrepreneurial culture and build a platform that turns student ideas into high-potential ventures.",
      points: [
        "Conduct bootcamps and product design workshops",
        "Enable hands-on prototyping and validation",
        "Provide direct linkages with mentors and investors"
      ],
      icon: (
        <svg className="support-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      )
    },
    {
      title: "Vision",
      desc: "To be a leading student innovation launchpad in Kerala, driving local economic and technological advancement.",
      points: [
        "Nurture a generation of problem solvers",
        "Incubate sustainable tech startups from SIAS",
        "Build a lasting innovation hub in Vazhayoor"
      ],
      icon: (
        <svg className="support-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      )
    },
    {
      title: "How We Support",
      desc: "Providing access to direct support infrastructure, grants, and scaling pathways backed by KSUM.",
      points: [
        "Pre-seed grants and prototype support",
        "Intellectual property and patent guidance",
        "Access to KSUM incubation and workspace facilities"
      ],
      icon: (
        <svg className="support-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      )
    }
  ];

  return (
    <section className="section" id="support">
      <div className="container">
        <div className="section-head lit">
          <span className="section-node" aria-hidden="true"></span>
          <span className="section-num" aria-hidden="true">
            03
          </span>
          <h2>How we support you</h2>
        </div>
        <p className="section-sub in" data-reveal>
          Turning creative ideas into working ventures with mentoring, resources, and institutional support.
        </p>

        <div className="support-grid">
          {supports.map((s, i) => (
            <div key={i} className="support-card in" data-reveal style={{ "--i": i }}>
              <div className="support-card-header">
                <div className="support-icon-wrapper">{s.icon}</div>
                <h3>{s.title}</h3>
              </div>
              <p className="support-card-desc">{s.desc}</p>
              <ul className="support-card-list">
                {s.points.map((p, idx) => (
                  <li key={idx}>
                    <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
