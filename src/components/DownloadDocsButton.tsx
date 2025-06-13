"use client";

import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DownloadDocsButtonProps {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg";
  showText?: boolean;
  className?: string;
}

export default function DownloadDocsButton({
  variant = "ghost",
  size = "sm",
  showText = true,
  className = "",
}: DownloadDocsButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadDocumentation = async () => {
    if (isDownloading) return;

    setIsDownloading(true);

    try {
      toast.info("📦 Preparing documentation bundle...", {
        description: "This may take a few moments",
        duration: 3000,
      });

      const response = await fetch("/api/download-docs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          format: "zip",
          includeAssets: false, // Set to true if you want images/assets included
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the blob data
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Generate filename with current date
      const date = new Date().toISOString().split("T")[0];
      link.download = `farm-framework-docs-${date}.zip`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      window.URL.revokeObjectURL(url);

      toast.success("✅ Documentation downloaded!", {
        description: "Perfect for AI context and offline reference",
        duration: 4000,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast.error("❌ Download failed", {
        description: "Please try again or contact support",
        duration: 4000,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const ButtonContent = () => (
    <>
      {isDownloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {showText && (
        <span className="text-sm font-medium">
          {isDownloading ? "Downloading..." : "Download Docs"}
        </span>
      )}
    </>
  );

  if (!showText) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={downloadDocumentation}
              variant={variant}
              size={size}
              disabled={isDownloading}
              className={`h-8 w-8 p-0 ${className}`}
            >
              <ButtonContent />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <div className="font-medium">Download FARM Documentation</div>
              <div className="text-xs text-muted-foreground mt-1">
                Perfect for AI context & offline use
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      onClick={downloadDocumentation}
      variant={variant}
      size={size}
      disabled={isDownloading}
      className={`gap-2 ${className}`}
    >
      <ButtonContent />
    </Button>
  );
}
