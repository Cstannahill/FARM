import type { ReactNode } from "react";
import { ModeToggle } from "@/components/mode-toggle";

interface ContentLayoutProps {
  children: ReactNode;
}

export default function ContentLayout({ children }: ContentLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <span className="hidden font-bold sm:inline-block">
                FARM Stack
              </span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="/docs"
              >
                Docs
              </a>
              <a
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="/templates"
              >
                Templates
              </a>
              <a
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="/showcase"
              >
                Showcase
              </a>
              <a
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="/enterprise"
              >
                Enterprise
              </a>
              <a
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="/learn"
              >
                Learn
              </a>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* Search could go here */}
            </div>
            <nav className="flex items-center">
              <ModeToggle />
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built with{" "}
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                FARM Stack
              </a>
              . The source code is available on{" "}
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
