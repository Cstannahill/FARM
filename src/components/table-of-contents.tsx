import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePageContext } from "@/lib/page-context";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const { frontmatter } = usePageContext();

  useEffect(() => {
    // Get all headings in the document
    const headingElements = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const headingItems: TocItem[] = [];

    headingElements.forEach((heading) => {
      // Create ID if it doesn't exist
      if (!heading.id && heading.textContent) {
        const id = heading.textContent
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        heading.id = id;
      }

      if (heading.id) {
        headingItems.push({
          id: heading.id,
          text: heading.textContent || "",
          level: parseInt(heading.tagName.charAt(1)),
        });
      }
    });

    setHeadings(headingItems);

    // Set up intersection observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0% -35% 0%",
        threshold: 0,
      }
    );

    headingElements.forEach((heading) => {
      if (heading.id) {
        observer.observe(heading);
      }
    });

    return () => {
      headingElements.forEach((heading) => {
        if (heading.id) {
          observer.unobserve(heading);
        }
      });
    };
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <p className="font-semibold text-sm text-foreground mb-4">On this page</p>
      <nav className="space-y-1">
        {headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => scrollToHeading(heading.id)}
            className={cn(
              "block w-full text-left text-sm transition-all duration-200 hover:text-emerald-600 dark:hover:text-emerald-400 border-l-2 border-transparent hover:border-emerald-200 dark:hover:border-emerald-800 py-1",
              heading.level === 2 && "pl-3",
              heading.level === 3 && "pl-6 text-xs",
              heading.level === 4 && "pl-9 text-xs",
              heading.level > 4 && "pl-12 text-xs",
              activeId === heading.id
                ? "text-emerald-600 dark:text-emerald-400 font-medium border-l-emerald-500 dark:border-l-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
                : "text-muted-foreground"
            )}
          >
            {heading.text}
          </button>
        ))}
      </nav>
    </div>
  );
}
