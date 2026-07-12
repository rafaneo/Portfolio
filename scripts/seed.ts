/**
 * Seed the Supabase project with the content currently hardcoded in
 * src/content, so the site is identical the moment it flips to DB-backed.
 *
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seed.ts
 * (or put both in .env.local and run: npx tsx --env-file=.env.local scripts/seed.ts)
 *
 * Idempotent-ish: skips any table that already has rows, so it never
 * clobbers content edited through the CMS.
 */
import { createClient } from "@supabase/supabase-js";
import {
  achievements,
  education,
  radarAxes,
  skillGroups,
} from "../src/content/about";
import { roles } from "../src/content/experience";
import { profile } from "../src/content/profile";
import { projects } from "../src/content/projects";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error(
    "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first."
  );
  process.exit(1);
}
const db = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function isEmpty(table: string) {
  const { count, error } = await db
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) throw new Error(`${table}: ${error.message}`);
  return (count ?? 0) === 0;
}

async function seed(table: string, rows: Record<string, unknown>[]) {
  if (!(await isEmpty(table))) {
    console.log(`skip  ${table} (already has rows)`);
    return;
  }
  const { error } = await db.from(table).insert(rows);
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`seed  ${table} (${rows.length} rows)`);
}

async function main() {
  await seed("site_settings", [{ id: "default", profile }]);

  await seed(
    "experiences",
    roles.map((r, i) => ({
      num: r.num,
      dates: r.dates,
      location: r.location,
      location_full: r.locationFull,
      title: r.title,
      org: r.org,
      kicker: r.kicker,
      summary: r.summary,
      stack: r.stack,
      story: r.story,
      display_order: i,
    }))
  );

  await seed(
    "projects",
    projects.map((p, i) => ({
      category: p.category,
      org_label: p.orgLabel,
      title: p.title,
      description: p.description,
      short_description: p.shortDescription,
      stack: p.stack,
      featured: p.featured,
      span_full: p.spanFull ?? false,
      url: p.url ?? null,
      story: p.story ?? [],
      display_order: i,
    }))
  );

  await seed(
    "skill_groups",
    skillGroups.map((g, i) => ({
      label: g.label,
      items: g.items,
      display_order: i,
    }))
  );

  await seed(
    "radar_axes",
    radarAxes.map((a, i) => ({
      label: a.label,
      level: a.level,
      display_order: i,
    }))
  );

  await seed(
    "achievements",
    achievements.map((a, i) => ({
      title: a.title,
      badge: a.badge,
      summary: a.summary,
      story: a.story,
      display_order: i,
    }))
  );

  await seed("education", [{ id: "default", ...education }]);

  console.log("done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
