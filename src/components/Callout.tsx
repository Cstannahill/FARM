import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Info,
  AlertTriangle,
  Lightbulb,
  Palette,
  CheckCircle,
  XCircle,
} from "lucide-react";

type CalloutType =
  | "info"
  | "warning"
  | "tip"
  | "gradient"
  | "success"
  | "error";

export default function Callout({
  type = "info",
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}) {
  const icon =
    type === "info" ? (
      <Info />
    ) : type === "warning" ? (
      <AlertTriangle />
    ) : type === "gradient" ? (
      <Palette />
    ) : type === "success" ? (
      <CheckCircle />
    ) : type === "error" ? (
      <XCircle />
    ) : (
      <Lightbulb />
    );

  const variant =
    type === "warning" || type === "error" ? "destructive" : "default";
  // Custom gradient styling for the gradient type
  const gradientClassName =
    type === "gradient"
      ? "bg-gradient-to-r from-[#3776AB] via-[#FFD43B] to-[#61DAFB] text-white border-none [&>svg]:text-white [&_*[data-slot=alert-description]]:text-white/90 [&_*[data-slot=alert-title]]:text-white gradient-callout-text"
      : "";

  // Custom styling for success type
  const successClassName =
    type === "success"
      ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 [&>svg]:text-green-600 dark:[&>svg]:text-green-400"
      : "";

  return type === "gradient" ? (
    <Alert
      variant={variant}
      className={`my-4 ${gradientClassName} ${successClassName} `}
    >
      {icon}
      {title && (
        <AlertTitle className="gradient-callout-title text-black">
          {title}
        </AlertTitle>
      )}
      <AlertDescription className="gradient-callout-text">
        {children}
      </AlertDescription>
    </Alert>
  ) : (
    <Alert
      variant={variant}
      className={`my-4 ${gradientClassName} ${successClassName}`}
    >
      {icon}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
