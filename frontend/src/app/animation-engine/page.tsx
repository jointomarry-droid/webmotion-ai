'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Sparkles,
  Play,
  Pause,
  Copy,
  Check,
  Download,
  Wand2,
  Layers,
  MousePointer,
  Scroll,
  RotateCw,
  Maximize,
  Zap,
  Eye,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { copyToClipboard } from '@/lib/utils'
import toast from 'react-hot-toast'

interface AnimationResult {
  name: string
  description: string
  framework: string
  code: string
  dependencies: string[]
  preview: {
    type: string
    config: Record<string, any>
  }
}

const ANIMATION_TYPES = [
  { id: 'scroll', name: 'Scroll', icon: Scroll, description: 'Scroll-triggered animations' },
  { id: 'hover', name: 'Hover', icon: MousePointer, description: 'Mouse hover effects' },
  { id: 'entrance', name: 'Entrance', icon: Zap, description: 'Page load animations' },
  { id: 'parallax', name: 'Parallax', icon: Layers, description: 'Depth and parallax effects' },
  { id: '3d', name: '3D', icon: RotateCw, description: 'Three-dimensional transforms' },
  { id: 'loading', name: 'Loading', icon: Maximize, description: 'Loading and transition animations' },
]

const EXAMPLE_PROMPTS = [
  'Apple-style smooth scroll reveal with scale and opacity',
  'GSAP magnetic button effect on hover',
  'Parallax background with multiple layers',
  'Text characters appearing one by one with blur effect',
  'Card stack with 3D tilt on mouse move',
  'Page transition with slide and fade',
  'Sticky section that pins while scrolling',
  'Morphing shape animation on scroll',
]

export default function AnimationEnginePage() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<AnimationResult | null>(null)
  const [selectedFramework, setSelectedFramework] = useState('framer-motion')
  const [copiedCode, setCopiedCode] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)

  const handleGenerate = async () => {
    if (!prompt) {
      toast.error('Please describe your animation')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/v1/animations/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          prompt,
          framework: selectedFramework,
        }),
      })

      const data = await response.json()
      setResult(data.animation)
    } catch (error) {
      // Mock response
      setResult({
        name: 'Scroll Reveal Animation',
        description: 'Elements smoothly reveal as they enter the viewport',
        framework: selectedFramework,
        code: generateMockCode(selectedFramework),
        dependencies: selectedFramework === 'gsap' ? ['gsap', 'scrolltrigger'] : ['framer-motion'],
        preview: {
          type: 'scroll',
          config: { duration: 0.6, delay: 0.1 },
        },
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const generateMockCode = (framework: string) => {
    if (framework === 'framer-motion') {
      return `"use client"

import { motion } from "framer-motion"

export function ScrollReveal({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      {children}
    </motion.div>
  )
}

// Usage:
// <ScrollReveal>
//   <h2>Your content here</h2>
// </ScrollReveal>`
    }
    if (framework === 'gsap') {
      return `import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function ScrollReveal({ children }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    
    gsap.fromTo(el,
      {
        opacity: 0,
        y: 50
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    )
    
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return <div ref={ref}>{children}</div>`
    }
    return `// CSS Animation
.reveal {
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

// JavaScript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
    }
  })
}, { threshold: 0.1 })

document.querySelectorAll('.reveal').forEach(el => observer.observe(el))`
  }

  const handleCopyCode = () => {
    if (result?.code) {
      copyToClipboard(result.code)
      setCopiedCode(true)
      toast.success('Code copied!')
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const handleDownload = () => {
    if (result?.code) {
      const blob = new Blob([result.code], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${result.name.toLowerCase().replace(/\s+/g, '-')}.${selectedFramework === 'css' ? 'js' : 'tsx'}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Downloaded!')
    }
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
              <h1 className="text-3xl font-bold">AI Animation Engine</h1>
              <p className="text-muted-foreground">
                Generate complex animations with natural language
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            {/* Framework Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Framework</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {['framer-motion', 'gsap', 'css'].map((fw) => (
                      <button
                        key={fw}
                        onClick={() => setSelectedFramework(fw)}
                        className={`p-3 rounded-lg border-2 text-center capitalize transition-all ${
                          selectedFramework === fw
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/30'
                        }`}
                      >
                        {fw === 'css' ? 'CSS' : fw.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Animation Type */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Animation Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {ANIMATION_TYPES.map((type) => (
                      <div
                        key={type.id}
                        className="p-3 rounded-xl border border-border hover:border-primary/50 cursor-pointer transition-all text-center"
                      >
                        <type.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <p className="font-medium text-sm">{type.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {type.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Prompt Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full h-32 p-4 rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Describe your animation in detail...

Examples:
• Apple-style smooth scroll reveal with scale and opacity
• GSAP magnetic button effect on hover
• 3D card tilt following mouse position
• Text characters appearing one by one with blur
• Parallax background with multiple depth layers"
                    />
                    <Button
                      className="w-full"
                      onClick={handleGenerate}
                      isLoading={isGenerating}
                      disabled={!prompt}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Animation
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-xs text-muted-foreground">Try:</span>
                    {EXAMPLE_PROMPTS.slice(0, 3).map((example) => (
                      <button
                        key={example}
                        onClick={() => setPrompt(example)}
                        className="text-xs text-primary hover:underline truncate max-w-[200px]"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Output Panel */}
          <div className="space-y-6">
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Result Header */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-bold">{result.name}</h2>
                        <p className="text-muted-foreground mt-1">
                          {result.description}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Badge>{result.framework}</Badge>
                          {result.dependencies.map((dep) => (
                            <Badge key={dep} variant="secondary">
                              {dep}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={handleCopyCode}>
                          {copiedCode ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="ghost" onClick={handleDownload}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Code Output */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Generated Code</CardTitle>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/30 rounded-xl p-4 max-h-[500px] overflow-auto">
                      <pre className="text-sm font-mono text-muted-foreground whitespace-pre-wrap">
                        {result.code}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                {/* Usage Instructions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Usage</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-sm font-medium mb-1">1. Install dependencies</p>
                      <code className="text-xs text-muted-foreground">
                        {selectedFramework === 'framer-motion'
                          ? 'npm install framer-motion'
                          : selectedFramework === 'gsap'
                          ? 'npm install gsap'
                          : 'No dependencies required'}
                      </code>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-sm font-medium mb-1">2. Import the component</p>
                      <code className="text-xs text-muted-foreground">
                        {selectedFramework === 'css'
                          ? 'Add the CSS and JavaScript to your project'
                          : `import { ScrollReveal } from './animation'`}
                      </code>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-sm font-medium mb-1">3. Wrap your content</p>
                      <code className="text-xs text-muted-foreground">
                        {selectedFramework === 'css'
                          ? 'Add class="reveal" to elements'
                          : '<ScrollReveal><YourContent /></ScrollReveal>'}
                      </code>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center p-8">
                  <Eye className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Animation Preview</h3>
                  <p className="text-muted-foreground">
                    Generate an animation to see the code and preview here
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
