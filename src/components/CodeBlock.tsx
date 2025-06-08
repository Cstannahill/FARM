import { Clipboard, Check } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CodeBlockProps {
  className?: string;
  children: ReactNode;
}

export default function CodeBlock({
  className = "",
  children,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Extract code content and language from MDX structure
  let code = "";
  let language = "text";

  // MDX generates a pre element with a code child element
  // We need to handle this nested structure properly
  if (children && typeof children === "object" && "props" in children) {
    const codeElement = children as {
      props: { children: string; className?: string };
    };
    if (codeElement.props) {
      code = String(codeElement.props.children || "").trim();
      const codeClassName = codeElement.props.className || "";
      language = codeClassName.replace(/language-/, "") || "text";
    }
  } else if (typeof children === "string") {
    code = children.trim();
    language = className.replace(/language-/, "") || "text";
  } else {
    // Fallback for other structures
    code = String(children || "").trim();
    language = className.replace(/language-/, "") || "text";
  }

  // Final fallback - check the pre element's className
  if (language === "text" && className) {
    language = className.replace(/language-/, "") || "text";
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  return (
    <div className="group relative my-6">
      {/* Header with language badge and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 dark:bg-slate-900 border border-slate-700 dark:border-slate-600 rounded-t-lg">
        <span className="text-xs font-medium text-slate-300 uppercase tracking-wide">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded transition-all",
            "bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white",
            "border border-slate-600 hover:border-slate-500"
          )}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Clipboard className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark} // Always use dark theme for consistent Mintlify-like appearance
        customStyle={{
          margin: 0,
          borderRadius: "0 0 8px 8px",
          border: "1px solid rgb(51 65 85)", // slate-700
          borderTop: "none",
          fontSize: "14px",
          lineHeight: "1.6",
          background: "rgb(15 23 42)", // slate-900
        }}
        showLineNumbers={code.split("\n").length > 5}
        wrapLines
        wrapLongLines
        codeTagProps={{
          style: {
            fontFamily:
              "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
