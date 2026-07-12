import { cache } from "react";
import { achievements as staticAchievements } from "@/content/about";
import {
  education as staticEducation,
  radarAxes as staticRadarAxes,
  skillGroups as staticSkillGroups,
} from "@/content/about";
import {
  earlierRoles as staticEarlierRoles,
  roles as staticRoles,
} from "@/content/experience";
import { posts as staticPosts } from "@/content/posts";
import { profile as staticProfile } from "@/content/profile";
import { projects as staticProjects } from "@/content/projects";
import type {
  Achievement,
  EarlierRole,
  Education,
  ExperienceRole,
  Post,
  Profile,
  Project,
  RadarAxis,
  SkillGroup,
} from "@/content/types";
import { createPublicClient, hasSupabase } from "@/lib/supabase/public";
import type {
  AchievementRow,
  EarlierRoleRow,
  EducationRow,
  ExperienceRow,
  PostRow,
  ProjectRow,
  RadarAxisRow,
  SkillGroupRow,
} from "@/lib/supabase/types";

/**
 * Content access layer. Every getter reads from Supabase when the project is
 * configured (NEXT_PUBLIC_SUPABASE_URL/ANON_KEY set) and falls back to the
 * static files in src/content otherwise, so the site runs without a database.
 * Results are request-cached; admin mutations revalidate the public routes.
 */

export const getProfile = cache(async (): Promise<Profile> => {
  if (!hasSupabase()) return staticProfile;
  const { data } = await createPublicClient()
    .from("site_settings")
    .select("profile")
    .eq("id", "default")
    .single();
  const profile = data?.profile as Profile | undefined;
  return profile && Object.keys(profile).length > 0 ? profile : staticProfile;
});

export const getRoles = cache(async (): Promise<ExperienceRole[]> => {
  if (!hasSupabase()) return staticRoles;
  const { data } = await createPublicClient()
    .from("experiences")
    .select("*")
    .eq("active", true)
    .order("display_order");
  if (!data) return staticRoles;
  return (data as ExperienceRow[]).map((row, i) => ({
    id: row.id,
    num: row.num || String(i + 1).padStart(2, "0"),
    dates: row.dates,
    location: row.location,
    locationFull: row.location_full,
    title: row.title,
    org: row.org,
    kicker: row.kicker,
    summary: row.summary,
    stack: row.stack,
    story: row.story ?? [],
    imageUrl: row.image_url ?? undefined,
  }));
});

export const getEarlierRoles = cache(async (): Promise<EarlierRole[]> => {
  if (!hasSupabase()) return staticEarlierRoles;
  const { data } = await createPublicClient()
    .from("earlier_roles")
    .select("*")
    .eq("active", true)
    .order("display_order");
  if (!data) return staticEarlierRoles;
  return (data as EarlierRoleRow[]).map((row) => ({
    id: row.id,
    dates: row.dates,
    location: row.location,
    title: row.title,
    org: row.org,
  }));
});

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    category: row.category,
    orgLabel: row.org_label,
    title: row.title,
    description: row.description,
    shortDescription: row.short_description,
    stack: row.stack,
    featured: row.featured,
    spanFull: row.span_full || undefined,
    url: row.url ?? undefined,
    story: row.story?.length ? row.story : undefined,
  };
}

export const getProjects = cache(async (): Promise<Project[]> => {
  if (!hasSupabase()) return staticProjects;
  const { data } = await createPublicClient()
    .from("projects")
    .select("*")
    .eq("active", true)
    .order("display_order");
  if (!data) return staticProjects;
  return (data as ProjectRow[]).map(mapProject);
});

export const getFeaturedProjects = cache(async (): Promise<Project[]> => {
  const projects = await getProjects();
  return projects.filter((p) => p.featured);
});

export const getSkillGroups = cache(async (): Promise<SkillGroup[]> => {
  if (!hasSupabase()) return staticSkillGroups;
  const { data } = await createPublicClient()
    .from("skill_groups")
    .select("*")
    .order("display_order");
  if (!data || data.length === 0) return staticSkillGroups;
  return (data as SkillGroupRow[]).map((row) => ({
    label: row.label,
    items: row.items ?? [],
  }));
});

export const getRadarAxes = cache(async (): Promise<RadarAxis[]> => {
  if (!hasSupabase()) return staticRadarAxes;
  const { data } = await createPublicClient()
    .from("radar_axes")
    .select("*")
    .order("display_order");
  if (!data || data.length === 0) return staticRadarAxes;
  return (data as RadarAxisRow[]).map((row) => ({
    label: row.label,
    level: row.level,
  }));
});

export const getAchievements = cache(async (): Promise<Achievement[]> => {
  if (!hasSupabase()) return staticAchievements;
  const { data } = await createPublicClient()
    .from("achievements")
    .select("*")
    .eq("active", true)
    .order("display_order");
  if (!data) return staticAchievements;
  return (data as AchievementRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    badge: row.badge,
    summary: row.summary,
    story: row.story ?? [],
  }));
});

export const getEducation = cache(async (): Promise<Education> => {
  if (!hasSupabase()) return staticEducation;
  const { data } = await createPublicClient()
    .from("education")
    .select("*")
    .eq("id", "default")
    .single();
  if (!data) return staticEducation;
  const row = data as EducationRow;
  return {
    years: row.years,
    degree: row.degree,
    school: row.school,
    description: row.description,
  };
});

function mapPost(row: PostRow): Post {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    publishedAt: row.published_at ?? row.created_at,
  };
}

export const getPosts = cache(async (): Promise<Post[]> => {
  if (!hasSupabase()) return staticPosts;
  const { data } = await createPublicClient()
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (!data) return staticPosts;
  return (data as PostRow[]).map(mapPost);
});

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  if (!hasSupabase())
    return staticPosts.find((p) => p.slug === slug) ?? null;
  const { data } = await createPublicClient()
    .from("posts")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .single();
  return data ? mapPost(data as PostRow) : null;
});
