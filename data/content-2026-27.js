const SITE_CONTENT = {
  programmes: [],
  gallery: [],
  stats: [
    { value: "KSUM", label: "Backed by Kerala Startup Mission" },
    { value: "5+", label: "flagship programmes so far" },
    { value: "20+", label: "student core team" },
  ],
};

if (typeof window !== "undefined") {
  window.SITE_DATA = window.SITE_DATA || {};
  window.SITE_DATA["2026-27"] = window.SITE_DATA["2026-27"] || {};
  window.SITE_DATA["2026-27"].programmes = SITE_CONTENT.programmes;
  window.SITE_DATA["2026-27"].gallery = SITE_CONTENT.gallery;
  window.SITE_DATA["2026-27"].stats = SITE_CONTENT.stats;
}

export default SITE_CONTENT;
