import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/zh", "/en", "/zh/work/hermes", "/en/work/hermes", "/zh/work/bhms", "/en/work/bhms"];
  return paths.map((path) => ({ url: `${siteUrl}${path}`, changeFrequency: "monthly", priority: path.split("/").length === 2 ? 1 : 0.8 }));
}
