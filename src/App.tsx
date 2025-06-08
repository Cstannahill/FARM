import MainLayout from "@/layouts/main-layout";
import DocsLayout from "@/layouts/docs-layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./components/not-found";
import LandingPage from "./components/landing-page";
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
                      element={<Component />}
                    />
                  );
                })}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </DocsLayout>
          }
        />

        {/* Other routes with main layout (templates, showcase, etc.) */}
        {otherRoutes.map(({ path, Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <MainLayout>
                <Component />
              </MainLayout>
            }
          />
        ))}

        {/* Placeholder routes for sections without MDX files yet */}
        <Route
          path="/templates"
          element={
            <MainLayout>
              <div className="container mx-auto px-4 py-20">
                <h1 className="text-4xl font-bold mb-6">Templates</h1>
                <p className="text-lg text-muted-foreground">Coming soon...</p>
              </div>
            </MainLayout>
          }
        />

        <Route
          path="/showcase"
          element={
            <MainLayout>
              <div className="container mx-auto px-4 py-20">
                <h1 className="text-4xl font-bold mb-6">Showcase</h1>
                <p className="text-lg text-muted-foreground">Coming soon...</p>
              </div>
            </MainLayout>
          }
        />

        <Route
          path="/enterprise"
          element={
            <MainLayout>
              <div className="container mx-auto px-4 py-20">
                <h1 className="text-4xl font-bold mb-6">Enterprise</h1>
                <p className="text-lg text-muted-foreground">Coming soon...</p>
              </div>
            </MainLayout>
          }
        />

        <Route
          path="/learn"
          element={
            <MainLayout>
              <div className="container mx-auto px-4 py-20">
                <h1 className="text-4xl font-bold mb-6">Learn</h1>
                <p className="text-lg text-muted-foreground">Coming soon...</p>
              </div>
            </MainLayout>
          }
        />

        {/* 404 page */}
        <Route
          path="*"
          element={
            <MainLayout>
              <NotFound />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
