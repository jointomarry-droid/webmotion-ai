from typing import Dict, Any, List, Optional
from app.services.ai_orchestrator import ai_orchestrator, AIProvider

class WebsiteAgent:
    """
    AI Agent for generating complete websites from natural language descriptions.
    Generates React/Next.js code with Tailwind CSS and Framer Motion animations.
    """

    STYLE_PROMPTS = {
        "modern": "Clean, minimalist design with bold typography, subtle animations, and a professional color palette. Use glassmorphism effects and gradient accents.",
        "minimal": "Ultra-clean design with lots of white space, simple typography, and minimal color usage. Focus on content hierarchy.",
        "luxury": "Elegant design with dark backgrounds, gold accents, sophisticated typography, and premium feel. Use subtle animations and high-end imagery.",
        "playful": "Fun, colorful design with rounded shapes, playful animations, and engaging interactions. Use bright colors and dynamic elements.",
        "corporate": "Professional, trustworthy design with clean lines, blue/gray color scheme, and business-focused layout. Emphasize credibility.",
    }

    PAGE_TEMPLATES = {
        "home": """Homepage with:
- Hero section with animated headline and CTA
- Features/benefits section
- Social proof (logos, testimonials)
- Pricing preview
- Newsletter signup
- Footer""",
        
        "about": """About page with:
- Company story/mission
- Team section
- Values/principles
- Timeline/history
- Office/culture images""",
        
        "contact": """Contact page with:
- Contact form
- Office location/map
- Email/phone info
- Social media links
- FAQ section""",
        
        "pricing": """Pricing page with:
- 3-tier pricing cards
- Feature comparison
- FAQ section
- CTA section""",
        
        "blog": """Blog page with:
- Featured post
- Post grid/list
- Categories/tags
- Search functionality""",
    }

    async def generate(
        self,
        description: str,
        style: str = "modern",
        pages: List[str] = ["home"],
        model: Optional[str] = None,
        provider: Optional[AIProvider] = None,
    ) -> Dict[str, Any]:
        """
        Generate a complete website from a natural language description.
        """
        style_guide = self.STYLE_PROMPTS.get(style, self.STYLE_PROMPTS["modern"])
        
        pages_description = "\n".join([
            self.PAGE_TEMPLATES.get(page, f"- {page.title()} page")
            for page in pages
        ])

        user_prompt = f"""Create a complete website with the following requirements:

Description: {description}

Style Guide: {style_guide}

Pages to generate:
{pages_description}

Generate:
1. Complete Next.js 15 project structure with App Router
2. All page components with full code
3. Shared layout and navigation
4. Responsive design with Tailwind CSS
5. Framer Motion animations
6. TypeScript types
7. SEO metadata
8. package.json, tsconfig.json, tailwind.config.ts, next.config.ts
9. README.md with setup instructions"""

        result = await ai_orchestrator.generate(
            prompt=user_prompt,
            task_type="website_generation",
            model=model,
            provider=provider,
        )
        
        return {
            "content": result.content,
            "model": result.model,
            "tokens_used": result.tokens_used,
            "cost_usd": result.cost_usd,
            "provider": result.provider.value,
        }