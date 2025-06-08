import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle, Lightbulb } from "lucide-react";

type CalloutType = "info" | "warning" | "tip";

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
    ) : (
      <Lightbulb />
    );

  const variant = type === "warning" ? "destructive" : "default";

  return (
    <Alert variant={variant} className="my-4">
      {icon}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
