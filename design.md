# Mintlify-Style DocuTailwind Config (`tailwind.config.ts`): Define content paths to all .tsx and .mdx files. Extend the theme with Radix color scales (e.g. slate, gray, blue, etc.) as used by Radix UI. Include Shadcn's plugin if available (or manually add Radix colors). For example:

```ts
// tailwind.config.ts (excerpt)
import { slate, slateDark, slateA } from "@radix-ui/colors";

module.exports = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ...slate, // Radix Slate light
        ...slateDark, // Radix Slate dark
        // add other Radix palettes (blue, etc.) if needed
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"), // for prose styling
    // require('shadcn/ui') if using their plugin (optional)
  ],
};
```

on Site Architecture

Recreating the look-and-feel of Mintlify’s docs requires a React/TypeScript app (here using Vite) styled with Tailwind CSS and the Radix-based Shadcn UI components. In practice, the docs site will be a SPA with an MDX-powered content area and a persistent navigation/sidebar. We should adopt Tailwind’s design system extended by the Radix UI color palette and Shadcn UI components. Mintlify’s own design guide explicitly follows Radix UI and Tailwind CSS principles for colors, spacing, and fontsmintlify.com. For example, Tailwind CSS (with Radix UI Colors) should be used for styling, and Shadcn UI (built on Radix) can supply rich components and primitivesGitHub. Our architecture will reflect this: a global Tailwind config (with Radix color scales and typography plugin), a common layout (header/sidebar/footer), and custom React components for all interactive UI elements (accordions, tabs, etc.).

##

Tech Stack and Tooling

React + TypeScript: All pages and components are written in TypeScript/React for type safety and modularity.

Vite: A fast bundler chosen to build the docs site, avoiding larger frameworks (as per user preference). MDX can be integrated via a plugin (like vite-plugin-mdx).

Tailwind CSS: Utility-first CSS framework to design the theme. Extend its default theme with Radix color palettes for consistency (see [Mintlify design guidelines]mintlify.com).

Shadcn UI / Radix UI: A set of accessible components styled with Tailwind. Use Shadcn’s library (or implement similar) for UI widgets like Accordion, Tabs, Tooltip, etc.GitHubGitHub.

MDX: Documentation pages are written in MDX, enabling us to include custom React components within markdown.

Using Tailwind and Shadcn is explicitly suggested by the project’s own notes: the FARM framework’s docs plan states “Styling – Tailwind + ShadCN installed”GitHub, and OrbitKit’s example lists Tailwind (with Radix colors) and Shadcn UI for styling and componentsGitHub. This confirms our stack choice.

Tailwind CSS Configuration and Styleguide

Tailwind Config (``): Define content paths to all .tsx and .mdx files. Extend the theme with Radix color scales (e.g. slate, gray, blue, etc.) as used by Radix UI. Include Shadcn’s plugin if available (or manually add Radix colors). For example:

ts

CopyEdit

// tailwind.config.ts (excerpt) import { slate, slateDark, slateA } from '@radix-ui/colors'; module.exports = { content: ['./src/**/*.{ts,tsx,mdx}'], darkMode: 'class', theme: { extend: { colors: { ...slate, // Radix Slate light ...slateDark, // Radix Slate dark // add other Radix palettes (blue, etc.) if needed }, fontFamily: { sans: ['Inter', 'sans-serif'], }, }, }, plugins: [ require('@tailwindcss/typography'), // for prose styling // require('shadcn/ui') if using their plugin (optional) ], };

Using the Radix color tokens and @tailwindcss/typography plugin ensures our text, links, and code are styled harmoniously. Mintlify’s redesign “updated our colors, spacing, fonts” by following Radix UI and Tailwind guidelinesmintlify.com, so mirroring those palettes and rem-based spacing is key.

Global CSS (`src/index.css` or similar): Include the Tailwind base directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Configure dark mode (e.g. via a class on <html>). Optionally add custom resets or global styles: set html { scroll-behavior: smooth; }, body background (bg-white / dark-gray), and the chosen font family. Mintlify often uses a clean sans-serif (e.g. Inter) with consistent line-height. Spacing should follow a modular scale (4, 8, 16px, etc.) as per Tailwind’s default. Overall, follow Radix’s spacing scale to match their “fresh, simplified style”mintlify.com.

Theme Tokens: Define primary/secondary colors (e.g. blue shades), default text color (Radix gray 12 for light mode, gray 1 in dark mode), and backgrounds (white/light gray in light mode, dark slate in dark mode). Keep buttons or callouts in a consistent accent hue (Mintlify’s brand blue or similar).

Layout and Navigation

Responsive Layout: Implement a sidebar-and-content layout. On desktop, a left sidebar holds navigation (see Navigation below), and the main right pane shows the MDX content. On mobile, collapse the sidebar into a hamburger menu or drawer (Shadcn’s Sheet component can create a slide-out menu). The layout should use Tailwind flex/grid utilities and be mobile-friendly (Mintlify’s site is responsive by design).

Top Bar / Header: A top bar can contain the site logo/title (e.g. “Documentation”), a search or command palette trigger (Mintlify shows “⌘K Ask AI”), and account/demo links. Use Shadcn/Radix components: e.g. a simple div with horizontal flex (flex items-center justify-between p-4 border-b). If implementing search/command, Shadcn’s Command or Radix Popover is useful.

Sidebar Navigation: The sidebar lists sections with headings (e.g. “Getting Started”, “Components”, etc.) and links to pages. Each category can be a static header (<div class="font-semibold uppercase text-sm mt-4">) and each page a Link (<a> or React Router/NextLink) styled as a block with padding. Active link can be highlighted (e.g. blue text or a left border). For nesting (like sub-items), indent with padding. Tailwind classes like text-gray-700 hover:text-gray-900 and pl-4 for items work well. Optionally use Shadcn’s ScrollArea to make the sidebar scrollable if long.

Breadcrumb / Page Title: At top of content, render the current section path or title. Mintlify shows a mini-breadcrumb (e.g. “Getting Started › Introduction”). You can display this as plain text or links. The page title (<h1>) should use a larger font (e.g. text-2xl font-bold) with some top margin.

Footer: A simple footer with links (like Mintlify’s “Resources”, “Company”, “Legal” lists). Use a responsive grid or flex layout, smaller text color (gray-500), and maintain consistent spacing. The footer should appear at bottom of pages (static or sticky). Mintlify repeats some nav in the footer; you may simplify.

MDX Content and Typography

Typography Styles: Apply the Tailwind Typography (prose) classes to the content container (e.g. <article className="prose dark:prose-invert max-w-none">). This ensures nice defaults for headings, paragraphs, lists, and code. Customize the typography theme in tailwind.config if needed (font-sizes, link colors, etc.). Mintlify’s headings and text are clean and well-spaced; using the typography plugin replicates that.

MDX Components: Provide custom components for the special docs widgets. For example, in your MDX provider (or in mdx-bundler settings), map:

<Accordion title="...">…</Accordion> to a React Accordion component (using Shadcn’s Accordion or Radix Collapsible).

<Tabs> <Tab title="...">…</Tab> … </Tabs> to a Tabs component (Shadcn Tabs).

<Tooltip tip="...">Text</Tooltip> to a Tooltip (Shadcn/Radix Tooltip).

<Callout type="tip">…</Callout> to a styled alert box (see Callouts below).

<CodeGroup>…</CodeGroup> if grouping code by language (could use Shadcn Tabs under the hood).

Other components (Buttons, Alerts, etc.) as needed.
Essentially, any interactive example shown in Mintlify (accordions, tabs, etc.) should have a corresponding React component. These should be exported and then available to MDX files via an MDXProvider.

Typography and Elements: For plain markdown content, rely on Tailwind Typography. Custom MDX elements:

Headings (**-**): Ensure they have consistent font weights and margins (e.g. mt-8 font-bold for h2, smaller margins for h3/h4). The typography plugin handles much of this, but you can override in index.css if needed.

Paragraphs: Use base text color (text-gray-800 dark:text-gray-200) and comfortable line height (leading-7).

Lists (**, **): Default bullets or numbering with decent indent (typography plugin again).

Tables: Style with prose or custom: borders, padding, alternating row color (Tailwind “odd:bg-gray-100” etc.).

Code Blocks: Customize code block background (light gray bg-gray-100 in light mode, bg-gray-800 dark), monospace font, and a copy button. Mintlify’s code blocks have a top bar with filename and copy icon. You can implement this by wrapping <pre><code> in a custom component that adds a header. Syntax highlighting can use Prism or Shiki; the docs mention using Shikimintlify.com. Ensure line-height and padding (e.g. p-4 overflow-auto rounded).

Component Guide

Below are the key UI components (mostly provided by Shadcn UI or Radix) and how they should look/styled to match Mintlify:

Alert / Callout: Use Shadcn’s Alert component (or make a <Callout type="info|warning|tip">). Style: colored border or background (blue for info, yellow for warning, etc.), left accent bar or icon. E.g. bg-blue-50 border-blue-500 text-blue-800 p-4 rounded. These callouts draw attention to notes or warnings.

Card: A simple box with shadow or border (Shadcn Card). E.g. bg-white dark:bg-gray-800 shadow rounded-lg p-6. Useful for highlighting key info or example snippets.

Accordion: Toggle sections (Shadcn Accordion or Radix Collapsible). Example: each accordion item has a header row and hidden content. Style the header with cursor-pointer py-2 flex justify-between items-center and rotate an icon on open. Use border or background for the header row.

Tabs: Use Shadcn Tabs. The Mintlify style has horizontal tabs with an underline indicator. E.g. Tab list with inline-flex and each Tab trigger styled with px-4 py-2 -mx-4 font-medium and the selected tab has a bottom border (border-b-2 border-blue-500). Content area with border or background (p-4 border). The example [33] shows code content under tabs.

Tooltip: Use Shadcn Tooltip. Inline text that shows a small popup on hover. Style with a gray/black background and white text. The example [35] shows <Tooltip tip="This is a tooltip!">Hover me</Tooltip>. Implement with @radix-ui/react-tooltip under the hood.

Buttons: Style primary buttons (e.g. “Try for free”) in header as blue background with white text (bg-blue-600 hover:bg-blue-700), rounded corners, and padding. Secondary buttons: outline style.

Links: Default link color should be blue (text-blue-600 hover:underline). Dark mode can invert or use lighter blue. Ensure visited links are distinct if needed.

Icons: Use an icon library (Heroicons or Radix icons). In callouts or steps, mintlify uses arrow/emojis. Use similar flex items-center space-x-2 to pair icon with text.

Code and Code Blocks: As mentioned, with syntax highlighting (Shiki or Prism). Include copy-button overlay (positioned in top-right of code block) with a clipboard icon. Use monospace font (font-mono text-sm), and light scroll area if horizontal.

Code Groups: If supporting toggling languages, use a tab component or radio buttons to switch code blocks. Shadcn doesn’t have a built-in codegroup, but you can use the Tabs component, labeling each tab with the language name.

Lists & Tables: Styled by Tailwind Typography by default. For tables, ensure min-width: full, borders (border classes), and thead styled differently (bg-gray-100). Use overflow-x-auto wrapper for mobile.

Field / Form Components: For any interactive docs (e.g. example form), use Shadcn form components (Input, Checkbox, Select) to style form fields. Labels above fields with spacing.

Mermaid Diagrams: Use a React Mermaid integration (like react-mermaid2) to embed diagrams. Surround with a full-width container.

Panels / Drawers: For things like side menus or feature toggles, Shadcn’s Sheet (side panel) or Dialog can be used.

Steps / Progress: For numbered steps, use a horizontal flex with step circles (use CSS for circles or Shadcn’s Steps if available) and labels. Each step item: circle with number (bg-blue, text-white) and step description.

Each custom component should follow the site’s light/dark theme: e.g. light mode white backgrounds vs dark mode slate-900, text switching between black and light-gray. Rounded corners (rounded-md), subtle shadows or borders for depth, and consistent spacing (Tailwind’s p-/m- increments).

MDX Components Registration

In your code, set up an MDX provider so that when writing MDX files, you can use the custom components above. For example:

```tsx
import { MDXProvider } from "@mdx-js/react";
import Accordion from "./components/Accordion";
import Tabs from "./components/Tabs";
import Tooltip from "./components/Tooltip";
import Alert from "./components/Alert";
// ...other imports

const mdxComponents = {
  Accordion,
  Tabs,
  Tab: Tabs.Tab,
  Tooltip,
  Alert,
  // map h1..h4 if you need custom styling overrides
};

function App() {
  return (
    <MDXProvider components={mdxComponents}>
      {/* your MDX content router/view */}
    </MDXProvider>
  );
}
```

Then in MDX pages (e.g. Introduction.mdx), authors can write:

```mdx
import { Accordion, Tabs, Tooltip } from "your-component-library";

# Headers and Text

This is a _callout_: <Tooltip tip="Extra info">hover over me</Tooltip>.

<Tabs>
  <Tab title="First">Content 1</Tab>
  <Tab title="Second">Content 2</Tab>
</Tabs>

<Accordion title="I am an Accordion">Hidden content here.</Accordion>
```

Shadcn’s documentation generator (or simple React setup) will render these with the styled components you created.

Examples and Style References

Mintlify Introduction Page: The top intro page uses a large hero text and buttons. Ensure your home page (or index) has a similar banner (e.g. big heading, subheading, CTA buttons) with center alignment, padded section (py-16), and possibly a background image or light accent.

Component Showcase: The “Components” section on Mintlify shows examples with code on one side and the rendered component on the other. You might replicate this by creating MDX examples with two columns: left code snippet (<CodeBlock> component) and right a live demo (your component with props).

Consistency: All components should share the same radius (rounded-md by default), typography scale, and color palette. Mintlify’s UI is minimalistic with generous whitespace. Use Tailwind’s utility classes (space-y-6, divide-y divide-gray-200, etc.) to space lists and sections.

Sources: Mintlify’s own design blog notes that they rebuilt their design system around Radix UI and Tailwind CSSmintlify.com. Internal project notes confirm using Tailwind + Shadcn UI for stylingGitHubGitHub. Following these guidelines ensures our docs site matches the “beautiful out-of-the-box” feel of Mintlify’s docs.
