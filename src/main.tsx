import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider";
import { MDXProvider } from "@mdx-js/react";
import CodeBlock from "./components/CodeBlock";
import CodeTabs, { CodeTab } from "./components/CodeTabs";
import Tooltip from "./components/Tooltip";
import Callout from "./components/Callout";
import Hero from "./components/Hero";
import Accordion from "./components/Accordion";
import * as Tabs from "./components/Tabs";
import * as Card from "./components/Card";
import * as Typography from "./components/ui/typography";
import {
  FeatureList,
  ApiMethod,
  PropertyTable,
  Badge,
  ComparisonTable,
} from "./components/docs-components";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      {" "}
      <MDXProvider
        components={{
          // Code blocks
          pre: CodeBlock,
          code: Typography.InlineCode,
          CodeBlock, // Add CodeBlock as a named component for MDX

          // Typography
          h1: Typography.H1,
          h2: Typography.H2,
          h3: Typography.H3,
          h4: Typography.H4,
          h5: Typography.H5,
          h6: Typography.H6,
          p: Typography.P,
          a: Typography.A,
          hr: Typography.Hr,
          blockquote: Typography.Blockquote,
          ul: Typography.List,
          ol: Typography.OrderedList,
          li: Typography.ListItem,
          table: Typography.Table,
          tr: Typography.TableRow,
          th: Typography.TableHead,
          td: Typography.TableCell, // Custom components
          Tooltip,
          Callout,
          Hero,
          Accordion,
          CodeTabs,
          CodeTab,
          Note: Typography.Note,
          Warning: Typography.Warning,
          Info: Typography.Info,
          Step: Typography.Step,
          Lead: Typography.Lead,
          Large: Typography.Large,
          Small: Typography.Small,
          Muted: Typography.Muted, // Documentation components
          FeatureList,
          ApiMethod,
          PropertyTable,
          Badge,
          ComparisonTable,

          // Tabs and Cards
          ...Tabs,
          ...Card,
        }}
      >
        <App />
      </MDXProvider>
    </ThemeProvider>
  </StrictMode>
);
