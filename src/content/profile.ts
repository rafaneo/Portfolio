import type { Profile } from "./types";

export const profile: Profile = {
  name: "Rafael Neocleous",
  brand: "RN – 2026",
  role: "Senior Software Engineer",
  location: "Breda, NL",
  locationFull: "Breda, Netherlands",
  email: "rafaneokleous@gmail.com",
  github: "https://github.com/rafaneo",
  githubLabel: "github.com/rafaneo",
  linkedin: "https://www.linkedin.com/in/rafael-neocleous",
  linkedinLabel: "rafael-neocleous",
  phoneNl: "+31 6 5748 0515",
  phoneCy: "+357 9775 0012",
  cvPath: "/cv.pdf",
  heroKicker: "Senior Software Engineer · Breda, NL",
  heroBlurb:
    "Backend systems, web platforms and mobile apps across SaaS, logistics, fintech, IoT and applied research. Six years owning systems from architecture and implementation through deployment and delivery. Co-founder at Caonyx.",
  heroStack: [""],
  aboutIntro: [
    "I'm a software engineer and co-founder with 6+ years building backend systems, web platforms, mobile applications and production software across SaaS, logistics, fintech, IoT and applied research.",
    "I own systems end to end: shaping the architecture, setting the technical direction, building and deploying, and seeing the result through to production. I plan roadmaps, break them down into work a team can execute, and keep engineers moving with clear priorities, code reviews and mentoring.",
    "A large part of my role happens outside the codebase. I translate between customers, management and engineering, keep stakeholders aligned on scope and timelines, and coordinate suppliers, budgets and risk so that delivery dates hold. Currently I coordinate engineering projects at Intermodal Telematics in the Netherlands, while running Caonyx, the software company I co-founded in Cyprus.",
  ],
  atAGlance: [
    { label: "Based in", value: "Breda, NL" },
    { label: "Experience", value: "6+ years" },
    { label: "Languages", value: "Greek · English" },
    { label: "Roles", value: "Engineer · Coordinator · Co-founder" },
  ],
  terminal: [
    { cmd: "whoami", out: "rafael · engineer · coordinator · co-founder" },
    { cmd: "pwd", out: "/sweden/lund" },
    { cmd: "uptime", out: "6+ years building production systems" },
    { cmd: "locale", out: "el_CY · en_GB" },
    // { cmd: "ls ~/companies", out: "intermodal-telematics/  caonyx/" },
  ],
  channels: [
    {
      key: "github",
      label: "GitHub",
      value: "github.com/rafaneo ↗",
      href: "https://github.com/rafaneo",
      external: true,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      value: "rafael-neocleous ↗",
      href: "https://www.linkedin.com/in/rafael-neocleous",
      external: true,
    },
    {
      key: "email",
      label: "Email",
      value: "rafaneokleous@gmail.com",
      href: "mailto:rafaneokleous@gmail.com",
    },
    { key: "phone-nl", label: "Phone – NL", value: "+31 6 5748 0515" },
    { key: "phone-cy", label: "Phone – CY", value: "+357 9775 0012" },
    { key: "location", label: "Location", value: "Breda, Netherlands" },
  ],
};
