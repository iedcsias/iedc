import SITE_DATA from "@/data/content-2026-27";
import SITE_CONFIG from "@/data/site-config";

export default function GallerySection() {
  const items = SITE_DATA.gallery || [];

  return (
    <section className="section" id="gallery">
      <div className="container">
        <div className="section-head lit">
          <span className="section-node" aria-hidden="true"></span>
          <span className="section-num" aria-hidden="true">
            05
          </span>
          <h2>Gallery</h2>
        </div>

        <div className={`gallery-grid ${items.length === 0 ? "is-empty" : ""}`} id="galleryGrid">
          {items.length === 0 ? (
            <div className="empty-state in" data-reveal>
              <span className="empty-node"></span>
              <h3>This year's story starts soon</h3>
              <p>
                Photos from the first 2026–27 events will land here. The archive lives on Instagram meanwhile.
              </p>
              <a
                className="btn btn-ghost btn-sm"
                href={SITE_CONFIG.contact.instagram || "https://instagram.com/iedc.sias"}
                target="_blank"
                rel="noopener noreferrer"
              >
                See past moments {SITE_CONFIG.contact.instagramHandle || "@iedc.sias"}
              </a>
            </div>
          ) : (
            items.map((g, idx) => (
              <figure key={idx}>
                <img src={g.src} alt={g.alt || "IEDC SIAS event photo"} loading="lazy" />
              </figure>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
