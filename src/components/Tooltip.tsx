import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function Tooltip({ tip, children }: { tip: string; children: React.ReactNode }) {
  return (
    <UITooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{tip}</TooltipContent>
    </UITooltip>
  );
}
