import HashRedirect from "@/components/HashRedirect";
import HeroSection from "@/components/HeroSection";
import EventsSection from "@/components/EventsSection";
import AboutSection from "@/components/AboutSection";
import SupportSection from "@/components/SupportSection";
import ProgrammesSection from "@/components/ProgrammesSection";
import GallerySection from "@/components/GallerySection";
import TeamSection from "@/components/TeamSection";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <HashRedirect />
      <main id="main">
        {/* 1) Home page */}
        <HeroSection />

        {/* 2) Upcoming events & About */}
        <EventsSection />
        <AboutSection />

        {/* 3) How we support you */}
        <SupportSection />

        {/* 4) Activities & Gallery */}
        <ProgrammesSection />
        <GallerySection />

        {/* 5) Meet the leads */}
        <TeamSection currentYear="2026–27" />

        {/* 6) Get in touch */}
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
