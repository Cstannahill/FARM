import "../index.css";
import type { ReactNode } from "react";
import { AppSidebar } from "../components/app-sidebar";
import CopyPageButton from "../components/CopyPageButton";
import { ModeToggle } from "../components/mode-toggle";
import { TableOfContents } from "../components/table-of-contents";
import { useLocation } from "react-router-dom";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function DocsLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const pathSegments = location.pathname
    .split("/")
    .filter(Boolean)
    .map((p) => p.replace(/-/g, " "));

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">FARM Framework</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/docs">Documentation</BreadcrumbLink>
                </BreadcrumbItem>
                {pathSegments.slice(1).map((segment, index) => (
                  <div key={index} className="flex items-center">
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      {index === pathSegments.slice(1).length - 1 ? (
                        <BreadcrumbPage className="capitalize">
                          {segment}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href={`/${pathSegments
                            .slice(0, index + 2)
                            .join("/")}`}
                          className="capitalize"
                        >
                          {segment}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex items-center gap-2 px-4">
            <ModeToggle />
            <CopyPageButton />
          </div>
        </header>
        <div className="flex flex-1">
          <div className="flex w-full max-w-screen-2xl mx-auto">
            <main className="flex-1 min-w-0 px-6 py-8 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="prose prose-slate dark:prose-invert max-w-none prose-lg prose-headings:scroll-mt-20 prose-headings:font-semibold prose-h1:text-4xl prose-h1:font-bold prose-h1:tracking-tight prose-h2:text-3xl prose-h2:font-semibold prose-h2:tracking-tight prose-h2:border-b prose-h2:border-border prose-h2:pb-3 prose-h3:text-2xl prose-h3:font-semibold prose-h4:text-xl prose-h4:font-semibold prose-p:leading-7 prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-code:text-emerald-600 dark:prose-code:text-emerald-400 prose-code:font-semibold prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-200 dark:prose-pre:border-slate-800">
                  {children}
                </div>
              </div>
            </main>
            <aside className="hidden xl:block w-64 flex-shrink-0 border-l border-border/40">
              <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-auto py-8 px-6">
                <TableOfContents />
              </div>
            </aside>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
