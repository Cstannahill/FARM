import { useState } from "react";
import { cn } from "@/lib/utils";
import CodeBlock from "./CodeBlock";

interface CodeExample {
  language: string;
  label: string;
  code: string;
}

interface CodeTabsProps {
  examples: CodeExample[];
  className?: string;
}

export default function CodeTabs({ examples, className }: CodeTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (!examples || examples.length === 0) {
    return null;
  }

  // If only one example, render as a regular code block
  if (examples.length === 1) {
    return (
      <div className={className}>
        <CodeBlock className={`language-${examples[0].language}`}>
          <code className={`language-${examples[0].language}`}>
            {examples[0].code}
          </code>
        </CodeBlock>
      </div>
    );
  }

  return (
    <div className={cn("my-6", className)}>
      {/* Tab Headers */}
      <div className="flex border-b border-slate-700 bg-slate-800 rounded-t-lg">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all duration-200",
              "first:rounded-tl-lg last:rounded-tr-lg",
              "border-b-2 border-transparent",
              activeTab === index
                ? "text-emerald-400 border-emerald-400 bg-slate-700/50"
                : "text-slate-300 hover:text-white hover:bg-slate-700/30"
            )}
          >
            {example.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="relative">
        {examples.map((example, index) => (
          <div
            key={index}
            className={cn(
              "transition-opacity duration-200",
              activeTab === index
                ? "opacity-100"
                : "opacity-0 absolute inset-0 pointer-events-none"
            )}
            style={{
              marginTop: 0, // Remove default CodeBlock margin since we're managing it here
            }}
          >
            <div className="[&>div]:!mt-0 [&>div]:!mb-0 [&>div>div:first-child]:!rounded-t-none">
              <CodeBlock className={`language-${example.language}`}>
                <code className={`language-${example.language}`}>
                  {example.code}
                </code>
              </CodeBlock>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
