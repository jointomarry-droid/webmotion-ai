/**
 * AI Orchestrator - Multi-model with automatic fallback
 * 
 * Priority: OpenAI → Anthropic → Gemini → Template fallback
 * Each provider is tried in order. If one fails, the next is attempted.
 */

export type AIProvider = 'openai' | 'anthropic' | 'gemini' | 'openrouter' | 'template'
export type AnimationFramework = 'framer-motion' | 'gsap' | 'css' | 'threejs'

interface AIRequest {
  prompt: string
  framework: AnimationFramework
  provider?: AIProvider
  model?: string
}

interface AIResponse {
  content: string
  provider: AIProvider
  model: string
  tokens: number
  latency: number
}

interface ProviderConfig {
  name: AIProvider
  apiKey: string | undefined
  baseUrl: string
  models: string[]
  defaultModel: string
}

// Provider configurations
const providers: ProviderConfig[] = [
  {
    name: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
    defaultModel: 'gpt-4o',
  },
  {
    name: 'anthropic',
    apiKey: process.env.ANTHROPIC_API_KEY,
    baseUrl: 'https://api.anthropic.com/v1',
    models: ['claude-sonnet-4-20250514', 'claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
    defaultModel: 'claude-sonnet-4-20250514',
  },
  {
    name: 'gemini',
    apiKey: process.env.GEMINI_API_KEY,
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    defaultModel: 'gemini-2.0-flash',
  },
  {
    name: 'openrouter',
    apiKey: process.env.OPENROUTER_API_KEY,
    baseUrl: 'https://openrouter.ai/api/v1',
    models: ['openai/gpt-4o', 'anthropic/claude-sonnet-4', 'google/gemini-2.0-flash-001'],
    defaultModel: 'openai/gpt-4o',
  },
]

// System prompt for animation code generation
const SYSTEM_PROMPT = `You are an expert React animation developer. You generate production-ready animation code.

Rules:
1. Always use TypeScript (.tsx)
2. Always add 'use client' at the top for React components
3. Use the specified framework (Framer Motion, GSAP, or CSS)
4. Generate complete, runnable components
5. Include proper imports
6. Use modern React patterns (hooks, functional components)
7. Add meaningful comments only when complex logic exists
8. Make components reusable and customizable
9. Use Tailwind CSS for styling
10. Follow accessibility best practices

Output ONLY the code. No explanations, no markdown fences, no extra text.`

/**
 * Generate animation code using AI with automatic fallback
 */
export async function generateWithAI(request: AIRequest): Promise<AIResponse> {
  const startTime = Date.now()
  
  // If specific provider requested, try only that one
  if (request.provider && request.provider !== 'template') {
    const provider = providers.find(p => p.name === request.provider)
    if (provider && provider.apiKey) {
      try {
        const result = await callProvider(provider, request)
        return { ...result, latency: Date.now() - startTime }
      } catch (error) {
        console.error(`${request.provider} failed:`, error)
        // Fall through to template
      }
    }
  }

  // Auto-fallback through all providers
  for (const provider of providers) {
    if (!provider.apiKey) continue
    
    try {
      const result = await callProvider(provider, request)
      return { ...result, latency: Date.now() - startTime }
    } catch (error) {
      console.error(`${provider.name} failed:`, error)
      continue
    }
  }

  // Final fallback: template-based generation
  const templateResult = generateFromTemplate(request)
  return { ...templateResult, latency: Date.now() - startTime }
}

/**
 * Call a specific AI provider
 */
async function callProvider(provider: ProviderConfig, request: AIRequest): Promise<Omit<AIResponse, 'latency'>> {
  const model = request.model || provider.defaultModel
  const userPrompt = buildUserPrompt(request.prompt, request.framework)

  switch (provider.name) {
    case 'openai':
      return callOpenAI(provider, model, userPrompt)
    case 'anthropic':
      return callAnthropic(provider, model, userPrompt)
    case 'gemini':
      return callGemini(provider, model, userPrompt)
    case 'openrouter':
      return callOpenRouter(provider, model, userPrompt)
    default:
      throw new Error(`Unknown provider: ${provider.name}`)
  }
}

/**
 * OpenAI API call
 */
async function callOpenAI(
  provider: ProviderConfig,
  model: string,
  userPrompt: string
): Promise<Omit<AIResponse, 'latency'>> {
  const response = await fetch(`${provider.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${provider.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content || ''
  const tokens = data.usage?.total_tokens || 0

  return {
    content: cleanCode(content),
    provider: 'openai',
    model,
    tokens,
  }
}

/**
 * Anthropic API call
 */
async function callAnthropic(
  provider: ProviderConfig,
  model: string,
  userPrompt: string
): Promise<Omit<AIResponse, 'latency'>> {
  const response = await fetch(`${provider.baseUrl}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': provider.apiKey!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: userPrompt },
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Anthropic API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  const content = data.content[0]?.text || ''
  const tokens = (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)

  return {
    content: cleanCode(content),
    provider: 'anthropic',
    model,
    tokens,
  }
}

/**
 * Gemini API call
 */
async function callGemini(
  provider: ProviderConfig,
  model: string,
  userPrompt: string
): Promise<Omit<AIResponse, 'latency'>> {
  const response = await fetch(
    `${provider.baseUrl}/models/${model}:generateContent?key=${provider.apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: SYSTEM_PROMPT + '\n\n' + userPrompt },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  const tokens = data.usageMetadata?.totalTokenCount || 0

  return {
    content: cleanCode(content),
    provider: 'gemini',
    model,
    tokens,
  }
}

/**
 * OpenRouter API call (unified gateway to multiple models)
 */
async function callOpenRouter(
  provider: ProviderConfig,
  model: string,
  userPrompt: string
): Promise<Omit<AIResponse, 'latency'>> {
  const response = await fetch(`${provider.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${provider.apiKey}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'WebMotion.ai',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content || ''
  const tokens = data.usage?.total_tokens || 0

  return {
    content: cleanCode(content),
    provider: 'openrouter',
    model,
    tokens,
  }
}

/**
 * Build the user prompt with framework-specific instructions
 */
function buildUserPrompt(prompt: string, framework: AnimationFramework): string {
  const frameworkInstructions: Record<AnimationFramework, string> = {
    'framer-motion': `Use Framer Motion for animations. Import from 'framer-motion'. Use motion components, variants, useScroll, useTransform, useSpring, AnimatePresence.`,
    'gsap': `Use GSAP for animations. Import gsap and plugins (ScrollTrigger, etc.). Use useRef and useEffect hooks.`,
    'css': `Use CSS animations and transitions. Use @keyframes, CSS custom properties, and Intersection Observer for scroll triggers.`,
    'threejs': `Use Three.js with React Three Fiber (@react-three/fiber) and @react-three/drei for 3D animations.`,
  }

  return `${frameworkInstructions[framework]}

Create a React component for: ${prompt}

Requirements:
- Complete, runnable TypeScript component
- Use Tailwind CSS for styling
- Make it responsive
- Include proper TypeScript types
- Export as default`
}

/**
 * Clean AI-generated code (remove markdown fences, extra text)
 */
function cleanCode(code: string): string {
  // Remove markdown code fences
  let cleaned = code.replace(/^```(?:tsx?|jsx?|javascript)?\n/gm, '')
  cleaned = cleaned.replace(/\n```$/gm, '')
  
  // Remove any leading/trailing whitespace
  cleaned = cleaned.trim()
  
  // If the response contains explanation before/after code, extract just the code
  const lines = cleaned.split('\n')
  const codeStart = lines.findIndex(line => 
    line.startsWith("'use client'") ||
    line.startsWith('"use client"') ||
    line.startsWith('import ') ||
    line.startsWith('export ')
  )
  
  if (codeStart > 0) {
    cleaned = lines.slice(codeStart).join('\n')
  }
  
  return cleaned
}

/**
 * Template-based fallback generation
 */
function generateFromTemplate(request: AIRequest): Omit<AIResponse, 'latency'> {
  const { prompt, framework } = request
  const lower = prompt.toLowerCase()

  // Detect features
  const hasHero = lower.includes('hero') || lower.includes('banner')
  const hasPricing = lower.includes('pricing') || lower.includes('price')
  const hasScroll = lower.includes('scroll') || lower.includes('parallax')
  const hasStagger = lower.includes('stagger') || lower.includes('grid') || lower.includes('gallery')
  const hasTestimonial = lower.includes('testimonial') || lower.includes('review')
  const hasFeature = lower.includes('feature') || lower.includes('benefit')
  const hasNav = lower.includes('nav') || lower.includes('menu')
  const hasCTA = lower.includes('cta') || lower.includes('button')
  const hasModal = lower.includes('modal') || lower.includes('dialog')
  const hasLoader = lower.includes('loader') || lower.includes('loading')

  // Generate based on framework and detected features
  let code: string

  if (framework === 'framer-motion') {
    code = generateFramerMotionTemplate(prompt, {
      hasHero, hasPricing, hasScroll, hasStagger, hasTestimonial,
      hasFeature, hasNav, hasCTA, hasModal, hasLoader,
    })
  } else if (framework === 'gsap') {
    code = generateGSAPTemplate(prompt, {
      hasHero, hasPricing, hasScroll, hasStagger, hasTestimonial,
      hasFeature, hasNav, hasCTA, hasModal, hasLoader,
    })
  } else {
    code = generateCSSTemplate(prompt, {
      hasHero, hasPricing, hasScroll, hasStagger, hasTestimonial,
      hasFeature, hasNav, hasCTA, hasModal, hasLoader,
    })
  }

  return {
    content: code,
    provider: 'template',
    model: 'webmotion-template-v1',
    tokens: 0,
  }
}

interface TemplateFeatures {
  hasHero: boolean
  hasPricing: boolean
  hasScroll: boolean
  hasStagger: boolean
  hasTestimonial: boolean
  hasFeature: boolean
  hasNav: boolean
  hasCTA: boolean
  hasModal: boolean
  hasLoader: boolean
}

function generateFramerMotionTemplate(prompt: string, f: TemplateFeatures): string {
  if (f.hasHero) {
    return `'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl font-bold text-white mb-6"
        >
          ${prompt.slice(0, 50) || 'Your Heading'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-white/70 mb-10 max-w-2xl mx-auto"
        >
          Replace this with your content
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold"
        >
          Get Started
        </motion.button>
      </motion.div>
    </section>
  )
}`
  }

  if (f.hasPricing) {
    return `'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const plans = [
  { name: 'Starter', price: 0, features: ['5 projects', 'Basic support'] },
  { name: 'Pro', price: 29, features: ['Unlimited projects', 'Priority support', 'Custom branding'], popular: true },
  { name: 'Enterprise', price: 99, features: ['Everything in Pro', 'Team features', 'Dedicated support'] },
]

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function PricingSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl font-bold text-center mb-16">
          Simple Pricing
        </motion.h2>
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <motion.div key={plan.name} variants={item} whileHover={{ y: -8 }} className={\`p-8 rounded-2xl border-2 \${plan.popular ? 'border-purple-500 shadow-xl' : 'border-gray-200 dark:border-gray-700'}\`}>
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6"><span className="text-4xl font-bold">\${plan.price}</span><span className="text-gray-500">/mo</span></div>
              <ul className="space-y-3 mb-8">{plan.features.map((f) => <li key={f} className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" />{f}</li>)}</ul>
              <button className={\`w-full py-3 rounded-xl font-semibold \${plan.popular ? 'bg-purple-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}\`}>Choose Plan</button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}`
  }

  // Default template
  return `'use client'

import { motion } from 'framer-motion'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function AnimatedComponent() {
  return (
    <motion.section variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={item} className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">${prompt.slice(0, 60) || 'Your Heading'}</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">Replace this content with your own text.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <motion.div key={i} variants={item} whileHover={{ y: -8 }} className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Feature {i}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Describe your feature here.</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}`
}

function generateGSAPTemplate(prompt: string, f: TemplateFeatures): string {
  return `import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function AnimatedComponent() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    gsap.from(el.querySelectorAll('.animate-item'), {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
    })
  }, [])

  return (
    <section ref={ref} className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 animate-item">
          ${prompt.slice(0, 60) || 'Your Heading'}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-item p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Feature {i}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Describe your feature here.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}`
}

function generateCSSTemplate(prompt: string, f: TemplateFeatures): string {
  return `'use client'

import { useEffect, useRef } from 'react'

export default function AnimatedComponent() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible')
      })
    }, { threshold: 0.1 })

    el.querySelectorAll('.fade-in').forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-24 px-4">
      <style>{\`
        .fade-in { opacity: 0; transform: translateY(30px); transition: all 0.6s ease; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }
        .fade-in:nth-child(2) { transition-delay: 0.1s; }
        .fade-in:nth-child(3) { transition-delay: 0.2s; }
      \`}</style>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 fade-in">
          ${prompt.slice(0, 60) || 'Your Heading'}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="fade-in p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Feature {i}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Describe your feature here.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}`
}

/**
 * Get available providers (those with API keys configured)
 */
export function getAvailableProviders(): AIProvider[] {
  const available: AIProvider[] = ['template'] // Always available
  
  for (const provider of providers) {
    if (provider.apiKey) {
      available.push(provider.name)
    }
  }
  
  return available
}

/**
 * Check if AI generation is available (at least one real provider)
 */
export function isAIAvailable(): boolean {
  return providers.some(p => !!p.apiKey)
}
