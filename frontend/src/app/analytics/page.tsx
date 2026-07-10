'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Eye,
  Clock,
  MousePointer,
  Globe,
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  Activity,
  Users,
  Zap,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { formatDate, formatNumber } from '@/lib/utils'

interface AnalyticsData {
  overview: {
    total_views: number
    unique_visitors: number
    avg_session_duration: number
    bounce_rate: number
    page_views_change: number
    visitors_change: number
  }
  pages: {
    path: string
    views: number
    unique_views: number
    avg_time: number
    bounce_rate: number
  }[]
  devices: {
    type: string
    percentage: number
  }[]
  browsers: {
    name: string
    percentage: number
  }[]
  referrers: {
    source: string
    visits: number
  }[]
  timeline: {
    date: string
    views: number
    visitors: number
  }[]
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedProject, setSelectedProject] = useState('all')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange, selectedProject])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/v1/analytics?range=${timeRange}&project=${selectedProject}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      )
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      // Mock data for demo
      setData({
        overview: {
          total_views: 12847,
          unique_visitors: 8234,
          avg_session_duration: 245,
          bounce_rate: 32.4,
          page_views_change: 12.5,
          visitors_change: 8.3,
        },
        pages: [
          { path: '/', views: 4521, unique_views: 3200, avg_time: 45, bounce_rate: 25.3 },
          { path: '/features', views: 2834, unique_views: 2100, avg_time: 120, bounce_rate: 18.7 },
          { path: '/pricing', views: 1923, unique_views: 1500, avg_time: 89, bounce_rate: 42.1 },
          { path: '/blog', views: 1567, unique_views: 1200, avg_time: 180, bounce_rate: 35.6 },
          { path: '/contact', views: 987, unique_views: 800, avg_time: 65, bounce_rate: 28.9 },
        ],
        devices: [
          { type: 'Desktop', percentage: 58.2 },
          { type: 'Mobile', percentage: 35.4 },
          { type: 'Tablet', percentage: 6.4 },
        ],
        browsers: [
          { name: 'Chrome', percentage: 62.3 },
          { name: 'Safari', percentage: 21.5 },
          { name: 'Firefox', percentage: 9.8 },
          { name: 'Edge', percentage: 6.4 },
        ],
        referrers: [
          { source: 'Google', visits: 4521 },
          { source: 'Direct', visits: 3200 },
          { source: 'Twitter', visits: 1823 },
          { source: 'LinkedIn', visits: 987 },
          { source: 'GitHub', visits: 654 },
        ],
        timeline: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
          views: Math.floor(Math.random() * 2000) + 1000,
          visitors: Math.floor(Math.random() * 1500) + 800,
        })),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    trend,
  }: {
    title: string
    value: string | number
    change?: number
    icon: any
    trend?: 'up' | 'down'
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1 mt-1">
                {trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={`text-sm ${
                    trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {change > 0 ? '+' : ''}{change}%
                </span>
              </div>
            )}
          </div>
          <div className="p-3 rounded-xl bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Analytics</h1>
                <p className="text-muted-foreground">
                  Track your website performance and visitor insights
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 rounded-xl border border-border bg-background"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <Button variant="outline" onClick={fetchAnalytics}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Total Views"
            value={formatNumber(data?.overview.total_views || 0)}
            change={data?.overview.page_views_change}
            icon={Eye}
            trend="up"
          />
          <StatCard
            title="Unique Visitors"
            value={formatNumber(data?.overview.unique_visitors || 0)}
            change={data?.overview.visitors_change}
            icon={Users}
            trend="up"
          />
          <StatCard
            title="Avg. Session"
            value={`${Math.floor((data?.overview.avg_session_duration || 0) / 60)}m ${
              (data?.overview.avg_session_duration || 0) % 60
           }s`}
            icon={Clock}
          />
          <StatCard
            title="Bounce Rate"
            value={`${data?.overview.bounce_rate || 0}%`}
            icon={MousePointer}
          />
        </motion.div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="pages">
              <Globe className="h-4 w-4 mr-1" />
              Pages
            </TabsTrigger>
            <TabsTrigger value="audience">
              <Users className="h-4 w-4 mr-1" />
              Audience
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Timeline Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Views Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end gap-2">
                    {data?.timeline.map((day, i) => {
                      const maxViews = Math.max(...(data.timeline.map((d) => d.views) || [1]))
                      const height = (day.views / maxViews) * 100
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                            style={{ height: `${height}%` }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Top Referrers */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Referrers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data?.referrers.map((ref, i) => {
                    const maxVisits = Math.max(...(data.referrers.map((r) => r.visits) || [1]))
                    const width = (ref.visits / maxVisits) * 100
                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{ref.source}</span>
                          <span className="text-muted-foreground">
                            {formatNumber(ref.visits)}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pages Tab */}
          <TabsContent value="pages">
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
                <CardDescription>Most visited pages on your website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                          Page
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                          Views
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                          Unique
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                          Avg. Time
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                          Bounce Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.pages.map((page, i) => (
                        <tr key={i} className="border-b border-border last:border-0">
                          <td className="py-3 px-4 font-mono text-sm">{page.path}</td>
                          <td className="py-3 px-4 text-right">{formatNumber(page.views)}</td>
                          <td className="py-3 px-4 text-right">{formatNumber(page.unique_views)}</td>
                          <td className="py-3 px-4 text-right">{page.avg_time}s</td>
                          <td className="py-3 px-4 text-right">
                            <Badge
                              variant={
                                page.bounce_rate < 30
                                  ? 'success'
                                  : page.bounce_rate < 50
                                  ? 'warning'
                                  : 'error'
                              }
                            >
                              {page.bounce_rate}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audience Tab */}
          <TabsContent value="audience">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Devices */}
              <Card>
                <CardHeader>
                  <CardTitle>Devices</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data?.devices.map((device, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{device.type}</span>
                        <span className="text-muted-foreground">{device.percentage}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${device.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Browsers */}
              <Card>
                <CardHeader>
                  <CardTitle>Browsers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data?.browsers.map((browser, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{browser.name}</span>
                        <span className="text-muted-foreground">{browser.percentage}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${browser.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
