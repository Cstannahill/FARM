import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export function MarkdownViewer({ content, className }: MarkdownViewerProps) {
  return (
    <div
      className={cn(
        "prose prose-slate dark:prose-invert max-w-none prose-sm",
        "prose-headings:scroll-mt-20 prose-headings:font-semibold",
        "prose-h1:text-xl prose-h1:font-bold prose-h1:tracking-tight",
        "prose-h2:text-lg prose-h2:font-semibold prose-h2:tracking-tight prose-h2:border-b prose-h2:border-border prose-h2:pb-2 prose-h2:mb-3",
        "prose-h3:text-base prose-h3:font-semibold prose-h3:mb-2",
        "prose-h4:text-sm prose-h4:font-semibold",
        "prose-p:leading-relaxed prose-p:text-sm",
        "prose-a:text-primary-accent dark:prose-a:text-primary-accent prose-a:font-medium prose-a:no-underline hover:prose-a:underline",
        "prose-code:text-coral-pink dark:prose-code:text-coral-pink prose-code:font-semibold prose-code:before:content-[''] prose-code:after:content-['']",
        "prose-pre:bg-muted dark:prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg",
        "prose-ul:text-sm prose-ol:text-sm prose-li:text-sm",
        "prose-blockquote:border-l-primary-accent prose-blockquote:bg-muted/50 prose-blockquote:italic",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={
          {
            // Use default prose styling, no custom components needed
          }
        }
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
