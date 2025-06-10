# FARM Framework Brand Colors - Tri-Tech Palette 🎨

## **Python · React · AI Brand Identity**

We've evolved the FARM Framework brand to use a **tri-tech palette** that immediately communicates our technology stack: **Python**, **React**, and **AI**. Each color family represents a core technology while maintaining excellent readability and accessibility.

| Role                 | Hex       | Color Name      | Technology | Usage & Rationale                                    |
| -------------------- | --------- | --------------- | ---------- | ---------------------------------------------------- |
| **Python Primary**   | `#306998` | Pythonic Blue   | Python     | Official Python blue - backend/API focus            |
| **Python Secondary** | `#FFD43B` | Python Gold     | Python     | Official Python yellow - highlighting & accents     |
| **React Focus**      | `#61DAFB` | React Cyan      | React      | Official React cyan - frontend/UI components        |
| **AI Innovation**    | `#A855F7` | AI Purple       | AI         | Futuristic purple - machine learning & automation   |
| **Dark Foundation**  | `#111827` | Midnight Navy   | Base       | Professional dark background - focus & depth        |
| **Surface Layer**    | `#1F2937` | Steel Gray      | Cards      | Card/surface backgrounds - clean layering           |
| **Text Balance**     | `#9CA3AF` | Graystone       | Text       | Secondary text - excellent readability              |
| **Code Highlights**  | `#F472B6` | Electric Pink   | Syntax     | Bright contrast - code snippets & highlights        |

## **Brand Mapping**

### **Primary Colors**
- **Primary Accent:** Pythonic Blue (`#306998`) - Main brand identity
- **Secondary Accent:** Python Gold (`#FFD43B`) - Call-to-action elements

### **Technology Colors**
- **Python:** Blue (`#306998`) + Gold (`#FFD43B`)
- **React:** Cyan (`#61DAFB`)
- **AI:** Purple (`#A855F7`)

## **Implementation**

### **CSS Variables**

```css
:root {
  /* Tri-Tech Brand Colors */
  --color-python-primary: #306998;   /* Pythonic Blue */
  --color-python-secondary: #FFD43B; /* Python Gold */
  --color-react: #61DAFB;            /* React Cyan */
  --color-ai: #A855F7;               /* AI Purple */
  --color-bg: #111827;               /* Midnight Navy */
  --color-surface: #1F2937;          /* Steel Gray */
  --color-text-neutral: #9CA3AF;     /* Graystone */
  --color-highlight: #F472B6;        /* Electric Pink */

  /* Primary brand mapping */
  --color-primary-accent: #306998;   /* Pythonic Blue */
  --color-secondary-accent: #FFD43B; /* Python Gold */
}
```

### **Tailwind Classes**

```css
/* Tech-specific colors */
.text-python-primary     /* Pythonic Blue text */
.bg-python-primary       /* Pythonic Blue backgrounds */
.text-python-secondary   /* Python Gold text */
.bg-python-secondary     /* Python Gold backgrounds */
.text-react-cyan         /* React Cyan text */
.bg-react-cyan           /* React Cyan backgrounds */
.text-ai-purple          /* AI Purple text */
.bg-ai-purple            /* AI Purple backgrounds */

/* Foundation colors */
.bg-midnight-navy        /* Dark backgrounds */
.bg-steel-gray           /* Card/surface backgrounds */
.text-graystone          /* Secondary text */
.text-electric-pink      /* Code highlights */

/* Brand shortcuts */
.text-primary-accent     /* Pythonic Blue */
.text-secondary-accent   /* Python Gold */
```

## **Usage Guidelines**

### **Typography**
- **Primary text:** White (`#FFFFFF`)
- **Secondary/muted text:** Graystone (`#9CA3AF`)
- **Links:** Pythonic Blue (`#306998`)
- **Code snippets:** Electric Pink (`#F472B6`)

### **Interactive Elements**
- **Primary buttons:** Pythonic Blue (`#306998`)
- **Secondary buttons:** Python Gold (`#FFD43B`)
- **Accent elements:** React Cyan (`#61DAFB`) or AI Purple (`#A855F7`)

### **Backgrounds**
- **Page background:** Midnight Navy (`#111827`)
- **Card/section backgrounds:** Steel Gray (`#1F2937`)
- **Code block backgrounds:** Steel Gray (`#1F2937`)

### **Technology-Specific Usage**

#### **Python Content**
- **Primary:** Pythonic Blue (`#306998`)
- **Accents:** Python Gold (`#FFD43B`)
- Use for backend documentation, API references, data processing

#### **React Content**
- **Primary:** React Cyan (`#61DAFB`)
- **Accents:** Pythonic Blue (`#306998`)
- Use for frontend documentation, UI components, user interfaces

#### **AI Content**
- **Primary:** AI Purple (`#A855F7`)
- **Accents:** Electric Pink (`#F472B6`)
- Use for machine learning, automation, intelligent features

### **Syntax Highlighting**

```css
/* Tri-Tech Syntax Theme */
.hljs-keyword     { color: #306998; } /* Pythonic Blue - keywords */
.hljs-string      { color: #FFD43B; } /* Python Gold - strings */
.hljs-title       { color: #61DAFB; } /* React Cyan - titles */
.hljs-function    { color: #A855F7; } /* AI Purple - functions */
.hljs-comment     { color: #9CA3AF; } /* Graystone - comments */
.hljs-number      { color: #F472B6; } /* Electric Pink - numbers */
```

## **Brand Benefits**

1. **Immediate Technology Recognition** - Colors instantly communicate Python + React + AI
2. **Professional Authority** - Official technology colors build trust
3. **Clear Information Architecture** - Color-coded content types
4. **Excellent Accessibility** - High contrast ratios for all text
5. **Cohesive Visual Language** - Consistent across all documentation

## **Migration & Backward Compatibility**

Legacy color names are mapped to the new tri-tech palette:

```css
/* Legacy → Tri-Tech Mapping */
mongodb-green     → python-primary     (Pythonic Blue)
warm-dev-yellow   → python-secondary   (Python Gold)
deep-graphite     → midnight-navy      (Dark foundation)
soft-charcoal     → steel-gray         (Surface layer)
medium-steel      → graystone          (Text balance)
neon-raspberry    → electric-pink      (Code highlights)
coral-pink        → electric-pink      (Alias)
```

## **Color Psychology & Rationale**

- **Pythonic Blue:** Trustworthy, stable, backend-focused
- **Python Gold:** Optimistic, energetic, attention-grabbing
- **React Cyan:** Modern, fresh, frontend-oriented
- **AI Purple:** Innovative, futuristic, intelligent
- **Midnight Navy:** Professional, focused, premium
- **Electric Pink:** Dynamic, highlighted, code-focused

This palette positions FARM as a **modern, professional, full-stack framework** that seamlessly bridges **Python's power**, **React's elegance**, and **AI's innovation**.