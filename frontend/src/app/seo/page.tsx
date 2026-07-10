'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Search,
  BarChart3,
  FileText,
  Image,
  Link2,
  AlertTriangle,
  Check,
  X,
  RefreshCw,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import toast from 'react-hot-toast'

interface SEOIssue {
  id: string
  type: 'error' | 'warning' | 'info'
  category: string
  message: string
  suggestion: string
}

interface SEOReport {
  score: number
  url: string
  issues: SEOIssue[]
  meta: {
    title: string
    description: string
    keywords: string[]
    og_image: string
    canonical_url: string
  }
  performance: {
    load_time: number
    first_contentful_paint: number
    largest_contentful_paint: number
    cumulative_layout_shift: number
  }
}

export default function SEOPage() {
  const [url, setUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [report, setReport] = useState<SEOReport | null>(null)

  const handleAnalyze = async () => {
    if (!url) {
      toast.error('Please enter a URL')
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/v1/seo/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()
      setReport(data)
    } catch (error) {
      toast.error('Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500'
    if (score >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <X className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Check className="h-4 w-4 text-blue-500" />
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
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">SEO Optimizer</h1>
              <p className="text-muted-foreground">
                Analyze and optimize your website's search engine performance
              </p>
            </div>
          </div>
        </motion.div>

        {/* URL Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter website URL to analyze..."
                    leftIcon={<Search className="h-4 w-4" />}
                  />
                </div>
                <Button
                  onClick={handleAnalyze}
                  isLoading={isAnalyzing}
                  disabled={!url}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        {report && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Score Overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className={`text-5xl font-bold mb-2 ${getScoreColor(report.score)}`}>
                    {report.score}
                  </div>
                  <p className="text-muted-foreground">SEO Score</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-5xl font-bold mb-2 text-blue-500">
                    {report.performance.load_time.toFixed(1)}s
                  </div>
                  <p className="text-muted-foreground">Load Time</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-5xl font-bold mb-2 text-purple-500">
                    {report.performance.first_contentful_paint.toFixed(0)}ms
                  </div>
                  <p className="text-muted-foreground">First Paint</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-5xl font-bold mb-2 text-pink-500">
                    {report.issues.filter((i) => i.type === 'error').length}
                  </div>
                  <p className="text-muted-foreground">Critical Issues</p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Report */}
            <Tabs defaultValue="meta">
              <TabsList className="mb-6">
                <TabsTrigger value="meta">
                  <FileText className="h-4 w-4 mr-1" />
                  Meta Tags
                </TabsTrigger>
                <TabsTrigger value="performance">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Performance
                </TabsTrigger>
                <TabsTrigger value="issues">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Issues ({report.issues.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="meta">
                <Card>
                  <CardHeader>
                    <CardTitle>Meta Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Title</label>
                      <p className="mt-1">{report.meta.title || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Description</label>
                      <p className="mt-1">{report.meta.description || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Keywords</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {report.meta.keywords.map((kw, i) => (
                          <Badge key={i} variant="secondary">{kw}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Canonical URL</label>
                      <p className="mt-1 font-mono text-sm">{report.meta.canonical_url || 'Not set'}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-500/10">
                            <RefreshCw className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="font-medium">Largest Contentful Paint</p>
                            <p className="text-sm text-muted-foreground">Time for largest content element to render</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{report.performance.largest_contentful_paint.toFixed(0)}ms</p>
                          <Badge variant={report.performance.largest_contentful_paint < 2500 ? 'success' : 'error'}>
                            {report.performance.largest_contentful_paint < 2500 ? 'Good' : 'Needs Work'}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-purple-500/10">
                            <BarChart3 className="h-5 w-5 text-purple-500" />
                          </div>
                          <div>
                            <p className="font-medium">Cumulative Layout Shift</p>
                            <p className="text-sm text-muted-foreground">Visual stability of the page</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{report.performance.cumulative_layout_shift.toFixed(3)}</p>
                          <Badge variant={report.performance.cumulative_layout_shift < 0.1 ? 'success' : 'error'}>
                            {report.performance.cumulative_layout_shift < 0.1 ? 'Good' : 'Needs Work'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="issues">
                <Card>
                  <CardHeader>
                    <CardTitle>Issues & Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {report.issues.map((issue) => (
                        <div
                          key={issue.id}
                          className="p-4 rounded-lg border border-border"
                        >
                          <div className="flex items-start gap-3">
                            {getIssueIcon(issue.type)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium">{issue.message}</p>
                                <Badge variant={
                                  issue.type === 'error' ? 'error' :
                                  issue.type === 'warning' ? 'warning' : 'secondary'
                                }>
                                  {issue.category}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {issue.suggestion}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </main>
    </div>
  )
}
