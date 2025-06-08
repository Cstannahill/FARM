import matter from "gray-matter";

export interface FrontmatterData {
  title?: string;
  description?: string;
  sidebarTitle?: string;
  icon?: string;
  [key: string]: any;
}

export interface MDXModule {
  default: React.ComponentType;
  frontmatter?: FrontmatterData;
}

// This is a placeholder for now - we'll need to modify Vite config to extract frontmatter
export function extractFrontmatter(content: string): {
  content: string;
  data: FrontmatterData;
} {
  const { content: mdxContent, data } = matter(content);
  return { content: mdxContent, data };
}

// Create a mapping of route paths to their frontmatter
export const routeFrontmatter: Record<string, FrontmatterData> = {
  "/docs": {
    title: "FARM Stack Framework",
    description: "AI-first full-stack development platform",
    sidebarTitle: "Overview",
  },
  "/docs/getting-started": {
    title: "Getting Started",
    description: "How to start using FARM",
    sidebarTitle: "Getting Started",
    icon: "rocket",
  },
  "/docs/guide/architecture": {
    title: "Framework Architecture",
    description: "Core concepts and project structure",
    sidebarTitle: "Architecture",
    icon: "building",
  },
  "/docs/guide/ai-integration": {
    title: "AI Integration",
    description: "Multi-provider AI setup and local models",
    sidebarTitle: "AI Integration",
    icon: "brain",
  },
  "/docs/guide/database": {
    title: "Database",
    description: "MongoDB with Beanie ODM and relationships",
    sidebarTitle: "Database",
    icon: "database",
  },
  "/docs/guide/code-generation": {
    title: "Code Generation",
    description: "Automatic type generation and API clients",
    sidebarTitle: "Code Generation",
    icon: "code",
  },
  "/docs/guide/dev-server": {
    title: "Development Server",
    description: "Hot reload and development workflow",
    sidebarTitle: "Dev Server",
    icon: "server",
  },
  "/docs/guide/plugin-system": {
    title: "Plugin System",
    description: "Extensible plugin architecture",
    sidebarTitle: "Plugins",
    icon: "puzzle",
  },
  "/docs/api/cli": {
    title: "CLI Reference",
    description: "Complete command-line interface documentation",
    sidebarTitle: "CLI",
    icon: "terminal",
  },
  "/docs/deployment": {
    title: "Deployment",
    description: "Production deployment guide",
    sidebarTitle: "Deployment",
    icon: "rocket",
  },
  "/docs/advanced/architecture": {
    title: "Advanced Architecture",
    description: "Advanced patterns and best practices",
    sidebarTitle: "Advanced",
    icon: "star",
  },
  "/docs/configuration": {
    title: "Configuration",
    description: "TypeScript-first configuration",
    sidebarTitle: "Configuration",
    icon: "settings",
  },
  "/blog": {
    title: "Blog",
    description: "Latest news and updates from the FARM Framework team",
    sidebarTitle: "Blog",
    icon: "edit",
  },
  "/changelog": {
    title: "Changelog",
    description: "Release notes and version history",
    sidebarTitle: "Changelog",
    icon: "history",
  },
  "/templates": {
    title: "Templates",
    description: "Pre-built project templates",
    sidebarTitle: "Templates",
    icon: "template",
  },
  "/showcase": {
    title: "Showcase",
    description: "Projects built with FARM Framework",
    sidebarTitle: "Showcase",
    icon: "star",
  },
  "/enterprise": {
    title: "Enterprise",
    description: "Enterprise solutions and support",
    sidebarTitle: "Enterprise",
    icon: "building",
  },
  "/learn": {
    title: "Learn",
    description: "Tutorials and learning resources",
    sidebarTitle: "Learn",
    icon: "book",
  },
  "/community": {
    title: "Community",
    description: "Join the FARM Framework community",
    sidebarTitle: "Community",
    icon: "users",
  },
};

// Get frontmatter for a route path
export function getFrontmatter(path: string): FrontmatterData {
  return (
    routeFrontmatter[path] || { title: "Documentation", sidebarTitle: "Doc" }
  );
}
