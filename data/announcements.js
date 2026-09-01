const ANNOUNCEMENTS = [
  {
    title: "IEDC SIAS 2026–27 Annual Hackathon",
    date: "2026-09-15",
    time: "09:30 AM",
    venue: "Main Auditorium, SIAS Campus",
    description:
      "24-hour campus hackathon to build prototype solutions for real-world entrepreneurial challenges.",
    registrationUrl: "https://iedcsias.org/apply",
    deadline: "2026-09-10",
    active: true,
  },
  {
    title: "Startup Bootcamp & Founder Track",
    date: "2026-09-28",
    time: "10:00 AM",
    venue: "IEDC Innovation Lab, SIAS",
    description:
      "Interactive workshop on venture incubation, pitch deck design, and student startup grants.",
    registrationUrl: "",
    deadline: "2026-09-25",
    active: true,
  },
  {
    title: "Executive Tech Summit & Demo Day",
    date: "2026-10-12",
    time: "11:00 AM",
    venue: "Seminar Hall, SIAS Campus",
    description:
      "Showcase of student-built tech platforms, peer reviews, and mentorship sessions.",
    registrationUrl: "",
    deadline: "2026-10-08",
    active: true,
  }
];

if (typeof window !== "undefined") {
  window.ANNOUNCEMENTS = ANNOUNCEMENTS;
}

export default ANNOUNCEMENTS;
