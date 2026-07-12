import type { Metadata } from "next";
import { Archivo, Space_Mono } from "next/font/google";
import { SiteNav } from "@/components/site-nav";
import { getProfile } from "@/lib/data";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Rafael Neocleous – Senior Software Engineer",
    template: "%s – Rafael Neocleous",
  },
  description:
    "Backend systems, web platforms and mobile apps across SaaS, logistics, fintech, IoT and applied research. Co-founder at Caonyx.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile();
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteNav brand={profile.brand} />
        {children}
      </body>
    </html>
  );
}
