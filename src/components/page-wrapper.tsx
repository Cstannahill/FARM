import React, { useEffect } from "react";
import { usePageContext } from "@/lib/page-context";
import { getFrontmatter } from "@/lib/frontmatter";
import { useLocation } from "react-router-dom";

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  const { setFrontmatter } = usePageContext();
  const location = useLocation();

  useEffect(() => {
    // Get frontmatter for current route
    const frontmatter = getFrontmatter(location.pathname);
    setFrontmatter(frontmatter);
  }, [location.pathname, setFrontmatter]);

  return <>{children}</>;
}
