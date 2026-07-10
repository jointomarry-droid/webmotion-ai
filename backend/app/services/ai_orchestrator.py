"""
AI Orchestrator - Multi-model with automatic fallback
Supports: OpenAI, Anthropic, Google Gemini, OpenRouter, Ollama (local)
"""

import os
import asyncio
import json
import time
from typing import Dict, List, Optional, Any, AsyncGenerator
from dataclasses import dataclass
from enum import Enum
from openai import AsyncOpenAI
from anthropic import AsyncAnthropic
import google.generativeai as genai


class AIProvider(str, Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GEMINI = "gemini"
    OPENROUTER = "openrouter"
    OLLAMA = "ollama"
    TEMPLATE = "template"


@dataclass
class ProviderConfig:
    name: AIProvider
    api_key: Optional[str]
    base_url: str
    models: List[str]
    default_model: str
    cost_per_1k_input: float
    cost_per_1k_output: float


@dataclass
class AIResponse:
    content: str
    provider: AIProvider
    model: str
    tokens_used: int
    cost_usd: float
    latency_ms: int


# Provider configurations
PROVIDERS: List[ProviderConfig] = [
    ProviderConfig(
        name=AIProvider.OPENAI,
        api_key=os.getenv("OPENAI_API_KEY"),
        base_url="https://api.openai.com/v1",
        models=["gpt-4o", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"],
        default_model="gpt-4o",
        cost_per_1k_input=0.005,
        cost_per_1k_output=0.015,
    ),
    ProviderConfig(
        name=AIProvider.ANTHROPIC,
        api_key=os.getenv("ANTHROPIC_API_KEY"),
        base_url="https://api.anthropic.com/v1",
        models=["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-opus-20240229"],
        default_model="claude-3-5-sonnet-20241022",
        cost_per_1k_input=0.003,
        cost_per_1k_output=0.015,
    ),
    ProviderConfig(
        name=AIProvider.GEMINI,
        api_key=os.getenv("GEMINI_API_KEY"),
        base_url="https://generativelanguage.googleapis.com/v1beta",
        models=["gemini-2.0-flash-exp", "gemini-1.5-pro", "gemini-1.5-flash"],
        default_model="gemini-2.0-flash-exp",
        cost_per_1k_input=0.0001,
        cost_per_1k_output=0.0004,
    ),
    ProviderConfig(
        name=AIProvider.OPENROUTER,
        api_key=os.getenv("OPENROUTER_API_KEY"),
        base_url="https://openrouter.ai/api/v1",
        models=["openai/gpt-4o", "anthropic/claude-3.5-sonnet", "google/gemini-2.0-flash"],
        default_model="openai/gpt-4o",
        cost_per_1k_input=0.005,
        cost_per_1k_output=0.015,
    ),
    ProviderConfig(
        name=AIProvider.OLLAMA,
        api_key=None,
        base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1"),
        models=["llama3.1:70b", "llama3.1:8b", "codellama:34b", "mistral:7b"],
        default_model="llama3.1:70b",
        cost_per_1k_input=0.0,
        cost_per_1k_output=0.0,
    ),
]


# System prompts for different generation tasks
SYSTEM_PROMPTS = {
    "website_generation": """You are an expert Full-Stack Developer specializing in Next.js 15, React 19, TypeScript, and Tailwind CSS.
Generate production-ready, complete website code from natural language descriptions.

REQUIREMENTS:
1. Always use 'use client' for client components
2. Use TypeScript with proper types
3. Use Tailwind CSS for styling
4. Use Framer Motion for animations
5. Follow React 19 and Next.js 15 best practices
6. Implement proper SEO metadata
7. Make it fully responsive (mobile-first)
8. Include dark mode support
9. Use semantic HTML
10. Optimize for performance and accessibility

OUTPUT FORMAT: Return ONLY the code files as a JSON object with file paths as keys and content as values.
Include: package.json, next.config.ts, tailwind.config.ts, tsconfig.json, and all source files.""",

    "animation_generation": """You are an expert React Animation Developer specializing in Framer Motion, GSAP, CSS Animations, and Three.js/React Three Fiber.

REQUIREMENTS:
1. Generate complete, runnable React components
2. Use TypeScript with proper types
3. Include 'use client' directive
4. Implement accessibility (prefers-reduced-motion)
5. Use Tailwind CSS for styling
6. Make components reusable and customizable
7. Optimize for 60fps performance
8. Include proper cleanup in useEffect

OUTPUT: Return ONLY the component code as a string.""",

    "code_generation": """You are an expert software engineer. Generate clean, production-ready code.

REQUIREMENTS:
1. Use TypeScript
2. Follow best practices for the specified framework
3. Include proper error handling
4. Add meaningful comments only for complex logic
5. Make code modular and reusable
6. Include proper types

OUTPUT: Return ONLY the code.""",
}


class AIOrchestrator:
    """Orchestrates multiple AI providers with automatic fallback."""
    
    def __init__(self):
        self.clients: Dict[AIProvider, Any] = {}
        self._initialize_clients()
    
    def _initialize_clients(self):
        """Initialize API clients for available providers."""
        for provider in PROVIDERS:
            if not provider.api_key and provider.name != AIProvider.OLLAMA:
                continue
            
            try:
                if provider.name == AIProvider.OPENAI:
                    self.clients[provider.name] = AsyncOpenAI(
                        api_key=provider.api_key,
                        base_url=provider.base_url,
                    )
                elif provider.name == AIProvider.ANTHROPIC:
                    self.clients[provider.name] = AsyncAnthropic(
                        api_key=provider.api_key,
                        base_url=provider.base_url,
                    )
                elif provider.name == AIProvider.GEMINI:
                    genai.configure(api_key=provider.api_key)
                    self.clients[provider.name] = genai
                elif provider.name == AIProvider.OPENROUTER:
                    self.clients[provider.name] = AsyncOpenAI(
                        api_key=provider.api_key,
                        base_url=provider.base_url,
                    )
                elif provider.name == AIProvider.OLLAMA:
                    self.clients[provider.name] = AsyncOpenAI(
                        api_key="ollama",
                        base_url=provider.base_url,
                    )
            except Exception as e:
                print(f"Failed to initialize {provider.name}: {e}")
    
    def get_available_providers(self) -> List[ProviderConfig]:
        """Get list of providers with valid API keys."""
        return [p for p in PROVIDERS if p.api_key or p.name == AIProvider.OLLAMA]
    
    async def generate(
        self,
        prompt: str,
        task_type: str = "code_generation",
        model: Optional[str] = None,
        provider: Optional[AIProvider] = None,
        framework: str = "framer-motion",
        max_tokens: int = 8192,
        temperature: float = 0.7,
    ) -> AIResponse:
        """
        Generate content using AI with automatic fallback.
        """
        system_prompt = SYSTEM_PROMPTS.get(task_type, SYSTEM_PROMPTS["code_generation"])
        
        # Add framework-specific instructions
        if task_type == "animation_generation":
            framework_prompts = {
                "framer-motion": "Use Framer Motion. Import from 'framer-motion'. Use motion components, variants, useScroll, useTransform, useSpring, AnimatePresence.",
                "gsap": "Use GSAP. Import gsap and plugins (ScrollTrigger, etc.). Use useRef and useEffect hooks.",
                "css": "Use CSS animations and transitions. Use @keyframes, CSS custom properties, and Intersection Observer for scroll triggers.",
                "threejs": "Use Three.js with React Three Fiber (@react-three/fiber) and @react-three/drei for 3D animations.",
            }
            system_prompt += f"\n\nFRAMEWORK: {framework_prompts.get(framework, framework_prompts['framer-motion'])}"
        
        user_prompt = self._build_user_prompt(prompt, task_type, framework)
        
        # Determine provider order
        providers_to_try = self._get_provider_order(provider, model)
        
        last_error = None
        for provider_config in providers_to_try:
            try:
                start_time = time.time()
                
                if provider_config.name == AIProvider.OPENAI:
                    response = await self._call_openai(
                        provider_config, model or provider_config.default_model,
                        system_prompt, user_prompt, max_tokens, temperature
                    )
                elif provider_config.name == AIProvider.ANTHROPIC:
                    response = await self._call_anthropic(
                        provider_config, model or provider_config.default_model,
                        system_prompt, user_prompt, max_tokens, temperature
                    )
                elif provider_config.name == AIProvider.GEMINI:
                    response = await self._call_gemini(
                        provider_config, model or provider_config.default_model,
                        system_prompt, user_prompt, max_tokens, temperature
                    )
                elif provider_config.name == AIProvider.OPENROUTER:
                    response = await self._call_openrouter(
                        provider_config, model or provider_config.default_model,
                        system_prompt, user_prompt, max_tokens, temperature
                    )
                elif provider_config.name == AIProvider.OLLAMA:
                    response = await self._call_ollama(
                        provider_config, model or provider_config.default_model,
                        system_prompt, user_prompt, max_tokens, temperature
                    )
                else:
                    continue
                
                latency = int((time.time() - start_time) * 1000)
                
                # Calculate cost
                input_tokens = len((system_prompt + user_prompt).split()) * 1.3
                output_tokens = len(response.split()) * 1.3
                cost = (input_tokens / 1000 * provider_config.cost_per_1k_input) + \
                       (output_tokens / 1000 * provider_config.cost_per_1k_output)
                
                return AIResponse(
                    content=self._clean_code(response),
                    provider=provider_config.name,
                    model=model or provider_config.default_model,
                    tokens_used=int(input_tokens + output_tokens),
                    cost_usd=round(cost, 6),
                    latency_ms=latency,
                )
                
            except Exception as e:
                last_error = e
                print(f"Provider {provider_config.name} failed: {e}")
                continue
        
        # All providers failed, use template fallback
        print(f"All AI providers failed, using template fallback. Last error: {last_error}")
        return self._generate_from_template(prompt, task_type, framework)
    
    async def generate_stream(
        self,
        prompt: str,
        task_type: str = "code_generation",
        model: Optional[str] = None,
        provider: Optional[AIProvider] = None,
        framework: str = "framer-motion",
    ) -> AsyncGenerator[str, None]:
        """Generate streaming response."""
        system_prompt = SYSTEM_PROMPTS.get(task_type, SYSTEM_PROMPTS["code_generation"])
        user_prompt = self._build_user_prompt(prompt, task_type, framework)
        
        providers_to_try = self._get_provider_order(provider, model)
        
        for provider_config in providers_to_try:
            try:
                if provider_config.name == AIProvider.OPENAI:
                    async for chunk in self._stream_openai(
                        provider_config, model or provider_config.default_model,
                        system_prompt, user_prompt
                    ):
                        yield chunk
                    return
                elif provider_config.name == AIProvider.ANTHROPIC:
                    async for chunk in self._stream_anthropic(
                        provider_config, model or provider_config.default_model,
                        system_prompt, user_prompt
                    ):
                        yield chunk
                    return
            except Exception as e:
                print(f"Streaming failed for {provider_config.name}: {e}")
                continue
        
        # Fallback
        yield json.dumps({"content": self._generate_from_template(prompt, task_type, framework).content, "done": True})
    
    def _get_provider_order(
        self, 
        preferred_provider: Optional[AIProvider], 
        preferred_model: Optional[str]
    ) -> List[ProviderConfig]:
        """Determine the order of providers to try."""
        available = self.get_available_providers()
        
        if preferred_provider:
            preferred = [p for p in available if p.name == preferred_provider]
            others = [p for p in available if p.name != preferred_provider]
            return preferred + others
        
        # Default priority
        priority = [AIProvider.OPENAI, AIProvider.ANTHROPIC, AIProvider.GEMINI, AIProvider.OPENROUTER, AIProvider.OLLAMA]
        ordered = []
        for p in priority:
            for a in available:
                if a.name == p:
                    ordered.append(a)
        return ordered
    
    def _build_user_prompt(self, prompt: str, task_type: str, framework: str) -> str:
        """Build the user prompt with context."""
        if task_type == "website_generation":
            return f"""Create a complete, production-ready Next.js 15 website with the following requirements:

{prompt}

Technical Requirements:
- Next.js 15 with App Router
- React 19 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Full SEO metadata (Open Graph, Twitter Cards, JSON-LD)
- Responsive design (mobile-first)
- Dark mode support
- Accessibility (WCAG 2.1 AA)
- Performance optimized

Output format: Return a JSON object where keys are file paths and values are file contents.
Include: package.json, next.config.ts, tailwind.config.ts, tsconfig.json, and all source files under src/"""
        
        elif task_type == "animation_generation":
            return f"""Create a React animation component for: {prompt}

Framework: {framework}

Requirements:
- Complete, runnable TypeScript component
- 'use client' directive
- Proper imports
- Tailwind CSS styling
- Accessibility (prefers-reduced-motion)
- Reusable and customizable with props
- Clean, production-ready code

Return ONLY the component code."""
        
        return f"""Generate code for: {prompt}

Requirements:
- TypeScript
- Modern best practices
- Clean, readable code
- Proper error handling"""
    
    def _clean_code(self, code: str) -> str:
        """Clean AI-generated code (remove markdown fences, etc.)."""
        # Remove markdown code fences
        code = code.replace("```tsx", "").replace("```typescript", "").replace("```ts", "").replace("```javascript", "").replace("```js", "").replace("```json", "").replace("```python", "").replace("```", "")
        
        # Remove leading/trailing whitespace
        code = code.strip()
        
        # If response contains explanation before code, extract just the code
        lines = code.split("\n")
        code_start = 0
        for i, line in enumerate(lines):
            if line.startswith("'use client'") or line.startswith('"use client"') or \
               line.startswith("import ") or line.startswith("export ") or \
               line.startswith("{") or line.startswith("["):
                code_start = i
                break
        
        if code_start > 0:
            code = "\n".join(lines[code_start:])
        
        return code
    
    async def _call_openai(
        self, provider: ProviderConfig, model: str,
        system_prompt: str, user_prompt: str,
        max_tokens: int, temperature: float
    ) -> str:
        client = self.clients[AIProvider.OPENAI]
        response = await client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=max_tokens,
            temperature=temperature,
        )
        return response.choices[0].message.content or ""
    
    async def _call_anthropic(
        self, provider: ProviderConfig, model: str,
        system_prompt: str, user_prompt: str,
        max_tokens: int, temperature: float
    ) -> str:
        client = self.clients[AIProvider.ANTHROPIC]
        response = await client.messages.create(
            model=model,
            max_tokens=max_tokens,
            temperature=temperature,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )
        return response.content[0].text if response.content else ""
    
    async def _call_gemini(
        self, provider: ProviderConfig, model: str,
        system_prompt: str, user_prompt: str,
        max_tokens: int, temperature: float
    ) -> str:
        model_obj = genai.GenerativeModel(model)
        response = await model_obj.generate_content_async(
            [system_prompt + "\n\n" + user_prompt],
            generation_config=genai.GenerationConfig(
                temperature=temperature,
                max_output_tokens=max_tokens,
            ),
        )
        return response.text or ""
    
    async def _call_openrouter(
        self, provider: ProviderConfig, model: str,
        system_prompt: str, user_prompt: str,
        max_tokens: int, temperature: float
    ) -> str:
        client = self.clients[AIProvider.OPENROUTER]
        response = await client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=max_tokens,
            temperature=temperature,
        )
        return response.choices[0].message.content or ""
    
    async def _call_ollama(
        self, provider: ProviderConfig, model: str,
        system_prompt: str, user_prompt: str,
        max_tokens: int, temperature: float
    ) -> str:
        client = self.clients[AIProvider.OLLAMA]
        response = await client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=max_tokens,
            temperature=temperature,
        )
        return response.choices[0].message.content or ""
    
    async def _stream_openai(
        self, provider: ProviderConfig, model: str,
        system_prompt: str, user_prompt: str
    ) -> AsyncGenerator[str, None]:
        client = self.clients[AIProvider.OPENAI]
        stream = await client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=4096,
            temperature=0.7,
            stream=True,
        )
        
        async for chunk in stream:
            content = chunk.choices[0].delta.content
            if content:
                yield json.dumps({"content": content, "done": False}) + "\n"
        
        yield json.dumps({"content": "", "done": True}) + "\n"
    
    async def _stream_anthropic(
        self, provider: ProviderConfig, model: str,
        system_prompt: str, user_prompt: str
    ) -> AsyncGenerator[str, None]:
        client = self.clients[AIProvider.ANTHROPIC]
        stream = await client.messages.create(
            model=model,
            max_tokens=4096,
            temperature=0.7,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
            stream=True,
        )
        
        async for chunk in stream:
            if chunk.type == "content_block_delta":
                yield json.dumps({"content": chunk.delta.text, "done": False}) + "\n"
        
        yield json.dumps({"content": "", "done": True}) + "\n"
    
    def _generate_from_template(self, prompt: str, task_type: str, framework: str) -> AIResponse:
        """Template-based fallback generation."""
        lower = prompt.lower()
        
        if task_type == "animation_generation":
            return self._generate_animation_template(prompt, framework)
        elif task_type == "website_generation":
            return self._generate_website_template(prompt)
        
        return AIResponse(
            content=f"// Generated code for: {prompt}\n// Template fallback - configure AI providers for better results",
            provider=AIProvider.TEMPLATE,
            model="webmotion-template-v1",
            tokens_used=0,
            cost_usd=0.0,
            latency_ms=0,
        )
    
    def _generate_animation_template(self, prompt: str, framework: str) -> AIResponse:
        if framework == "framer-motion":
            code = f"""'use client'

import {{ motion, useReducedMotion }} from 'framer-motion'

interface AnimatedComponentProps {{
  children: React.ReactNode
  className?: string
}}

export function AnimatedComponent({{ children, className }}: AnimatedComponentProps) {{
  const shouldReduceMotion = useReducedMotion()

  const variants = {{
    hidden: {{ 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20 
    }},
    visible: {{ 
      opacity: 1, 
      y: 0 
    }},
  }}

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{variants}}
      transition={{duration: 0.5, ease: 'easeOut'}}
      className={{className}}
    >
      {{children}}
    </motion.div>
  )
}}"""
        elif framework == "gsap":
            code = f"""import {{ useEffect, useRef }} from 'react'
import gsap from 'gsap'
import {{ ScrollTrigger }} from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollAnimationProps {{
  children: React.ReactNode
  className?: string
}}

export function ScrollAnimation({{ children, className }}: ScrollAnimationProps) {{
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {{
    const element = ref.current
    if (!element) return

    const animation = gsap.fromTo(
      element,
      {{ opacity: 0, y: 50 }},
      {{
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {{
          trigger: element,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        }},
      }}
    )

    return () => {{
      animation.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }}
  }}, [])

  return (
    <div ref={{ref}} className={{className}}>
      {{children}}
    </div>
  )
}}"""
        elif framework == "css":
            code = f"""/* CSS Animation */
.animated-element {{
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}}

@keyframes fadeInUp {{
  from {{
    opacity: 0;
    transform: translateY(20px);
  }}
  to {{
    opacity: 1;
    transform: translateY(0);
  }}
}}

@media (prefers-reduced-motion: reduce) {{
  .animated-element {{
    animation: none;
    opacity: 1;
  }}
}}

.hover-animation {{
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}}

.hover-animation:hover {{
  transform: translateY(-4px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}}"""
        else:
            code = f"""'use client'

import {{ Canvas }} from '@react-three/fiber'
import {{ OrbitControls, Sphere }} from '@react-three/drei'
import {{ useRef }} from 'react'
import {{ useFrame }} from '@react-three/fiber'
import * as THREE from 'three'

function AnimatedSphere() {{
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {{
    if (meshRef.current) {{
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.5
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
    }}
  }})

  return (
    <Sphere ref={{meshRef}} args={{[1, 64, 64]}}>
      <meshStandardMaterial
        color="#6366f1"
        wireframe
        transparent
        opacity={{0.8}}
      />
    </Sphere>
  )
}}

interface Scene3DProps {{
  className?: string
}}

export function Scene3D({{ className }}: Scene3DProps) {{
  return (
    <div className={{className}}>
      <Canvas camera={{{{ position: [0, 0, 5] }}}}>
        <ambientLight intensity={{0.5}} />
        <directionalLight position={{[5, 5, 5]}} intensity={{1}} />
        <AnimatedSphere />
        <OrbitControls enableZoom={{false}} />
      </Canvas>
    </div>
  )
}}"""
        
        return AIResponse(
            content=code,
            provider=AIProvider.TEMPLATE,
            model="webmotion-template-v1",
            tokens_used=0,
            cost_usd=0.0,
            latency_ms=0,
        )
    
    def _generate_website_template(self, prompt: str) -> AIResponse:
        code = f"""// Generated Website: {prompt}
// Template fallback - configure AI providers for full generation

/*
Project Structure:
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   └── pricing/page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── Pricing.tsx
│   │   │   └── Testimonials.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Input.tsx
│   ├── lib/
│   │   └── utils.ts
│   └── styles/
│       └── globals.css
├── public/
├── tailwind.config.ts
├── next.config.ts
└── package.json
*/

// Sample Hero Component
'use client'

import {{ motion }} from 'framer-motion'

export function Hero() {{
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/5">
      <div className="container mx-auto px-4 text-center">
        <motion.h1
          initial={{{{ opacity: 0, y: 20 }}}}
          animate={{{{ opacity: 1, y: 0 }}}}
          transition={{{{ duration: 0.6 }}}}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          {prompt}
        </motion.h1>
        <motion.p
          initial={{{{ opacity: 0, y: 20 }}}}
          animate={{{{ opacity: 1, y: 0 }}}}
          transition={{{{ duration: 0.6, delay: 0.2 }}}}
          className="text-xl text-muted-foreground mb-8"
        >
          Build something amazing with our platform
        </motion.p>
        <motion.button
          initial={{{{ opacity: 0, y: 20 }}}}
          animate={{{{ opacity: 1, y: 0 }}}}
          transition={{{{ duration: 0.6, delay: 0.4 }}}}
          whileHover={{{{ scale: 1.05 }}}}
          whileTap={{{{ scale: 0.95 }}}}
          className="px-8 py-4 bg-primary text-primary-foreground rounded-xl text-lg font-semibold"
        >
          Get Started
        </motion.button>
      </div>
    </section>
  )
}}"""
        
        return AIResponse(
            content=code,
            provider=AIProvider.TEMPLATE,
            model="webmotion-template-v1",
            tokens_used=0,
            cost_usd=0.0,
            latency_ms=0,
        )


# Global instance
ai_orchestrator = AIOrchestrator()