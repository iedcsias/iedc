import "./globals.css";
import RevealObserver from "@/components/RevealObserver";

export const metadata = {
  title: "IEDC SIAS — Innovation & Entrepreneurship Development Centre | 2026–27",
  description:
    "IEDC SIAS is the student-run Innovation & Entrepreneurship Development Centre at Safi Institute of Advanced Study, Kerala — turning student ideas into prototypes and ventures, backed by Kerala Startup Mission. Explore the 2026–27 team, events and programmes.",
  canonical: "https://iedcsias.github.io/",
  openGraph: {
    type: "website",
    url: "https://iedcsias.github.io/",
    siteName: "IEDC SIAS",
    title: "IEDC SIAS | 2026–27 — Ideas are easy. Acting on them is everything.",
    description:
      "The student-run innovation and entrepreneurship centre at SIAS, Vazhayoor. Events, programmes and the 2026–27 core team.",
    images: ["https://iedcsias.github.io/assets/images/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "IEDC SIAS | 2026–27",
    description:
      "Ideas are easy. Acting on them is everything. The student-run innovation centre at SIAS, Kerala.",
    images: ["https://iedcsias.github.io/assets/images/logo.png"],
  },
  icons: {
    icon: "/assets/images/favicon.png",
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "IEDC SIAS",
    alternateName:
      "Innovation and Entrepreneurship Development Centre, Safi Institute of Advanced Study",
    url: "https://iedcsias.github.io/",
    logo: "https://iedcsias.github.io/assets/images/logo.png",
    email: "iedc@siasindia.org",
    telephone: "+91 99953 86355",
    sameAs: ["https://instagram.com/iedc.sias"],
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Safi Institute of Advanced Study, Rasia Nagar, Vazhayoor East",
      addressRegion: "Kerala",
      postalCode: "673633",
      addressCountry: "IN",
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Audiowide&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600;700&family=Orbitron:wght@600;700;800;900&family=Space+Grotesk:wght@500;600;700;800&family=Syne:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <RevealObserver />
        {children}
      </body>
    </html>
  );
}
