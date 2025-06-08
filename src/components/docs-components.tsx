import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";
import { type ReactNode } from "react";

interface FeatureListProps {
  features?: Array<{
    name: string;
    included: boolean;
    description?: string;
  }>;
  children?: ReactNode;
  className?: string;
}

export function FeatureList({
  features,
  children,
  className,
}: FeatureListProps) {
  // Handle children-based usage (MDX pattern)
  if (children && !features) {
    // Extract text content from children and convert to feature list
    let textContent = "";

    // Helper function to extract text from React nodes
    const extractText = (node: ReactNode): string => {
      if (typeof node === "string") {
        return node;
      }
      if (typeof node === "number") {
        return String(node);
      }
      if (Array.isArray(node)) {
        return node.map(extractText).join("");
      }
      if (node && typeof node === "object" && "props" in node) {
        const element = node as { props?: { children?: ReactNode } };
        if (element.props && element.props.children) {
          return extractText(element.props.children);
        }
      }
      if (node && typeof node === "object" && "children" in node) {
        const element = node as { children?: ReactNode };
        if (element.children) {
          return extractText(element.children);
        }
      }
      return "";
    };

    textContent = extractText(children);

    // Ensure textContent is a string before calling split
    if (typeof textContent !== "string") {
      textContent = String(textContent || "");
    }

    // Parse markdown-style list from text content
    const items = textContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("-"))
      .map((line) => line.substring(1).trim())
      .filter((line) => line.length > 0);

    return (
      <div className={cn("space-y-3 my-6", className)}>
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-medium text-foreground">{item}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Handle legacy features prop usage
  if (!features) {
    return null;
  }

  return (
    <div className={cn("space-y-3 my-6", className)}>
      {features.map((feature, index) => (
        <div key={index} className="flex items-start gap-3">
          {feature.included ? (
            <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          )}
          <div className="flex-1">
            <span
              className={cn(
                "font-medium",
                feature.included
                  ? "text-foreground"
                  : "text-muted-foreground line-through"
              )}
            >
              {feature.name}
            </span>
            {feature.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {feature.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

interface ApiMethodProps {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description: string;
  children?: ReactNode;
  className?: string;
}

export function ApiMethod({
  method,
  path,
  description,
  children,
  className,
}: ApiMethodProps) {
  const methodColors = {
    GET: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    POST: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    PUT: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
    DELETE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    PATCH:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
  };

  return (
    <div className={cn("my-6 rounded-lg border bg-card p-4", className)}>
      <div className="flex items-center gap-3 mb-3">
        <span
          className={cn(
            "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
            methodColors[method]
          )}
        >
          {method}
        </span>
        <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
          {path}
        </code>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {children && <div className="border-t pt-4">{children}</div>}
    </div>
  );
}

interface PropertyTableProps {
  properties: Array<{
    name: string;
    type: string;
    required?: boolean;
    description: string;
    default?: string;
  }>;
  className?: string;
}

export function PropertyTable({ properties, className }: PropertyTableProps) {
  return (
    <div className={cn("my-6 overflow-hidden rounded-lg border", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left px-4 py-3 font-semibold text-sm">
              Property
            </th>
            <th className="text-left px-4 py-3 font-semibold text-sm">Type</th>
            <th className="text-left px-4 py-3 font-semibold text-sm">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {properties.map((prop, index) => (
            <tr key={index} className="border-b last:border-b-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <code className="font-mono text-sm">{prop.name}</code>
                  {prop.required && (
                    <span className="text-red-500 text-xs">*</span>
                  )}
                </div>
                {prop.default && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Default: <code>{prop.default}</code>
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
                  {prop.type}
                </code>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface TabsProps {
  defaultTab?: string;
  children: ReactNode;
  className?: string;
}

interface TabProps {
  label: string;
  value: string;
  children: ReactNode;
}

export function Tabs({ children, className }: Omit<TabsProps, "defaultTab">) {
  // This is a simplified version - in production you'd want proper state management
  return (
    <div className={cn("my-6", className)}>
      <div className="border-b border-border">
        <div className="flex space-x-8">
          {/* Tab headers would be extracted from children in real implementation */}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function Tab({ children }: Pick<TabProps, "children">) {
  return <div>{children}</div>;
}

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "error" | "info";
  children: ReactNode;
  className?: string;
}

export function Badge({
  variant = "default",
  children,
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-muted text-muted-foreground",
    success:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

interface ComparisonTableProps {
  headers?: string[];
  rows?: Array<{
    framework: string;
    data: Array<string | boolean | ReactNode>;
  }>;
  children?: ReactNode;
  className?: string;
}

export function ComparisonTable({
  headers,
  rows,
  children,
  className,
}: ComparisonTableProps) {
  // Handle children-based usage (MDX pattern)
  if (children && (!headers || !rows)) {
    // Extract text content from children and convert to table data
    let textContent = "";

    // Helper function to extract text from React nodes
    const extractText = (node: ReactNode): string => {
      if (typeof node === "string") {
        return node;
      }
      if (typeof node === "number") {
        return String(node);
      }
      if (Array.isArray(node)) {
        return node.map(extractText).join("");
      }
      if (node && typeof node === "object" && "props" in node) {
        const element = node as { props?: { children?: ReactNode } };
        if (element.props && element.props.children) {
          return extractText(element.props.children);
        }
      }
      if (node && typeof node === "object" && "children" in node) {
        const element = node as { children?: ReactNode };
        if (element.children) {
          return extractText(element.children);
        }
      }
      return "";
    };

    textContent = extractText(children);

    // Ensure textContent is a string before parsing
    if (typeof textContent !== "string") {
      textContent = String(textContent || "");
    }

    // Parse markdown table from text content
    const lines = textContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && line.includes("|"));

    if (lines.length < 2) {
      return null; // Need at least header and one data row
    }

    // Extract headers from first line
    const headerLine = lines[0];
    const parsedHeaders = headerLine
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell.length > 0);

    // Skip separator line (if exists) and extract data rows
    const dataLines = lines
      .slice(1)
      .filter((line) => !line.match(/^[\s|:-]+$/));
    const parsedRows = dataLines
      .map((line) => {
        const cells = line
          .split("|")
          .map((cell) => cell.trim())
          .filter((cell) => cell.length > 0);

        if (cells.length === 0) return null;

        return {
          framework: cells[0].replace(/\*\*/g, ""), // Remove markdown bold
          data: cells.slice(1).map((cell) => {
            // Convert markdown formatting
            const cleanCell = cell.replace(/\*\*/g, ""); // Remove bold
            if (
              cleanCell === "✅" ||
              cleanCell.toLowerCase() === "yes" ||
              cleanCell.toLowerCase() === "true"
            ) {
              return true;
            }
            if (
              cleanCell === "❌" ||
              cleanCell.toLowerCase() === "no" ||
              cleanCell.toLowerCase() === "false"
            ) {
              return false;
            }
            return cleanCell;
          }),
        };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null);

    if (parsedHeaders.length === 0 || parsedRows.length === 0) {
      return null;
    }

    return (
      <div className={cn("my-6 overflow-hidden rounded-lg border", className)}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-muted/50">
              {parsedHeaders.map((header, index) => (
                <th
                  key={index}
                  className="text-left px-4 py-3 font-semibold text-sm"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parsedRows.map((row, index) => (
              <tr
                key={index}
                className="border-b last:border-b-0 hover:bg-muted/20"
              >
                <td className="px-4 py-3 font-medium">{row.framework}</td>
                {row.data.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3">
                    {typeof cell === "boolean" ? (
                      cell ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Handle legacy props-based usage
  if (!headers || !rows) {
    return null;
  }
  return (
    <div className={cn("my-6 overflow-hidden rounded-lg border", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-muted/50">
            {headers.map((header, index) => (
              <th
                key={index}
                className="text-left px-4 py-3 font-semibold text-sm"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className="border-b last:border-b-0 hover:bg-muted/20"
            >
              <td className="px-4 py-3 font-medium">{row.framework}</td>
              {row.data.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3">
                  {typeof cell === "boolean" ? (
                    cell ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
