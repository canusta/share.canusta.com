import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // Crawlers must be able to read the site's noindex headers and meta tags.
      allow: "/",
    },
  };
}
