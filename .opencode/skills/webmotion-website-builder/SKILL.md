---
name: webmotion-website-builder
description: Use when generating complete websites from natural language descriptions. Trigger on keywords like generate website, create landing page, build site, website generator, AI builder, page generator, full website.
---

# WebMotion Website Builder Skill

This skill enables AI-powered website generation from natural language descriptions, producing production-ready React/Next.js code.

## Website Generation Pipeline

```
User Description
    ↓
Parse Requirements
    ↓
Generate Architecture
    ↓
Create Components
    ↓
Implement Styling
    ↓
Add Animations
    ↓
Generate SEO
    ↓
Output: Complete Project
```

## Website Types

### 1. Landing Page
```markdown
Prompt: Create a [style] landing page for [business type]

Sections:
- Hero with CTA
- Features/Benefits
- Social Proof (testimonials/logos)
- Pricing (if applicable)
- FAQ
- Footer with links

Style: [minimal/modern/luxury/playful/corporate]
Colors: [primary, secondary, accent]
Fonts: [heading, body]
```

### 2. SaaS Website
```markdown
Prompt: Create a SaaS website for [product name]

Pages:
- Homepage (hero, features, pricing, testimonials)
- Features (detailed breakdown)
- Pricing (3 tiers)
- About Us
- Contact
- Blog (structure)

Features:
- Dark/light mode toggle
- Responsive navigation
- Animated sections
- Interactive pricing calculator
```

### 3. Portfolio Website
```markdown
Prompt: Create a portfolio website for [profession]

Pages:
- Home (hero with featured work)
- Projects (filterable gallery)
- About (bio, skills, experience)
- Contact (form, social links)

Style:
- [Creative/Professional/Minimalist]
- Project hover effects
- Smooth page transitions
- Loading animations
```

### 4. E-commerce Website
```markdown
Prompt: Create an e-commerce website for [product type]

Pages:
- Homepage (featured products, categories)
- Product listing (filters, sorting)
- Product detail (images, reviews, related)
- Cart (summary, checkout)
- User account (orders, wishlist)

Features:
- Product image zoom
- Add to cart animation
- Quick view modal
- Search with autocomplete
```

## Component Generation Templates

### Hero Section
```markdown
Generate a hero section with:
- Headline: [text]
- Subheadline: [text]
- CTA Button: [text]
- Background: [image/video/gradient]
- Animation: [entrance type]

Output: React component with Framer Motion
```

### Feature Card
```markdown
Generate a feature card with:
- Icon: [type]
- Title: [text]
- Description: [text]
- Hover effect: [scale/glow/rotate]

Output: Reusable component with variants
```

### Pricing Table
```markdown
Generate a pricing table with:
- Tiers: [Free, Pro, Enterprise]
- Features: [list per tier]
- CTA: [text per tier]
- Highlight: [recommended tier]

Output: Responsive grid with animations
```

## Tech Stack Configuration

```typescript
// Default stack for generated websites
const config = {
  framework: 'Next.js 15',
  ui: 'React 19 + Tailwind CSS',
  components: 'Shadcn UI',
  animation: 'Framer Motion',
  icons: 'Lucide React',
  fonts: 'Inter + Geist',
  deployment: 'Vercel'
}
```

## Code Generation Rules

### 1. Component Structure
```typescript
// Always generate typed components
interface ComponentProps {
  title: string
  description?: string
  variant?: 'default' | 'secondary'
}

export function Component({ title, description, variant = 'default' }: ComponentProps) {
  return (
    <div className={cn('base-styles', variantStyles[variant])}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}
```

### 2. Styling Pattern
```typescript
// Use Tailwind with cn utility
import { cn } from '@/lib/utils'

const styles = {
  base: 'px-6 py-3 rounded-lg font-medium',
  variants: {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    outline: 'border border-input bg-background'
  }
}
```

### 3. Animation Pattern
```typescript
// Consistent animation implementation
'use client'

import { motion } from 'framer-motion'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function AnimatedSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeIn}
      transition={{ duration: 0.6 }}
    >
      {/* Content */}
    </motion.section>
  )
}
```

## SEO Generation

### Metadata Template
```typescript
export const metadata: Metadata = {
  title: `${pageName} | ${siteName}`,
  description: 'SEO-optimized description',
  openGraph: {
    title: 'OG Title',
    description: 'OG Description',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
}
```

### Schema.org Template
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Site Name",
  "url": "https://example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://example.com/search?q={search_term_string}"
  }
}
```

## Quality Checklist

- [ ] **Responsive**: Mobile-first design
- [ ] **Accessible**: WCAG 2.1 AA compliant
- [ ] **Performant**: Lighthouse score > 90
- [ ] **SEO Optimized**: Meta tags, schema, sitemap
- [ ] **Animated**: Smooth, purposeful motion
- [ ] **Typed**: Full TypeScript coverage
- [ ] **Documented**: Component storybook

## Output Format

When generating a website, provide:
1. Project structure
2. All components with full code
3. Styling with Tailwind classes
4. Animations with Framer Motion
5. SEO metadata
6. Deployment instructions
