# FARM Framework Brand Colors

This document outlines the new branding color palette implemented across the FARM Framework documentation and website.

## Color Palette

| Color Name | Hex Code | Usage | Tailwind Class |
|------------|----------|-------|----------------|
| **MongoDB Green** | `#00ED64` | Primary accent, CTAs, links, code highlights | `mongodb-green` |
| **Warm Dev Yellow** | `#fbcd14` | Secondary accent, warnings, highlights | `warm-dev-yellow` |
| **Deep Graphite** | `#0b0b09` | Dark backgrounds, code blocks | `deep-graphite` |
| **Soft Charcoal** | `#1b1916` | Card surfaces, secondary backgrounds | `soft-charcoal` |
| **Medium Steel** | `#565656` | Text, borders, subtle accents | `medium-steel` |
| **Neon Raspberry** | `#FF007F` | Errors, warnings, high-visibility elements | `neon-raspberry` |

## CSS Custom Properties

The colors are also available as CSS custom properties:

```css
:root {
  --color-mongodb-green: #00ED64;
  --color-warm-dev-yellow: #fbcd14;
  --color-deep-graphite: #0b0b09;
  --color-soft-charcoal: #1b1916;
  --color-medium-steel: #565656;
  --color-neon-raspberry: #FF007F;
}
```

## Theme Integration

The brand colors are integrated into the design system:

- **Primary**: MongoDB Green (`--primary`)
- **Secondary/Accent**: Warm Dev Yellow (`--secondary`, `--accent`)
- **Background**: Deep Graphite (dark mode)
- **Card**: Soft Charcoal (dark mode)
- **Destructive/Error**: Neon Raspberry (`--destructive`)

## Usage Examples

### Tailwind Classes

```html
<!-- Primary button -->
<button class="bg-mongodb-green text-deep-graphite">
  Get Started
</button>

<!-- Secondary button -->
<button class="bg-warm-dev-yellow text-deep-graphite">
  Learn More
</button>

<!-- Error state -->
<div class="border-neon-raspberry text-neon-raspberry">
  Error message
</div>

<!-- Code block -->
<pre class="bg-deep-graphite border-soft-charcoal">
  <code class="text-mongodb-green">npm install @farm/cli</code>
</pre>
```

### CSS Variables

```css
/* Using theme colors */
.custom-element {
  background: var(--color-primary); /* MongoDB Green */
  color: var(--color-primary-foreground);
}

/* Using brand colors directly */
.brand-accent {
  border-color: var(--color-mongodb-green);
}
```

## Updated Components

The following components have been updated to use the new brand colors:

1. **Table of Contents** - MongoDB Green for active states and hover
2. **Documentation Layout** - MongoDB Green for links and code highlights
3. **Theme System** - All CSS variables updated for consistent branding

## Brand Strategy

This color palette:

- **Establishes Identity**: MongoDB Green ties directly to the FARM stack
- **Enhances Readability**: Dark backgrounds with high-contrast accents
- **Supports Accessibility**: Sufficient contrast ratios for text and UI elements
- **Enables Flexibility**: Multiple accent colors for different UI states

## Next Steps

Consider updating these components to use the new brand colors:

- [ ] Hero section and landing page
- [ ] Navigation and sidebar
- [ ] Code blocks and syntax highlighting
- [ ] Form elements and inputs
- [ ] Charts and data visualization
- [ ] Loading states and animations