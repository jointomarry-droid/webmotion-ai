'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Download,
  Copy,
  Heart,
  Share2,
  Star,
  Code2,
  Eye,
  Sparkles,
  ExternalLink,
  Check,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { Avatar } from '@/components/ui/Avatar'
import { useAuthStore } from '@/lib/store'
import { copyToClipboard, formatNumber } from '@/lib/utils'
import { Template } from '@/types'
import toast from 'react-hot-toast'

export default function TemplateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const [template, setTemplate] = useState<Template | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCopying, setIsCopying] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [activeTab, setActiveTab] = useState('preview')

  useEffect(() => {
    fetchTemplate()
  }, [params.id])

  const fetchTemplate = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/v1/templates/${params.id}`)
      const data = await response.json()
      setTemplate(data)
    } catch (error) {
      console.error('Failed to fetch template:', error)
      toast.error('Failed to load template')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyPrompt = async () => {
    if (!template) return
    setIsCopying(true)
    await copyToClipboard(template.prompt_content)
    toast.success('Prompt copied to clipboard!')
    setIsCopying(false)
  }

  const handleCopyCode = async () => {
    if (!template?.code_output) return
    await copyToClipboard(template.code_output)
    toast.success('Code copied to clipboard!')
  }

  const handleDownload = () => {
    if (!template?.code_output) return
    const blob = new Blob([template.code_output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${template.title.toLowerCase().replace(/\s+/g, '-')}.tsx`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Code downloaded!')
  }

  const handleUseTemplate = () => {
    if (!user) {
      toast.error('Please sign in to use templates')
      router.push('/auth/login')
      return
    }
    // Create project from template
    router.push(`/generator?template=${params.id}`)
  }

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited)
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites')
  }

  const handleShare = async () => {
    await copyToClipboard(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Template not found</h2>
          <p className="text-muted-foreground mb-4">
            The template you're looking for doesn't exist.
          </p>
          <Link href="/templates">
            <Button>Browse Templates</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/templates"
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="font-semibold line-clamp-1">{template.title}</h1>
                <p className="text-xs text-muted-foreground">
                  by {template.creator?.name || 'Anonymous'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleFavorite}
                className={isFavorited ? 'text-red-500' : ''}
              >
                <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5" />
              </Button>
              {template.is_premium && !user?.lifetime_deal ? (
                <Button onClick={handleUseTemplate}>
                  Buy for ${template.price}
                </Button>
              ) : (
                <Button onClick={handleUseTemplate}>
                  Use Template
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preview Card */}
            <Card className="overflow-hidden">
              <div className="aspect-video relative bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10">
                {template.preview_image ? (
                  <img
                    src={template.preview_image}
                    alt={template.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Eye className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                      <p className="text-muted-foreground">Preview</p>
                    </div>
                  </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <Button onClick={handleCopyPrompt} leftIcon={<Copy className="h-4 w-4" />}>
                    Copy Prompt
                  </Button>
                  {template.code_output && (
                    <Button onClick={handleCopyCode} leftIcon={<Code2 className="h-4 w-4" />}>
                      Copy Code
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Code/Tabs Section */}
            <Card>
              <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between">
                    <TabsList>
                      <TabsTrigger value="preview">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </TabsTrigger>
                      <TabsTrigger value="prompt">
                        <Sparkles className="h-4 w-4 mr-1" />
                        Prompt
                      </TabsTrigger>
                      <TabsTrigger value="code">
                        <Code2 className="h-4 w-4 mr-1" />
                        Code
                      </TabsTrigger>
                    </TabsList>
                    {activeTab === 'code' && template.code_output && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={handleCopyCode}>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleDownload}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <TabsContent value="preview" className="m-0">
                    <div className="aspect-video rounded-xl bg-white border border-border overflow-hidden">
                      <div className="p-8 text-center text-gray-500">
                        <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Interactive preview will render here</p>
                        <p className="text-sm mt-2">
                          This shows how the animation looks in a browser
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="prompt" className="m-0">
                    <div className="relative">
                      <pre className="p-4 rounded-xl bg-muted/30 text-sm overflow-x-auto whitespace-pre-wrap">
                        {template.prompt_content}
                      </pre>
                      <Button
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleCopyPrompt}
                        isLoading={isCopying}
                      >
                        {isCopying ? 'Copying...' : 'Copy'}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="code" className="m-0">
                    {template.code_output ? (
                      <div className="relative">
                        <pre className="p-4 rounded-xl bg-muted/30 text-sm overflow-x-auto">
                          <code>{template.code_output}</code>
                        </pre>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Code2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Code not available for this template</p>
                      </div>
                    )}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            {/* Main Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{template.title}</CardTitle>
                    <p className="text-muted-foreground mt-1">
                      {template.description || 'No description provided'}
                    </p>
                  </div>
                  {template.is_premium && (
                    <Badge variant="warning">Premium</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {formatNumber(template.downloads)} downloads
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm">
                      {template.rating.toFixed(1)} ({template.rating_count} reviews)
                    </span>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <p className="text-sm font-medium mb-2">Category</p>
                  <Badge variant="secondary">{template.category}</Badge>
                </div>

                {/* Tags */}
                {template.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price */}
                {template.is_premium && (
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold">${template.price}</span>
                      <span className="text-sm text-muted-foreground">one-time</span>
                    </div>
                    <Button className="w-full" onClick={handleUseTemplate}>
                      Purchase Template
                    </Button>
                    {user?.lifetime_deal && (
                      <p className="text-sm text-center text-green-600 mt-2">
                        <Check className="h-4 w-4 inline mr-1" />
                        Included with Lifetime Deal
                      </p>
                    )}
                  </div>
                )}

                {!template.is_premium && (
                  <Button className="w-full" onClick={handleUseTemplate}>
                    Use Template Free
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Creator */}
            {template.creator && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Creator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={template.creator.avatar_url || undefined}
                      alt={template.creator.name || ''}
                      size="lg"
                    />
                    <div>
                      <p className="font-medium">{template.creator.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {template.creator.subscription_tier === 'pro'
                          ? 'Pro Creator'
                          : 'Creator'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                      <div className="w-16 h-12 rounded bg-muted flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">Related Template {i}</p>
                        <p className="text-xs text-muted-foreground">Hero</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
