'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wand2,
  Sparkles,
  Layout,
  Loader2,
  ChevronDown,
  ChevronRight,
  Zap,
  Globe,
  Palette,
  ShoppingCart,
  Briefcase,
  GraduationCap,
} from 'lucide-react'

export interface GeneratedSection {
  id: string
  type: string
  name: string
  props: Record<string, any>
  styles: Record<string, string>
  visible: boolean
  locked: boolean
  children?: GeneratedSection[]
}

interface AILayoutGeneratorProps {
  onGenerate: (sections: GeneratedSection[]) => void
  onAppend: (sections: GeneratedSection[]) => void
  currentSectionCount: number
}

const LAYOUT_PRESETS = [
  {
    id: 'saas-landing',
    name: 'SaaS Landing',
    icon: Zap,
    description: 'Hero + Features + Pricing + CTA',
    prompt: 'Build a modern SaaS landing page with hero section, features grid, pricing table with 3 tiers, customer testimonials, and a call-to-action footer. Use a dark purple/blue color scheme.',
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    icon: Briefcase,
    description: 'Hero + About + Projects + Contact',
    prompt: 'Create a developer portfolio with a dramatic hero, about me section, project showcase grid with hover effects, skills section, and contact form. Minimal dark theme.',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    icon: ShoppingCart,
    description: 'Hero + Products + Reviews + Cart',
    prompt: 'Build an e-commerce homepage with hero banner, featured products grid, customer reviews carousel, newsletter signup, and footer with links. Clean modern design.',
  },
  {
    id: 'education',
    name: 'Education',
    icon: GraduationCap,
    description: 'Hero + Courses + Testimonials + FAQ',
    prompt: 'Create an online learning platform landing page with hero, course catalog grid, instructor profiles, student testimonials, FAQ accordion, and enrollment CTA. Blue/teal theme.',
  },
  {
    id: 'agency',
    name: 'Agency',
    icon: Globe,
    description: 'Hero + Services + Team + Contact',
    prompt: 'Build a creative agency website with animated hero, services showcase, team member cards, case studies, and contact section. Bold typography, dark theme with accent colors.',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    icon: Palette,
    description: 'Clean single-page layout',
    prompt: 'Create a clean, minimal single-page website with large typography, whitespace, subtle animations, and a monochrome color scheme. Focus on readability and elegance.',
  },
]

const QUICK_PROMPTS = [
  'Add a hero section with gradient background',
  'Create a features grid with 6 items',
  'Build a pricing table with 3 tiers',
  'Add customer testimonials carousel',
  'Create a contact form with validation',
  'Build a footer with newsletter signup',
  'Add a FAQ accordion section',
  'Create a team showcase grid',
]

export function AILayoutGenerator({
  onGenerate,
  onAppend,
  currentSectionCount,
}: AILayoutGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPresets, setShowPresets] = useState(false)
  const [showQuickPrompts, setShowQuickPrompts] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async (mode: 'replace' | 'append' = 'replace') => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/v1/editor/generate-layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          mode,
          existingSections: mode === 'append' ? currentSectionCount : 0,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate layout')
      }

      const data = await response.json()

      if (data.sections && data.sections.length > 0) {
        if (mode === 'replace') {
          onGenerate(data.sections)
        } else {
          onAppend(data.sections)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePresetClick = (preset: typeof LAYOUT_PRESETS[0]) => {
    setPrompt(preset.prompt)
    setShowPresets(false)
  }

  const handleQuickPromptClick = (quickPrompt: string) => {
    setPrompt(quickPrompt)
    setShowQuickPrompts(false)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Wand2 className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">AI Layout Generator</h3>
          <p className="text-xs text-muted-foreground">Describe your layout in natural language</p>
        </div>
      </div>

      {/* Prompt Input */}
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the layout you want to create..."
          className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50"
          disabled={isGenerating}
        />
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
          {prompt.length}/500
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generate Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => handleGenerate('replace')}
          disabled={!prompt.trim() || isGenerating}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {isGenerating ? 'Generating...' : 'Generate Layout'}
        </button>
        {currentSectionCount > 0 && (
          <button
            onClick={() => handleGenerate('append')}
            disabled={!prompt.trim() || isGenerating}
            className="px-4 py-2.5 rounded-lg border border-input bg-background text-sm font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            + Add
          </button>
        )}
      </div>

      {/* Presets Toggle */}
      <div>
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors w-full"
        >
          {showPresets ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          <Layout className="h-3 w-3" />
          Layout Presets
        </button>

        <AnimatePresence>
          {showPresets && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 space-y-2 overflow-hidden"
            >
              {LAYOUT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset)}
                  className="w-full flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <preset.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{preset.name}</div>
                    <div className="text-xs text-muted-foreground">{preset.description}</div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Prompts Toggle */}
      <div>
        <button
          onClick={() => setShowQuickPrompts(!showQuickPrompts)}
          className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors w-full"
        >
          {showQuickPrompts ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          <Zap className="h-3 w-3" />
          Quick Prompts
        </button>

        <AnimatePresence>
          {showQuickPrompts && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 overflow-hidden"
            >
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((qp) => (
                  <button
                    key={qp}
                    onClick={() => handleQuickPromptClick(qp)}
                    className="px-2.5 py-1.5 rounded-full border border-border text-xs hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    {qp}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
