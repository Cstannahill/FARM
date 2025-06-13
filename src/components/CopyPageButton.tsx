"use client";

import { toast } from "sonner";
import { Copy, Check, FileText, Link } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type CopyMode = "url" | "markdown";

export default function CopyPageButton() {
  const [copied, setCopied] = useState<CopyMode | null>(null);

  const extractMarkdownContent = (): string => {
    try {
      // Find the main content area with prose class
      const proseContent = document.querySelector(".prose");
      if (!proseContent) {
        throw new Error("Content area not found");
      }

      // Get the page title from the first h1
      const titleElement = proseContent.querySelector("h1");
      const title = titleElement?.textContent || document.title;

      // Extract all text content, preserving structure
      const extractTextWithStructure = (element: Element): string => {
        let result = "";

        for (const node of element.childNodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent?.trim();
            if (text) {
              result += text + " ";
            }
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element;
            const tagName = el.tagName.toLowerCase();

            switch (tagName) {
              case "h1":
                result += `\n# ${el.textContent?.trim()}\n\n`;
                break;
              case "h2":
                result += `\n## ${el.textContent?.trim()}\n\n`;
                break;
              case "h3":
                result += `\n### ${el.textContent?.trim()}\n\n`;
                break;
              case "h4":
                result += `\n#### ${el.textContent?.trim()}\n\n`;
                break;
              case "h5":
                result += `\n##### ${el.textContent?.trim()}\n\n`;
                break;
              case "h6":
                result += `\n###### ${el.textContent?.trim()}\n\n`;
                break;
              case "p":
                result += `${el.textContent?.trim()}\n\n`;
                break;
              case "li":
                result += `- ${el.textContent?.trim()}\n`;
                break;
              case "ul":
              case "ol":
                result += "\n" + extractTextWithStructure(el) + "\n";
                break;
              case "code":
                result += `\`${el.textContent?.trim()}\``;
                break;
              case "pre":
                const codeContent = el.textContent?.trim();
                result += `\n\`\`\`\n${codeContent}\n\`\`\`\n\n`;
                break;
              case "blockquote":
                const quoteText = el.textContent?.trim();
                result += `\n> ${quoteText}\n\n`;
                break;
              case "a":
                const href = el.getAttribute("href");
                const text = el.textContent?.trim();
                if (href && text) {
                  result += `[${text}](${href})`;
                } else {
                  result += text || "";
                }
                break;
              case "strong":
              case "b":
                result += `**${el.textContent?.trim()}**`;
                break;
              case "em":
              case "i":
                result += `*${el.textContent?.trim()}*`;
                break;
              case "br":
                result += "\n";
                break;
              default:
                result += extractTextWithStructure(el);
                break;
            }
          }
        }

        return result;
      };

      let content = extractTextWithStructure(proseContent);

      // Clean up extra whitespace and newlines
      content = content
        .replace(/\n{3,}/g, "\n\n") // Replace 3+ newlines with 2
        .replace(/[ \t]+/g, " ") // Replace multiple spaces/tabs with single space
        .trim();

      // Add page metadata
      const url = window.location.href;
      const pageHeader = `# ${title}\n\n**Source:** ${url}\n**Generated:** ${new Date().toLocaleDateString()}\n\n---\n\n`;

      return pageHeader + content;
    } catch (error) {
      console.error("Error extracting markdown content:", error);
      throw error;
    }
  };

  const handleCopy = async (mode: CopyMode) => {
    try {
      let content: string;
      let successMessage: string;
      let description: string;

      if (mode === "url") {
        content = window.location.href;
        successMessage = "✅ Page URL copied!";
        description = "Ready to share with your team";
      } else {
        content = extractMarkdownContent();
        successMessage = "✅ Markdown content copied!";
        description = "Full page content ready to paste";
      }

      await navigator.clipboard.writeText(content);
      setCopied(mode);
      setTimeout(() => setCopied(null), 2000);

      toast.success(successMessage, {
        description,
        duration: 3000,
      });
    } catch (error) {
      console.error("Copy error:", error);
      const errorMessage =
        mode === "url" ? "❌ Copy URL failed" : "❌ Copy markdown failed";
      const errorDescription =
        mode === "url"
          ? "Please try selecting and copying the URL manually"
          : "Unable to extract page content. Try copying the URL instead.";

      toast.error(errorMessage, {
        description: errorDescription,
        duration: 4000,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-muted-foreground hover:text-primary transition-colors"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          <span className="text-xs font-medium">
            {copied === "url"
              ? "URL Copied!"
              : copied === "markdown"
              ? "Content Copied!"
              : "Copy"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => handleCopy("url")}
          className="cursor-pointer"
        >
          <Link className="h-4 w-4 mr-2" />
          Copy page URL
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleCopy("markdown")}
          className="cursor-pointer"
        >
          <FileText className="h-4 w-4 mr-2" />
          Copy as markdown
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
