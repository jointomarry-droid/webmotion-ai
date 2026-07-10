from typing import Dict, Any, Optional
from app.services.ai_orchestrator import ai_orchestrator, AIProvider

class AnimationAgent:
    """
    AI Agent for generating animation code from natural language prompts.
    Supports Framer Motion, GSAP, CSS, and Three.js animations.
    """

    FRAMEWORK_PROMPTS = {
        "framer-motion": """You are an expert Framer Motion developer. Generate production-ready React code using Framer Motion.

Requirements:
- Use 'use client' directive
- Import from 'framer-motion'
- Implement useReducedMotion() for accessibility
- Create variants object for animations
- Add whileHover/whileTap for interactive elements
- Include AnimatePresence for exit animations
- Use proper TypeScript types
- Follow React best practices

Output only the code, no explanations.""",

        "gsap": """You are an expert GSAP developer. Generate production-ready code using GSAP and ScrollTrigger.

Requirements:
- Import gsap and ScrollTrigger
- Register ScrollTrigger plugin
- Create timeline or scroll-triggered animations
- Add responsive breakpoints
- Handle cleanup on unmount (React)
- Use refs for DOM elements
- Optimize for performance

Output only the code, no explanations.""",

        "css": """You are an expert CSS animator. Generate production-ready CSS animations.

Requirements:
- Use @keyframes for complex animations
- Implement will-change for performance
- Add prefers-reduced-motion media query
- Use transform/opacity only for 60fps
- Include animation-fill-mode
- Support responsive design

Output only the code, no explanations.""",

        "threejs": """You are an expert Three.js developer. Generate production-ready 3D animations using React Three Fiber.

Requirements:
- Use @react-three/fiber and @react-three/drei
- Create reusable 3D components
- Implement proper lighting
- Add camera controls
- Optimize for performance
- Handle responsive canvas

Output only the code, no explanations.""",
    }

    async def generate(
        self,
        prompt: str,
        framework: str = "framer-motion",
        model: Optional[str] = None,
        provider: Optional[AIProvider] = None,
        context: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Generate animation code from a natural language prompt.
        """
        user_prompt = f"""Create an animation based on this description:

{prompt}

{"Additional context: " + context if context else ""}

Generate complete, production-ready code that can be copied and used directly."""

        result = await ai_orchestrator.generate(
            prompt=user_prompt,
            task_type="animation_generation",
            model=model,
            provider=provider,
            framework=framework,
        )
        
        return {
            "content": result.content,
            "model": result.model,
            "tokens_used": result.tokens_used,
            "cost_usd": result.cost_usd,
            "provider": result.provider.value,
        }