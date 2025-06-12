# Documentation Contributor Guidelines

Welcome to the FARM Framework documentation team! This guide will help you create high-quality, consistent documentation that follows our established patterns and standards.

## Quick Start

1. **Read the Style Guide**: Familiarize yourself with [`docs/MDX_STYLE_GUIDE.md`](./MDX_STYLE_GUIDE.md)
2. **Use the Template**: Copy [`docs/MDX_TEMPLATE.mdx`](./MDX_TEMPLATE.mdx) for new documents
3. **Follow the Checklist**: Complete all items before submitting
4. **Test Locally**: Verify your documentation renders correctly

## Documentation Standards

### File Organization

```
docs-site/pages/
├── docs/
│   ├── index.mdx                 # Main documentation landing page
│   ├── getting-started.mdx       # Installation and first steps
│   ├── guide/                    # Comprehensive guides
│   │   ├── architecture.mdx      # Framework architecture
│   │   ├── ai-integration.mdx    # AI/ML integration guide
│   │   └── database.mdx          # Database setup and usage
│   ├── api/                      # API reference documentation
│   │   ├── cli.mdx              # CLI command reference
│   │   └── configuration.mdx     # Configuration options
│   ├── tutorials/                # Step-by-step tutorials
│   └── advanced/                 # Advanced topics and patterns
└── architectural-sketches/       # Design documents and RFCs
```

### File Naming Conventions

- Use kebab-case: `getting-started.mdx`, `ai-integration.mdx`
- Be descriptive: `database-migration-guide.mdx` not `db-guide.mdx`
- Include context: `api-cli-reference.mdx` not just `cli.mdx`
- Avoid abbreviations when possible: `configuration.mdx` not `config.mdx`

## Writing Process

### 1. Planning

Before writing, consider:

- **Audience**: Who will read this? (beginners, advanced users, etc.)
- **Purpose**: What problem does this solve?
- **Scope**: What topics will and won't be covered?
- **Prerequisites**: What should readers know first?

### 2. Research

- Review existing documentation for consistency
- Test all code examples and procedures
- Identify related documentation to link to
- Check for duplicate or overlapping content

### 3. Writing

1. **Copy the template**:

   ```bash
   cp docs/MDX_TEMPLATE.mdx docs-site/pages/docs/your-topic.mdx
   ```

2. **Update frontmatter**:

   - Choose appropriate category and difficulty
   - Select relevant tags
   - Pick a suitable icon from [Lucide Icons](https://lucide.dev/icons/)

3. **Structure your content**:
   - Start with a clear introduction
   - Use progressive disclosure (simple → complex)
   - Include working examples
   - Add navigation helpers

### 4. Review and Testing

- [ ] All frontmatter fields are accurate
- [ ] Code examples are tested and working
- [ ] Links are valid and point to correct destinations
- [ ] Components render correctly
- [ ] Content follows style guide
- [ ] Typography and formatting are consistent
- [ ] Navigation helpers are included
- [ ] Proofread for grammar and clarity

## Frontmatter Best Practices

### Required Fields

Every documentation file must include:

```yaml
---
title: "Clear, Descriptive Title"
description: "Concise description under 160 characters"
sidebarTitle: "Short Navigation Title"
---
```

### Category Guidelines

Choose the appropriate category:

- **`getting-started`**: Installation, setup, first steps
- **`guides`**: Comprehensive how-to guides
- **`tutorials`**: Step-by-step learning paths
- **`api`**: Reference documentation
- **`advanced`**: Complex patterns and architecture
- **`tools`**: CLI, development tools, utilities

### Difficulty Levels

- **`beginner`**: No prior FARM knowledge required
- **`intermediate`**: Basic FARM familiarity expected
- **`advanced`**: Deep technical knowledge assumed

### Tag Strategy

Use relevant, consistent tags:

- **Technology**: `typescript`, `python`, `react`, `mongodb`
- **Features**: `authentication`, `ai`, `database`, `deployment`
- **Type**: `tutorial`, `guide`, `reference`, `example`
- **Audience**: `beginner`, `advanced`, `enterprise`

## Content Guidelines

### Code Examples

#### ✅ Good Examples

```typescript
// Clear, working example with context
import { createFarmApp } from "@farm/core";

const app = createFarmApp({
  database: {
    url: process.env.DATABASE_URL || "mongodb://localhost:27017/farm",
  },
  ai: {
    provider: "ollama",
    models: ["llama3.2"],
  },
});

// Start the application
app.listen(3000, () => {
  console.log("FARM app running on http://localhost:3000");
});
```

#### ❌ Poor Examples

```typescript
// Unclear, untested example
const app = createApp(config); // What config?
app.start(); // No context or explanation
```

### Writing Style

- **Use active voice**: "Configure the database" not "The database should be configured"
- **Be concise**: Remove unnecessary words and phrases
- **Stay consistent**: Use the same terminology throughout
- **Include context**: Explain why, not just how
- **Test everything**: All examples must work

### Component Usage

#### Alerts and Callouts

```mdx
<Alert>
  <AlertTitle>Important</AlertTitle>
  <AlertDescription>
    Critical information users must understand.
  </AlertDescription>
</Alert>

<Note title="Pro Tip">Helpful advice for better implementation.</Note>

<Warning title="Caution">Potential pitfalls or breaking changes.</Warning>
```

#### Code Tabs

Use for multiple implementation approaches:

```mdx
<CodeTabs
  examples={[
    {
      language: "typescript",
      label: "TypeScript",
      code: `// TypeScript implementation`,
    },
    {
      language: "javascript",
      label: "JavaScript",
      code: `// JavaScript implementation`,
    },
  ]}
/>
```

#### Feature Lists

Perfect for comparing features or capabilities:

```mdx
<FeatureList
  features={[
    {
      name: "Feature Name",
      included: true,
      description: "What this feature provides",
    },
  ]}
/>
```

## Common Mistakes to Avoid

### Frontmatter Issues

❌ **Using Docusaurus conventions**:

```yaml
sidebar_position: 4 # Don't use this
slug: /custom-path # Not needed
```

✅ **Using FARM conventions**:

```yaml
order: 4 # Use this for ordering
# URLs are generated from file paths
```

### Content Structure Issues

❌ **Skipping heading levels**:

```markdown
# Title

### Subsection (missing H2)
```

✅ **Proper hierarchy**:

```markdown
# Title

## Section

### Subsection
```

### Code Issues

❌ **Untested examples**:

```typescript
// This might not work
createApp(undefined).start();
```

✅ **Tested, complete examples**:

```typescript
// Verified working code
import { createFarmApp } from "@farm/core";

const app = createFarmApp({
  database: { url: process.env.DATABASE_URL },
});
```

## Submission Process

### Pull Request Guidelines

1. **Branch naming**: Use descriptive names like `docs/add-authentication-guide`
2. **Commit messages**: Follow conventional commits: `docs: add authentication guide`
3. **PR description**: Explain what documentation you're adding/changing and why
4. **Self-review**: Use the checklist before requesting review

### Review Checklist

Before submitting your PR:

- [ ] Frontmatter is complete and follows conventions
- [ ] Content structure follows the style guide
- [ ] All code examples are tested and working
- [ ] Links are valid and use correct paths
- [ ] Components render properly in development
- [ ] Grammar and spelling are correct
- [ ] Navigation helpers are included
- [ ] Related documentation is linked
- [ ] Tags and categories are appropriate

### Getting Feedback

1. **Request specific feedback**: Ask reviewers to focus on particular areas
2. **Be responsive**: Address feedback promptly and thoroughly
3. **Ask questions**: Don't hesitate to clarify review comments
4. **Test suggestions**: Verify that suggested changes work correctly

## Tools and Resources

### Development Setup

```bash
# Clone the repository
git clone https://github.com/farm-framework/farm-web.git
cd farm-web

# Install dependencies
npm install

# Start development server
npm run dev

# Build documentation index
npm run index-docs
```

### Useful Links

- [MDX Style Guide](./MDX_STYLE_GUIDE.md) - Complete writing guidelines
- [MDX Template](./MDX_TEMPLATE.mdx) - Starting template for new docs
- [Lucide Icons](https://lucide.dev/icons/) - Icon reference
- [Gray-Matter Documentation](https://github.com/jonschlinkert/gray-matter) - Frontmatter parser docs
- [Component Library](/docs/components) - Available UI components

### VS Code Extensions

Recommended extensions for documentation writing:

- **MDX**: Syntax highlighting for MDX files
- **Prettier**: Code formatting
- **ESLint**: Code linting
- **Code Spell Checker**: Spell checking
- **Markdown All in One**: Markdown editing tools

## Getting Help

### Documentation Team

- **Primary contact**: [@farm-team](https://github.com/orgs/farm-framework/teams/documentation)
- **Discord channel**: `#documentation` in the FARM Discord server
- **Office hours**: Weekly documentation review sessions (check Discord for schedule)

### Community Resources

- [GitHub Discussions](https://github.com/farm-framework/farm/discussions) - Ask questions and share ideas
- [Discord Server](https://discord.gg/farm-framework) - Real-time community support
- [Documentation Issues](https://github.com/farm-framework/farm-web/issues?q=is%3Aissue+is%3Aopen+label%3Adocumentation) - Report documentation bugs

## Recognition

Great documentation contributions are recognized in:

- Monthly contributor highlights in the newsletter
- Annual documentation awards
- Special mentions in release notes
- Contributor spotlight on the website

Thank you for helping make FARM Framework documentation world-class! 🎉
