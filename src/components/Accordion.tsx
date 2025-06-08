import {
  Accordion as AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const value = title.toLowerCase().replace(/\s+/g, "-");
  return (
    <AccordionRoot type="single" collapsible className="w-full">
      <AccordionItem value={value}>
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  );
}

export { AccordionItem, AccordionTrigger, AccordionContent };
