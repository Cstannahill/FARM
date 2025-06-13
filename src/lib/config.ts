// Site configuration
export const siteConfig = {
  name: "FARM Framework",
  description:
    "Full-Stack Framework for React, FastAPI, and MongoDB applications",
  url: "https://farm-framework.dev",

  // GitHub Repository Configuration
  github: {
    owner: "yourusername", // Replace with actual GitHub username/organization
    repo: "farm-framework", // Replace with actual repository name
  },

  // NPM Package Configuration (if published)
  npm: {
    packageName: "farm-framework", // Replace with actual npm package name
  },

  // Social Links
  links: {
    github: "https://github.com/yourusername/farm-framework",
    twitter: "https://twitter.com/farmframework",
    discord: "https://discord.gg/JmeShQtv",
    docs: "/docs",
  },

  // Analytics Configuration
  analytics: {
    // Add analytics IDs here if needed
    gtag: import.meta.env.VITE_GTAG_ID,
  },
} as const;

export type SiteConfig = typeof siteConfig;
