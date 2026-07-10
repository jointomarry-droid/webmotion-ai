'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Sparkles,
  Building2,
  Globe,
  Users,
  Target,
  TrendingUp,
  FileText,
  Palette,
  Download,
  Check,
  Lightbulb,
  Briefcase,
  BarChart3,
  Copy,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { copyToClipboard } from '@/lib/utils'
import toast from 'react-hot-toast'

interface BusinessPlan {
  business: {
    name: string
    industry: string
    target_market: string
    unique_value: string
    competitors: string[]
  }
  branding: {
    colors: string[]
    fonts: string[]
    tone: string
    style: string
  }
  pages: {
    name: string
    description: string
    sections: string[]
  }[]
  content: {
    tagline: string
    mission: string
    features: string[]
    testimonials: { name: string; role: string; quote: string }[]
  }
  seo: {
    keywords: string[]
    meta_title: string
    meta_description: string
  }
}

const INDUSTRIES = [
  'SaaS / Software',
  'E-commerce / Retail',
  'Healthcare',
  'Education / EdTech',
  'Finance / FinTech',
  'Real Estate',
  'Food & Restaurant',
  'Travel & Hospitality',
  'Creative Agency',
  'Portfolio / Personal',
  'Non-profit',
  'Other',
]

export default function BusinessPage() {
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [businessIdea, setBusinessIdea] = useState('')
  const [industry, setIndustry] = useState('')
  const [targetCountry, setTargetCountry] = useState('')
  const [competitors, setCompetitors] = useState('')
  const [result, setResult] = useState<BusinessPlan | null>(null)

  const handleGenerate = async () => {
    if (!businessIdea) {
      toast.error('Please describe your business idea')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/v1/business/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          idea: businessIdea,
          industry,
          target_country: targetCountry,
          competitors: competitors.split(',').map((c) => c.trim()),
        }),
      })

      const data = await response.json()
      setResult(data.plan)
    } catch (error) {
      // Mock response
      setResult({
        business: {
          name: 'InnovateTech',
          industry: industry || 'SaaS / Software',
          target_market: targetCountry || 'Global',
          unique_value: 'AI-powered solutions for modern businesses',
          competitors: competitors ? competitors.split(',').map((c) => c.trim()) : ['Competitor A', 'Competitor B'],
        },
        branding: {
          colors: ['#6366f1', '#8b5cf6', '#ec4899', '#ffffff', '#0f172a'],
          fonts: ['Inter', 'Cal Sans'],
          tone: 'Professional yet approachable',
          style: 'Modern, clean, minimal',
        },
        pages: [
          {
            name: 'Homepage',
            description: 'Main landing page with hero, features, and CTA',
            sections: ['Hero', 'Features', 'Social Proof', 'Pricing', 'FAQ', 'CTA'],
          },
          {
            name: 'About',
            description: 'Company story and team',
            sections: ['Mission', 'Values', 'Team', 'Timeline'],
          },
          {
            name: 'Features',
            description: 'Detailed feature breakdown',
            sections: ['Feature Grid', 'Screenshots', 'Integrations', 'Use Cases'],
          },
          {
            name: 'Pricing',
            description: 'Pricing plans and comparison',
            sections: ['Plan Cards', 'Feature Comparison', 'Enterprise', 'FAQ'],
          },
        ],
        content: {
          tagline: 'Build faster with AI-powered tools',
          mission: 'To empower businesses with intelligent automation',
          features: [
            'AI-Powered Analytics',
            'Real-time Collaboration',
            'Automated Workflows',
            'Enterprise Security',
          ],
          testimonials: [
            {
              name: 'Sarah Johnson',
              role: 'CTO, TechCorp',
              quote: 'This platform transformed how we build software.',
            },
          ],
        },
        seo: {
          keywords: ['saas', 'ai tools', 'automation', 'productivity'],
          meta_title: 'InnovateTech - AI-Powered Business Solutions',
          meta_description: 'Build faster with AI-powered analytics and automation tools.',
        },
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = (text: string) => {
    copyToClipboard(text)
    toast.success('Copied!')
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <h1 className="text-3xl font-bold">AI Business Assistant</h1>
              <p className="text-muted-foreground">
                Describe your idea, get a complete business plan and website strategy
              </p>
            </div>
          </div>
        </motion.div>

        {!result ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= s
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step > s ? <Check className="h-5 w-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-20 h-1 ${
                        step > s ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Business Idea */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Describe Your Business Idea
                  </CardTitle>
                  <CardDescription>
                    What do you want to build? Be as detailed as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea
                    value={businessIdea}
                    onChange={(e) => setBusinessIdea(e.target.value)}
                    className="w-full h-40 p-4 rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Example: An AI-powered school management system for 500 schools in the UAE with features like attendance tracking, fee management, online exams, and parent portals..."
                  />
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground">Quick ideas:</span>
                    {[
                      'AI fitness coaching app',
                      'Restaurant ordering platform',
                      'Real estate marketplace',
                      'Project management SaaS',
                    ].map((idea) => (
                      <button
                        key={idea}
                        onClick={() => setBusinessIdea(idea)}
                        className="text-xs text-primary hover:underline"
                      >
                        {idea}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => setStep(2)}>Next Step</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-500" />
                    Business Details
                  </CardTitle>
                  <CardDescription>
                    Help us understand your market better.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Industry</label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {INDUSTRIES.map((ind) => (
                        <button
                          key={ind}
                          onClick={() => setIndustry(ind)}
                          className={`p-2 rounded-lg border text-sm text-left transition-all ${
                            industry === ind
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/30'
                          }`}
                        >
                          {ind}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Input
                    label="Target Country/Region"
                    value={targetCountry}
                    onChange={(e) => setTargetCountry(e.target.value)}
                    placeholder="e.g., UAE, USA, Europe, Global"
                    leftIcon={<Globe className="h-4 w-4" />}
                  />
                  <Input
                    label="Main Competitors (comma separated)"
                    value={competitors}
                    onChange={(e) => setCompetitors(e.target.value)}
                    placeholder="e.g., Notion, Monday.com, Asana"
                    leftIcon={<Target className="h-4 w-4" />}
                  />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button
                      onClick={handleGenerate}
                      isLoading={isGenerating}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        ) : (
          /* Results */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{result.business.name}</h2>
                    <p className="text-muted-foreground mt-1">
                      {result.content.tagline}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Badge>{result.business.industry}</Badge>
                      <Badge variant="secondary">{result.business.target_market}</Badge>
                    </div>
                  </div>
                  <Button onClick={() => setResult(null)}>
                    Start Over
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="overview">
              <TabsList className="mb-6 flex-wrap">
                <TabsTrigger value="overview">
                  <Briefcase className="h-4 w-4 mr-1" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="branding">
                  <Palette className="h-4 w-4 mr-1" />
                  Branding
                </TabsTrigger>
                <TabsTrigger value="pages">
                  <FileText className="h-4 w-4 mr-1" />
                  Pages
                </TabsTrigger>
                <TabsTrigger value="seo">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  SEO
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Business Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Mission</p>
                        <p className="font-medium">{result.content.mission}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Unique Value</p>
                        <p className="font-medium">{result.business.unique_value}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Competitors</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {result.business.competitors.map((comp) => (
                            <Badge key={comp} variant="secondary">{comp}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Key Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {result.content.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Testimonial</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {result.content.testimonials.map((t, i) => (
                        <div key={i} className="p-4 rounded-xl bg-muted/30">
                          <p className="italic mb-3">"{t.quote}"</p>
                          <div>
                            <p className="font-medium">{t.name}</p>
                            <p className="text-sm text-muted-foreground">{t.role}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Branding Tab */}
              <TabsContent value="branding">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Brand Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">Color Palette</p>
                      <div className="flex gap-3">
                        {result.branding.colors.map((color, i) => (
                          <div
                            key={i}
                            className="w-16 h-16 rounded-xl cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            onClick={() => handleCopy(color)}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Typography</p>
                      <div className="flex gap-2">
                        {result.branding.fonts.map((font) => (
                          <Badge key={font} variant="secondary">{font}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Tone of Voice</p>
                        <p className="font-medium">{result.branding.tone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Visual Style</p>
                        <p className="font-medium">{result.branding.style}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pages Tab */}
              <TabsContent value="pages">
                <div className="grid md:grid-cols-2 gap-6">
                  {result.pages.map((page) => (
                    <Card key={page.name}>
                      <CardHeader>
                        <CardTitle className="text-lg">{page.name}</CardTitle>
                        <CardDescription>{page.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">Sections:</p>
                        <div className="flex flex-wrap gap-2">
                          {page.sections.map((section) => (
                            <Badge key={section} variant="outline">{section}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* SEO Tab */}
              <TabsContent value="seo">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">SEO Strategy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">Meta Title</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(result.seo.meta_title)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="p-3 rounded-lg bg-muted/30 font-mono text-sm">
                        {result.seo.meta_title}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">Meta Description</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(result.seo.meta_description)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="p-3 rounded-lg bg-muted/30 text-sm">
                        {result.seo.meta_description}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Target Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {result.seo.keywords.map((kw) => (
                          <Badge key={kw}>{kw}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Actions */}
            <div className="flex justify-center gap-4">
              <Link href="/generator">
                <Button size="lg">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Website
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Plan
              </Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
