import type { StoryBlock, Profile } from "@/content/types";

export type ExperienceRow = {
  id: string;
  num: string;
  dates: string;
  location: string;
  location_full: string;
  title: string;
  org: string;
  kicker: string;
  summary: string;
  stack: string;
  story: string[];
  image_url: string | null;
  display_order: number;
  active: boolean;
};

export type ProjectRow = {
  id: string;
  category: string;
  org_label: string;
  title: string;
  description: string;
  short_description: string;
  stack: string;
  featured: boolean;
  span_full: boolean;
  url: string | null;
  story: StoryBlock[];
  display_order: number;
  active: boolean;
};

export type PostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  tags: string[];
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
};

export type SkillGroupRow = {
  id: string;
  label: string;
  items: string[];
  display_order: number;
};

export type RadarAxisRow = {
  id: string;
  label: string;
  level: number;
  display_order: number;
};

export type AchievementRow = {
  id: string;
  title: string;
  badge: string;
  summary: string;
  story: StoryBlock[];
  display_order: number;
  active: boolean;
};

export type EducationRow = {
  id: string;
  years: string;
  degree: string;
  school: string;
  description: string;
};

export type SiteSettingsRow = {
  id: string;
  profile: Profile;
};
