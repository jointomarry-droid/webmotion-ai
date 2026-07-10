'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  GitBranch,
  GitMerge,
  GitPullRequest,
  MessageSquare,
  Upload,
  Download,
  Settings,
  UserPlus,
  CreditCard,
  Zap,
  Globe,
  FileCode,
  Clock,
  Filter,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { formatDate } from '@/lib/utils'

interface ActivityItem {
  id: string
  type: 'commit' | 'deploy' | 'comment' | 'upload' | 'settings' | 'member' | 'billing' | 'ai' | 'export'
  user: {
    name: string
    avatar?: string
  }
  action: string
  target?: string
  project?: string
  timestamp: string
  metadata?: Record<string, any>
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchActivities()
  }, [filter])

  const fetchActivities = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/v1/activity?filter=${filter}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      const data = await response.json()
      setActivities(data.activities)
    } catch (error) {
      console.error('Failed to fetch activities:', error)
      // Mock data
      setActivities([
        {
          id: '1',
          type: 'deploy',
          user: { name: 'John Doe' },
          action: 'deployed',
          target: 'v2.1.0',
          project: 'Landing Page',
          timestamp: new Date(Date.now() - 300000).toISOString(),
        },
        {
          id: '2',
          type: 'ai',
          user: { name: 'AI Assistant' },
          action: 'generated animation for',
          target: 'hero section',
          project: 'Landing Page',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '3',
          type: 'commit',
          user: { name: 'Jane Smith' },
          action: 'committed changes to',
          target: 'main branch',
          project: 'Dashboard',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: '4',
          type: 'member',
          user: { name: 'John Doe' },
          action: 'invited',
          target: 'bob@example.com',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
        },
        {
          id: '5',
          type: 'comment',
          user: { name: 'Alice Brown' },
          action: 'commented on',
          target: 'pricing section',
          project: 'Landing Page',
          timestamp: new Date(Date.now() - 28800000).toISOString(),
        },
        {
          id: '6',
          type: 'export',
          user: { name: 'John Doe' },
          action: 'exported',
          target: 'Landing Page',
          project: 'Landing Page',
          timestamp: new Date(Date.now() - 43200000).toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'commit':
        return <GitBranch className="h-5 w-5" />
      case 'deploy':
        return <Globe className="h-5 w-5" />
      case 'comment':
        return <MessageSquare className="h-5 w-5" />
      case 'upload':
        return <Upload className="h-5 w-5" />
      case 'settings':
        return <Settings className="h-5 w-5" />
      case 'member':
        return <UserPlus className="h-5 w-5" />
      case 'billing':
        return <CreditCard className="h-5 w-5" />
      case 'ai':
        return <Zap className="h-5 w-5" />
      case 'export':
        return <Download className="h-5 w-5" />
      default:
        return <FileCode className="h-5 w-5" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'commit':
        return 'bg-blue-500/20 text-blue-500'
      case 'deploy':
        return 'bg-green-500/20 text-green-500'
      case 'comment':
        return 'bg-purple-500/20 text-purple-500'
      case 'ai':
        return 'bg-yellow-500/20 text-yellow-500'
      case 'member':
        return 'bg-pink-500/20 text-pink-500'
      default:
        return 'bg-gray-500/20 text-gray-500'
    }
  }

  const filters = [
    { value: 'all', label: 'All Activity' },
    { value: 'commits', label: 'Commits' },
    { value: 'deploys', label: 'Deploys' },
    { value: 'comments', label: 'Comments' },
    { value: 'ai', label: 'AI Activity' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <h1 className="text-3xl font-bold">Activity Feed</h1>
              <p className="text-muted-foreground">
                Track all actions across your projects and team
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Tabs defaultValue={filter} onValueChange={setFilter}>
            <TabsList>
              {filters.map((f) => (
                <TabsTrigger key={f.value} value={f.value}>
                  {f.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted" />
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
                <p className="text-muted-foreground">
                  Start working on your projects to see activity here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

              <div className="space-y-6">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative pl-14"
                  >
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-4 top-4 w-5 h-5 rounded-full flex items-center justify-center ${getActivityColor(
                        activity.type
                      )}`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Avatar
                              fallback={activity.user.name.charAt(0)}
                              size="sm"
                            />
                            <div>
                              <p className="text-sm">
                                <span className="font-medium">
                                  {activity.user.name}
                                </span>{' '}
                                {activity.action}{' '}
                                {activity.target && (
                                  <span className="font-medium text-primary">
                                    {activity.target}
                                  </span>
                                )}
                              </p>
                              {activity.project && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  in{' '}
                                  <Link
                                    href="/dashboard"
                                    className="hover:underline"
                                  >
                                    {activity.project}
                                  </Link>
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDate(activity.timestamp)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
