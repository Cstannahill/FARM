import MainLayout from "@/layouts/main-layout";
import DocsLayout from "@/layouts/docs-layout";
import ContentLayout from "@/layouts/content-layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./components/not-found";
import LandingPage from "./components/landing-page";
import { PageProvider } from "@/lib/page-context";
import { PageWrapper } from "@/components/page-wrapper";
import React from "react";

// Import all MDX pages
const pages = import.meta.glob("../docs-site/pages/**/*.mdx", {
  eager: true,
}) as Record<string, { default: React.ComponentType }>;

// Create routes from MDX files
const mdxRoutes = Object.entries(pages).map(([path, module]) => {
  const cleaned = path
    .replace("../docs-site/pages", "")
    .replace(/index.mdx$/, "")
    .replace(/\.mdx$/, "");
  const routePath = cleaned || "/";
  return { path: routePath, Component: module.default };
});

// Separate docs routes from other routes
const docsRoutes = mdxRoutes.filter((route) => route.path.startsWith("/docs"));
const otherRoutes = mdxRoutes.filter(
  (route) => !route.path.startsWith("/docs")
);

export default function App() {
  return (
    <PageProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing page with main layout */}
          <Route
            path="/"
            element={
              <MainLayout>
                <LandingPage />
              </MainLayout>
            }
          />
          {/* Documentation routes with docs layout */}
          <Route
            path="/docs/*"
            element={
              <DocsLayout>
                <Routes>
                  {docsRoutes.map(({ path, Component }) => {
                    // Remove /docs prefix for nested routing
                    const nestedPath =
                      path === "/docs" ? "/" : path.replace("/docs", "");
                    return (
                      <Route
                        key={path}
                        path={nestedPath}
                        element={
                          <PageWrapper>
                            <Component />
                          </PageWrapper>
                        }
                      />
                    );
                  })}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </DocsLayout>
            }
          />{" "}
          {/* Other routes with content layout for enhanced pages */}
          {otherRoutes.map(({ path, Component }) => {
            // Use ContentLayout for the enhanced content pages
            const isEnhancedPage = [
              "/templates",
              "/showcase",
              "/enterprise",
              "/learn",
            ].includes(path);
            const Layout = isEnhancedPage ? ContentLayout : MainLayout;

            return (
              <Route
                key={path}
                path={path}
                element={
                  <Layout>
                    <Component />
                  </Layout>
                }
              />
            );
          })}
          {/* 404 page */}
          <Route
            path="*"
            element={
              <MainLayout>
                <NotFound />
              </MainLayout>
            }
          />{" "}
        </Routes>
      </BrowserRouter>
    </PageProvider>
  );
}
