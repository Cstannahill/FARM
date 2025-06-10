import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();

  useEffect(() => {
    // Reset state on page change
    setHeadings([]);
    setActiveId("");

    // Wait for content to render after navigation
    const timeoutId = setTimeout(() => {
      // Only get headings from the main content area, not sidebar or other UI elements
      const mainContent =
        document.querySelector("main .prose") || document.querySelector("main");
      if (!mainContent) return;

      const headingElements =
        mainContent.querySelectorAll("h2, h3, h4, h5, h6"); // Exclude h1 (page title)
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

      // Improved intersection observer for more accurate tracking
      const observer = new IntersectionObserver(
        (entries) => {
          const visibleEntries = entries.filter(
            (entry) => entry.isIntersecting
          );

          if (visibleEntries.length > 0) {
            // Find the heading with the highest intersection ratio
            // or the first one if they're equal
            const mostVisible = visibleEntries.reduce((prev, current) =>
              current.intersectionRatio > prev.intersectionRatio
                ? current
                : prev
            );

            setActiveId(mostVisible.target.id);
          } else {
            // If no headings are visible, find the closest one above the viewport
            const allHeadingElements = Array.from(headingElements);
            const viewportTop = window.scrollY + window.innerHeight * 0.2; // 20% from top

            let closestHeadingId = "";
            let minDistance = Infinity;

            allHeadingElements.forEach((heading) => {
              const rect = heading.getBoundingClientRect();
              const elementTop = window.scrollY + rect.top;

              if (elementTop <= viewportTop && heading.id) {
                const distance = viewportTop - elementTop;
                if (distance < minDistance) {
                  minDistance = distance;
                  closestHeadingId = heading.id;
                }
              }
            });

            if (closestHeadingId) {
              setActiveId(closestHeadingId);
            }
          }
        },
        {
          // More precise intersection tracking
          rootMargin: "-10% 0% -70% 0%",
          threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        }
      );

      headingElements.forEach((heading) => {
        if (heading.id) {
          observer.observe(heading);
        }
      });

      // Set initial active heading based on scroll position
      const handleScroll = () => {
        if (headingItems.length === 0) return;

        const scrollPosition = window.scrollY + window.innerHeight * 0.2;
        let currentActiveId = headingItems[0].id;

        for (const heading of headingItems) {
          const element = document.getElementById(heading.id);
          if (element) {
            const rect = element.getBoundingClientRect();
            const elementTop = window.scrollY + rect.top;

            if (elementTop <= scrollPosition) {
              currentActiveId = heading.id;
            } else {
              break;
            }
          }
        }

        setActiveId(currentActiveId);
      };

      // Set initial state
      setTimeout(handleScroll, 100);

      return () => {
        headingElements.forEach((heading) => {
          if (heading.id) {
            observer.unobserve(heading);
          }
        });
      };
    }, 150); // Small delay to ensure content is rendered

    return () => {
      clearTimeout(timeoutId);
    };
  }, [location.pathname]); // Re-run when page changes

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
      <nav className="space-y-0.5">
        {headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => scrollToHeading(heading.id)}
            className={cn(
              "block w-full text-left text-sm transition-all duration-200 hover:text-primary dark:hover:text-primary border-l-2 border-transparent hover:border-primary/30 dark:hover:border-primary/30 py-1.5 px-2 rounded-r-md",
              // Reduced indentation for cleaner Mintlify-style appearance
              heading.level === 2 && "pl-2",
              heading.level === 3 && "pl-4 text-sm",
              heading.level === 4 && "pl-6 text-sm",
              heading.level > 4 && "pl-8 text-sm",
              activeId === heading.id
                ? "text-primary dark:text-primary font-medium border-l-primary dark:border-l-primary bg-primary/5 dark:bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="line-clamp-2 leading-tight">{heading.text}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
