export type Lang = "en" | "de";

export function getLangFromUrl(url?: string): Lang {
  try {
    const u = new URL(url ?? (typeof window !== "undefined" ? window.location.href : "http://x"));
    const lang = u.searchParams.get("lang");
    return lang === "de" ? "de" : "en";
  } catch {
    return "en";
  }
}

export const t = (lang: Lang) => ({
  nav_jobs: lang === "de" ? "Jobs" : "Jobs",
  nav_login: lang === "de" ? "Login" : "Login",
  headline_jobs: lang === "de" ? "Offene Jobs" : "Open Jobs",
  filter_placeholder: lang === "de" ? "Suche (Titel, Keyword)..." : "Search (title, keyword)...",
  empty: lang === "de" ? "Noch keine Jobs." : "No jobs yet.",
  apply: lang === "de" ? "Bewerben" : "Apply",
  view: lang === "de" ? "Ansehen" : "View",
  share: lang === "de" ? "Link kopieren" : "Copy link",
  copied: lang === "de" ? "Kopiert!" : "Copied!",
});
