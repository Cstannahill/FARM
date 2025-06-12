# MDX Style Guide for FARM Framework Documentation

This comprehensive style guide ensures consistent, high-quality documentation across the FARM Framework project. All documentation authors and contributors should follow these guidelines.

## Table of Contents

1. [Frontmatter Specifications](#frontmatter-specifications)
2. [Content Structure](#content-structure)
3. [Typography Guidelines](#typography-guidelines)
4. [Code Examples](#code-examples)
5. [Interactive Components](#interactive-components)
6. [Best Practices](#best-practices)
7. [Template Usage](#template-usage)

## Frontmatter Specifications

The FARM Framework uses [gray-matter](https://github.com/jonschlinkert/gray-matter) for frontmatter parsing, which supports YAML, JSON, TOML, and JavaScript formats. We standardize on **YAML** for consistency.

### Required Fields

Every MDX file must include these essential fields:

```yaml
---
title: "Document Title" # Required: Page title for navigation and SEO
description: "Brief page description" # Required: Meta description for SEO and search
sidebarTitle: "Sidebar Title" # Required: Shortened title for sidebar navigation
---
```

### Optional but Recommended Fields

```yaml
---
# Navigation & Organization
icon: "rocket" # Optional: Icon name for sidebar (Lucide icons)
category: "getting-started" # Optional: Content category for organization
difficulty: "beginner" # Optional: beginner|intermediate|advanced
order: 1 # Optional: Sort order within category

# Content Metadata
tags: ["typescript", "api", "tutorial"] # Optional: Array of relevant tags
author: "FARM Team" # Optional: Author name or team
lastUpdated: "2024-01-20" # Optional: ISO date format (YYYY-MM-DD)
version: "1.0.0" # Optional: Documentation version

# Feature Flags
draft: false # Optional: Hide from production (default: false)
featured: true # Optional: Feature in listings (default: false)
deprecated: false # Optional: Mark as deprecated (default: false)

# Advanced Options
breadcrumbs: # Optional: Custom breadcrumb path
  - { label: "Docs", href: "/docs" }
  - { label: "Guides", href: "/docs/guides" }
customCSS: ["./custom-styles.css"] # Optional: Additional CSS files
---
```

### Frontmatter Format Examples

#### YAML (Recommended)

```yaml
---
title: "Getting Started with FARM"
description: "Complete guide to setting up your first FARM application"
sidebarTitle: "Getting Started"
icon: "rocket"
category: "tutorial"
difficulty: "beginner"
tags: ["setup", "installation", "tutorial"]
author: "FARM Team"
lastUpdated: "2024-01-20"
---
```

#### JSON (Alternative)

```yaml
---json
{
  "title": "Advanced Architecture Patterns",
  "description": "Deep dive into FARM framework architecture",
  "sidebarTitle": "Architecture",
  "icon": "building",
  "category": "advanced",
  "difficulty": "advanced",
  "tags": ["architecture", "patterns", "scalability"]
}
---
```

#### JavaScript (For Dynamic Content)

```yaml
---js
{
  title: "Dynamic Configuration Guide",
  description: "Runtime configuration and environment setup",
  sidebarTitle: "Configuration",
  category: "configuration",
  lastUpdated: () => new Date().toISOString().split('T')[0],
  buildInfo: {
    environment: process.env.NODE_ENV || 'development',
    timestamp: Date.now()
  }
}
---
```

## Content Structure

### Document Hierarchy

Follow this consistent structure for all documentation:

```markdown
# Main Title (H1) - Should match frontmatter title

Brief introduction paragraph explaining what this document covers.

## Overview (H2) - Optional but recommended

High-level summary of the topic.

## Prerequisites (H2) - If applicable

<Alert>
  <AlertTitle>Prerequisites</AlertTitle>
  <AlertDescription>
    List required knowledge, tools, or setup steps.
  </AlertDescription>
</Alert>

## Main Content Sections (H2)

### Subsections (H3)

#### Detailed Topics (H4)

##### Specific Details (H5) - Use sparingly

###### Minor Points (H6) - Rarely needed

## Examples (H2)

## Troubleshooting (H2) - If applicable

## Next Steps (H2) - Recommended

## Related Documentation (H2) - Optional
```

### Page Navigation

Always include clear navigation helpers:

```markdown
## What's Next?

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">

<Card>
  <CardHeader>
    <CardTitle>Next: Database Setup</CardTitle>
  </CardHeader>
  <CardContent>
    Learn how to configure and connect to MongoDB.
    
    [Database Guide →](/docs/guide/database)
  </CardContent>
</Card>

<Card>
  <CardHeader>
    <CardTitle>Related: Type Generation</CardTitle>
  </CardHeader>
  <CardContent>
    Understand automatic TypeScript type generation.
    
    [Type-Sync →](/docs/type-sync)
  </CardContent>
</Card>

</div>
```

## Typography Guidelines

### Headings

- **H1**: Page title only (matches frontmatter title)
- **H2**: Major sections
- **H3**: Subsections within major topics
- **H4**: Specific implementation details
- **H5-H6**: Use sparingly for very specific breakdowns

### Text Formatting

- **Bold**: Use for emphasis, UI elements, and important terms
- _Italic_: Use for subtle emphasis, file names, or foreign terms
- `Inline code`: Use for code snippets, file names, and technical terms
- [Links]: Always use descriptive link text

### Lists

**Unordered Lists**: Use for non-sequential items

- Feature lists
- Benefits and advantages
- Related concepts

**Ordered Lists**: Use for sequential steps

1. Installation steps
2. Configuration process
3. Implementation workflow

**Task Lists**: Use for progress tracking

- [x] Completed features
- [ ] Upcoming features
- [ ] Future enhancements

### Emphasis and Callouts

Use our custom components for different types of emphasis:

```markdown
<Alert>
  <AlertTitle>Important Note</AlertTitle>
  <AlertDescription>
    Critical information that users must understand.
  </AlertDescription>
</Alert>

<Note title="Pro Tip">
  Helpful suggestions and best practices.
</Note>

<Warning title="Caution">
  Important warnings about potential issues.
</Warning>
```

## Code Examples

### Inline Code

Use backticks for:

- File names: `package.json`
- Command names: `npm install`
- Variable names: `API_KEY`
- Short code snippets: `const app = createFarmApp()`

### Code Blocks

#### Single Language

```typescript
import { createFarmApp } from "@farm/core";

const app = createFarmApp({
  database: {
    url: process.env.DATABASE_URL,
  },
  ai: {
    provider: "ollama",
    models: ["llama3.2"],
  },
});
```

#### Multiple Languages with Tabs

```mdx
<CodeTabs examples={[
  {
    language: "typescript",
    label: "TypeScript",
    code: `import { createFarmApp, FarmConfig } from '@farm/core';

const config: FarmConfig = {
database: {
url: process.env.DATABASE_URL!,
options: { maxPoolSize: 10 }
}
};

const app = createFarmApp(config);`  },
  {
    language: "javascript", 
    label: "JavaScript",
    code:`const { createFarmApp } = require('@farm/core');

const app = createFarmApp({
database: {
url: process.env.DATABASE_URL,
options: { maxPoolSize: 10 }
}
});`
}
]} />
```

#### Command Line Examples

Use appropriate shell syntax:

```bash
# Installation
npm create farm-app@latest my-app
cd my-app

# Development
npm run dev

# Production build
npm run build
```

### Code Highlighting

Highlight important lines or changes:

```typescript {3,7-9}
import { createFarmApp } from "@farm/core";

const app = createFarmApp({
  database: {
    url: process.env.DATABASE_URL,
  },
  // Highlight these AI configuration lines
  ai: {
    provider: "ollama",
    models: ["llama3.2", "codellama"],
  },
});
```

## Interactive Components

### Feature Lists

```mdx
<FeatureList
  features={[
    {
      name: "TypeScript Support",
      included: true,
      description: "Full TypeScript integration out of the box",
    },
    {
      name: "Hot Module Replacement",
      included: true,
      description: "Fast development with instant updates",
    },
    {
      name: "GraphQL Support",
      included: false,
      description: "Coming in version 2.0",
    },
  ]}
/>
```

### Property Tables

```mdx
<PropertyTable
  properties={[
    {
      name: "apiKey",
      type: "string",
      required: true,
      description: "Your API key for authentication",
    },
    {
      name: "timeout",
      type: "number",
      required: false,
      description: "Request timeout in milliseconds",
      default: "5000",
    },
  ]}
/>
```

### Expandable Sections

````mdx
<Accordion>
  <AccordionItem title="Advanced Configuration">
    Detailed configuration options for production deployments. ```yaml
    production: database: replicas: 3 sharding: true cache: redis: true ttl:
    3600 ```
  </AccordionItem>
</Accordion>
````

### Grid Layouts

```mdx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">

<Card>
  <CardHeader>
    <CardTitle>🎨 Design System</CardTitle>
  </CardHeader>
  <CardContent>Consistent UI components and design patterns.</CardContent>
</Card>

<Card>
  <CardHeader>
    <CardTitle>⚡ Performance</CardTitle>
  </CardHeader>
  <CardContent>Optimized for speed and developer experience.</CardContent>
</Card>

</div>
```

## Best Practices

### Writing Style

1. **Clear and Concise**: Use simple, direct language
2. **Active Voice**: Prefer active over passive voice
3. **Present Tense**: Use present tense for instructions
4. **Consistent Terminology**: Use the same terms throughout
5. **User-Focused**: Write from the user's perspective

### Content Organization

1. **Progressive Disclosure**: Start simple, add complexity gradually
2. **Scannable Structure**: Use headings, lists, and whitespace effectively
3. **Cross-References**: Link to related documentation
4. **Examples First**: Show working examples before explaining theory
5. **Testing**: Include testable examples and validation steps

### Technical Accuracy

1. **Code Testing**: All code examples must be tested and working
2. **Version Specificity**: Specify version requirements clearly
3. **Error Handling**: Include common errors and solutions
4. **Platform Coverage**: Consider different operating systems when relevant
5. **Dependencies**: List all required dependencies and versions

### Accessibility

1. **Alt Text**: Provide alt text for all images
2. **Descriptive Links**: Use meaningful link text
3. **Color Independence**: Don't rely solely on color for meaning
4. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
5. **Screen Reader Friendly**: Structure content for screen reader users

### SEO and Discoverability

1. **Descriptive Titles**: Use clear, searchable titles
2. **Meta Descriptions**: Write compelling descriptions under 160 characters
3. **Header Hierarchy**: Use proper heading hierarchy (H1 → H2 → H3)
4. **Internal Linking**: Link to related content within the documentation
5. **Tag Strategy**: Use relevant, consistent tags for categorization

## Template Usage

Use the provided MDX template (`docs/MDX_TEMPLATE.mdx`) as a starting point for all new documentation. The template includes:

- Proper frontmatter structure
- Content organization guidelines
- Common component examples
- Best practice reminders

### Template Customization

1. **Copy the template**: `cp docs/MDX_TEMPLATE.mdx your-new-file.mdx`
2. **Update frontmatter**: Modify all required and relevant optional fields
3. **Replace placeholder content**: Add your actual documentation content
4. **Test locally**: Verify rendering and functionality
5. **Review checklist**: Use the template's built-in checklist

### Quality Assurance

Before submitting documentation:

- [ ] Frontmatter is complete and accurate
- [ ] All code examples are tested and working
- [ ] Links are valid and point to correct destinations
- [ ] Typography follows the style guide
- [ ] Components render correctly
- [ ] Content is proofread for grammar and clarity
- [ ] Tags and categories are appropriate
- [ ] Navigation helpers are included

## Common Mistakes to Avoid

### Frontmatter Issues

❌ **Don't use Docusaurus conventions:**

```yaml
---
sidebar_position: 4 # Docusaurus convention - don't use
slug: /getting-started # Not needed for FARM docs
---
```

✅ **Use FARM conventions:**

```yaml
---
title: "Getting Started"
description: "How to start using FARM"
sidebarTitle: "Getting Started"
order: 1 # Use this instead of sidebar_position
---
```

### Content Structure Issues

❌ **Don't skip heading levels:**

```markdown
# Main Title

### Skipped H2 - Bad!
```

✅ **Follow proper hierarchy:**

```markdown
# Main Title

## Section Title

### Subsection Title
```

### Code Example Issues

❌ **Don't use untested code:**

```typescript
// This might not work
const app = createFarmApp(invalidConfig);
```

✅ **Use tested, working examples:**

```typescript
// Tested and verified
const app = createFarmApp({
  database: { url: process.env.DATABASE_URL },
});
```

This style guide ensures that all FARM Framework documentation maintains high quality, consistency, and usability across all contributors and use cases.
