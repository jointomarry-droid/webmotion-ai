---
name: animation-prompt-engineering
description: Use when generating, optimizing, or editing animation prompts for Framer Motion, GSAP, CSS, Three.js, or any web animation framework. Trigger on keywords like animation, motion, scroll, parallax, transition, keyframe, easing, timeline, GSAP, Framer Motion.
---

# Animation Prompt Engineering Skill

This skill provides specialized knowledge for creating high-quality animation prompts that generate production-ready React animation code.

## Animation Categories

### 1. Entrance Animations
```markdown
Prompt: Create a [fade-in/slide-up/scale/rotate] entrance animation for [element]

Specifications:
- Initial state: [opacity: 0, y: 20, scale: 0.9]
- Final state: [opacity: 1, y: 0, scale: 1]
- Duration: [0.3-0.7s]
- Easing: [ease-out/cubic-bezier]
- Delay: [0-0.2s for stagger]
- Trigger: [on mount/while in view]

Code Output: Framer Motion variants
```

### 2. Scroll-Triggered Animations
```markdown
Prompt: Create a scroll-triggered animation for [element] that [description]

Specifications:
- Scroll position: [start: "top 80%", end: "bottom 20%"]
- Animation: [fade, slide, scale, reveal]
- Scrub: [true/false, smooth: 0.5-1s]
- Pin: [yes/no, duration]
- Stagger: [for multiple elements]
- Responsive: [mobile considerations]

Code Output: GSAP ScrollTrigger or Framer Motion useScroll
```

### 3. Hover & Interaction Animations
```markdown
Prompt: Create a hover animation for [element] that [description]

Specifications:
- Scale: [1.0-1.1]
- Rotation: [0-5deg]
- Shadow: [increase/shift]
- Color: [transition to]
- Duration: [0.2-0.3s]
- Easing: [ease-in-out]
- WhileTap: [secondary state]

Code Output: Framer Motion whileHover/whileTap
```

### 4. Page Transitions
```markdown
Prompt: Create a page transition between [route A] and [route B]

Specifications:
- Exit: [fade out, slide left]
- Enter: [fade in, slide right]
- Duration: [0.3-0.5s]
- Easing: [cubic-bezier]
- Layout: [shared element transitions]
- AnimatePresence: [mode: "wait"|"sync"]

Code Output: Framer Motion AnimatePresence
```

### 5. 3D Animations
```markdown
Prompt: Create a 3D animation for [element] using Three.js

Specifications:
- Geometry: [box, sphere, custom]
- Material: [standard, physical, wireframe]
- Lighting: [ambient, directional, point]
- Camera: [perspective, orthographic]
- Animation: [rotation, orbit, morph]
- Post-processing: [bloom, blur, vignette]

Code Output: React Three Fiber component
```

## Prompt Structure Template

```markdown
## Animation Request

**Element**: [What to animate]
**Animation Type**: [Entrance/Exit/Scroll/Hover/3D]
**Duration**: [Time in seconds]
**Easing**: [Timing function]

**Initial State**:
- opacity: [0-1]
- scale: [0-2]
- rotate: [0-360deg]
- x/y/z: [position]

**Final State**:
- opacity: [0-1]
- scale: [0-2]
- rotate: [0-360deg]
- x/y/z: [position]

**Triggers**:
- [ ] On mount
- [ ] While in view
- [ ] On hover
- [ ] On scroll
- [ ] On click

**Accessibility**:
- [ ] Respect prefers-reduced-motion
- [ ] ARIA labels
- [ ] Keyboard accessible

**Performance**:
- [ ] Use transform/opacity only
- [ ] Avoid layout thrashing
- [ ] Optimize for 60fps
```

## Framework-Specific Prompts

### Framer Motion
```markdown
Generate Framer Motion code for [animation]:

Requirements:
- Use 'use client' directive
- Import from 'framer-motion'
- Implement useReducedMotion()
- Create variants object
- Add whileHover/whileTap if interactive
- Include AnimatePresence for exits
```

### GSAP
```markdown
Generate GSAP code for [animation]:

Requirements:
- Import gsap and ScrollTrigger
- Register ScrollTrigger plugin
- Create timeline or scroll-triggered animation
- Add responsive breakpoints
- Handle cleanup on unmount
- Use refs for DOM elements
```

### CSS
```markdown
Generate CSS animation for [element]:

Requirements:
- Use @keyframes
- Implement will-change for performance
- Add prefers-reduced-motion media query
- Use transform/opacity only
- Include animation-fill-mode
```

## Quality Checklist

Before finalizing an animation prompt:

- [ ] **Specificity**: Clear, unambiguous description
- [ ] **Measurable**: Exact values for timing, transforms
- [ ] **Accessible**: Reduced motion support
- [ ] **Performant**: 60fps target
- [ ] **Cross-browser**: Tested compatibility
- [ ] **Responsive**: Mobile considerations
- [ ] **Reusable**: Component-based design

## Example Prompts

### Apple-Style Scroll Animation
```markdown
Create an Apple-style scroll-triggered animation for a hero section:

1. Text fades in and slides up as user scrolls
2. Background image scales from 1.1 to 1.0
3. Parallax effect on secondary elements
4. Smooth scrubbing with 1:1 scroll ratio
5. Staggered reveal for multiple text lines
6. Respect reduced motion preferences

Output: GSAP ScrollTrigger with React hooks
```

### E-commerce Product Card
```markdown
Create an interactive product card animation:

1. Subtle scale on hover (1.02)
2. Shadow elevation change
3. Image zoom on hover (1.05)
4. Quick add button slides up
5. Color transition on selection
6. Loading state for add to cart

Output: Framer Motion with Tailwind CSS
```

### Landing Page Hero
```markdown
Create an animated landing page hero:

1. Background gradient animation (subtle)
2. Headline typewriter effect
3. CTA button pulse animation
4. Floating elements with parallax
5. Scroll indicator bounce
6. All animations respect reduced motion

Output: Combined Framer Motion + CSS
```
