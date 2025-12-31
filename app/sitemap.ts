import type { MetadataRoute } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
const supabase = createSupabaseServerClient();


export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://staffroom.vercel.app";
  const supabase = await createServerClient();

  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, updated_at, created_at")
    .eq("published", true);

  const jobUrls =
    jobs?.map((j) => ({
      url: `${base}/jobs/${j.id}`,
      lastModified: (j as any).updated_at || j.created_at || new Date().toISOString(),
    })) || [];

  return [
    { url: `${base}/`, lastModified: new Date().toISOString() },
    { url: `${base}/jobs`, lastModified: new Date().toISOString() },
    { url: `${base}/impressum`, lastModified: new Date().toISOString() },
    { url: `${base}/datenschutz`, lastModified: new Date().toISOString() },
    ...jobUrls,
  ];
}
