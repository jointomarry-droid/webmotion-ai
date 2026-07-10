'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Search,
  Check,
  X,
  AlertTriangle,
  Info,
  Eye,
  Keyboard,
  Monitor,
  Contrast,
  Type,
  MousePointer,
  Volume2,
  Loader2,
  Shield,
  FileText,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import toast from 'react-hot-toast'

type IssueSeverity = 'error' | 'warning' | 'info'

interface AccessibilityIssue {
  id: string
  severity: IssueSeverity
  category: string
  rule: string
  description: string
  impact: string
  element?: string
  suggestion: string
  wcag_rule: string
}

interface AuditResult {
  score: number
  url: string
  issues: AccessibilityIssue[]
  passed: number
  failed: number
  warnings: number
  categories: {
    name: string
    score: number
    issues: number
  }[]
}

export default function AccessibilityPage() {
  const [url, setUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AuditResult | null>(null)

  const handleAnalyze = async () => {
    if (!url) {
      toast.error('Please enter a URL')
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/v1/accessibility/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      toast.error('Analysis failed')
      // Mock data for demo
      setResult({
        score: 78,
        url,
        passed: 42,
        failed: 8,
        warnings: 5,
        categories: [
          { name: 'Keyboard', score: 85, issues: 2 },
          { name: 'Screen Reader', score: 72, issues: 4 },
          { name: 'Color Contrast', score: 90, issues: 1 },
          { name: 'Motion', score: 65, issues: 3 },
          { name: 'Focus', score: 80, issues: 2 },
        ],
        issues: [
          {
            id: '1',
            severity: 'error',
            category: 'Motion',
            rule: 'prefers-reduced-motion',
            description: 'Animation does not respect prefers-reduced-motion media query',
            impact: 'Users with vestibular disorders may experience discomfort',
            element: '.hero-animation',
            suggestion: 'Add a media query to disable or reduce animations when prefers-reduced-motion is set',
            wcag_rule: '2.3.3',
          },
          {
            id: '2',
            severity: 'error',
            category: 'Keyboard',
            rule: 'focus-visible',
            description: 'Interactive elements lack visible focus indicator',
            impact: 'Keyboard users cannot see which element is focused',
            element: 'button.cta',
            suggestion: 'Add :focus-visible styles with a visible outline',
            wcag_rule: '2.4.7',
          },
          {
            id: '3',
            severity: 'warning',
            category: 'Color Contrast',
            rule: 'contrast-ratio',
            description: 'Text contrast ratio is below 4.5:1',
            impact: 'Low vision users may have difficulty reading text',
            element: 'p.subtitle',
            suggestion: 'Increase contrast by using darker text or lighter background',
            wcag_rule: '1.4.3',
          },
          {
            id: '4',
            severity: 'warning',
            category: 'Screen Reader',
            rule: 'aria-label',
            description: 'Icon buttons lack accessible labels',
            impact: 'Screen reader users cannot understand button purpose',
            element: 'button.icon-only',
            suggestion: 'Add aria-label attribute to icon buttons',
            wcag_rule: '4.1.2',
          },
          {
            id: '5',
            severity: 'info',
            category: 'Motion',
            rule: 'animation-duration',
            description: 'Animation duration exceeds 5 seconds',
            impact: 'May cause distraction or discomfort for some users',
            element: '.background-ripple',
            suggestion: 'Consider reducing animation duration or providing a pause control',
            wcag_rule: '2.2.2',
          },
        ],
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500'
    if (score >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getSeverityIcon = (severity: IssueSeverity) => {
    switch (severity) {
      case 'error':
        return <X className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Keyboard':
        return <Keyboard className="h-5 w-5" />
      case 'Screen Reader':
        return <Volume2 className="h-5 w-5" />
      case 'Color Contrast':
        return <Contrast className="h-5 w-5" />
      case 'Motion':
        return <Eye className="h-5 w-5" />
      case 'Focus':
        return <MousePointer className="h-5 w-5" />
      default:
        return <Shield className="h-5 w-5" />
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
              <h1 className="text-3xl font-bold">Accessibility Checker</h1>
              <p className="text-muted-foreground">
                Ensure your animations are accessible to all users
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
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
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
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Score Overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className={`text-5xl font-bold mb-2 ${getScoreColor(result.score)}`}>
                    {result.score}
                  </div>
                  <p className="text-muted-foreground">Accessibility Score</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-5xl font-bold mb-2 text-green-500">
                    {result.passed}
                  </div>
                  <p className="text-muted-foreground">Passed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-5xl font-bold mb-2 text-red-500">
                    {result.failed}
                  </div>
                  <p className="text-muted-foreground">Failed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-5xl font-bold mb-2 text-yellow-500">
                    {result.warnings}
                  </div>
                  <p className="text-muted-foreground">Warnings</p>
                </CardContent>
              </Card>
            </div>

            {/* Categories */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Category Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-5 gap-4">
                  {result.categories.map((cat) => (
                    <div
                      key={cat.name}
                      className="p-4 rounded-xl border border-border text-center"
                    >
                      <div className="flex justify-center mb-2 text-primary">
                        {getCategoryIcon(cat.name)}
                      </div>
                      <p className="font-medium text-sm mb-1">{cat.name}</p>
                      <p className={`text-2xl font-bold ${getScoreColor(cat.score)}`}>
                        {cat.score}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {cat.issues} issues
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Issues List */}
            <Card>
              <CardHeader>
                <CardTitle>Issues Found ({result.issues.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-4 rounded-xl border border-border"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getSeverityIcon(issue.severity)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{issue.rule}</p>
                          <Badge
                            variant={
                              issue.severity === 'error'
                                ? 'error'
                                : issue.severity === 'warning'
                                ? 'warning'
                                : 'secondary'
                            }
                          >
                            {issue.severity}
                          </Badge>
                          <Badge variant="outline">{issue.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {issue.description}
                        </p>
                        {issue.element && (
                          <p className="text-xs font-mono text-muted-foreground mb-2">
                            Element: {issue.element}
                          </p>
                        )}
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-sm">
                            <span className="font-medium">Impact:</span> {issue.impact}
                          </p>
                          <p className="text-sm mt-1">
                            <span className="font-medium">Suggestion:</span>{' '}
                            {issue.suggestion}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            WCAG Rule: {issue.wcag_rule}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  )
}
