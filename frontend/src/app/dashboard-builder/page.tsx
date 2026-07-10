'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Sparkles,
  LayoutDashboard,
  BarChart3,
  PieChart,
  Users,
  Settings,
  Bell,
  Search,
  Download,
  Copy,
  Check,
  Wand2,
  TrendingUp,
  Activity,
  DollarSign,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { copyToClipboard } from '@/lib/utils'
import toast from 'react-hot-toast'

interface DashboardTemplate {
  id: string
  name: string
  description: string
  category: string
  components: string[]
  preview: string
}

const DASHBOARD_TYPES = [
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    description: 'Charts, metrics, and data visualization',
    icon: BarChart3,
    components: ['Stats Cards', 'Line Chart', 'Bar Chart', 'Pie Chart', 'Data Table', 'Activity Feed'],
  },
  {
    id: 'crm',
    name: 'CRM Dashboard',
    description: 'Customer relationship management',
    icon: Users,
    components: ['Contacts List', 'Deal Pipeline', 'Tasks', 'Calendar', 'Email Integration', 'Reports'],
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Dashboard',
    description: 'Sales, orders, and inventory',
    icon: DollarSign,
    components: ['Revenue Chart', 'Orders Table', 'Products Grid', 'Customer Stats', 'Inventory', 'Reviews'],
  },
  {
    id: 'project',
    name: 'Project Management',
    description: 'Tasks, timelines, and collaboration',
    icon: Activity,
    components: ['Kanban Board', 'Gantt Chart', 'Task List', 'Team Members', 'Time Tracking', 'Milestones'],
  },
  {
    id: 'admin',
    name: 'Admin Panel',
    description: 'System management and settings',
    icon: Settings,
    components: ['User Management', 'Role Permissions', 'System Logs', 'API Keys', 'Settings', 'Audit Trail'],
  },
  {
    id: 'saas',
    name: 'SaaS Dashboard',
    description: 'Subscription and usage metrics',
    icon: TrendingUp,
    components: ['Usage Metrics', 'Billing', 'API Usage', 'Feature Usage', 'Team', 'Integrations'],
  },
]

export default function DashboardBuilderPage() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)

  const handleGenerate = async (type?: string) => {
    const finalPrompt = type || selectedType || prompt
    if (!finalPrompt) {
      toast.error('Please select a dashboard type or describe what you need')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/v1/dashboard/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          type: selectedType,
          prompt: finalPrompt,
        }),
      })

      const data = await response.json()
      setGeneratedCode(data.code)
    } catch (error) {
      // Mock response
      setGeneratedCode(generateMockDashboard(selectedType || 'analytics'))
    } finally {
      setIsGenerating(false)
    }
  }

  const generateMockDashboard = (type: string) => {
    return `"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 500 },
  { name: "Apr", value: 280 },
  { name: "May", value: 590 },
  { name: "Jun", value: 450 },
]

const stats = [
  { title: "Total Revenue", value: "$45,231", change: "+20.1%", icon: "dollar" },
  { title: "Subscriptions", value: "+2,350", change: "+180.1%", icon: "users" },
  { title: "Active Users", value: "+12,234", change: "+19%", icon: "activity" },
  { title: "Conversion Rate", value: "3.24%", change: "+2.1%", icon: "trending" },
]

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <input
            type="search"
            placeholder="Search..."
            className="px-4 py-2 rounded-lg border"
          />
          <button className="p-2 rounded-lg hover:bg-muted">
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">User</th>
                <th className="text-left py-3">Action</th>
                <th className="text-left py-3">Date</th>
                <th className="text-left py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3">John Doe</td>
                <td className="py-3">Created project</td>
                <td className="py-3">2 hours ago</td>
                <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Active</span></td>
              </tr>
              <tr className="border-b">
                <td className="py-3">Jane Smith</td>
                <td className="py-3">Deployed website</td>
                <td className="py-3">5 hours ago</td>
                <td className="py-3"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}`
  }

  const handleCopyCode = () => {
    if (generatedCode) {
      copyToClipboard(generatedCode)
      setCopiedCode(true)
      toast.success('Code copied!')
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const handleDownload = () => {
    if (generatedCode) {
      const blob = new Blob([generatedCode], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'dashboard.tsx'
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
              <h1 className="text-3xl font-bold">AI Dashboard Builder</h1>
              <p className="text-muted-foreground">
                Generate complete dashboards with charts, tables, and analytics
              </p>
            </div>
          </div>
        </motion.div>

        {!generatedCode ? (
          <div className="space-y-8">
            {/* Dashboard Types */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-lg font-semibold mb-4">Choose Dashboard Type</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DASHBOARD_TYPES.map((type) => (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all ${
                      selectedType === type.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary/30'
                    }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-primary/10">
                          <type.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{type.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {type.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {type.components.slice(0, 3).map((comp) => (
                              <Badge key={comp} variant="secondary" className="text-xs">
                                {comp}
                              </Badge>
                            ))}
                            {type.components.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{type.components.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Custom Prompt */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        placeholder="Or describe your custom dashboard: e.g., 'CRM dashboard with sales pipeline, customer list, and revenue charts'"
                        leftIcon={<Wand2 className="h-4 w-4" />}
                      />
                    </div>
                    <Button
                      onClick={() => handleGenerate()}
                      isLoading={isGenerating}
                      disabled={!prompt && !selectedType}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : (
          /* Generated Result */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Generated Dashboard</h2>
                    <p className="text-muted-foreground mt-1">
                      Complete React dashboard with charts and components
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleCopyCode}>
                      {copiedCode ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      Copy Code
                    </Button>
                    <Button variant="outline" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button onClick={() => setGeneratedCode(null)}>
                      Generate New
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Code */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">dashboard.tsx</CardTitle>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-xl p-4 max-h-[600px] overflow-auto">
                  <pre className="text-sm font-mono text-muted-foreground whitespace-pre-wrap">
                    {generatedCode}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Start</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-sm font-medium mb-1">1. Install dependencies</p>
                  <code className="text-xs text-muted-foreground">
                    npm install recharts
                  </code>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-sm font-medium mb-1">2. Copy the file</p>
                  <code className="text-xs text-muted-foreground">
                    Save as app/dashboard/page.tsx
                  </code>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-sm font-medium mb-1">3. Run your app</p>
                  <code className="text-xs text-muted-foreground">
                    npm run dev
                  </code>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  )
}
