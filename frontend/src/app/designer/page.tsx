'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Sparkles,
  Palette,
  Type,
  Layout,
  Box,
  Layers,
  Copy,
  Check,
  Download,
  Wand2,
  Lightbulb,
  Zap,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { copyToClipboard } from '@/lib/utils'
import toast from 'react-hot-toast'

interface DesignSystem {
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    muted: string
  }
  typography: {
    fontFamily: string
    headingFont: string
    sizes: Record<string, string>
    weights: Record<string, number>
  }
  spacing: Record<string, string>
  borderRadius: Record<string, string>
  shadows: Record<string, string>
  components: {
    name: string
    code: string
  }[]
}

const STYLE_PRESETS = [
  {
    id: 'apple',
    name: 'Apple',
    description: 'Clean, minimal, refined',
    prompt: 'Apple style - clean, minimal, lots of whitespace, San Francisco font, subtle shadows',
    colors: ['#007AFF', '#5856D6', '#FF2D55', '#FFFFFF', '#F2F2F7', '#1D1D1F', '#8E8E93'],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Gradient-rich, modern, professional',
    prompt: 'Stripe style - gradient backgrounds, modern typography, professional, clean layout',
    colors: ['#635BFF', '#0A2540', '#00D4AA', '#FFFFFF', '#F6F9FC', '#425466', '#8898AA'],
  },
  {
    id: 'vercel',
    name: 'Vercel',
    description: 'Dark mode, sharp, technical',
    prompt: 'Vercel style - dark theme, sharp edges, monospace accents, technical feel',
    colors: ['#000000', '#7928CA', '#FF0080', '#FFFFFF', '#111111', '#EDEDED', '#666666'],
  },
  {
    id: 'linear',
    name: 'Linear',
    description: 'Purple gradients, smooth, elegant',
    prompt: 'Linear style - purple gradients, smooth animations, elegant typography',
    colors: ['#5E6AD2', '#1B1B1F', '#F2C94C', '#FFFFFF', '#18181B', '#F4F4F5', '#71717A'],
  },
  {
    id: 'tailwind',
    name: 'Tailwind',
    description: 'Utility-first, flexible, modern',
    prompt: 'Tailwind CSS style - utility classes, flexible design system, modern',
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#FFFFFF', '#F9FAFB', '#111827', '#6B7280'],
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Clean, organized, productivity-focused',
    prompt: 'Notion style - clean, organized, black and white with accents',
    colors: ['#000000', '#2EAADC', '#EB5757', '#FFFFFF', '#F7F6F3', '#37352F', '#9B9A97'],
  },
]

export default function DesignerPage() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [designSystem, setDesignSystem] = useState<DesignSystem | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleGenerate = async (presetPrompt?: string) => {
    const finalPrompt = presetPrompt || prompt
    if (!finalPrompt) {
      toast.error('Please enter a design style')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/v1/designer/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ prompt: finalPrompt }),
      })

      const data = await response.json()
      setDesignSystem(data.design_system)
    } catch (error) {
      // Mock response for demo
      setDesignSystem({
        name: 'Custom Design System',
        description: 'Generated from: ' + finalPrompt,
        colors: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          accent: '#ec4899',
          background: '#ffffff',
          surface: '#f8fafc',
          text: '#0f172a',
          muted: '#64748b',
        },
        typography: {
          fontFamily: 'Inter, system-ui, sans-serif',
          headingFont: 'Inter, system-ui, sans-serif',
          sizes: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
          },
          weights: {
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
          },
        },
        spacing: {
          xs: '0.25rem',
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem',
          '2xl': '3rem',
        },
        borderRadius: {
          sm: '0.375rem',
          md: '0.5rem',
          lg: '0.75rem',
          xl: '1rem',
          full: '9999px',
        },
        shadows: {
          sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        },
        components: [
          {
            name: 'Button',
            code: `<button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
  Click me
</button>`,
          },
          {
            name: 'Card',
            code: `<div className="p-6 bg-surface rounded-xl shadow-md border border-border">
  <h3 className="text-lg font-semibold">Card Title</h3>
  <p className="text-muted">Card description goes here</p>
</div>`,
          },
        ],
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = (text: string, field: string) => {
    copyToClipboard(text)
    setCopiedField(field)
    toast.success('Copied!')
    setTimeout(() => setCopiedField(null), 2000)
  }

  const generateCSS = () => {
    if (!designSystem) return ''
    return `:root {
  /* Colors */
  --color-primary: ${designSystem.colors.primary};
  --color-secondary: ${designSystem.colors.secondary};
  --color-accent: ${designSystem.colors.accent};
  --color-background: ${designSystem.colors.background};
  --color-surface: ${designSystem.colors.surface};
  --color-text: ${designSystem.colors.text};
  --color-muted: ${designSystem.colors.muted};
  
  /* Typography */
  --font-family: ${designSystem.typography.fontFamily};
  --font-heading: ${designSystem.typography.headingFont};
  
  /* Spacing */
  --spacing-xs: ${designSystem.spacing.xs};
  --spacing-sm: ${designSystem.spacing.sm};
  --spacing-md: ${designSystem.spacing.md};
  --spacing-lg: ${designSystem.spacing.lg};
  --spacing-xl: ${designSystem.spacing.xl};
  
  /* Border Radius */
  --radius-sm: ${designSystem.borderRadius.sm};
  --radius-md: ${designSystem.borderRadius.md};
  --radius-lg: ${designSystem.borderRadius.lg};
  --radius-xl: ${designSystem.borderRadius.xl};
}`
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">AI Designer</h1>
              <p className="text-muted-foreground">
                Describe your style, get a complete design system
              </p>
            </div>
          </div>
        </motion.div>

        {/* Style Presets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold mb-4">Quick Presets</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {STYLE_PRESETS.map((preset) => (
              <Card
                key={preset.id}
                className="cursor-pointer hover:border-primary/50 transition-all"
                onClick={() => handleGenerate(preset.prompt)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-1 mb-3">
                    {preset.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="font-medium text-sm">{preset.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {preset.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Custom Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder="Describe your style: e.g., 'Luxury black and gold with serif fonts' or 'Modern minimal with blue accents'"
                    leftIcon={<Wand2 className="h-4 w-4" />}
                  />
                </div>
                <Button
                  onClick={() => handleGenerate()}
                  isLoading={isGenerating}
                  disabled={!prompt}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs text-muted-foreground">Try:</span>
                {['Dark mode cyberpunk', 'Minimal Japanese', 'Gradient modern', 'Classic luxury'].map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setPrompt(suggestion)
                        handleGenerate(suggestion)
                      }}
                      className="text-xs text-primary hover:underline"
                    >
                      {suggestion}
                    </button>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Generated Design System */}
        {designSystem && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Generated Design System</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => handleCopy(generateCSS(), 'css')}>
                  {copiedField === 'css' ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  Copy CSS
                </Button>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Colors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Colors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(designSystem.colors).map(([name, color]) => (
                      <div
                        key={name}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:border-primary/50"
                        onClick={() => handleCopy(color, `color-${name}`)}
                      >
                        <div
                          className="w-10 h-10 rounded-lg"
                          style={{ backgroundColor: color }}
                        />
                        <div>
                          <p className="text-sm font-medium capitalize">{name}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {color}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Typography */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="h-5 w-5" />
                    Typography
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Body Font</p>
                    <p className="font-medium">{designSystem.typography.fontFamily}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Heading Font</p>
                    <p className="font-medium">{designSystem.typography.headingFont}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Sizes</p>
                    <div className="space-y-1">
                      {Object.entries(designSystem.typography.sizes).map(([size, value]) => (
                        <div key={size} className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{size}</span>
                          <span className="text-xs font-mono">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Spacing & Radius */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Box className="h-5 w-5" />
                    Spacing & Radius
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Spacing</p>
                    <div className="space-y-2">
                      {Object.entries(designSystem.spacing).map(([name, value]) => (
                        <div key={name} className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-8">{name}</span>
                          <div
                            className="h-2 bg-primary rounded"
                            style={{ width: value }}
                          />
                          <span className="text-xs font-mono text-muted-foreground">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Border Radius</p>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(designSystem.borderRadius).map(([name, value]) => (
                        <div key={name} className="text-center">
                          <div
                            className="w-12 h-12 bg-primary/20 border-2 border-primary mb-1"
                            style={{ borderRadius: value }}
                          />
                          <span className="text-xs text-muted-foreground">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Components */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Components
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {designSystem.components.map((component) => (
                    <div
                      key={component.name}
                      className="p-4 rounded-lg border border-border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{component.name}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(component.code, component.name)}
                        >
                          {copiedField === component.name ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <pre className="text-xs text-muted-foreground font-mono overflow-auto">
                        {component.code}
                      </pre>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
