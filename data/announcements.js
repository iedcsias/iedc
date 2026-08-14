const ANNOUNCEMENTS = [
  {
    title: "IEDC SIAS 2026–27 Kickoff",
    date: "2026-08-05",
    time: "10:00 AM",
    venue: "Safi Institute of Advanced Study",
    description:
      "Meet the new core team, hear the year's plan, and find your first project.",
    registrationUrl: "",
    deadline: "2026-08-01",
    active: true,
  },
];

if (typeof window !== "undefined") {
  window.ANNOUNCEMENTS = ANNOUNCEMENTS;
}

export default ANNOUNCEMENTS;
