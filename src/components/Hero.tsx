import { Button } from "@/components/ui/button";
import { H1, Lead } from "@/components/ui/typography";

export default function Hero() {
  return (
    <section className="py-16 text-center space-y-4">
      <H1 className="text-5xl">FARM Stack Framework</H1>
      <Lead className="max-w-2xl mx-auto">
        AI-first full-stack development platform built with React and FastAPI.
      </Lead>
      <div className="flex justify-center gap-4 pt-4">
        {" "}
        <Button asChild>
          <a href="/docs/getting-started">Get Started</a>
        </Button>
        <Button variant="outline" asChild>
          <a
            href="https://github.com/cstannahill/farm-framework"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </Button>
      </div>
    </section>
  );
}
