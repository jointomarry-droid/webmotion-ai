'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  MessageSquare,
  Zap,
  Globe,
  CreditCard,
  Users,
  AlertTriangle,
  Info,
  Filter,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Notification {
  id: string
  type: 'message' | 'ai' | 'deploy' | 'billing' | 'team' | 'system' | 'warning'
  title: string
  description: string
  read: boolean
  timestamp: string
  action_url?: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchNotifications()
  }, [filter])

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/v1/notifications?filter=${filter}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      const data = await response.json()
      setNotifications(data.notifications)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      // Mock data
      setNotifications([
        {
          id: '1',
          type: 'ai',
          title: 'AI Generation Complete',
          description: 'Your animation for the hero section has been generated',
          read: false,
          timestamp: new Date(Date.now() - 300000).toISOString(),
          action_url: '/generator',
        },
        {
          id: '2',
          type: 'deploy',
          title: 'Deployment Successful',
          description: 'Landing Page has been deployed to Vercel',
          read: false,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          action_url: '/deploy/1',
        },
        {
          id: '3',
          type: 'team',
          title: 'New Team Member',
          description: 'bob@example.com has joined your team',
          read: true,
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          action_url: '/team',
        },
        {
          id: '4',
          type: 'billing',
          title: 'Credits Running Low',
          description: 'You have 50 AI credits remaining',
          read: true,
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          action_url: '/billing',
        },
        {
          id: '5',
          type: 'warning',
          title: 'Performance Alert',
          description: 'Your website has a high bounce rate on mobile',
          read: true,
          timestamp: new Date(Date.now() - 28800000).toISOString(),
          action_url: '/analytics',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`/api/v1/notifications/${id}/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/v1/notifications/read-all', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      setNotifications(notifications.map((n) => ({ ...n, read: true })))
      toast.success('All notifications marked as read')
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/v1/notifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      setNotifications(notifications.filter((n) => n.id !== id))
      toast.success('Notification deleted')
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-5 w-5" />
      case 'ai':
        return <Zap className="h-5 w-5" />
      case 'deploy':
        return <Globe className="h-5 w-5" />
      case 'billing':
        return <CreditCard className="h-5 w-5" />
      case 'team':
        return <Users className="h-5 w-5" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'ai':
        return 'bg-yellow-500/20 text-yellow-500'
      case 'deploy':
        return 'bg-green-500/20 text-green-500'
      case 'billing':
        return 'bg-blue-500/20 text-blue-500'
      case 'team':
        return 'bg-purple-500/20 text-purple-500'
      case 'warning':
        return 'bg-red-500/20 text-red-500'
      default:
        return 'bg-gray-500/20 text-gray-500'
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <h1 className="text-3xl font-bold">Notifications</h1>
                <p className="text-muted-foreground">
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread notifications`
                    : 'You\'re all caught up!'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="outline" onClick={handleMarkAllAsRead}>
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
              )}
              <Link href="/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
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
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {unreadCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="ai">AI</TabsTrigger>
              <TabsTrigger value="deploy">Deploys</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Notifications List */}
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
          ) : notifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                <p className="text-muted-foreground">
                  You're all caught up! Check back later for updates.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`transition-all ${
                      !notification.read
                        ? 'border-primary/50 bg-primary/5'
                        : 'hover:border-border'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-2 rounded-lg ${getNotificationColor(
                            notification.type
                          )}`}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{notification.title}</p>
                            {!notification.read && (
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(notification.timestamp)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {notification.action_url && (
                            <Link href={notification.action_url}>
                              <Button size="sm" variant="ghost">
                                View
                              </Button>
                            </Link>
                          )}
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(notification.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
