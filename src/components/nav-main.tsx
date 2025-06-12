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
                  className="group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 data-[state=open]:bg-green-500/20 data-[state=open]:text-green-600 dark:data-[state=open]:text-green-400"
                >
                  <div className="flex items-center gap-3">
                    {item.icon && (
                      <item.icon className="h-4 w-4 text-muted-foreground group-data-[state=open]/collapsible:text-green-600 dark:group-data-[state=open]/collapsible:text-green-400 transition-colors" />
                    )}
                    <span className="font-semibold group-data-[state=open]/collapsible:text-green-600 dark:group-data-[state=open]/collapsible:text-green-400">
                      {item.title}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-all duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[state=open]/collapsible:text-green-600 dark:group-data-[state=open]/collapsible:text-green-400" />
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
                            `block rounded-lg px-3 py-2 text-xs transition-all duration-200 relative ${
                              isActive
                                ? "bg-green-500/20 text-green-600 dark:text-green-400 font-medium before:absolute before:left-[-16px] before:top-0 before:h-full before:w-1 before:bg-green-500 before:rounded-r-full border border-green-500/20"
                                : "text-muted-foreground"
                            }`
                          }
                        >
                          {subItem.title}
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
