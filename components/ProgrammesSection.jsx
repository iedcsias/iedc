import SITE_DATA from "@/data/content-2026-27";

export default function ProgrammesSection() {
  const progs = (SITE_DATA.programmes || []).slice();

  const placeholders = [
    { tag: "Bootcamps", title: "Idea to prototype, hands-on", blurb: "First edition announced soon." },
    { tag: "EN-Talks", title: "Founders, unfiltered", blurb: "Speaker lineup in the works." },
    { tag: "Competitions", title: "Deadlines that sharpen ideas", blurb: "Dates land here first." },
  ];

  return (
    <section className="section" id="programmes">
      <div className="container">
        <div className="section-head lit">
          <span className="section-node" aria-hidden="true"></span>
          <span className="section-num" aria-hidden="true">
            04
          </span>
          <h2>Activities conducted</h2>
        </div>

        <div className="programmes-grid" id="programmesGrid">
          {progs.length === 0
            ? placeholders.map((p, i) => (
                <article key={i} className="prog-card is-placeholder in" data-reveal style={{ "--i": i }}>
                  <div className="prog-body">
                    <span className="prog-tag">{p.tag}</span>
                    <h3>{p.title}</h3>
                    <p>{p.blurb}</p>
                  </div>
                </article>
              ))
            : progs.map((p, i) => (
                <article key={i} className="prog-card in" data-reveal style={{ "--i": i % 6 }}>
                  <div className="prog-photo">
                    {p.photo ? (
                      <img src={p.photo} alt={p.title} loading="lazy" width="480" height="300" />
                    ) : (
                      <div className="prog-photo-fallback">{(p.title || "?").charAt(0)}</div>
                    )}
                  </div>
                  <div className="prog-body">
                    {p.tag && <span className="prog-tag">{p.tag}</span>}
                    <h3>{p.title}</h3>
                    {p.blurb && <p>{p.blurb}</p>}
                  </div>
                </article>
              ))}
        </div>
      </div>
    </section>
  );
}
