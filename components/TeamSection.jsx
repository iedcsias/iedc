import SITE_TEAM from "@/data/team-2026-27";

function avatarURI(name) {
  const initials = String(name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='500'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#F4E63F'/><stop offset='0.5' stop-color='#8DD449'/><stop offset='1' stop-color='#2FA84F'/></linearGradient></defs><rect width='400' height='500' fill='#12301F'/><circle cx='200' cy='230' r='96' fill='none' stroke='url(#g)' stroke-width='3'/><text x='200' y='230' text-anchor='middle' dominant-baseline='central' font-family='Arial, Helvetica, sans-serif' font-size='68' font-weight='700' fill='#EAF2EA'>${initials}</text></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

export default function TeamSection({ currentYear = "2026–27" }) {
  const team = SITE_TEAM.team || { tiers: [], members: [] };

  return (
    <section className="section" id="team">
      <div className="container">
        <div className="section-head lit">
          <span className="section-node" aria-hidden="true"></span>
          <span className="section-num" aria-hidden="true">
            06
          </span>
          <h2>Meet the leads <span>{currentYear}</span></h2>
        </div>
        <p className="section-sub in" data-reveal>
          The people who make things happen at SIAS — leads first, and the crew that carries every event over the line.
        </p>

        <div id="teamGroups">
          {team.tiers.map((tier) => {
            const members = team.members
              .filter((m) => m.tier === tier.id)
              .sort((a, b) => (a.order || 0) - (b.order || 0));

            if (members.length === 0) return null;

            return (
              <div key={tier.id} className="team-tier">
                <div className="team-tier-head">
                  <h3>{tier.label}</h3>
                  <span className="team-tier-count">{members.length}</span>
                </div>

                <div className={`team-grid tier-${tier.id}`}>
                  {members.map((m, i) => (
                    <article key={i} className="team-card in" data-reveal style={{ "--i": i % 8 }}>
                      <div className="team-photo">
                        <img
                          src={m.photo ? `/${m.photo}` : avatarURI(m.name)}
                          alt={`${m.name}, ${m.position}`}
                          loading="lazy"
                          width="400"
                          height="500"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = avatarURI(m.name);
                          }}
                        />
                      </div>
                      <div className="team-meta">
                        <h3 className="team-name">{m.name}</h3>
                        <p className="team-role">{m.position}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
