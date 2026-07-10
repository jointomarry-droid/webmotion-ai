# WebMotion.ai Agents & Skills

## Overview

WebMotion.ai uses specialized AI agents and skills to build an AI-powered animation prompt engineering platform. This document describes each agent and skill, their responsibilities, and how to use them.

---

## Agents

### 1. webmotion-architect

**Purpose**: System architecture design and planning

**Responsibilities**:
- Design microservices architecture
- Create database schemas (PostgreSQL/Supabase)
- Define API specifications (REST/GraphQL)
- Plan deployment strategies
- Design integration patterns

**When to Use**:
- Planning new features or services
- Designing database structures
- Architecting API endpoints
- Planning scalability strategies

**Example Tasks**:
- "Design the database schema for the template marketplace"
- "Plan the microservices architecture for AI generation"
- "Create the API specification for user authentication"

---

### 2. webmotion-frontend

**Purpose**: Frontend development with Next.js and React

**Responsibilities**:
- Build React components with TypeScript
- Implement animations (Framer Motion, GSAP, Three.js)
- Create responsive layouts with Tailwind CSS
- Optimize performance (Core Web Vitals)
- Ensure accessibility (WCAG 2.1 AA)

**When to Use**:
- Building UI components
- Implementing animations
- Creating page layouts
- Optimizing frontend performance

**Example Tasks**:
- "Build a hero section with scroll-triggered animations"
- "Create a responsive pricing table component"
- "Implement page transitions with Framer Motion"

---

### 3. webmotion-backend

**Purpose**: Backend development with Python FastAPI

**Responsibilities**:
- Build RESTful APIs with FastAPI
- Implement AI service orchestration
- Manage database operations (SQLAlchemy)
- Handle background tasks (Celery)
- Integrate third-party services

**When to Use**:
- Building API endpoints
- Implementing AI services
- Creating database models
- Setting up authentication

**Example Tasks**:
- "Create the template CRUD API endpoints"
- "Implement the AI animation generation service"
- "Build the user authentication system"

---

### 4. webmotion-ai

**Purpose**: AI/ML and animation generation

**Responsibilities**:
- Generate animation code from prompts
- Optimize prompt engineering
- Orchestrate multiple AI models
- Implement code generation
- Track AI usage and costs

**When to Use**:
- Generating animation prompts
- Creating AI-powered features
- Optimizing AI model selection
- Building prompt templates

**Example Tasks**:
- "Create a Framer Motion animation prompt template"
- "Implement multi-model fallback for AI generation"
- "Build the animation code generator"

---

### 5. webmotion-deploy

**Purpose**: Deployment and DevOps

**Responsibilities**:
- Set up CI/CD pipelines (GitHub Actions)
- Configure Docker containers
- Deploy to Vercel (frontend) and cloud (backend)
- Monitor application performance
- Manage secrets and security

**When to Use**:
- Setting up deployment pipelines
- Configuring infrastructure
- Monitoring applications
- Managing production environments

**Example Tasks**:
- "Create GitHub Actions workflow for CI/CD"
- "Set up Docker configuration for backend"
- "Configure Vercel deployment for frontend"

---

## Skills

### 1. animation-prompt-engineering

**Purpose**: Create high-quality animation prompts

**Trigger Keywords**: animation, motion, scroll, parallax, transition, keyframe, easing, timeline, GSAP, Framer Motion

**Capabilities**:
- Generate Framer Motion prompts
- Create GSAP ScrollTrigger prompts
- Build CSS animation prompts
- Design 3D animation prompts (Three.js)

**Example Usage**:
```
Create a scroll-triggered animation for a hero section that fades in and slides up
```

---

### 2. webmotion-website-builder

**Purpose**: Generate complete websites from descriptions

**Trigger Keywords**: generate website, create landing page, build site, website generator, AI builder

**Capabilities**:
- Generate landing pages
- Build SaaS websites
- Create portfolio sites
- Design e-commerce stores

**Example Usage**:
```
Generate a modern SaaS landing page with hero, features, pricing, and testimonials
```

---

### 3. webmotion-visual-editor

**Purpose**: Build drag-and-drop visual editor

**Trigger Keywords**: visual editor, drag drop, builder, canvas, property panel, component palette

**Capabilities**:
- Component palette with draggable items
- Canvas with live preview
- Property panel for customization
- Code export from visual design

**Example Usage**:
```
Build a visual editor with drag-and-drop component placement
```

---

## Usage Examples

### Example 1: Build a Landing Page

```
User: "Create a landing page for WebMotion.ai with animated hero section"

Agent: webmotion-frontend
Skill: webmotion-website-builder + animation-prompt-engineering

Output:
- Hero section with Framer Motion animations
- Features section with scroll reveals
- Pricing table with hover effects
- CTA with micro-interactions
- Complete responsive layout
```

### Example 2: Design Database Schema

```
User: "Design the database schema for the template marketplace"

Agent: webmotion-architect

Output:
- Users table (auth, profiles)
- Templates table (content, pricing)
- Purchases table (transactions)
- Reviews table (ratings, comments)
- Migration scripts
```

### Example 3: Implement AI Generation

```
User: "Build the AI animation generation service"

Agent: webmotion-backend + webmotion-ai

Output:
- FastAPI endpoints for AI generation
- Multi-model orchestration (GPT, Claude, Gemini)
- Prompt optimization system
- Code generation pipeline
- Usage tracking and cost management
```

---

## Integration Patterns

### Agent Collaboration

```
User Request
    ↓
webmotion-architect (planning)
    ↓
webmotion-frontend + webmotion-backend (parallel development)
    ↓
webmotion-ai (AI features integration)
    ↓
webmotion-deploy (deployment)
```

### Skill Application

```
User Prompt
    ↓
Skill Matching (based on keywords)
    ↓
Prompt Enhancement (using skill templates)
    ↓
Code Generation (framework-specific)
    ↓
Quality Validation (checklist)
```

---

## Best Practices

1. **Agent Selection**: Choose the most specific agent for the task
2. **Skill Application**: Use skills to enhance prompt quality
3. **Collaboration**: Combine agents for complex features
4. **Validation**: Always verify generated code
5. **Documentation**: Update agents/skills as project evolves

---

## Quick Reference

| Task | Agent | Skill |
|------|-------|-------|
| Design architecture | webmotion-architect | - |
| Build UI components | webmotion-frontend | animation-prompt-engineering |
| Create API endpoints | webmotion-backend | - |
| Generate animations | webmotion-ai | animation-prompt-engineering |
| Build full website | webmotion-frontend | webmotion-website-builder |
| Visual editor | webmotion-frontend | webmotion-visual-editor |
| Deploy application | webmotion-deploy | - |
