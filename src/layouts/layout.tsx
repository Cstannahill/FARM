import "../index.css";
import type { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import CopyPageButton from "../components/CopyPageButton";
import { useLocation } from "react-router-dom";

export default function RootLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const breadcrumb = location.pathname
    .split("/")
    .filter(Boolean)
    .map((p) => p.replace(/-/g, " "))
    .join(" / ") || "Home";
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-6 prose lg:prose-lg dark:prose-invert max-w-none">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-muted-foreground">{breadcrumb}</span>
          <CopyPageButton />
        </div>
        {children}
      </main>
    </div>
  );
}
