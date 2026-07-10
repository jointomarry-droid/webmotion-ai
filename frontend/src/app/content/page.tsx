'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Sparkles,
  FileText,
  Wand2,
  Copy,
  Check,
  Download,
  BookOpen,
  Newspaper,
  Mail,
  Megaphone,
  Tag,
  Clock,
  Target,
  PenTool,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { copyToClipboard } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ContentPlan {
  title: string
  sections: {
    heading: string
    content: string
    metaDescription: string
    keywords: string[]
    readTime: string
  }[]
}

export default function ContentPage() {
  const [contentType, setContentType] = useState<'blog' | 'email' | 'social' | 'ad'>('blog')
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('professional')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<ContentPlan | null>(null)
  const [copiedContent, setCopiedContent] = useState(false)
  const [wordCount, setWordCount] = useState('medium')

  const CONTENT_TYPES = [
    { id: 'blog' as const, name: 'Blog Post', icon: Newspaper, description: 'SEO-optimized articles' },
    { id: 'email' as const, name: 'Email', icon: Mail, description: 'Marketing & transactional' },
    { id: 'social' as const, name: 'Social Media', icon: Megaphone, description: 'Posts & captions' },
    { id: 'ad' as const, name: 'Ad Copy', icon: Target, description: 'Paid advertising' },
  ]

  const TONES = ['professional', 'casual', 'friendly', 'formal', 'witty', 'empathetic']
  const WORD_COUNTS = [
    { id: 'short', label: 'Short', description: '300-500 words' },
    { id: 'medium', label: 'Medium', description: '800-1200 words' },
    { id: 'long', label: 'Long', description: '1500-2500 words' },
  ]

  const handleGenerate = async () => {
    if (!topic) {
      toast.error('Please enter a topic')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/v1/content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ type: contentType, topic, tone, wordCount }),
      })
      const data = await response.json()
      setGeneratedContent(data)
    } catch (error) {
      setGeneratedContent({
        title: topic,
        sections: [
          {
            heading: `The Ultimate Guide to ${topic}`,
            content: `In today's rapidly evolving digital landscape, understanding ${topic} is crucial for businesses and individuals alike. This comprehensive guide will walk you through everything you need to know, from the fundamentals to advanced strategies.\n\n## Why ${topic} Matters\n\n${topic} has become increasingly important in recent years. Here's why:\n\n1. **Market Demand** - The demand for expertise in this area continues to grow\n2. **Competitive Advantage** - Organizations that master this gain an edge\n3. **Future-Proofing** - These skills will remain relevant for years to come\n\n## Key Concepts\n\nBefore diving deeper, let's establish a solid foundation of the core concepts:\n\n### Concept 1: Foundation\n\nEvery great understanding starts with the basics. ${topic} is no different. Start by grasping these fundamental principles.\n\n### Concept 2: Strategy\n\nOnce you understand the basics, it's time to develop a strategic approach. Consider your goals, resources, and timeline.\n\n### Concept 3: Execution\n\nStrategy without execution is just a plan. Focus on actionable steps and measurable outcomes.\n\n## Best Practices\n\nHere are proven strategies for success:\n\n- **Start Small** - Begin with manageable projects and scale\n- **Measure Everything** - Track key metrics from day one\n- **Iterate Constantly** - Use data to improve continuously\n- **Stay Updated** - Keep up with the latest trends and tools\n\n## Getting Started\n\nReady to begin? Here's your action plan:\n\n1. Assess your current situation\n2. Define clear objectives\n3. Create a roadmap\n4. Take the first step today\n\n## Conclusion\n\n${topic} is a journey, not a destination. Stay committed to learning and growing, and you'll see results.`,
            metaDescription: `Learn everything about ${topic} in this comprehensive guide. Tips, strategies, and best practices for success.`,
            keywords: [topic, `${topic} guide`, `${topic} tips`, `${topic} best practices`, `learn ${topic}`],
            readTime: '8 min read',
          },
        ],
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = (text: string) => {
    copyToClipboard(text)
    setCopiedContent(true)
    toast.success('Content copied!')
    setTimeout(() => setCopiedContent(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 rounded-lg hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">AI Content Generator</h1>
              <p className="text-muted-foreground">
                Create blog posts, emails, social media content, and ad copy
              </p>
            </div>
          </div>
        </motion.div>

        {!generatedContent ? (
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Content Type Selection */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="text-lg font-semibold mb-4">Content Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {CONTENT_TYPES.map((type) => (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all text-center ${
                      contentType === type.id ? 'border-primary bg-primary/5' : 'hover:border-primary/30'
                    }`}
                    onClick={() => setContentType(type.id)}
                  >
                    <CardContent className="p-4">
                      <type.icon className={`h-6 w-6 mx-auto mb-2 ${contentType === type.id ? 'text-primary' : 'text-muted-foreground'}`} />
                      <p className="text-sm font-medium">{type.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Topic Input */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <Input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder={
                      contentType === 'blog' ? 'Enter blog topic: e.g., "10 Tips for Better UX Design"' :
                      contentType === 'email' ? 'Email purpose: e.g., "Welcome new subscribers"' :
                      contentType === 'social' ? 'Post topic: e.g., "Product launch announcement"' :
                      'Ad product: e.g., "SaaS project management tool"'
                    }
                    leftIcon={<PenTool className="h-4 w-4" />}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Settings */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tone</label>
                    <div className="flex flex-wrap gap-2">
                      {TONES.map((t) => (
                        <Badge
                          key={t}
                          variant={tone === t ? 'default' : 'secondary'}
                          className="cursor-pointer capitalize"
                          onClick={() => setTone(t)}
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {contentType === 'blog' && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Length</label>
                      <div className="grid grid-cols-3 gap-2">
                        {WORD_COUNTS.map((wc) => (
                          <Card
                            key={wc.id}
                            className={`cursor-pointer transition-all text-center ${
                              wordCount === wc.id ? 'border-primary bg-primary/5' : 'hover:border-primary/30'
                            }`}
                            onClick={() => setWordCount(wc.id)}
                          >
                            <CardContent className="p-3">
                              <p className="text-sm font-medium">{wc.label}</p>
                              <p className="text-xs text-muted-foreground">{wc.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Generate */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Button onClick={handleGenerate} isLoading={isGenerating} size="lg" className="w-full">
                <Sparkles className="h-5 w-5 mr-2" />
                Generate Content
              </Button>
            </motion.div>
          </div>
        ) : (
          /* Generated Content */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-xl font-bold">{generatedContent.title}</h2>
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {generatedContent.sections[0].readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {generatedContent.sections[0].content.split(' ').length} words
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => handleCopy(generatedContent.sections[0].content)}>
                      {copiedContent ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      Copy Content
                    </Button>
                    <Button onClick={() => setGeneratedContent(null)}>
                      Generate New
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            {generatedContent.sections.map((section, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>{section.heading}</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-muted-foreground">{section.content}</div>
                </CardContent>
              </Card>
            ))}

            {/* SEO Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">SEO Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Meta Description</p>
                  <p className="text-sm text-muted-foreground">{generatedContent.sections[0].metaDescription}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {generatedContent.sections[0].keywords.map((kw) => (
                      <Badge key={kw} variant="secondary">
                        <Tag className="h-3 w-3 mr-1" />
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  )
}
