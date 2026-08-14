const SITE_CONFIG = {
  currentYear: "2026-27",
  years: [
    { id: "2026-27", type: "data" },
    { id: "2025-26", type: "page", href: "2025-26" },
  ],
  contact: {
    address:
      "Safi Institute of Advanced Study (SIAS), Rasia Nagar, Vazhayoor East, Kerala 673633",
    email: "iedc@siasindia.org",
    phone: "+91 99953 86355",
    instagram: "https://instagram.com/iedc.sias",
    instagramHandle: "@iedc.sias",
  },
};

if (typeof window !== "undefined") {
  window.SITE_CONFIG = SITE_CONFIG;
}

export default SITE_CONFIG;
