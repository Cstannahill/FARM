import "../index.css";
import type { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import CopyPageButton from "../components/CopyPageButton";
import { ModeToggle } from "../components/mode-toggle";
import { useLocation } from "react-router-dom";

export default function RootLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const breadcrumb = location.pathname
    .split("/")
    .filter(Boolean)
    .map((p) => p.replace(/-/g, " "))
    .join(" / ") || "Home";
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <span className="font-semibold">FARM Docs</span>
        <div className="flex gap-2">
          <ModeToggle />
          <CopyPageButton />
        </div>
      </header>
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 px-6 py-8">
          <div className="mx-auto max-w-3xl prose lg:prose-lg dark:prose-invert">
            <div className="mb-6 text-sm text-muted-foreground">{breadcrumb}</div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
