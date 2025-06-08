"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarMenu className="space-y-2">
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  className="group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-accent/80 hover:text-accent-foreground data-[state=open]:bg-accent/50"
                >
                  <div className="flex items-center gap-3">
                    {item.icon && (
                      <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
                    )}
                    <span className="font-semibold">{item.title}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-all duration-200 group-data-[state=open]/collapsible:rotate-90 group-hover:text-accent-foreground" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-left-1 data-[state=open]:slide-in-from-left-1">
                <SidebarMenuSub className="ml-6 mt-2 space-y-1 border-l border-border/40 pl-4">
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <NavLink
                          to={subItem.url}
                          className={({ isActive }) =>
                            `block rounded-lg px-3 py-2.5 text-sm transition-all duration-200 hover:bg-accent/60 hover:text-accent-foreground relative group ${
                              isActive
                                ? "bg-primary text-primary-foreground shadow-sm font-medium before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-primary-foreground before:rounded-r-full"
                                : "text-muted-foreground hover:text-foreground"
                            }`
                          }
                        >
                          <span className="relative z-10">{subItem.title}</span>
                          {/* Hover indicator */}
                          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg" />
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
