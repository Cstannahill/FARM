import {
  useState,
  Children,
  isValidElement,
  type ReactNode,
  type ReactElement,
} from "react";
import { cn } from "@/lib/utils";
import CodeBlock from "./CodeBlock";

interface CodeExample {
  language: string;
  label: string;
  code: string;
}

interface CodeTabsProps {
  examples?: CodeExample[];
  children?: ReactNode;
  defaultValue?: string;
  className?: string;
}

interface CodeTabProps {
  value: string;
  label: string;
  children: ReactNode;
}

// CodeTab component for individual tabs
export function CodeTab({ children }: CodeTabProps) {
  return <>{children}</>;
}

export default function CodeTabs({
  examples,
  children,
  defaultValue,
  className,
}: CodeTabsProps) {
  // Determine the initial state based on props
  const getInitialTabValue = () => {
    if (children) {
      const tabs = Children.toArray(children).filter(
        (child) => isValidElement(child) && child.type === CodeTab
      ) as ReactElement<CodeTabProps>[];
      const firstTabValue = tabs.length > 0 ? tabs[0].props.value : "";
      return defaultValue || firstTabValue;
    }
    return "";
  };

  // Always call hooks at the top level
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [activeTabValue, setActiveTabValue] =
    useState<string>(getInitialTabValue);

  // Handle children-based usage (MDX pattern)
  if (children) {
    const tabs = Children.toArray(children).filter(
      (child) => isValidElement(child) && child.type === CodeTab
    ) as ReactElement<CodeTabProps>[];

    const firstTabValue = tabs.length > 0 ? tabs[0].props.value : "";

    if (tabs.length === 0) {
      return null;
    }

    return (
      <div className={cn("my-6", className)}>
        {/* Tab Headers */}
        <div className="flex border-b border-slate-700 bg-slate-800 rounded-t-lg">
          {tabs.map((tab, index) => (
            <button
              key={tab.props.value || index}
              onClick={() => setActiveTabValue(tab.props.value)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all duration-200",
                "first:rounded-tl-lg last:rounded-tr-lg",
                "border-b-2 border-transparent",
                (activeTabValue || firstTabValue) === tab.props.value
                  ? "text-emerald-400 border-emerald-400 bg-slate-700/50"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/30"
              )}
            >
              {tab.props.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="relative">
          {tabs.map((tab, index) => (
            <div
              key={tab.props.value || index}
              className={cn(
                "transition-opacity duration-200",
                (activeTabValue || firstTabValue) === tab.props.value
                  ? "opacity-100"
                  : "opacity-0 absolute inset-0 pointer-events-none"
              )}
              style={{
                marginTop: 0,
              }}
            >
              <div className="[&>div]:!mt-0 [&>div]:!mb-0 [&>div>div:first-child]:!rounded-t-none">
                {tab.props.children}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Handle legacy examples-based usage
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
            onClick={() => setActiveTabIndex(index)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all duration-200",
              "first:rounded-tl-lg last:rounded-tr-lg",
              "border-b-2 border-transparent",
              activeTabIndex === index
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
              activeTabIndex === index
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
