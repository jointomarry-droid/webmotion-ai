'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Zap,
  Clock,
  Cpu,
  Activity,
  AlertTriangle,
  Check,
  TrendingUp,
  TrendingDown,
  Minus,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import toast from 'react-hot-toast'

interface AnimationMetric {
  name: string
  value: number
  unit: string
  rating: 'good' | 'needs-improvement' | 'poor'
  description: string
}

interface AnimationIssue {
  id: string
  type: 'performance' | 'accessibility' | 'best-practice'
  severity: 'high' | 'medium' | 'low'
  title: string
  description: string
  suggestion: string
  impact: string
}

interface AnalysisResult {
  score: number
  metrics: AnimationMetric[]
  issues: AnimationIssue[]
  recommendations: string[]
}

export default function AnalyzerPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [codeInput, setCodeInput] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const handleAnalyze = async () => {
    if (!codeInput.trim()) {
      toast.error('Please enter animation code to analyze')
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/v1/analyzer/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ code: codeInput }),
      })

      const data = await response.json()
      setResult(data)
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

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'success'
      case 'needs-improvement':
        return 'warning'
      default:
        return 'error'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'medium':
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
              <h1 className="text-3xl font-bold">Animation Performance Analyzer</h1>
              <p className="text-muted-foreground">
                Analyze and optimize your animations for better performance
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Code Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Animation Code</CardTitle>
                    <CardDescription>
                      Paste your animation code for analysis
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setCodeInput('')}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <textarea
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    className="w-full h-96 p-4 rounded-xl border border-border bg-muted/30 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={`// Paste your animation code here\n// Example:\nimport { motion } from 'framer-motion'\n\nconst MyComponent = () => (\n  <motion.div\n    animate={{ opacity: 1, y: 0 }}\n    transition={{ duration: 0.5 }}\n  />\n)\n`}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleAnalyze}
                  isLoading={isAnalyzing}
                  disabled={!codeInput.trim()}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Performance'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {result ? (
              <div className="space-y-6">
                {/* Score */}
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.score)}`}>
                      {result.score}
                    </div>
                    <p className="text-muted-foreground">Performance Score</p>
                  </CardContent>
                </Card>

                {/* Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.metrics.map((metric) => (
                      <div
                        key={metric.name}
                        className="flex items-center justify-between p-3 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <Activity className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{metric.name}</p>
                            <p className="text-xs text-muted-foreground">{metric.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {metric.value.toFixed(1)}{metric.unit}
                          </p>
                          <Badge variant={getRatingColor(metric.rating)}>
                            {metric.rating}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Issues */}
                <Card>
                  <CardHeader>
                    <CardTitle>Issues ({result.issues.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.issues.map((issue) => (
                      <div
                        key={issue.id}
                        className="p-4 rounded-lg border border-border"
                      >
                        <div className="flex items-start gap-3">
                          {getSeverityIcon(issue.severity)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{issue.title}</p>
                              <Badge variant={
                                issue.severity === 'high' ? 'error' :
                                issue.severity === 'medium' ? 'warning' : 'secondary'
                              }>
                                {issue.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {issue.description}
                            </p>
                            <p className="text-sm text-primary">
                              Suggestion: {issue.suggestion}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {result.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center p-8">
                  <Zap className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Analysis Yet</h3>
                  <p className="text-muted-foreground">
                    Enter your animation code and click "Analyze Performance" to get started
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
