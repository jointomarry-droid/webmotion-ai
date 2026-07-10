# WebMotion.ai

> **AI-Powered Animation Prompt Engineering Platform**
> 
> Build, animate, and deploy stunning websites with AI. Create production-ready animations using natural language prompts.

![WebMotion.ai](https://webmotion.ai/og-image.png)

## 🚀 Features

- **AI Animation Engine** - Generate Framer Motion, GSAP, CSS, and Three.js animations from natural language
- **Smart Code Generation** - Production-ready React/Next.js code with TypeScript and Tailwind CSS
- **Template Marketplace** - Browse and share premium animation prompts
- **One-Click Deploy** - Deploy to Vercel with a single click
- **Visual Builder** - Drag-and-drop editor for creating animations (coming soon)
- **Multi-Model AI** - Support for GPT-4, Claude, Gemini, and more

## 📦 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Shadcn UI** - Components

### Backend
- **Python 3.11** - Runtime
- **FastAPI** - API framework
- **SQLAlchemy** - ORM
- **PostgreSQL** - Database
- **Redis** - Caching
- **Supabase** - Auth & Real-time

### AI Providers
- **OpenAI** - GPT-4, GPT-4 Turbo
- **Anthropic** - Claude 3 Opus, Sonnet
- **Google** - Gemini Pro

## 🏗️ Project Structure

```
webmotion.ai/
├── frontend/                    # Next.js 15 frontend
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   ├── components/         # React components
│   │   ├── lib/                # Utilities & stores
│   │   ├── hooks/              # Custom hooks
│   │   ├── types/              # TypeScript types
│   │   └── styles/             # Global styles
│   └── public/                 # Static assets
│
├── backend/                     # Python FastAPI backend
│   ├── app/
│   │   ├── api/                # API routes
│   │   ├── core/               # Configuration
│   │   ├── models/             # Database models
│   │   ├── schemas/            # Pydantic schemas
│   │   ├── services/           # Business logic
│   │   └── agents/             # AI agents
│   └── tests/                  # Test files
│
├── database/                    # SQL migrations
│   └── migrations/
│
├── docker-compose.yml          # Docker configuration
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 20+** - JavaScript runtime
- **Python 3.11+** - Python runtime
- **PostgreSQL 16+** - Database
- **Redis 7+** - Cache
- **Docker** (optional) - Containerization

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/webmotion.ai.git
   cd webmotion.ai
   ```

2. **Set up environment variables**
   ```bash
   # Frontend
   cp frontend/.env.local.example frontend/.env.local
   
   # Backend
   cp backend/.env.example backend/.env
   ```

3. **Start with Docker (recommended)**
   ```bash
   docker-compose up -d
   ```

4. **Or start manually**

   **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   **Backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## 📚 API Documentation

### Authentication
```bash
# Sign up
POST /api/v1/auth/signup
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

# Login
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Templates
```bash
# List templates
GET /api/v1/templates?category=hero&page=1&limit=12

# Get template
GET /api/v1/templates/:id

# Create template
POST /api/v1/templates
{
  "title": "Animated Hero",
  "category": "hero",
  "prompt_content": "Create a hero section with fade-in animations"
}
```

### AI Generation
```bash
# Generate animation
POST /api/v1/ai/generate-animation
{
  "prompt": "Create a scroll-triggered animation for a hero section",
  "framework": "framer-motion",
  "model": "gpt-4"
}

# Generate website
POST /api/v1/ai/generate-website
{
  "description": "Modern SaaS landing page",
  "style": "modern",
  "pages": ["home", "pricing", "contact"]
}
```

## 🎨 Usage Examples

### Generate an Animation

```typescript
// From your React component
const response = await fetch('/api/v1/ai/generate-animation', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'Create a hero section that fades in and slides up on page load',
    framework: 'framer-motion',
  }),
})

const { content } = await response.json()
// content contains the generated React component code
```

### Use the Generated Code

```tsx
'use client'

import { motion, useReducedMotion } from 'framer-motion'

export function AnimatedHero() {
  const shouldReduceMotion = useReducedMotion()

  const variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="min-h-screen flex items-center justify-center"
    >
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">Welcome to WebMotion.ai</h1>
        <p className="text-xl text-gray-600">Build stunning animated websites</p>
      </div>
    </motion.section>
  )
}
```

## 🤖 AI Models & Pricing

| Model | Provider | Cost per 1K tokens | Best For |
|-------|----------|-------------------|----------|
| GPT-4 | OpenAI | $0.03 | Complex animations |
| GPT-4 Turbo | OpenAI | $0.01 | Fast generation |
| Claude 3 Opus | Anthropic | $0.015 | High-quality code |
| Claude 3 Sonnet | Anthropic | $0.003 | Balanced speed/quality |
| Gemini Pro | Google | $0.001 | Cost-effective |

## 💳 Pricing Plans

| Plan | Price | AI Credits | Features |
|------|-------|------------|----------|
| **Free** | $0/mo | 100 | Basic animations, community templates |
| **Starter** | $19/mo | 1,000 | Premium components, priority support |
| **Pro** | $49/mo | 5,000 | Unlimited, AI agents, deployment |
| **Team** | $99/mo | 15,000 | Collaboration, SSO, dedicated support |

## 🛠️ Development

### Running Tests

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
pytest
```

### Linting

```bash
# Frontend
npm run lint
npm run typecheck

# Backend
ruff check .
mypy .
```

### Database Migrations

```bash
# Run migrations
cd backend
alembic upgrade head

# Create new migration
alembic revision --autogenerate -m "description"
```

## 🚢 Deployment

### Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker (Full Stack)

```bash
# Build and run
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables

See [deployment guide](docs/deployment.md) for complete environment setup.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [FastAPI](https://fastapi.tiangolo.com/) - Python API framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Supabase](https://supabase.com/) - Backend-as-a-service
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

- **Documentation**: [docs.webmotion.ai](https://docs.webmotion.ai)
- **Email**: support@webmotion.ai
- **Discord**: [Join our community](https://discord.gg/webmotion)
- **Twitter**: [@webmotionai](https://twitter.com/webmotionai)

---

Built with ❤️ by the WebMotion.ai team
