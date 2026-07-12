export type ContactChannel = {
  key: string;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
};

export type Profile = {
  name: string;
  brand: string;
  role: string;
  location: string;
  locationFull: string;
  email: string;
  github: string;
  githubLabel: string;
  linkedin: string;
  linkedinLabel: string;
  phoneNl: string;
  phoneCy: string;
  cvPath: string;
  heroKicker: string;
  heroBlurb: string;
  heroStack: string[];
  aboutIntro: string[];
  atAGlance: { label: string; value: string }[];
  terminal: TerminalLine[];
  channels: ContactChannel[];
};

export type ExperienceRole = {
  id: string;
  num: string;
  dates: string;
  location: string;
  locationFull: string;
  title: string;
  org: string;
  kicker: string;
  summary: string;
  stack: string;
  story: string[];
  imageUrl?: string;
};

export type EarlierRole = {
  id: string;
  dates: string;
  location: string;
  title: string;
  org: string;
};

export type Project = {
  id: string;
  category: string;
  orgLabel: string;
  title: string;
  description: string;
  shortDescription: string;
  stack: string;
  featured: boolean;
  spanFull?: boolean;
  /** External case study/site. When set, the card links out (with a ↗ mark). */
  url?: string;
  /** Popup content. When there is no url, the card opens an in-page paper. */
  story?: string[];
};

export type SkillGroup = {
  label: string;
  items: string[];
};

export type RadarAxis = {
  label: string;
  level: number; // 0–100
};

export type TerminalLine = {
  cmd: string;
  out: string;
};

export type AchievementBlock =
  | { type: "text"; text: string }
  | { type: "image"; src?: string; caption?: string };

export type Achievement = {
  id: string;
  title: string;
  badge: string;
  summary: string;
  story: AchievementBlock[];
};

export type Education = {
  years: string;
  degree: string;
  school: string;
  description: string;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
};
