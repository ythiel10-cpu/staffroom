import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://staffroom.vercel.app"),
  title: {
    default: "Staffroom – Jobs & Bewerbungen",
    template: "%s | Staffroom",
  },
  description: "Jobboard + Bewerbungsmanagement mit Admin-Bereich.",
  openGraph: {
    title: "Staffroom – Jobs & Bewerbungen",
    description: "Jobboard + Bewerbungsmanagement mit Admin-Bereich.",
    type: "website",
  },
};

function Footer() {
  return (
    <footer style={{ padding: "32px 16px", opacity: 0.8 }}>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Link href="/impressum">Impressum</Link>
        <Link href="/datenschutz">Datenschutz</Link>
        <Link href="/jobs">Jobs</Link>
        <Link href="/login">Login</Link>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}

