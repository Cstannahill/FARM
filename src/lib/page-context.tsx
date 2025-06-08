import React, { createContext, useContext, useState } from "react";
import { type FrontmatterData } from "./frontmatter";

// Create context for current page metadata
interface PageContextType {
  frontmatter: FrontmatterData;
  setFrontmatter: (data: FrontmatterData) => void;
}

const PageContext = createContext<PageContextType>({
  frontmatter: { title: "Documentation", sidebarTitle: "Doc" },
  setFrontmatter: () => {},
});

export const usePageContext = () => useContext(PageContext);

export function PageProvider({ children }: { children: React.ReactNode }) {
  const [frontmatter, setFrontmatter] = useState<FrontmatterData>({
    title: "Documentation",
    sidebarTitle: "Doc",
  });

  return (
    <PageContext.Provider value={{ frontmatter, setFrontmatter }}>
      {children}
    </PageContext.Provider>
  );
}
