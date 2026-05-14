import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const root = base.replace(/\/$/, "");
  const lastModified = new Date();

  return [
    { url: root, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${root}/about`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${root}/roadmaps`, lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: `${root}/pricing`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${root}/login`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${root}/register`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
