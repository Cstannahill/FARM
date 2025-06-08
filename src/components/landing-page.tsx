import {
  ArrowRight,
  Github,
  Star,
  Download,
  Zap,
  Shield,
  Globe,
  Code2,
  Database,
  Server,
  Users,
  BookOpen,
  Rocket,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10" />
        <div className="container relative mx-auto px-4 py-20 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <Badge
              variant="secondary"
              className="mb-8 bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Full-Stack Framework 2024
            </Badge>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Build faster with{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                FARM Framework
              </span>
            </h1>

            <p className="mb-10 text-xl text-muted-foreground lg:text-2xl">
              The modern full-stack framework combining FastAPI, React, and
              MongoDB.
              <br />
              Ship production-ready applications in minutes, not months.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                asChild
              >
                <Link to="/docs/getting-started">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                asChild
              >
                <a
                  href="https://github.com/cstannahill/farm-framework"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-5 w-5" />
                  View on GitHub
                </a>
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>4.2k stars</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>50k+ downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>2.5k developers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to build modern apps
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              FARM Framework provides a complete toolkit for building scalable,
              production-ready applications.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900">
                    <Zap className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <CardTitle>Lightning Fast</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Built on FastAPI and React with hot reload, async support, and
                  optimized builds for maximum performance.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-teal-200 dark:border-teal-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-teal-100 p-2 dark:bg-teal-900">
                    <Database className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <CardTitle>MongoDB Ready</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Seamless MongoDB integration with ODM, migrations, and
                  real-time data synchronization out of the box.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-cyan-200 dark:border-cyan-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-cyan-100 p-2 dark:bg-cyan-900">
                    <Shield className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <CardTitle>Type Safe</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Full TypeScript support with automatic API types generation
                  and end-to-end type safety.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
                    <Server className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle>Production Ready</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Built-in authentication, caching, monitoring, and deployment
                  tools for enterprise applications.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-orange-200 dark:border-orange-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900">
                    <Globe className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle>Modern Stack</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  React 18, FastAPI 0.100+, MongoDB 7.0, with modern tooling and
                  best practices included.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-rose-200 dark:border-rose-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-rose-100 p-2 dark:bg-rose-900">
                    <Code2 className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                  </div>
                  <CardTitle>Developer Experience</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Exceptional DX with CLI tools, code generation,
                  auto-completion, and comprehensive documentation.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="bg-muted/30 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Get started in seconds
              </h2>
              <p className="mb-12 text-lg text-muted-foreground">
                Create a new FARM application with a single command
              </p>
            </div>

            <div className="rounded-lg bg-background p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <pre className="overflow-x-auto text-sm">
                <code className="text-emerald-600 dark:text-emerald-400">
                  {`npx create-farm-app my-app
cd my-app
npm run dev`}
                </code>
              </pre>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {" "}
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
                  <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Read the docs</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive guides and API references to get you started
                </p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link to="/docs">View Docs</Link>
                </Button>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900">
                  <Rocket className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Try templates</h3>
                <p className="text-sm text-muted-foreground">
                  Start with pre-built templates for common use cases
                </p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link to="/templates">Browse Templates</Link>
                </Button>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900">
                  <Users className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Join community</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with other developers and get help when you need it
                </p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link to="/community">Join Community</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to build something amazing?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of developers building the next generation of web
              applications with FARM Framework.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                asChild
              >
                <Link to="/docs/getting-started">
                  Start Building
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                asChild
              >
                <a
                  href="https://github.com/cstannahill/farm-framework"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-5 w-5" />
                  Star on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
