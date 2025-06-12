import * as React from "react";
import {
  BookOpen,
  Bot,
  Users,
  Star,
  Building2,
  Layout,
  Sparkles,
  Globe,
  MessageCircle,
  Github,
  Heart,
  Newspaper,
  Calendar,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import { NavMain } from "@/components/nav-main";
import { TeamSwitcher } from "@/components/team-switcher";
import { SearchDialogTrigger } from "@/components/modern-search-dialog-clean";
import { AIChatAside } from "@/components/ai-chat-aside";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

// Custom Logo Component
const FarmLogo = ({ className }: { className?: string }) => (
  <img
    src="/farm-c.svg"
    alt="FARM Framework Logo"
    className={`rounded-md ${className}`}
    style={{ width: "100%", height: "100%", objectFit: "contain" }}
  />
);

// Framework ecosystem navigation structure
function useNavigationData() {
  const location = useLocation();

  const data = {
    teams: [
      {
        name: "FARM Framework",
        logo: FarmLogo,
        plan: "Full-Stack Platform",
      },
    ],
    navMain: [
      {
        title: "Documentation",
        url: "/docs",
        icon: BookOpen,
        isActive: location.pathname.startsWith("/docs"),
        items: [
          {
            title: "Introduction",
            url: "/docs",
          },
          {
            title: "Getting Started",
            url: "/docs/getting-started",
          },
          {
            title: "Configuration",
            url: "/docs/configuration",
          },
          {
            title: "Type-Sync",
            url: "/docs/type-sync",
          },
          {
            title: "Components",
            url: "/docs/components",
          },
          {
            title: "API Reference",
            url: "/docs/api",
          },
          {
            title: "Deployment",
            url: "/docs/deployment",
          },
        ],
      },
      {
        title: "Templates",
        url: "/templates",
        icon: Layout,
        isActive: location.pathname.startsWith("/templates"),
        items: [
          {
            title: "Starter Templates",
            url: "/templates/starters",
          },
          {
            title: "Example Projects",
            url: "/templates/examples",
          },
          {
            title: "Enterprise Boilerplates",
            url: "/templates/enterprise",
          },
          {
            title: "E-commerce",
            url: "/templates/ecommerce",
          },
          {
            title: "SaaS Kits",
            url: "/templates/saas",
          },
          {
            title: "Authentication",
            url: "/templates/auth",
          },
        ],
      },
      {
        title: "Showcase",
        url: "/showcase",
        icon: Star,
        isActive: location.pathname.startsWith("/showcase"),
        items: [
          {
            title: "Featured Projects",
            url: "/showcase/featured",
          },
          {
            title: "Community Built",
            url: "/showcase/community",
          },
          {
            title: "Enterprise Apps",
            url: "/showcase/enterprise",
          },
          {
            title: "Submit Your Project",
            url: "/showcase/submit",
          },
        ],
      },
      {
        title: "Enterprise",
        url: "/enterprise",
        icon: Building2,
        isActive: location.pathname.startsWith("/enterprise"),
        items: [
          {
            title: "Enterprise Features",
            url: "/enterprise/features",
          },
          {
            title: "Support Plans",
            url: "/enterprise/support",
          },
          {
            title: "Custom Development",
            url: "/enterprise/custom",
          },
          {
            title: "Training & Consulting",
            url: "/enterprise/training",
          },
          {
            title: "Contact Sales",
            url: "/enterprise/contact",
          },
        ],
      },
      {
        title: "Learn",
        url: "/learn",
        icon: Sparkles,
        isActive: location.pathname.startsWith("/learn"),
        items: [
          {
            title: "Tutorials",
            url: "/learn/tutorials",
          },
          {
            title: "Best Practices",
            url: "/learn/best-practices",
          },
          {
            title: "Video Courses",
            url: "/learn/videos",
          },
          {
            title: "Workshops",
            url: "/learn/workshops",
          },
          {
            title: "Certification",
            url: "/learn/certification",
          },
        ],
      },
    ],
    ecosystem: [
      {
        title: "Community",
        url: "/community",
        icon: Users,
        badge: "Active",
        badgeColor: "bg-green-500",
      },
      {
        title: "GitHub",
        url: "https://github.com/cstannahill/farm-framework",
        icon: Github,
        external: true,
      },
      {
        title: "Discord",
        url: "/discord",
        icon: MessageCircle,
        badge: "Join",
        badgeColor: "bg-blue-500",
      },
    ],
    resources: [
      {
        title: "Blog",
        url: "/blog",
        icon: Newspaper,
      },
      {
        title: "Changelog",
        url: "/changelog",
        icon: Calendar,
      },
      {
        title: "Roadmap",
        url: "/roadmap",
        icon: Globe,
      },
      {
        title: "Contributors",
        url: "/contributors",
        icon: Heart,
      },
    ],
  };

  // Temporary debug logging to verify active states
  console.log("Current path:", location.pathname);
  console.log(
    "Navigation data:",
    data.navMain.map((item) => ({ title: item.title, isActive: item.isActive }))
  );

  return data;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const data = useNavigationData();

  return (
    <>
      <Sidebar collapsible="icon" className="border-r bg-sidebar" {...props}>
        <SidebarHeader className="border-b bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/60">
          <div className="px-4 py-4">
            <TeamSwitcher teams={data.teams} />
            {/* Enhanced Search Section */}
            <div className="mt-4 space-y-3">
              <SearchDialogTrigger />
              {/* Ask AI Button */}
              <Button
                variant="outline"
                className="w-full justify-start h-9 px-3 text-sm font-normal text-muted-foreground/80 hover:text-foreground hover:bg-accent/30"
                onClick={() => setIsChatOpen(true)}
              >
                <Bot className="mr-2 h-4 w-4" />
                Ask AI Assistant
                <div className="ml-auto flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] text-green-600 dark:text-green-400 font-medium">
                    AI
                  </span>
                </div>
              </Button>
            </div>
          </div>
        </SidebarHeader>{" "}
        <SidebarContent className="px-2 py-2">
          <NavMain items={data.navMain} />
          {/* Ecosystem Section */}
          <div className="mt-6 px-2">
            <div className="px-2 py-2 mb-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Ecosystem
              </h4>
            </div>
            <nav className="space-y-1">
              {data.ecosystem.map((item) => (
                <NavLink
                  key={item.url}
                  to={item.url}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 hover:bg-green-500/20 hover:text-green-600 dark:hover:text-green-400 group ${
                      isActive && !item.external
                        ? "bg-green-500/20 text-green-600 dark:text-green-400 shadow-sm font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`
                  }
                >
                  <item.icon
                    className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                      item.title === "Community"
                        ? "text-blue-500"
                        : item.title === "GitHub"
                        ? "text-gray-500"
                        : "text-indigo-500"
                    }`}
                  />
                  <span className="font-medium flex-1">{item.title}</span>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-medium rounded-full text-white ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.external && (
                    <div className="h-3 w-3 opacity-50">
                      <svg viewBox="0 0 12 12" fill="currentColor">
                        <path d="M3.5 3C3.22386 3 3 3.22386 3 3.5C3 3.77614 3.22386 4 3.5 4H7.29289L3.14645 8.14645C2.95118 8.34171 2.95118 8.65829 3.14645 8.85355C3.34171 9.04882 3.65829 9.04882 3.85355 8.85355L8 4.70711V8.5C8 8.77614 8.22386 9 8.5 9C8.77614 9 9 8.77614 9 8.5V3.5C9 3.22386 8.77614 3 8.5 3H3.5Z" />
                      </svg>
                    </div>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
          {/* Resources Section */}
          <div className="mt-6 px-2">
            <div className="px-2 py-2 mb-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Resources
              </h4>
            </div>
            <nav className="space-y-1">
              {data.resources.map((item) => (
                <NavLink
                  key={item.url}
                  to={item.url}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 hover:bg-green-500/20 hover:text-green-600 dark:hover:text-green-400 group ${
                      isActive
                        ? "bg-green-500/20 text-green-600 dark:text-green-400 shadow-sm font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`
                  }
                >
                  <item.icon
                    className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                      item.title === "Blog"
                        ? "text-green-500"
                        : item.title === "Changelog"
                        ? "text-blue-500"
                        : item.title === "Roadmap"
                        ? "text-purple-500"
                        : "text-red-500"
                    }`}
                  />
                  <span className="font-medium">{item.title}</span>
                </NavLink>
              ))}
            </nav>
          </div>{" "}
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <AIChatAside isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
