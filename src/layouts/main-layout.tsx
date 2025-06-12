import "../index.css";
import type { ReactNode } from "react";
import { ModeToggle } from "../components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Github, BookOpen, Menu } from "lucide-react";
import { Link } from "react-router-dom";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mongodb-green text-deep-graphite">
                <img
                  src="/farm-c.svg"
                  alt="FARM Logo"
                  className="h-6 w-6 rounded-sm"
                />
              </div>
              <span className="text-lg font-bold">FARM Framework</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/docs"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Documentation
              </Link>
              <Link
                to="/templates"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Templates
              </Link>
              <Link
                to="/showcase"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Showcase
              </Link>
              <Link
                to="/enterprise"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Enterprise
              </Link>
              <Link
                to="/learn"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Learn
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden sm:flex"
            >
              <a
                href="https://github.com/cstannahill/farm-framework/farm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
              </a>
            </Button>

            <Button
              variant="outline"
              size="sm"
              asChild
              className="hidden sm:flex"
            >
              <Link to="/docs">
                <BookOpen className="mr-2 h-4 w-4" />
                Docs
              </Link>
            </Button>

            <ModeToggle />

            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                  <span className="text-xs font-bold">F</span>
                </div>
                <span className="font-semibold">FARM Framework</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The modern full-stack framework for building production-ready
                applications with FastAPI, React, and MongoDB.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Framework</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/docs"
                    className="hover:text-foreground transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/docs/getting-started"
                    className="hover:text-foreground transition-colors"
                  >
                    Getting Started
                  </Link>
                </li>
                <li>
                  <Link
                    to="/templates"
                    className="hover:text-foreground transition-colors"
                  >
                    Templates
                  </Link>
                </li>
                <li>
                  <Link
                    to="/showcase"
                    className="hover:text-foreground transition-colors"
                  >
                    Showcase
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/learn"
                    className="hover:text-foreground transition-colors"
                  >
                    Learn
                  </Link>
                </li>
                <li>
                  <Link
                    to="/enterprise"
                    className="hover:text-foreground transition-colors"
                  >
                    Enterprise
                  </Link>
                </li>
                <li>
                  <a
                    href="/blog"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/changelog"
                    className="hover:text-foreground transition-colors"
                  >
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="https://github.com/cstannahill/farm-framework"
                    className="hover:text-foreground transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.gg/JmeShQtv"
                    className="hover:text-foreground transition-colors"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/FarmFramework"
                    className="hover:text-foreground transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:Farm.Framework@gmail.com"
                    className="hover:text-foreground transition-colors"
                  >
                    Email
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/cstannahill/farm-framework/farm/contributors"
                    className="hover:text-foreground transition-colors"
                  >
                    Contributors
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 FARM Framework. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
