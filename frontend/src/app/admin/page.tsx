'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Users, Settings, Activity, Database,
  Shield, BarChart3, Bell, FileText, Server, Cpu,
  HardDrive, Wifi, Clock, TrendingUp, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import toast from 'react-hot-toast'

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
}

interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalProjects: number
  apiCallsToday: number
  storageUsed: string
  uptime: string
  cpuUsage: number
  memoryUsage: number
}

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalProjects: 0,
    apiCallsToday: 0,
    storageUsed: '0 GB',
    uptime: '0d 0h 0m',
    cpuUsage: 0,
    memoryUsage: 0,
  })

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token')
    if (adminToken) {
      setIsAuthenticated(true)
      loadStats()
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('admin_token', 'admin_authenticated')
      setIsAuthenticated(true)
      toast.success('Welcome to Admin Panel!')
      loadStats()
    } else {
      toast.error('Invalid credentials')
    }

    setIsLoading(false)
  }

  const loadStats = () => {
    // Simulated stats - in production, fetch from API
    setStats({
      totalUsers: 1247,
      activeUsers: 89,
      totalProjects: 3456,
      apiCallsToday: 12847,
      storageUsed: '45.2 GB',
      uptime: '32d 14h 23m',
      cpuUsage: 34,
      memoryUsage: 67,
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    setIsAuthenticated(false)
    toast.success('Logged out')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Admin Access</CardTitle>
              <p className="text-muted-foreground">
                Enter your credentials to access the admin panel
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isLoading}
                >
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">WebMotion.ai Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="success">
                <Activity className="h-3 w-3 mr-1" />
                System Online
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'projects', label: 'Projects', icon: FileText },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'system', label: 'System', icon: Server },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold">Dashboard Overview</h2>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Users</p>
                          <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                        </div>
                        <Users className="h-10 w-10 text-primary/20" />
                      </div>
                      <p className="text-sm text-green-500 mt-2">+12% this month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Active Projects</p>
                          <p className="text-3xl font-bold">{stats.totalProjects.toLocaleString()}</p>
                        </div>
                        <FileText className="h-10 w-10 text-purple-500/20" />
                      </div>
                      <p className="text-sm text-green-500 mt-2">+8% this week</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">API Calls Today</p>
                          <p className="text-3xl font-bold">{stats.apiCallsToday.toLocaleString()}</p>
                        </div>
                        <Activity className="h-10 w-10 text-blue-500/20" />
                      </div>
                      <p className="text-sm text-green-500 mt-2">+23% vs yesterday</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Active Users</p>
                          <p className="text-3xl font-bold">{stats.activeUsers}</p>
                        </div>
                        <TrendingUp className="h-10 w-10 text-green-500/20" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Online now</p>
                    </CardContent>
                  </Card>
                </div>

                {/* System Health */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Server className="h-5 w-5" />
                        System Health
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Cpu className="h-5 w-5 text-muted-foreground" />
                          <span>CPU Usage</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${stats.cpuUsage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{stats.cpuUsage}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <HardDrive className="h-5 w-5 text-muted-foreground" />
                          <span>Memory</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${stats.memoryUsage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{stats.memoryUsage}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Database className="h-5 w-5 text-muted-foreground" />
                          <span>Storage</span>
                        </div>
                        <span className="text-sm font-medium">{stats.storageUsed}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                          <span>Uptime</span>
                        </div>
                        <span className="text-sm font-medium">{stats.uptime}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { action: 'New user registered', time: '2 min ago', type: 'user' },
                          { action: 'Project deployed', time: '15 min ago', type: 'deploy' },
                          { action: 'API key rotated', time: '1 hour ago', type: 'security' },
                          { action: 'Backup completed', time: '3 hours ago', type: 'system' },
                        ].map((activity, i) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${
                                activity.type === 'user' ? 'bg-green-500' :
                                activity.type === 'deploy' ? 'bg-blue-500' :
                                activity.type === 'security' ? 'bg-amber-500' :
                                'bg-purple-500'
                              }`} />
                              <span className="text-sm">{activity.action}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{activity.time}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">User Management</h2>
                  <Button>Add User</Button>
                </div>
                <Card>
                  <CardContent className="p-0">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-4 font-medium">User</th>
                          <th className="text-left p-4 font-medium">Email</th>
                          <th className="text-left p-4 font-medium">Plan</th>
                          <th className="text-left p-4 font-medium">Status</th>
                          <th className="text-left p-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'John Doe', email: 'john@example.com', plan: 'Pro', status: 'active' },
                          { name: 'Jane Smith', email: 'jane@example.com', plan: 'Starter', status: 'active' },
                          { name: 'Bob Wilson', email: 'bob@example.com', plan: 'Free', status: 'inactive' },
                        ].map((user, i) => (
                          <tr key={i} className="border-b border-border last:border-0">
                            <td className="p-4 font-medium">{user.name}</td>
                            <td className="p-4 text-muted-foreground">{user.email}</td>
                            <td className="p-4">
                              <Badge variant={user.plan === 'Pro' ? 'default' : 'secondary'}>
                                {user.plan}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
                                {user.status}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Button variant="ghost" size="sm">Edit</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'projects' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold">All Projects</h2>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground">Project management interface coming soon...</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold">Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-4xl font-bold text-primary">98.5%</p>
                      <p className="text-muted-foreground mt-2">API Uptime</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-4xl font-bold text-green-500">2.3s</p>
                      <p className="text-muted-foreground mt-2">Avg Response Time</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-4xl font-bold text-purple-500">$4,567</p>
                      <p className="text-muted-foreground mt-2">Monthly Revenue</p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {activeTab === 'system' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold">System Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'PostgreSQL', status: 'healthy', icon: Database },
                    { name: 'Redis', status: 'healthy', icon: Server },
                    { name: 'MongoDB', status: 'healthy', icon: Database },
                    { name: 'AI Service', status: 'healthy', icon: Cpu },
                  ].map((service) => (
                    <Card key={service.name}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <service.icon className="h-5 w-5" />
                            <span className="font-medium">{service.name}</span>
                          </div>
                          <Badge variant="success">
                            <Wifi className="h-3 w-3 mr-1" />
                            {service.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold">Admin Settings</h2>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div>
                        <p className="font-medium">Maintenance Mode</p>
                        <p className="text-sm text-muted-foreground">Temporarily disable public access</p>
                      </div>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div>
                        <p className="font-medium">New Registrations</p>
                        <p className="text-sm text-muted-foreground">Allow new user signups</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium">AI Generation</p>
                        <p className="text-sm text-muted-foreground">Enable AI features globally</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
