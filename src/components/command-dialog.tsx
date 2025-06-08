"use client";

import * as React from "react";
import type { DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import {
  Search,
  FileText,
  BookOpen,
  Code,
  Rocket,
  Zap,
  Users,
  Bot,
  Layout,
  Star,
  Building2,
  Sparkles,
  Globe,
  MessageCircle,
  Github,
  Heart,
  Newspaper,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className={cn("py-6 text-center text-sm", className)}
    {...props}
  />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

function SearchDialog(props: DialogProps) {
  const navigate = useNavigate();

  const navigationItems = [
    // Documentation
    {
      title: "Introduction",
      url: "/docs",
      icon: FileText,
      category: "Documentation",
    },
    {
      title: "Getting Started Guide",
      url: "/docs/getting-started",
      icon: BookOpen,
      category: "Documentation",
    },
    {
      title: "Configuration",
      url: "/docs/configuration",
      icon: Code,
      category: "Documentation",
    },
    {
      title: "Components",
      url: "/docs/components",
      icon: Zap,
      category: "Documentation",
    },
    {
      title: "API Reference",
      url: "/docs/api",
      icon: Code,
      category: "Documentation",
    },
    {
      title: "Deployment",
      url: "/docs/deployment",
      icon: Rocket,
      category: "Documentation",
    },

    // Templates
    {
      title: "Starter Templates",
      url: "/templates/starters",
      icon: Layout,
      category: "Templates",
    },
    {
      title: "Example Projects",
      url: "/templates/examples",
      icon: Layout,
      category: "Templates",
    },
    {
      title: "Enterprise Boilerplates",
      url: "/templates/enterprise",
      icon: Building2,
      category: "Templates",
    },
    {
      title: "SaaS Kits",
      url: "/templates/saas",
      icon: Layout,
      category: "Templates",
    },

    // Showcase
    {
      title: "Featured Projects",
      url: "/showcase/featured",
      icon: Star,
      category: "Showcase",
    },
    {
      title: "Community Built",
      url: "/showcase/community",
      icon: Users,
      category: "Showcase",
    },
    {
      title: "Submit Your Project",
      url: "/showcase/submit",
      icon: Star,
      category: "Showcase",
    },

    // Enterprise
    {
      title: "Enterprise Features",
      url: "/enterprise/features",
      icon: Building2,
      category: "Enterprise",
    },
    {
      title: "Support Plans",
      url: "/enterprise/support",
      icon: Building2,
      category: "Enterprise",
    },
    {
      title: "Contact Sales",
      url: "/enterprise/contact",
      icon: Building2,
      category: "Enterprise",
    },

    // Learn
    {
      title: "Tutorials",
      url: "/learn/tutorials",
      icon: Sparkles,
      category: "Learn",
    },
    {
      title: "Best Practices",
      url: "/learn/best-practices",
      icon: Sparkles,
      category: "Learn",
    },
    {
      title: "Video Courses",
      url: "/learn/videos",
      icon: Sparkles,
      category: "Learn",
    },

    // Community & Resources
    {
      title: "Community",
      url: "/community",
      icon: Users,
      category: "Ecosystem",
    },
    {
      title: "GitHub",
      url: "https://github.com/farm-framework",
      icon: Github,
      category: "Ecosystem",
    },
    {
      title: "Discord",
      url: "/discord",
      icon: MessageCircle,
      category: "Ecosystem",
    },
    {
      title: "Blog",
      url: "/blog",
      icon: Newspaper,
      category: "Resources",
    },
    {
      title: "Changelog",
      url: "/changelog",
      icon: Calendar,
      category: "Resources",
    },
    {
      title: "Roadmap",
      url: "/roadmap",
      icon: Globe,
      category: "Resources",
    },
    {
      title: "Contributors",
      url: "/contributors",
      icon: Heart,
      category: "Resources",
    },
  ];

  const handleSelect = (url: string) => {
    navigate(url);
    props.onOpenChange?.(false);
  };

  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <CommandInput placeholder="Search documentation..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              {navigationItems.map((item) => (
                <CommandItem
                  key={item.url}
                  value={item.title}
                  onSelect={() => handleSelect(item.url)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                  <CommandShortcut>{item.category}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="AI Assistant">
              <CommandItem
                onSelect={() => {
                  // TODO: Implement AI chat functionality
                  console.log("Opening AI Assistant...");
                  props.onOpenChange?.(false);
                }}
              >
                <Bot className="mr-2 h-4 w-4" />
                <span>Ask AI Assistant</span>
                <CommandShortcut>AI</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export {
  Command,
  SearchDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
