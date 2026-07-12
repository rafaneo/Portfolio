import type { Achievement, Education, RadarAxis, SkillGroup } from "./types";

// Axes of the proficiency radar on the About page. Levels are 0–100;
// tune freely, the graph rescales.
export const radarAxes: RadarAxis[] = [
  { label: "BACKEND", level: 95 },
  { label: "FRONTEND", level: 80 },
  { label: "MOBILE", level: 75 },
  { label: "DATABASES", level: 85 },
  { label: "DEVOPS & INFRA", level: 80 },
  { label: "AI / ML", level: 60 },
];

export const skillGroups: SkillGroup[] = [
  {
    label: "BACKEND",
    items: ["Django", "DRF", "Wagtail", "Python", "REST APIs", "Microservices"],
  },
  {
    label: "FRONTEND",
    items: ["Next.js", "TypeScript", "Tailwind", "HTMX", "Playwright"],
  },
  { label: "MOBILE", items: ["Flutter", "Dart"] },
  { label: "DATABASES", items: ["PostgreSQL", "Supabase", "Redis"] },
  { label: "ASYNC & MESSAGING", items: ["Celery", "Redis", "RabbitMQ"] },
  {
    label: "CLOUD & INFRA",
    items: ["AWS", "GCP", "Docker", "Kubernetes", "Hetzner", "Nginx"],
  },
  {
    label: "DEVOPS & TOOLING",
    items: ["GitHub Actions", "Jenkins", "CI/CD", "Grafana", "Rancher"],
  },
  {
    label: "PRACTICES",
    items: [
      "System design",
      "API design",
      "Agile",
      "Code review",
      "Stakeholder comms",
    ],
  },
];

export const achievements: Achievement[] = [
  {
    id: "plutus-idea",
    title: "Plutus · BoC IDEA Programme",
    badge: "",
    summary:
      "Gamified financial-literacy startup selected for the Bank of Cyprus IDEA incubator.",
    story: [
      {
        type: "text",
        text: "Plutus is a gamified financial-literacy product for young learners that I co-founded, teaching money skills through play instead of lectures.",
      },
      {
        type: "text",
        text: "The product was selected for the Bank of Cyprus IDEA programme, securing €20k in funding alongside office space and mentoring to develop the product and its go-to-market.",
      },
      { type: "image", caption: "Plutus at the IDEA programme" },
      {
        type: "text",
        text: "Beyond the product itself, the programme was a crash course in pitching, product strategy and building for a real market. Those lessons carried directly into founding Caonyx.",
      },
    ],
  },
  {
    id: "boc-hackathon",
    title: "Bank of Cyprus Hackathon 4.0",
    badge: "",
    summary:
      "Second place out of 24 teams at Cyprus's largest fintech hackathon.",
    story: [
      {
        type: "text",
        text: "Placed 2nd out of 24 teams at the Bank of Cyprus Hackathon 4.0, building and pitching a working fintech prototype with my team over a single weekend.",
      },
      { type: "image", caption: "The team at Hackathon 4.0" },
      {
        type: "text",
        text: "From idea to demo in 48 hours: rapid scoping, splitting the build across the team, and shipping something judges could actually click through.",
      },
    ],
  },
  {
    id: "huawei-seeds",
    title: "Huawei Seeds Hackathon",
    badge: "",
    summary: "First place in Cyprus at Huawei's Seeds for the Future hackathon.",
    story: [
      {
        type: "text",
        text: "Won first place in Cyprus at the Huawei Seeds for the Future hackathon.",
      },
      { type: "image", caption: "Huawei Seeds for the Future" },
      {
        type: "text",
        text: "The winning pitch combined a technically credible prototype with a clear story about who it serves and why it matters.",
      },
    ],
  },
  {
    id: "esa-actinspace",
    title: "ESA ActInSpace Hackathon",
    badge: "",
    summary:
      "Second place in Cyprus at the European Space Agency's ActInSpace hackathon.",
    story: [
      {
        type: "text",
        text: "Took 2nd place in Cyprus at ActInSpace, the European Space Agency's innovation hackathon, building a product concept on top of real space technologies and patents.",
      },
      { type: "image", caption: "ActInSpace Cyprus finals" },
    ],
  },
  {
    id: "digital-championship",
    title: "Digital Championship 2017–18",
    badge: "3RD CY",
    summary: "Third place nationally, an early start in building software.",
    story: [
      {
        type: "text",
        text: "Placed 3rd in Cyprus at the Digital Championship 2017–18, my first national competition, back when programming was still just a hobby.",
      },
      { type: "image", caption: "Digital Championship awards" },
      {
        type: "text",
        text: "It was the first signal that building software could be more than a pastime: the start of the path that led here.",
      },
    ],
  },
];

export const education: Education = {
  years: "2020 – 2024",
  degree: "BSc Computer Science & Engineering",
  school: "Cyprus University of Technology",
  description:
    "Thesis on blockchain technologies, NFTs and web development: a proof-of-concept rental marketplace built on blockchain/NFT primitives. Focus on distributed systems and web development.",
};
