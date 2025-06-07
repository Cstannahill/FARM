import RootLayout from "@/layouts/layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./components/not-found";
import React from "react";

const pages = import.meta.glob("../docs-site/pages/**/*.mdx", { eager: true }) as Record<string, { default: React.ComponentType }>;

const routes = Object.entries(pages).map(([path, module]) => {
  const cleaned = path
    .replace("../docs-site/pages", "")
    .replace(/index.mdx$/, "")
    .replace(/\.mdx$/, "");
  const routePath = cleaned || "/";
  return { path: routePath, Component: module.default };
});

export default function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
          {routes.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  );
}
