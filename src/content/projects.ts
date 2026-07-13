import type { Project } from "./types";

export const projects: Project[] = [
  {
    id: "synergas",
    category: "SAAS · LOGISTICS",
    orgLabel: "CAONYX",
    title: "Synergas Platform",
    description:
      "Full-stack platform for a gas-shipping company: customer & staff management, shipment management, live order tracking, notifications, dashboards, RBAC and customer support.",
    shortDescription:
      "Full-stack platform for a gas-shipping company: live order tracking, dashboards, RBAC, mobile app.",
    stack: "Django/DRF · Next.js · Flutter · PostgreSQL · Celery/Redis · Firebase",
    featured: true,
    story: [
      { type: "text", text: "Full-stack platform for Synergas, a gas-shipping company: customer and staff management, shipment management, live order tracking, notifications, dashboards, RBAC and customer support." },
      { type: "text", text: "Django/DRF backend, Next.js admin portal and a Flutter mobile app for customers, backed by PostgreSQL, Celery and Redis, with Firebase push notifications." },
      { type: "text", text: "Built and delivered through Caonyx, from the first architecture sketch to production rollout." },
    ],
  },
  {
    id: "imt-portal",
    category: "IOT · INTERNAL TOOLS",
    orgLabel: "INTERMODAL TELEMATICS",
    title: "IMT Device Portal",
    description:
      "Company-wide internal portal replacing a Metabase setup: device operations, fleet-wide updates and remote command execution across thousands of deployed IoT units.",
    shortDescription:
      "Company-wide portal for fleet operations, OTA updates and remote commands across thousands of devices.",
    stack: "Django · Next.js · MUI · Tailwind",
    featured: true,
    story: [
      { type: "text", text: "Company-wide internal portal replacing a Metabase-based dashboarding setup, centralising device operations, command tooling and engineering workflows." },
      { type: "text", text: "Supports large-scale IoT fleet operations: company-wide device updates and remote command execution across thousands of deployed units." },
      { type: "text", text: "Built with Django, Next.js, MUI and Tailwind." },
    ],
  },
  {
    id: "accounting-platform",
    category: "FINTECH · SAAS",
    orgLabel: "CAONYX",
    title: "Accounting Platform",
    description:
      "Greenfield replacement for an accounting firm's legacy software serving ~25 employees and 500+ end customers: backend platform, Flutter receipt-submission app and an OCR microservice.",
    shortDescription:
      "Greenfield replacement for an accounting firm's legacy software: backend, mobile app, OCR microservice.",
    stack: "Django · Flutter · OCR/LLM · PostgreSQL",
    featured: false,
    story: [
      { type: "text", text: "Greenfield replacement for an accounting firm's legacy software, serving ~25 employees and 500+ end customers." },
      { type: "text", text: "Backend platform, a Flutter receipt-submission app for customers and an OCR microservice for automated document intake." },
      { type: "text", text: "Delivered through Caonyx with Django, Flutter and PostgreSQL." },
    ],
  },
  {
    id: "plutus",
    category: "FINTECH · STARTUP",
    orgLabel: "CO-FOUNDER",
    title: "Plutus",
    description:
      "Gamified financial-literacy product for young learners. Secured €20k funding, office space and mentoring via the Bank of Cyprus IDEA programme.",
    shortDescription:
      "Gamified financial-literacy product. €20k funding via the Bank of Cyprus IDEA programme.",
    stack: "Django · Flutter · Product strategy",
    featured: true,
    story: [
      { type: "text", text: "Gamified financial-literacy product for young learners, co-founded as a startup." },
      { type: "text", text: "Secured €20k in funding, office space and mentoring via the Bank of Cyprus IDEA programme." },
      { type: "text", text: "Built with Django and Flutter; equal parts product strategy and engineering." },
    ],
  },
  {
    id: "personar",
    category: "MARTECH · MICROSERVICES",
    orgLabel: "PARALLAXWORKS",
    title: "Personar",
    description:
      "Marketing & personalisation platform: multi-channel campaign delivery (WhatsApp, Viber, email, push), audience selection and eligibility rules across organisations.",
    shortDescription:
      "Marketing & personalisation platform: multi-channel campaigns, audience selection, eligibility rules.",
    stack: "Django/DRF · Kubernetes · Tilt · Rancher",
    featured: false,
    story: [
      { type: "text", text: "Marketing and personalisation platform delivering recommendations and campaigns across multiple organisations." },
      { type: "text", text: "Multi-channel campaign delivery across WhatsApp, Viber, email and push: audience selection, delivery rules, silent hours and user eligibility." },
      { type: "text", text: "Kubernetes-based microservice architecture with Django/DRF, Tilt, Rancher and Longhorn." },
    ],
  },
  {
    id: "drone-response",
    category: "RESEARCH · ML",
    orgLabel: "CUT",
    title: "Drone Health & Disaster Response",
    description:
      "Drone-based platform locating people in inaccessible environments: DJI video streaming, fine-tuned YOLO person detection and a near real-time RTMP pipeline.",
    shortDescription:
      "Drone-based platform locating people in inaccessible environments: YOLO detection, RTMP pipeline.",
    stack: "Python · YOLO · RTMP · ML pipelines",
    featured: false,
    story: [
      { type: "text", text: "Drone-based remote health support and disaster response platform for locating people in inaccessible or high-risk environments." },
      { type: "text", text: "DJI drone video streaming integrated with backend processing and a fine-tuned YOLO model detecting people in atypical positions." },
      { type: "text", text: "Optimised RTMP drone-to-server pipeline enabling near real-time video processing." },
    ],
  },
  {
    id: "client-work",
    category: "CLIENT WORK · DELIVERED",
    orgLabel: "CAONYX",
    title: "Client websites & platforms",
    description:
      "Production sites and platforms across Django, Next.js, Wagtail and Shopify, including Allesura, Cyfireworks, AKTI and Synergas. Plus a re-engineered Wagtail → Next.js content pipeline (2–3 s → 50–100 ms) contributed back to the Headless Wagtail community.",
    shortDescription:
      "Production sites and platforms across Django, Next.js, Wagtail and Shopify.",
    stack: "Django · Next.js · Wagtail · Shopify",
    featured: false,
    spanFull: true,
    url: "https://caonyx.com",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
