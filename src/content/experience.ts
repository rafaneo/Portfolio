import type { ExperienceRole } from "./types";

export const roles: ExperienceRole[] = [
  {
    id: "imt",
    num: "01",
    dates: "APR 2025 – NOW",
    location: "NETHERLANDS",
    locationFull: "Breda, Netherlands",
    title: "Engineering Project Coordinator",
    org: "Intermodal Telematics",
    kicker: "IOT · COORDINATION · PLATFORMS",
    summary:
      "End-to-end technical planning and delivery coordination across software, firmware, hardware, support and production teams.",
    stack: "Django · Next.js · MUI · Tailwind",
    story: [
      "Own technical planning and delivery coordination across software, firmware, hardware, support and production teams, with end-to-end coordination until product delivery.",
      "Led a full product lifecycle from ideation to production within one year, coordinating customer requirements, engineering, suppliers, component ordering, pricing, assembly and delivery while mitigating risks and minimising delays.",
      "Built a custom company-wide internal portal (Django, Next.js, MUI, Tailwind) replacing a Metabase-based dashboarding setup, centralising device operations, command tooling and engineering workflows.",
      "Developed tools supporting large-scale IoT device operations, company-wide device updates and remote command execution across thousands of deployed units.",
      "Designed a proof of concept for symmetric-key encrypted device-to-server messaging and OTA across a multi-tenant fleet; handed off as the company-wide standard.",
    ],
  },
  {
    id: "caonyx",
    num: "02",
    dates: "OCT 2023 – NOW",
    location: "CYPRUS",
    locationFull: "Limassol, Cyprus",
    title: "Co-founder",
    org: "Caonyx",
    kicker: "FOUNDING · FULL-STACK · DELIVERY",
    summary:
      "Co-founded a software company delivering custom platforms, web and mobile applications, CMS solutions and startup products.",
    stack:
      "Django/DRF · Next.js · Flutter · Wagtail · PostgreSQL · Celery · Redis · Docker",
    story: [
      "Lead architecture and development across backend, frontend, mobile, infrastructure and client-facing delivery.",
      "Shipped the Synergas platform (customer and staff management, shipment management, live order tracking, dashboards, RBAC) with a Django/DRF backend, Next.js admin and Flutter mobile app.",
      "Built a greenfield replacement for an accounting firm’s legacy software (~25 employees, 500+ end customers): backend platform, Flutter receipt-submission app and an OCR microservice.",
      "Re-engineered Wagtail → Next.js content updates with persistent backend comms and batched delivery, cutting editor-to-frontend latency from 2–3 s to 50–100 ms; contributed back to the Headless Wagtail open-source community.",
      "Delivered production sites across Django, Next.js, Wagtail and Shopify: Allesura, Cyfireworks, AKTI, Synergas.",
    ],
  },
  {
    id: "pw",
    num: "03",
    dates: "JAN 2024 – APR 2025",
    location: "CYPRUS",
    locationFull: "Cyprus",
    title: "Mid Software Engineer",
    org: "ParallaxWorks",
    kicker: "MARTECH · MICROSERVICES",
    summary:
      "Personar: a marketing and personalisation platform delivering recommendations and campaigns across multiple organisations.",
    stack: "Django/DRF · Kubernetes · Tilt · Rancher · Longhorn",
    story: [
      "Built integrations for multiple communication channels: WhatsApp, Viber, email and mobile notifications.",
      "Developed backend logic for audience selection, campaign delivery rules, silent hours and user eligibility, controlling which users receive which messages and when.",
      "Designed and implemented messaging workflows for personalised outreach across multiple channels.",
      "Contributed to a Kubernetes-based microservice architecture using Tilt, Rancher, Longhorn and Lens; Django, DRF and containerised service deployments.",
    ],
  },
  {
    id: "cut",
    num: "04",
    dates: "DEC 2024 – APR 2025",
    location: "CYPRUS",
    locationFull: "Limassol, Cyprus",
    title: "Special Research Staff",
    org: "Cyprus University of Technology",
    kicker: "RESEARCH · ML · DRONES",
    summary:
      "Drone-based remote health support and disaster response platform for locating people in inaccessible or high-risk environments.",
    stack: "Python · YOLO · RTMP · DJI SDK",
    story: [
      "Built a drone-based remote health support and disaster response platform for locating people in inaccessible or high-risk environments.",
      "Integrated DJI drone video streaming with backend processing and ML-based person detection.",
      "Fine-tuned a YOLO model to detect people in atypical positions: lying on the ground, partially obscured.",
      "Optimised the RTMP drone-to-server pipeline, significantly reducing latency and enabling near real-time video processing.",
      "Contributed to raw and post-processed video stream handling, structured snapshot storage and reporting workflows.",
    ],
  },
];

const compact = (
  num: string,
  dates: string,
  title: string,
  org: string
): ExperienceRole => ({
  id: org.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  num,
  dates,
  location: "CYPRUS",
  locationFull: "Cyprus",
  title,
  org,
  kicker: "",
  summary: "",
  stack: "",
  story: [],
});

roles.push(
  compact("05", "2021 – 2023", "Software Developer", "PHOEBE Research & Innovation"),
  compact("06", "2022 – 2023", "Team Lead / Developer", "Ordinatio Garden Industry"),
  compact("07", "2021", "Unity 3D Developer", "Algolysis Ltd"),
  compact("08", "2021", "Electronics Specialist Intern", "CSEO"),
  compact("09", "2020 – 2021", "Embedded Systems Engineer", "Engino")
);
